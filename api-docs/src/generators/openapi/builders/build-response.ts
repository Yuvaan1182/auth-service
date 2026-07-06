import type { Endpoint } from "../../../types";

import type { OpenApiResponse } from "../openapi.types";
import { mapSchema } from "./build-map-schema";

export function buildResponse(endpoint: Endpoint): OpenApiResponse {
  const example = endpoint.examples.success?.response.body;

  return {
    description: endpoint.response.status >= 400 ? "Error" : "Success",

    content:
      example === undefined
        ? undefined
        : {
            "application/json": {
              schema: mapSchema(example),
              example,
            },
          },
  };
}
