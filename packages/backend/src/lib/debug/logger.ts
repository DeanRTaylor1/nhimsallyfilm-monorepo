import { join } from "path";
import { existsSync, mkdirSync } from "fs";

import { env } from "@env";

import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
import morgan from "morgan";
import { formatStatus, formatMethod } from "./utils";
import { Response, Request } from "express";

const logDir: string = join(__dirname, env.logs.logDir);

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      level: "debug",
      datePattern: "DD-MM-YYYY",
      dirname: logDir + "/debug",
      filename: "%DATE%.log",
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
    new winstonDaily({
      level: "error",
      datePattern: "DD-MM-YYYY",
      dirname: logDir + "/error",
      filename: "%DATE%.log",
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    level: env.logs.level,
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize()
    ),
  })
);

morgan.token("colored-status", (_: Request, res: Response) =>
  formatStatus(res.statusCode)
);
morgan.token("colored-method", (req: Request) => formatMethod(req.method));
morgan.token("end", () => formatMethod(""));

const morganStream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf("\n")));
  },
};

export { logger, morganStream };
