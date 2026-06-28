import type { EventBus } from "../events";
import type { ApiDocsEvents, Observation, Request, Response } from "../types";
import { HttpMethod } from "../types/http-method.types";

interface CollectInput {
  method: HttpMethod;
  route: string;
  path: string;
  request: Request;
  response: Response;
  duration: number;
}

export interface Collector {
  collect(input: CollectInput): void;
}

export function createCollector(eventBus: EventBus<ApiDocsEvents>): Collector {
  function collect(input: CollectInput): void {
    const observation: Observation = {
      request: input.request,
      response: input.response,
      method: input.method,
      route: input.route,
      path: input.path,
      duration: input.duration,
      timestamp: new Date().toISOString(),
    };

    eventBus.emit("observationCaptured", observation);
  }

  return {
    collect,
  };
}
