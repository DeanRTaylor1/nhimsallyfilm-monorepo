import { createParamDecorator } from "routing-controllers";
import { convertKeysToCamelCase } from "@lib/validation/utils";

function BodyToCamelCase() {
  return createParamDecorator({
    required: true,
    value: (actionProperties) => {
      const { body } = actionProperties.request;
      const convertedBody = convertKeysToCamelCase(body);

      return convertedBody;
    },
  });
}

export { BodyToCamelCase };
