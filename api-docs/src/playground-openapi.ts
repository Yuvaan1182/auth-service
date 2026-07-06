import { createOpenApiGenerator } from "./generators";
import { createJsonRepository } from "./repository";
import { getEndpointsFilePath } from "./utils";

async function main() {
  const repository = createJsonRepository({
    filePath: getEndpointsFilePath(),
  });

  const generator = createOpenApiGenerator({
    title: "Auth API",
    version: "1.0.0",
  });

  const document = await generator.generate(repository);

  console.dir(document, {
    depth: null,
  });
}

main().catch(console.error);
