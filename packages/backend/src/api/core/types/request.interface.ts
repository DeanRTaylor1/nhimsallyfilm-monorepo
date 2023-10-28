import User from "@api/models/entities/User.entity";
import { Request } from "express";

export interface RequestWithUser extends Request {
  user: User;
}
