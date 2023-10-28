import { SnakeCaseObj } from "@api/core/types/case.types";
import { convertKeysToSnakeCase } from "@lib/validation/utils";
import { Model } from "sequelize-typescript";

abstract class BaseEntity<T> extends Model<T> {
  toSnake() {
    return convertKeysToSnakeCase(this.get()) as SnakeCaseObj<T>;
  }
}

export default BaseEntity;
