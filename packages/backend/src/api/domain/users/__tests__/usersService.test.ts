import { UsersService } from "../users.service";
import { UserStatusEnum, UserRoleEnum } from "api/domain/users/users.enum";
import User from "api/models/entities/User.entity";
import { CreateUserDTO } from "api/domain/users/user.dto";

import Container from "typedi";
import { CamelCaseObj } from "@api/core/types/case.types";

const usersService = Container.get(UsersService);

describe("UsersService tests", () => {
  describe("createUser", () => {
    const testCases: Array<{
      description: string;
      input: CamelCaseObj<CreateUserDTO>;
      expected: Partial<User>;
    }> = [
      {
        description: "should create user John Doe successfully",
        input: {
          username: "username",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          password: "somehashedpassword1",
          role: UserRoleEnum.USER,
          status: UserStatusEnum.INACTIVE,
        },
        expected: {
          username: "username",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          status: UserStatusEnum.INACTIVE,
          role: UserRoleEnum.USER,
        },
      },
      {
        description: "should create user Jane Doe successfully",
        input: {
          username: "username1",
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@example.com",
          password: "somehashedpassword2",
          role: UserRoleEnum.USER,
          status: UserStatusEnum.INACTIVE,
        },
        expected: {
          username: "username1",
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@example.com",
          status: UserStatusEnum.INACTIVE,
          role: UserRoleEnum.USER,
        },
      },
      {
        description: "should create user Alice Johnson successfully",
        input: {
          username: "username2",
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice.johnson@example.com",
          password: "somehashedpassword3",
          role: UserRoleEnum.USER,
          status: UserStatusEnum.INACTIVE,
        },
        expected: {
          username: "username2",
          firstName: "Alice",
          lastName: "Johnson",
          email: "alice.johnson@example.com",
          status: UserStatusEnum.INACTIVE,
          role: UserRoleEnum.USER,
        },
      },
    ];

    testCases.forEach(({ description, input, expected }) => {
      test(description, async () => {
        const result: User = await usersService.createUser(input);

        expect(result.username).toBe(expected.username);
        expect(result.firstName).toBe(expected.firstName);
        expect(result.lastName).toBe(expected.lastName);
        expect(result.email).toBe(expected.email);
        expect(result.status).toBe(expected.status);
        expect(result.role).toBe(expected.role);
        expect(typeof result.hashedPassword).toBe("string");
        expect(result.hashedPassword).toBeDefined();
      });
    });
  });
});
