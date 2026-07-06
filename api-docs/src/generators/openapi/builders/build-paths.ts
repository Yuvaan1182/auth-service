import type { Endpoint } from "../../../types";

import type { OpenApiPathItem } from "../openapi.types";

import { buildOperation } from "./build-operation";

export function buildPaths(
  endpoints: Endpoint[],
): Record<string, OpenApiPathItem> {
  const paths: Record<string, OpenApiPathItem> = {};

  for (const endpoint of endpoints) {
    const method = endpoint.method.toLowerCase() as keyof OpenApiPathItem;

    paths[endpoint.route] ??= {};

    paths[endpoint.route][method] = buildOperation(endpoint);
  }

  return paths;
}
