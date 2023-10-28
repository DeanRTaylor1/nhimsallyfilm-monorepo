import { env } from "@env";
import { Dialect } from "sequelize";

import { SequelizeOptions, Sequelize } from "sequelize-typescript";

const { db } = env;

const sequelizeOptions: SequelizeOptions = {
  dialect: db.dialect as Dialect,
  host: db.host,
  port: Number(db.port),
  models: [__dirname + "/entities"],
  modelMatch: (filename, member) => {
    return (
      filename.substring(0, filename.indexOf(".model")) === member.toLowerCase()
    );
  },
  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: env.isDev,
  logging: env.isDev,
  benchmark: true,
  dialectOptions: {
    decimalNumbers: true,
    useUTC: false,
    dateStrings: true,
    typeCast: function (field, next) {
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
};

const sequelize = new Sequelize(
  db.database,
  db.username,
  db.password,
  sequelizeOptions
);

const DB = {
  sequelize,
  ...sequelize.models,
};

export { DB };
