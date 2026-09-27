import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only` throws unless bundled for React Server Components; tests run in plain Node.
      "server-only": fileURLToPath(
        new URL("./src/test/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    // A positive UTC offset (the school's timezone) is where date-only values
    // are most likely to shift to the previous day, so tests run there.
    env: { TZ: "Asia/Taipei" },
  },
});
