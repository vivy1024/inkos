// InkOS Studio — Single Executable Application entry
const { startStudioServer } = require("D:/DESKTOP/sub2api/inkos-master/packages/studio/dist/api/server.js");
const { join } = require("node:path");
const { spawn } = require("node:child_process");

// Parse command line arguments
const args = process.argv.slice(2);

// Handle --version flag
if (args.includes('--version') || args.includes('-v')) {
  console.log('InkOS Studio v1.1.1');
  process.exit(0);
}

// Handle --help flag
if (args.includes('--help') || args.includes('-h')) {
  console.log('Usage: inkos [options] [project-path]');
  console.log('');
  console.log('Options:');
  console.log('  -h, --help     Show this help message');
  console.log('  -v, --version  Show version number');
  console.log('  --port <port>  Specify port (default: 4567)');
  console.log('');
  console.log('Environment Variables:');
  console.log('  INKOS_PROJECT_ROOT  Default project directory');
  console.log('  INKOS_STUDIO_PORT   Server port (default: 4567)');
  process.exit(0);
}

// Extract port from --port flag if present
let portArg = null;
const portIndex = args.findIndex(arg => arg === '--port');
if (portIndex !== -1 && args[portIndex + 1]) {
  portArg = parseInt(args[portIndex + 1], 10);
}

// Get project root (first non-flag argument)
const root = args.find(arg => !arg.startsWith('-') && arg !== args[portIndex + 1])
  || process.env.INKOS_PROJECT_ROOT
  || process.cwd();

const port = portArg || parseInt(process.env.INKOS_STUDIO_PORT || "4567", 10);
const exeDir = require("node:path").dirname(process.execPath);
const staticDir = join(exeDir, "static");

setTimeout(() => {
  const url = "http://localhost:" + port;
  console.log("Opening " + url + " in browser...");
  const platform = process.platform;
  if (platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
  } else if (platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
  } else {
    spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
  }
}, 1500);

console.log("InkOS Studio starting on http://localhost:" + port);
startStudioServer(root, port, { staticDir }).catch((e) => {
  console.error("Failed to start:", e);
  process.exit(1);
});