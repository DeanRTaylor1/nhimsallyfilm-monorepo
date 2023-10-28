import { UserRoleEnum, UserStatusEnum } from "api/domain/users/users.enum";
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;

  @IsString()
  @MinLength(8, {
    message: "Password is too short. It should be at least 8 characters long",
  })
  @Matches(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(/[0-9]/, {
    message: "Password must contain at least one number",
  })
  @Matches(/[@$!%*?&]/, {
    message: "Password must contain at least one special character",
  })
  password: string;

  @IsOptional()
  @IsEnum(UserStatusEnum)
  status: UserStatusEnum;
}

export class LoginDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
