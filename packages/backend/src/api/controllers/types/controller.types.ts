const TaintedFields = {
  HASHEDPASSWORD: "hashedPassword",
  HASHED_PASSWORD: "hashed_password",
  PASSWORD: "password",
} as const;

const TaintedFieldsSet = new Set<string>(Object.values(TaintedFields));
type TaintedFieldTypes = (typeof TaintedFields)[keyof typeof TaintedFields];

type Sanitized<T> = Omit<keyof T, TaintedFieldTypes>;

type ObjectOnly<T> = T extends object
  ? T
  : "Error: Expected an object, but received a primitive type";

export {
  ObjectOnly,
  TaintedFieldTypes,
  TaintedFields,
  Sanitized,
  TaintedFieldsSet,
};
