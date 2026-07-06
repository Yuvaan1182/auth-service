import express from "express";

import { createCollector } from "./collector";
import { createEventBus } from "./events";
import { createExpressMiddleware } from "./middleware";
import {
  createInMemoryRepository,
  createJsonRepository,
  registerRepositoryListeners,
} from "./repository";

import type { ApiDocsEvents } from "./types";

async function main() {
  const app = express();

  app.use(express.json());

  const eventBus = createEventBus<ApiDocsEvents>();

  const repository = createJsonRepository({
    filePath: "./output/endpoints.json",
  });

  registerRepositoryListeners(eventBus, repository);

  const collector = createCollector(eventBus);

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use(createExpressMiddleware(collector));

  app.get("/hello", (req, res) => {
    res.json({
      message: "Hello RouteScribe!",
    });
  });

  app.post("/login", (req, res) => {
    res.status(201).json({
      token: "abc123",
      user: req.body,
    });
  });

  app.get("/users/:id", (req, res) => {
    res.json({
      id: req.params.id,
      active: req.query.active,
    });
  });

  app.get("/debug", async (req, res) => {
    res.json(await repository.findAll());
  });

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
}

main().catch(console.error);
