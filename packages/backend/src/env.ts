import path from "path";
import { getOsEnv, getOsEnvOptional } from "@lib/env/utils";
import * as dotenv from "dotenv";

const envPath = path.join(
  process.cwd(),
  `.env.${process.env.NODE_ENV || "development"}.local`
);

dotenv.config({ path: envPath });

const env = {
  appPath: __dirname,
  apiUrl: getOsEnv("API_URL"),
  nodeEnv: process.env.NODE_ENV || "development",
  isProd: process.env.NODE_ENV === "production",
  isDev: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
  logs: {
    logDir: getOsEnv("LOG_DIR"),
    logFormat: getOsEnv("LOG_FORMAT"),
    level: getOsEnv("LOG_LEVEL"),
  },
  core: {
    port: getOsEnv("PORT"),
  },
  db: {
    username: getOsEnv("DB_USERNAME"),
    password: getOsEnv("DB_PASSWORD"),
    database: getOsEnv("DB_DATABASE"),
    host: getOsEnv("DB_HOST"),
    dialect: getOsEnv("DB_DIALECT"),
    port: getOsEnv("DB_PORT"),
  },
  config: {
    enableSnakeCase: getOsEnv("SNAKE_CASE") === "true",
  },
  auth: {
    jwtSecret: getOsEnv("JWT_SECRET"),
    expiresIn: getOsEnv("JWT_EXPIRES"),
  },
  cache: {
    type: getOsEnv("CACHE_TYPE"),
    redis: {
      host: getOsEnv("REDIS_HOST"),
      password: getOsEnvOptional("REDIS_PASSWORD"),
      username: getOsEnvOptional("REDIS_USERNAME"),
      port: getOsEnv("REDIS_PORT"),
    },
  },
  upload: {
    type: getOsEnv("UPLOAD_TYPE"),
    disksDir: getOsEnv("DISKS_DIR") || "/public/uploads",
  },
};

export { env };
