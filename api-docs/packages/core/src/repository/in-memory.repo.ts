import type { Endpoint, EndpointRepository } from "../types";

export function createInMemoryRepository(): EndpointRepository {
  const store = new Map<string, Endpoint>();

  function getKey(endpoint: Endpoint) {
    return `${endpoint.method}:${endpoint.route}`;
  }

  return {
    async findByRoute(route) {
      for (const endpoint of store.values()) {
        if (endpoint.route === route) {
          return endpoint;
        }
      }

      return null;
    },

    async save(endpoint) {
      store.set(getKey(endpoint), endpoint);
    },

    async findAll() {
      return [...store.values()];
    },

    async clear() {
      store.clear();
    },
  };
}
