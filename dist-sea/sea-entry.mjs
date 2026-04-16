// InkOS Studio — Single Executable Application entry
import { startStudioServer } from "./packages/studio/dist-server/api/server.js";
import { resolve, join } from "node:path";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const root = process.argv[2] ?? process.env.INKOS_PROJECT_ROOT ?? process.cwd();
const port = parseInt(process.env.INKOS_STUDIO_PORT ?? "4567", 10);

// Static assets are embedded alongside the SEA blob
const staticDir = join(import.meta.dirname ?? __dirname, "packages", "studio", "dist");

// Auto-open browser after a short delay
setTimeout(() => {
  const url = `http://localhost:${port}`;
  console.log(`Opening ${url} in browser...`);
  import("node:child_process").then(({ spawn }) => {
    const platform = process.platform;
    if (platform === "win32") {
      spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
    } else if (platform === "darwin") {
      spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
    } else {
      spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
    }
  });
}, 1500);

console.log(`InkOS Studio starting on http://localhost:${port}`);
startStudioServer(root, port, { staticDir }).catch((e) => {
  console.error("Failed to start:", e);
  process.exit(1);
});