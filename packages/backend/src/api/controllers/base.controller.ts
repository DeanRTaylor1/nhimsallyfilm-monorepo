import { API_RES, StatusCodeEnum } from "@core/enum/api.enum";
import { ApiResponse } from "@core/types/response.interface";
import BaseEntity from "@models/entities/types/Base.entity";
import { env } from "@env";
import {
  ObjectOnly,
  Sanitized,
  TaintedFieldsSet,
} from "./types/controller.types";

import { Model } from "sequelize-typescript";
import { Response } from "express";
export class BaseController {
  protected code: StatusCodeEnum = StatusCodeEnum.OK;
  protected data: unknown;
  protected message: string = "Success";
  protected typeRes: API_RES = API_RES.JSON;
  protected enableSnakeCase: boolean = env.config.enableSnakeCase;

  public setCode(code: StatusCodeEnum): this {
    this.code = code;
    return this;
  }

  public setData<T>(data: T | BaseEntity<T>[]): this {
    this.data = this.transformData(data);
    return this;
  }

  public setMessage(message: string): this {
    this.message = message;
    return this;
  }

  public setTypeRes(type: API_RES): this {
    this.typeRes = type;
    return this;
  }

  protected getResponse<T>(res: Response, status: boolean): Response {
    const result: ApiResponse<T> = {
      status,
      code: this.code,
      data: this.data as T,
      message: this.message,
    };

    switch (this.typeRes) {
      case API_RES.JSON:
        return res.status(this.code).json(result);
      case API_RES.SEND:
        return res.status(this.code).send(result);
      default:
        throw new Error(`Unsupported response type: ${this.typeRes}`);
    }
  }

  public responseSuccess<T>({
    data,
    message,
    res,
  }: {
    data: ObjectOnly<T>;
    message: string;
    res: Response;
  }): Response {
    return this.setCode(StatusCodeEnum.OK)
      .setData(data)
      .setMessage(message)
      .getResponse<T>(res, true);
  }

  public responseError({
    res,
    message = "An error occurred",
    statusCode = StatusCodeEnum.INTERNAL_SERVER_ERROR,
  }: {
    res: Response;
    message: string;
    statusCode: StatusCodeEnum;
  }): Response {
    return this.setCode(statusCode)
      .setData(null)
      .setMessage(message)
      .getResponse<null>(res, false);
  }

  private transformData<T>(
    data: T | BaseEntity<T>[]
  ): Sanitized<T> | Array<Sanitized<T>> {
    if (!this.enableSnakeCase) {
      if (data instanceof Model) {
        return this.sanitizeData(data.get());
      }

      return this.sanitizeData(data);
    }

    if (Array.isArray(data)) {
      return data.map((item) => {
        const resData = this.isBaseEntity(item) ? item.toSnake() : item;

        return this.sanitizeData(resData);
      });
    }

    const resData = this.isBaseEntity(data) ? data.toSnake() : data;

    return this.sanitizeData(resData);
  }

  private sanitizeData<T>(data: T): Sanitized<T> {
    const sanitizedData: T = { ...data };

    for (const key of Object.keys(data)) {
      if (TaintedFieldsSet.has(key)) {
        delete sanitizedData[key];
      }
    }

    return sanitizedData as Sanitized<T>;
  }

  private isBaseEntity<T>(object: unknown): object is BaseEntity<T> {
    return (object as BaseEntity<T>)?.toSnake !== undefined;
  }
}
