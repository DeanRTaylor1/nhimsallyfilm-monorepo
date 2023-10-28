import { promisify } from "util";
import { randomBytes, scrypt as scryptCb } from "crypto";
import * as jwt from "jsonwebtoken";
import { Service } from "typedi";
import { env } from "@env";

const scrypt = promisify(scryptCb);

@Service()
export class AuthService {
  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
    return `${derivedKey.toString("hex")}.${salt}`;
  }

  async compare({
    storedPassword,
    suppliedPassword,
  }: {
    storedPassword: string;
    suppliedPassword: string;
  }): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const derivedKey = (await scrypt(suppliedPassword, salt, 64)) as Buffer;
    return derivedKey.toString("hex") === hashedPassword;
  }

  generateJWT({ userId, email }: JwtProps): string {
    const secret = env.auth.jwtSecret;
    const expiresIn = env.auth.expiresIn;

    return jwt.sign({ userId, email }, secret, { expiresIn });
  }

  validateJWT(token: string): Promise<JwtProps> {
    return new Promise((resolve, reject) => {
      const secret = env.auth.jwtSecret;

      jwt.verify(token, secret, (err: unknown, decoded: JwtProps) => {
        if (err) {
          reject(err);
        } else if (typeof decoded === "object" && decoded !== null) {
          resolve(decoded as JwtProps);
        } else {
          reject(new Error("Invalid token"));
        }
      });
    });
  }
}

export type JwtProps = {
  userId: number;
  email: string;
};
