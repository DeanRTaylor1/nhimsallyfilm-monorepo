const isUndefined = (prop: string | number | unknown) => {
  return typeof prop === "undefined";
};

const getOsEnv = (key: string): string => {
  if (isUndefined(process.env[key])) {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return process.env[key];
};

function getOsEnvOptional(key: string): string | undefined {
  return process.env[key];
}

export { getOsEnv, getOsEnvOptional };
