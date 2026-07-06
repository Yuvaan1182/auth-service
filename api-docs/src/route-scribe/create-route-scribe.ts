import { createCollector } from "../collector";
import { createEventBus } from "../events";
import { createExpressMiddleware } from "../middleware";
import {
  createJsonRepository,
  registerRepositoryListeners,
} from "../repository";

import type { ApiDocsEvents } from "../types";
import type { RouteScribe, RouteScribeOptions } from "./route-scribe.types";
import { getEndpointsFilePath } from "../utils";

export function createRouteScribe(
  options: RouteScribeOptions = {},
): RouteScribe {
  const eventBus = createEventBus<ApiDocsEvents>();

  const repository = createJsonRepository({
    filePath: getEndpointsFilePath(options.output),
  });

  registerRepositoryListeners(eventBus, repository);

  const collector = createCollector(eventBus);

  return {
    middleware() {
      return createExpressMiddleware(collector, {
        shouldCollect(route) {
          return !options.ignore?.includes(route);
        },
      });
    },

    async getEndpoints() {
      return repository.findAll();
    },
  };
}
