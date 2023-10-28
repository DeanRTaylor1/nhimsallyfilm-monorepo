import { CacheClient } from "../types/cache.types";

export class MemoryCache<T> implements CacheClient<T> {
  private cache: Map<string, { value: string; expiresAt?: number }>;

  constructor() {
    this.cache = new Map();
  }

  async get(key: string): Promise<T | null> {
    const data = this.cache.get(key);
    if (!data) {
      return null;
    }
    const { value, expiresAt } = data;
    if (expiresAt && expiresAt < Date.now()) {
      await this.delete(key);
      return null;
    }
    return JSON.parse(value);
  }

  async set({
    key,
    value,
    expiresTime,
  }: {
    key: string;
    value: T;
    expiresTime: number;
  }): Promise<string> {
    const expiresAt = Date.now() + expiresTime * 1000;
    const valueToCache = {
      value: JSON.stringify(value),
      expiresAt,
    };
    this.cache.set(key, valueToCache);
    return "OK";
  }

  async delete(key: string): Promise<number> {
    const result = this.cache.delete(key) ? 1 : 0;
    return result;
  }

  async clear(): Promise<string> {
    this.cache.clear();
    return "OK";
  }

  async close(): Promise<string> {
    this.cache.clear();
    return "OK";
  }

  async getKeys(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keys.push(key);
      }
    });
    return keys;
  }

  async deleteWithPattern(pattern: string): Promise<string[]> {
    const keys = await this.getKeys(pattern);
    for (const key of keys) {
      await this.delete(key);
    }
    return keys;
  }
}
