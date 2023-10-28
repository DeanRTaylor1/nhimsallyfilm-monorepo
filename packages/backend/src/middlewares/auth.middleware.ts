import { StatusCodeEnum } from "api/core/enum/api.enum";
import { AuthService } from "@services/auth/auth.service";
import { UsersService } from "api/domain/users/users.service";
import { HttpException } from "api/core/errors/HttpException";
import { RequestWithUser } from "api/core/types/request.interface";
import { NextFunction } from "express";
import { Container } from "typedi";

function authMiddleware(_action?: object) {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authService = Container.get(AuthService);
    const userService = Container.get(UsersService);
    const { authorization } = req.headers;

    if (!authorization) {
      return next(
        new HttpException({
          status: StatusCodeEnum.FORBIDDEN,
          message: "Authentication token missing.",
        })
      );
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      return next(
        new HttpException({
          status: StatusCodeEnum.FORBIDDEN,
          message: "Middleware.authentication_token_missing",
        })
      );
    }

    try {
      const { userId } = await authService.validateJWT(token);
      const user = await userService.findUserById(userId);
      req.user = user;
      next();
    } catch (error: unknown) {
      return next(
        new HttpException({
          status: StatusCodeEnum.FORBIDDEN,
          message: "Invalid token.",
        })
      );
    }
  };
}

export default authMiddleware;
