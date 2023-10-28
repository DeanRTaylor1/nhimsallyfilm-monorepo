import { BaseRepository } from "../base/base.repository";
import { ModelContainer } from "api/core/decorators/models.decorator";

import User from "api/models/entities/User.entity";
import { Service } from "typedi";
import { ModelCtor } from "sequelize-typescript";
import { ICreateAttributes } from "api/models/entities/types/entity.types";
import { ClearCache } from "@services/cache/decorators/ClearCache.decorator";
import { CacheKeyEnum } from "@services/cache/types/cache.enum";

@Service()
class UsersRepository extends BaseRepository<User> {
  constructor(@ModelContainer(User.tableName) User: ModelCtor<User>) {
    super(User);
  }

  @ClearCache(() => CacheKeyEnum.USER_CACHE)
  async create(user: ICreateAttributes<User>): Promise<User> {
    return this.model.create(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.model.findOne({ where: { email } });
  }
}

export default UsersRepository;
