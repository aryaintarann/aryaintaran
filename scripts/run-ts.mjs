// Runs a TS entry with plain Node: bundle with esbuild, then import. Used instead of `payload run`,
// whose tsx loader breaks on undici's CacheStorage class. Usage: node scripts/run-ts.mjs scripts/x.ts [args]
import { build } from "esbuild";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

const root = process.cwd();
const entry = process.argv[2];
if (!entry) throw new Error("usage: node scripts/run-ts.mjs <entry.ts> [args]");

for (const f of [".env.local", ".env"]) if (fs.existsSync(f)) process.loadEnvFile(f);

const out = path.join(root, "node_modules/.cache/run-ts", `${path.basename(entry, ".ts")}.mjs`);
await build({
  entryPoints: [path.resolve(entry)],
  outfile: out,
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  tsconfig: path.join(root, "tsconfig.json"),
  logLevel: "warning",
  plugins: [
    {
      // revalidateTag needs a Next request scope; outside Next the revalidate hooks should do nothing.
      name: "stub-next-cache",
      setup(b) {
        b.onResolve({ filter: /^next\/cache$/ }, () => ({ path: "next-cache-stub", namespace: "stub" }));
        b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export const revalidateTag = () => {};" }));
      },
    },
  ],
});
await import(pathToFileURL(out).href);
process.exit(0);
