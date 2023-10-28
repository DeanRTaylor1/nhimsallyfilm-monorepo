

import { BaseRepository } from "../base/base.repository";
import { ModelContainer } from "api/core/decorators/models.decorator";

import { Service } from "typedi";
import { ModelCtor } from "sequelize-typescript";
import { ICreateAttributes } from "api/models/entities/types/entity.types";
import Image from "@api/models/entities/Image.entity";
import { Sequelize } from "sequelize";

@Service()
class ImagesRepository extends BaseRepository<Image> {
  constructor(@ModelContainer(Image.tableName) Image: ModelCtor<Image>) {
    super(Image);
  }

  async create(image: ICreateAttributes<Image>): Promise<Image> {
    return this.model.create(image);
  }

  async getTenRandomImages(): Promise<Array<Image>> {
    return this.model.findAll({
      order: Sequelize.literal("random()"),
      limit: 10,
    });
  }
  
}

export default ImagesRepository;
