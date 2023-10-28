#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const process = require("process");

const envFilePath = path.join(__dirname, "..", ".env.test.local");
const workflowFilePath = path.join(
  __dirname,
  "..",
  ".github",
  "workflows",
  "test.yml"
);

const envContent = fs.readFileSync(envFilePath, "utf-8");
const workflowContent = fs.readFileSync(workflowFilePath, "utf-8");

const envVars = new Set(
  envContent
    .split("\n")
    .filter((line) => line.trim() !== "" && !line.trim().startsWith("#"))
    .map((line) => line.split("=")[0].trim())
);

const workflowVars = new Set(
  workflowContent
    .split("\n")
    .filter((line) => line.includes(":"))
    .map((line) => line.split(":")[0].trim())
);

const missingVars = Array.from(envVars).filter(
  (varName) => !workflowVars.has(varName)
);

if (missingVars.length > 0) {
  console.error(
    "Error: Missing environment variables in GitHub Actions workflow:"
  );
  missingVars.forEach((varName) => console.error(`- ${varName}`));
  process.exit(1);
} else {
  console.log(
    "All environment variables are present in GitHub Actions workflow."
  );
}
