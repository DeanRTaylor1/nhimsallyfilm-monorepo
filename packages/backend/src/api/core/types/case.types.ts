type CamelCaseObj<S> = {
  [K in keyof S as K extends string ? CamelCase<K> : never]: S[K] extends object
    ? CamelCaseObj<S[K]>
    : S[K];
};

type CamelCase<S extends string> = S extends `${infer T}_${infer U}${infer V}`
  ? `${Lowercase<T>}${Uppercase<U>}${CamelCase<V>}`
  : Lowercase<S>;

type SnakeCaseObj<S> = {
  [K in keyof S as K extends string ? SnakeCase<K> : never]: S[K] extends object
    ? SnakeCaseObj<S[K]>
    : S[K];
};

type SnakeCase<S extends string> = S extends `${infer P1}${infer P2}`
  ? P2 extends Uncapitalize<P2>
    ? `${Lowercase<P1>}${SnakeCase<P2>}`
    : `${Lowercase<P1>}_${Lowercase<SnakeCase<P2>>}`
  : S;

export { CamelCaseObj, CamelCase, SnakeCaseObj, SnakeCase };
