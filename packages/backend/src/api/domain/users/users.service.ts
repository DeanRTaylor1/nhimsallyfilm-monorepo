import { Pagination } from "@api/core/decorators/pagination.decorator";
import UsersRepository from "@api/domain/users/users.repository";
import User from "@api/models/entities/User.entity";
import { CreateUserDTO } from "@api/domain/users/user.dto";
import { AuthService } from "@services/auth/auth.service";
import { ICreateAttributes } from "@api/models/entities/types/entity.types";
import { CamelCaseObj } from "@api/core/types/case.types";

import { Service } from "typedi";
import { BadRequestError } from "@api/core/errors/BadRequestError";
import { ForbiddenError } from "@api/core/errors/ForbiddenError";

@Service()
class UsersService {
  constructor(
    protected usersRepository: UsersRepository,
    protected authService: AuthService
  ) {}

  public async getAllUsers({ skip, limit }: Pagination): Promise<Array<User>> {
    return this.usersRepository.getAll({ skip, limit });
  }

  public async createUser(userDTO: CamelCaseObj<CreateUserDTO>): Promise<User> {
    const newUser = await this.hashUserPassword(userDTO);

    return this.usersRepository.create(newUser);
  }

  public async findUserById(userId: number): Promise<User> {
    return this.usersRepository.findById(userId);
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  public async loginUser(
    email: string,
    suppliedPassword: string
  ): Promise<string> {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new BadRequestError();
    }

    const { id: userId, hashedPassword } = user;

    await this.validatePassword(hashedPassword, suppliedPassword);

    return this.authService.generateJWT({
      userId,
      email,
    });
  }

  private async validatePassword(
    hashedPassword: string,
    suppliedPassword: string
  ): Promise<void> {
    const isValid = await this.authService.compare({
      storedPassword: hashedPassword,
      suppliedPassword,
    });

    if (!isValid) {
      throw new ForbiddenError();
    }
  }

  private async hashUserPassword(
    userDTO: CamelCaseObj<CreateUserDTO>
  ): Promise<ICreateAttributes<User>> {
    const hashedPassword = await this.authService.hashPassword(
      userDTO.password
    );
    return {
      ...userDTO,
      hashedPassword,
    };
  }
}

export { UsersService };
