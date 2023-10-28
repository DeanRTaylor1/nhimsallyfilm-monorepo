import { env } from "@env";
import { HttpException } from "api/core/errors/HttpException";
import { ApiResponse } from "api/core/types/response.interface";
import { NextFunction, Request, Response } from "express";

const errorMiddleware = (
  error: HttpException<object>,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const code = error.status || 500;
  const message = error.message || "Something Wrong";

  const result: ApiResponse<object> = {
    status: false,
    code: code,
    message: message,
    data: {},
  };
  const stack = error.stack;
  if (env.isDev) {
    return res.status(code).send({ ...result, stack });
  }
  return res.status(code).send(result);
};

export default errorMiddleware;
