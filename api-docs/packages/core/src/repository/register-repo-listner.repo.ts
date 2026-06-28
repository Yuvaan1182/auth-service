import type { EventBus } from "../events";
import type { ApiDocsEvents, EndpointRepository } from "../types";

export function registerRepositoryListeners(
  eventBus: EventBus<ApiDocsEvents>,
  repository: EndpointRepository,
) {
  eventBus.on("observationCaptured", async (observation) => {
    console.log("Observation received:", observation);

    // We'll implement this in the next step.
    // For now we're only verifying the pipeline.
  });
}
