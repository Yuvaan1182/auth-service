import { vi } from "vitest";

export const listenMock = vi.fn();

vi.mock("../../app.js", () => ({
  createApp: () => ({ listen: listenMock }),
}));
