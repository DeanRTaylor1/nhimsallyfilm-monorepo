const tsConfig = require("../../../tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths,
});

import { DB } from "../../api/models";

afterAll(() => {
  DB.sequelize.close();
});
