import { env } from "@env";
import { logger } from "@lib/debug/logger";
import { Model } from "sequelize";
import { Service } from "typedi";
import { RedisCache } from "./providers/redis.cache.provider";
import { CacheClient } from "./types/cache.types";
import { AvailableCacheTypes } from "./types/cache.enum";
import { MemoryCache } from "./providers/memory.cache.provider";

@Service()
export class CacheService<T> implements CacheClient<T> {
  protected cache: CacheClient<T>;

  public constructor() {
    this.setCache(env.cache.type);
  }

  async get(key: string): Promise<T> {
    return this.cache.get(key);
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
    return this.cache.set({ key, value, expiresTime });
  }

  async delete(key: string): Promise<number> {
    return this.cache.delete(key);
  }

  async clear(): Promise<string> {
    return this.cache.clear();
  }

  async close(): Promise<string> {
    return this.cache.close();
  }

  async updatecacheType(cacheType: AvailableCacheTypes) {
    this.setCache(cacheType);
  }

  async getKeys(pattern: string): Promise<string[]> {
    return this.cache.getKeys(pattern);
  }

  async deleteWithPattern(pattern: string): Promise<Array<string>> {
    return this.cache.deleteWithPattern(pattern);
  }

  private setCache(cacheType: string) {
    if (cacheType === "redis") {
      this.cache = new RedisCache();
      return this;
    }
    if (cacheType === "memory") {
      this.cache = new MemoryCache();
      return this;
    }
    logger.error("Cache type not implemented.");
    throw new Error("Cache type not implemented.");
  }

  /**
   * @description
   * rehydrateModel is a static function that takes in a model class and data
   * and returns a new instance of the model class with the data assigned to it.
   * This is used to rehydrate the model from the cache.
   */
  static rehydrateModel<T extends Model>(
    data: object,
    modelClass: { new (): T }
  ): T {
    const instance = new modelClass();
    Object.assign(instance, data);
    return instance;
  }
}
