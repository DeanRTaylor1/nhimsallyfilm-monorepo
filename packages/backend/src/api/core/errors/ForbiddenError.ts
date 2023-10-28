import { StatusCodeEnum } from "../enum/api.enum";
import { HttpException } from "./HttpException";

export class ForbiddenError<T> extends HttpException<T> {
  constructor() {
    super({ status: StatusCodeEnum.FORBIDDEN, message: "Not Authorized." });
  }
}
