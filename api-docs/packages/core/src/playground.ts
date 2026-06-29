import { createCollector } from "./collector";
import { createEventBus } from "./events";
import {
  createInMemoryRepository,
  registerRepositoryListeners,
} from "./repository";

import type { ApiDocsEvents, Response } from "./types";

async function main() {
  const eventBus = createEventBus<ApiDocsEvents>();

  const repository = createInMemoryRepository();

  registerRepositoryListeners(eventBus, repository);

  const collector = createCollector(eventBus);

  async function collect(duration: number, response: Response) {
    await collector.collect({
      method: "POST",

      route: "/api/v1/auth/register",

      path: "/api/v1/auth/register",

      request: {
        headers: {},
        query: {},
        params: {},
        body: {
          email: "john@example.com",
        },
      },

      response,

      duration,
    });
  }

  // Successful requests

  await collect(205, {
    status: 201,
    headers: {},
    body: {
      success: true,
    },
  });

  await collect(350, {
    status: 201,
    headers: {},
    body: {
      success: true,
    },
  });

  await collect(100, {
    status: 201,
    headers: {},
    body: {
      success: true,
    },
  });

  await collect(350, {
    status: 201,
    headers: {},
    body: {
      success: true,
    },
  });

  // Uncomment to test error handling

  /*
  await collect(180, {
    status: 400,
    headers: {},
    body: {
      message: "Invalid email",
    },
  });
  */

  console.dir(await repository.findAll(), {
    depth: null,
  });
}

main().catch(console.error);
