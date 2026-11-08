import { defineConfig } from "vitest/config";

// Suite explícita fuera de CI; no importa la configuración de producción.
export default defineConfig({
  test: {
    include: ["test-fork/**/*.test.ts"],
    environment: "node",
    fileParallelism: false,
    hookTimeout: 120000,
    testTimeout: 120000,
  },
});
