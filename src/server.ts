import { createApp } from "./app.js";
import { env } from "#config/env.config.js";
import { ServerOptions } from "#types/server.type.js";
import { appContainer } from "#container/app.container.js";
import { repoContainer } from "#container/repo.container.js";
import { serviceContainer } from "#container/service.container.js";

export const startServer = async (
  options: ServerOptions = {},
): Promise<void> => {
  /** deps initialization */
  const port = options.port ?? env.port;

  /** --- create db & redis connections --- */
  console.log("startServer: appContainer.init() -> connecting DB and Redis");
  await appContainer.init();

  /** --- initializing repos instances --- */
  console.log("startServer: repoContainer.init() -> creating repositories");
  await repoContainer.init();

  /** --- initialize service instances --- */
  console.log("startServer: serviceContainer.init() -> initializing services");
  await serviceContainer.init();

  /** --- create app --- */
  console.log(
    "startServer: createApp() -> building express app and registering routes",
  );
  const app = options.createApp ?? createApp();

  /** --- start server --- */
  app.listen(port, () => {
    console.info(`🚀 Auth_APP: running on port: ${port}`);
  });
};
