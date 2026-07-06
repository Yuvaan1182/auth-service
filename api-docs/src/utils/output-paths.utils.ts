import path from "node:path";

import {
  DEFAULT_OUTPUT_DIRECTORY,
  ENDPOINTS_FILE,
  OPENAPI_JSON_FILE,
  OPENAPI_YAML_FILE,
} from "../constants/constants";

export function getEndpointsFilePath(
  output = DEFAULT_OUTPUT_DIRECTORY,
): string {
  return path.join(output, ENDPOINTS_FILE);
}

export function getOpenApiJsonFilePath(
  output = DEFAULT_OUTPUT_DIRECTORY,
): string {
  return path.join(output, OPENAPI_JSON_FILE);
}

export function getOpenApiYamlFilePath(
  output = DEFAULT_OUTPUT_DIRECTORY,
): string {
  return path.join(output, OPENAPI_YAML_FILE);
}
