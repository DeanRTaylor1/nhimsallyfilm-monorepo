import { env } from "@env";
import { logger } from "@lib/debug/logger";
import { RedisClientType, createClient } from "redis";
import { CacheClient } from "../types/cache.types";

export class RedisCache<T> implements CacheClient<T> {
  private client: RedisClientType;

  public constructor() {
    this.client = createClient({ url: this.getRedisUrl() });

    this.client.on("connect", () => {
      logger.info(`Redis client connected on port ${env.cache.redis.port}!`);
    });

    this.client.on("error", (err: Error) => {
      logger.error(`Connect redis error: ${err?.message}`);
    });

    this.client.connect();
  }

  async get(key: string): Promise<T> {
    return JSON.parse(await this.client.get(key));
  }

  async set({
    key,
    value,
    expiresTime,
  }: {
    key: string;
    value: T;
    expiresTime: number;
  }) {
    return this.client.set(key, JSON.stringify(value), {
      EX: expiresTime,
    });
  }

  async delete(key: string): Promise<number> {
    return this.client.del(key);
  }

  async clear(): Promise<string> {
    return this.client.flushDb();
  }

  private getRedisUrl() {
    const { host, port, username, password } = env.cache.redis;
    const credentials =
      username || password ? `${username || ""}:${password || ""}@` : "";

    return `redis://${credentials}${host}:${port}`;
  }

  public async close(): Promise<string> {
    return this.client.quit();
  }

  public async deleteWithPattern(pattern: string): Promise<Array<string>> {
    const keys = await this.getKeys(pattern);
    for (const key of keys) {
      await this.delete(key);
    }
    return keys;
  }

  public async getKeys(pattern: string): Promise<string[]> {
    return await this.client.keys(pattern);
  }
}
