import { getModelFromTableName } from "@lib/db/utils";
import Container, { Constructable } from "typedi";

export function ModelContainer(property: string) {
  return function (
    object: Constructable<unknown>,
    propertyName: string,
    index?: number
  ) {
    const item = getModelFromTableName(property);
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: () => item,
    });
  };
}
