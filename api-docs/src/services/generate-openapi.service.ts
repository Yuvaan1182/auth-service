import { createOpenApiGenerator } from "../generators";
import { createJsonRepository } from "../repository";
import { getEndpointsFilePath } from "../utils";

export interface GenerateOpenApiOptions {
  output?: string;

  title: string;

  version: string;
}

export async function generateOpenApi(options: GenerateOpenApiOptions) {
  const repository = createJsonRepository({
    filePath: getEndpointsFilePath(options.output),
  });

  const generator = createOpenApiGenerator({
    title: options.title,
    version: options.version,
  });

  return generator.generate(repository);
}
