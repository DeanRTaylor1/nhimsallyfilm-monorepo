import { Model } from "sequelize-typescript";
import BaseEntity from "./Base.entity";

type OmitSystemFields<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

type ExcludeSequelizeModel<T> = Omit<T, keyof Model>;

type ExcludeBaseEntityProps<T> = Omit<T, keyof BaseEntity<T>>;

type ICreateAttributes<T> = OmitSystemFields<
  ExcludeBaseEntityProps<ExcludeSequelizeModel<T>>
>;

export { ICreateAttributes };
