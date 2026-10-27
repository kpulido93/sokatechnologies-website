import { resolve } from "node:path";
import { cloudflareTest, readD1Migrations } from "@cloudflare/vitest-plugin";
import { defineConfig } from "vitest/config";

const root = process.cwd();
const migrations = await readD1Migrations(resolve(root, "worker"));

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: resolve(root, "worker/wrangler.native-test.toml") },
      miniflare: {
        bindings: { TEST_MIGRATIONS: migrations }
      }
    })
  ],
  test: {
    include: ["worker/test/native-runtime.spec.mjs"]
  }
});
