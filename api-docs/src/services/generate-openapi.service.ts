import { createOpenApiGenerator } from "../generators";
import { GenerateOpenApiOptions } from "../generators/openapi/openapi.types";
import { createJsonRepository } from "../repository";
import { getEndpointsFilePath, getOpenApiJsonFilePath } from "../utils";
import { writeJson } from "../writers";

export async function generateOpenApi(options: GenerateOpenApiOptions) {
  const repository = createJsonRepository({
    filePath: getEndpointsFilePath(options.output),
  });

  const generator = createOpenApiGenerator({
    title: options.title,
    version: options.version,
  });

  const document = await generator.generate(repository);

  if (options.writeJson) {
    await writeJson(getOpenApiJsonFilePath(options.output), document);
  }

  const files: string[] = [];

  if (options.writeJson) {
    const filePath = getOpenApiJsonFilePath(options.output);

    await writeJson(filePath, document);

    files.push(filePath);
  }

  return {
    document,
    files,
  };
}
