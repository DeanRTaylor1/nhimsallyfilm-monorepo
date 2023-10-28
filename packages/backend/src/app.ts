import "reflect-metadata";
import path from "path";

import { env } from "@env";
import { morganStream } from "@lib/debug/logger";
import { DB } from "api/models";

import express, { Request, Response } from "express";
import { Container } from "typedi";
import { useExpressServer, useContainer } from "routing-controllers";
import morgan from "morgan";
import errorMiddleware from "middlewares/errors.middleware";
import { TerminalEscapeCodes } from "@lib/debug/utils";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

class App {
  private app: express.Application = express();
  public env: NodeJS.ProcessEnv | string | number;
  public port: string | number;

  constructor() {
    //TODO Update env
    this.env = env.nodeEnv || "development";
    this.port = env.core.port || 3000;

    this.connectToDatabase();
    this.registerMiddleware();
    this.serveSwagger();
    this.initRoutes();
    this.initializeErrorHandling();
    this.registerHealthCheck();
  }

  public listen() {
    this.app.listen(this.port, () => {
      const art = `
        ██████╗ ███████╗ █████╗ ██████╗ ██╗   ██╗
        ██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
        ██████╔╝█████╗  ███████║██║  ██║ ╚████╔╝ 
        ██╔══██╗██╔══╝  ██╔══██║██║  ██║  ╚██╔╝  
        ██║  ██║███████╗██║  ██║██████╔╝   ██║   
        ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝    ╚═╝
      `;
      console.log(`${art}`);
      console.log(
        "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
      );
      console.log(
        `         ${TerminalEscapeCodes.BgGreen}Server ready and listening on port: ${this.port}.${TerminalEscapeCodes.Reset}`
      );
      console.log("");
      console.log(
        "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
      );
    });
  }

  public getApp() {
    return this.app;
  }

  private connectToDatabase() {
    DB.sequelize.authenticate();
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public registerMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(__dirname, "/public")));
    this.app.use(
      morgan(
        "[Express] :colored-status | :response-time ms | :remote-addr | :colored-method ':url' :end",
        { stream: morganStream }
      )
    );
  }

  private serveSwagger() {
    const filePath = path.join(__dirname, "../docs/spec.yaml");
    console.log(filePath);
    const swaggerDocument = YAML.load(filePath);

    this.app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  private initRoutes() {
    useContainer(Container);
    useExpressServer(this.app, {
      defaultErrorHandler: false,
      routePrefix: "/api/v1",
      middlewares: [path.join(__dirname, "/api/middleware/*")],
      controllers: [path.join(__dirname, "/api/controllers/*")],
    });
  }

  private registerHealthCheck() {
    this.app.get("/", async (req: Request, res: Response) => {
      res.json({ status: 200, message: "ok" });
    });
  }
}

export { App };
