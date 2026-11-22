# Troubleshooting

| Symptom | What to check |
| --- | --- |
| `wails3 doctor` cannot find the CLI or Go | Check `go version`, `wails3 version`, and PATH. Inside Docker, run `docker compose run --rm dev wails3 doctor`. |
| Native compilation fails | On Windows check WebView2 and your target architecture. On macOS check `xcode-select -p`. On Linux run `pkg-config --modversion gtk4 webkitgtk-6.0` and install the development packages for your distribution. |
| Vite reports a port conflict | Stop the other process or use `wails3 dev -port 9250` for native development. The Go proxy and Vite must use the same port. |
| The Wails window cannot reach Vite | Inspect the dev logs. If you started Vite separately, stop it and let Wails manage both processes. Inside Docker, inspect `docker compose logs dev`; the Vite server is private to that container. |
| The Docker viewer is unreachable | Check that Docker is using Linux containers, then check `docker compose ps` and `docker compose logs dev`. Set `DESKTOP_PORT` before starting Compose if host port 6080 is already occupied. |
| Docker commands cannot write to the project on Linux | Match `LOCAL_UID` and `LOCAL_GID` to your host user before the initial image build and volume creation. |
| Missing or stale bindings | Run `wails3 generate bindings -ts` from the generated app root. Verify the Go module name and the wrapper's import. |
| `@/` resolves in one tool only | Keep `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, and `components.json` aliases aligned. Restart the editor's TypeScript server. |
| Tailwind styles are missing | Check the Vite plugin, the `@import "tailwindcss"` entry in `src/style.css`, and the stylesheet import in `src/main.ts`. Use complete class names so Tailwind can detect them. |
| shadcn-vue cannot add a component | Run the pinned CLI from `frontend/`. Check `components.json`, aliases, registry access, and the local component export. Update the lockfile with dependency changes. |
| `go test` reports a missing embedded path | Run `wails3 generate bindings -ts` from the app root, then run `bun install --frozen-lockfile` and `bun run build` from `frontend/` before the Go tests. |
| Static assets disappear in production | Import assets through Vite or put them in `frontend/public/`. Rebuild with `wails3 build` so Go embeds the latest output. |
| An installed Linux app opens a blank window | Check that GTK4 and WebKitGTK 6.0 are installed for your distro. Run the app from a terminal to inspect webview errors and test against the distro used for packaging. |

In a browser pointed directly at Vite, the dashboard renders and the theme toggle works. To call the Go service, open the Wails webview or the Docker desktop viewer.
