import path from "node:path";
import { defineConfig } from "vitest/config";

const r = (p: string) => path.resolve(__dirname, "../../../src/", p);

export default defineConfig({
  test: {
    setupFiles: ["src/test/setup.ts"],
    environment: "node",
    testTimeout: 10000,
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    reporters: ["verbose"],
  },
  resolve: {
    alias: {
      "#config": r("config"),
      "#routes": r("routes"),
      "#utils": r("utils"),
      "#middlewares": r("middlewares"),
      "#prisma": r("generated/prisma"),
      "#controllers": r("controllers"),
      "#constants": r("constants"),
      "#types": r("types"),
      "#repo": r("repositories"),
      "#queue": r("queue"),
      "#worker": r("worker"),
    },
  },
});
