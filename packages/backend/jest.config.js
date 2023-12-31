/** @type {import('jest').Config} */
const path = require("path");

function makeModuleNameMapper(srcPath, tsconfigPath) {
  const { paths } = require(tsconfigPath).compilerOptions;

  const aliases = {};

  Object.keys(paths).forEach((item) => {
    const key = item.replace(/\/\*$/, "/(.*)");
    const path = paths[item][0].replace(/\/\*$/, "/$1");
    aliases[key] = srcPath + "/" + path;
  });

  return aliases;
}

const SRC_PATH = "<rootDir>/src";
const TS_CONFIG_PATH = "./tsconfig.json";

const config = {
  moduleNameMapper: makeModuleNameMapper(SRC_PATH, TS_CONFIG_PATH),
  moduleDirectories: ["node_modules", "src"],
  testMatch: ["**/__tests__/**/*.test.+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: ["/dist/", "/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/src/lib/__tests__/globalSetup.ts"],
};

module.exports = config;
