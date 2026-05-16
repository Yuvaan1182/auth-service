/** --- @@@ --- IMP. Keep mock file imports at top --- @@ --- */

/** --- mock files --- */
import { listenMock } from "../__mocks__/app.mock.js";
import { mockRedisService } from "../__mocks__/redis_service.mock.js";

/** --- package imports --- */
import { beforeEach, describe, expect, it, vi } from "vitest";

/** --- module imports --- */
import { startServer } from "../../server.js";

describe("Server integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should connect to redis and start the server", async () => {
    listenMock.mockImplementation((port, cb) => {
      cb();
      return { close: vi.fn() };
    });
    const data = await startServer({
      port: 5000,
      redis: mockRedisService,
    });

    expect(mockRedisService.connect).toHaveBeenCalled();
    expect(listenMock).toHaveBeenCalledWith(5000, expect.any(Function));
  });
});
