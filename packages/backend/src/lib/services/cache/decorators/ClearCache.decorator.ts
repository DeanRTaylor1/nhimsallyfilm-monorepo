import { Container } from "typedi";
import { CacheService } from "../cache.service";
import { CacheKeyFactory } from "../types/cache.types";

export function ClearCache<T, R>(cacheKeyFactory: CacheKeyFactory<T>) {
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
      const cacheService = Container.get<CacheService<R>>(CacheService);
      const cacheKey = cacheKeyFactory(args);
      if (cacheKey.includes("*")) {
        await cacheService.deleteWithPattern(cacheKey);
      } else {
        await cacheService.delete(cacheKey);
      }

      return await originalMethod.apply(this, [args]);
    };

    return descriptor;
  };
}
