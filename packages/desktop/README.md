# @actalk/inkos-desktop (Tauri)

> **Status: DEPRECATED / EXPERIMENTAL**
>
> This package is **no longer the primary desktop distribution path** for InkOS.
> The main path is now **Node SEA → EXE + browser** (see Phase 8 in the v2 plan).
>
> Known issues with the Tauri path:
> - Uses raw `std::fs` without workspace sandboxing (path traversal risk)
> - Missing plugin integrations (MCP, notifications)
> - Maintenance burden of Rust + Tauri + web stack
>
> This code is preserved for reference only. Do not invest further effort here.

## If you're looking for the desktop version

Use `inkos studio` to start the HTTP server, then access it in your browser.
Future releases will ship a single `inkos.exe` via Node SEA that auto-launches the browser.
