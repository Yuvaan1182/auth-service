import type { EndpointRepository } from "../types";

export interface DocumentationGenerator {
  generate(repository: EndpointRepository): Promise<void>;
}

export interface GeneratorOptions {
  outputPath: string;
}
