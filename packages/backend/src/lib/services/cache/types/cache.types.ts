import { CacheKeyEnum } from "./cache.enum";

export interface CacheClient<T> {
  get(key: string): Promise<T>;
  set({
    key,
    value,
    expiresTime,
  }: {
    key: string;
    value: T;
    expiresTime: number;
  }): Promise<string>;
  delete(key: string): Promise<number>;
  clear(): Promise<string>;
  close(): Promise<string>;
  getKeys(pattern: string): Promise<string[]>;
  deleteWithPattern(pattern: string): Promise<Array<string>>;
}

/**
 * @description
 * CacheKeyFactory is a function that returns a string or CacheKeyEnum.
 * The string or CacheKeyEnum is used as the cache key.
 * the purpose of this is to use the args from the method as the cachekey in
 * our decorators.
 * Therefore if returning a string it should use the args param.
 */
export type CacheKeyFactory<T> = (args: T) => string | CacheKeyEnum;
