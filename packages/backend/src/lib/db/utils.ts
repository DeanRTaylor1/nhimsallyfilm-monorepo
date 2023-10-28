import Image from "@api/models/entities/Image.entity";
import { DB } from "api/models";
import User from "api/models/entities/User.entity";
import { ModelCtor } from "sequelize-typescript";

const getModelFromTableName = (tableName: string): ModelCtor | undefined => {
  switch (tableName) {
    case User.tableName:
      return DB.sequelize.model(User);
    case Image.tableName:
      return DB.sequelize.model(Image);
    default:
      return undefined;
  }
};

export { getModelFromTableName };
