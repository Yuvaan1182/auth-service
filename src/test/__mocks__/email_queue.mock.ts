import { vi } from "vitest";

export const mockEmailQueue = {
  emailQueue: { add: vi.fn() },
};

vi.mock("#queue/email.queue.js", () => mockEmailQueue);
