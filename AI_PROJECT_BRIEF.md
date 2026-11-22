# AI project brief

This repository generates desktop apps with Wails v3.1.0, Go, Vue 3, strict TypeScript, Tailwind CSS v4, and local shadcn-vue components. A dashboard proves the real Go binding and the packaged asset path.

Use the pinned CLI and official Wails v3 APIs. Wails renders `*.tmpl` files and creates platform build assets during initialization. Keep the app-owned service wrapper aligned with the generated module path. Bindings, frontend output, dependencies, and installer artifacts belong to generated apps and are excluded from the template source.

Use Docker Compose when working without a host toolchain. Inside the generated root, `docker compose up --build` opens the local desktop viewer. See [Development](docs/DEVELOPMENT.md) and [Build and release](docs/BUILD_AND_RELEASE.md) for the equivalent host commands and packaging.

Validate changes in a newly initialized app. Check formatting, lint, Vue types, frontend tests and build, Go tests and vet, and the relevant desktop builds. For UI changes test blank input, the greeting, keyboard submission, and the theme in a Wails window. List actual platforms and test outcomes in the handoff.
