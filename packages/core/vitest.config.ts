import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    exclude: ["test-fork/**"],
    // Los tests NUNCA tocan la red: cualquier fetch real es un bug.
    environment: "node",
  },
});
