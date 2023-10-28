function snakeToCamel(string: string): string {
  return string.replace(/([-_]\w)/g, (g) => g[1].toUpperCase());
}

function camelToSnake(str: string): string {
  return str
    .replace(/[\w]([A-Z])/g, (m) => {
      return m[0] + "_" + m[1];
    })
    .toLowerCase();
}

function convertKeysToCamelCase<T>(obj: T) {
  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = snakeToCamel(key);
    newObj[newKey] = convertKeysToCamelCase(value);
  }
  return newObj;
}

function convertKeysToSnakeCase<T>(obj: T) {
  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = camelToSnake(key);
    newObj[newKey] = convertKeysToSnakeCase(value);
  }
  return newObj;
}

export {
  convertKeysToCamelCase,
  convertKeysToSnakeCase,
  snakeToCamel,
  camelToSnake,
};
