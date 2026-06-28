import { createInMemoryRepository } from "./repository/in-memory.repo";
import { Endpoint } from "./types";

async function main() {
  const endpoint: Endpoint = {
    method: "POST",
    route: "/api/v1/auth/register",

    request: {
      headers: {},
      query: {},
      params: {},
      body: {},
    },

    response: {
      status: 201,
      headers: {},
      body: {},
    },

    examples: {
      latest: undefined,
      success: undefined,
      errors: {},
    },

    metadata: {},

    stats: {
      hits: 1,
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      responseTime: {
        average: 205,
        minimum: 205,
        maximum: 205,
      },
    },
  };

  const repository = createInMemoryRepository();

  await repository.save(endpoint);

  const loaded = await repository.findByRoute(endpoint.route);

  console.log(loaded);

  console.log(await repository.findAll());

  await repository.clear();

  console.log(await repository.findAll());
}

main().catch(console.error);
