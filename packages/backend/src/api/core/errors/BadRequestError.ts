import { StatusCodeEnum } from "../enum/api.enum";
import { HttpException } from "./HttpException";

export class BadRequestError<T> extends HttpException<T> {
  constructor() {
    super({ status: StatusCodeEnum.BAD_REQUEST, message: "Bad Request." });
  }
}
