import { Container } from "typedi";
import { CacheService } from "../cache.service";
import { CacheKeyFactory } from "../types/cache.types";

export function UpdateCache<T, R>(
  cacheKeyFactory: CacheKeyFactory<T>,
  expiresTime: number
) {
  return (
    target: object,
    key: string,
    descriptor: TypedPropertyDescriptor<(args: T) => Promise<R>>
  ) => {
    const originalMethod = descriptor.value;
    if (!originalMethod) {
      throw new Error("Descriptor value is not a method");
    }

    descriptor.value = async function (args: T): Promise<R> {
      const cacheKey = cacheKeyFactory(args);
      const cacheService = Container.get<CacheService<R>>(CacheService);
      const result = await originalMethod.apply(this, [args]);
      await cacheService.set({ key: cacheKey, value: result, expiresTime });

      return result;
    };

    return descriptor;
  };
}
