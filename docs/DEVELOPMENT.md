# Development

## Set up

[Create an app from the template](../README.md) into a separate directory. Go and frontend checks run inside this generated app. With Docker, install only Docker with Compose and start the environment with `docker compose up --build`. Edit the bind-mounted project from your host editor. Named volumes hold Linux node_modules and package caches. On a Linux host with a UID or GID other than 1000, set `LOCAL_UID` and `LOCAL_GID` before building the image to match your account.

For host development, install the toolchain and platform libraries from the [README](../README.md), run `wails3 doctor`, and start `wails3 dev` from the app root. The first build installs frontend dependencies from the frozen lockfile and generates bindings. Later Go rebuilds reuse the install while Vite handles Vue, CSS, and template edits. Docker enables Vite polling for bind mounts.

## Checks

From the generated root:

```sh
wails3 generate bindings -ts
pnpm --dir frontend install --frozen-lockfile
pnpm --dir frontend format:check
pnpm --dir frontend typecheck
pnpm --dir frontend lint
pnpm --dir frontend test
pnpm --dir frontend build
go test ./...
go vet ./...
```

Build the frontend before testing Go since its output is embedded. Use `gofmt -w` on Go files and `pnpm --dir frontend format` on frontend files. For Docker, prefix a command with `docker compose run --rm dev`, or use `docker compose exec dev bash` inside a running container. Stop the development session before running build commands that rewrite bindings or `frontend/dist`.

## Extend the app

Put app screens in `frontend/src/views/`, shared UI in `frontend/src/components/`, and stateful Vue logic in composables when it can be tested or shared independently. Use `<script setup lang="ts">` with types for component props and emits.

Add a public method to the Go service, or register a new service in `main.go`. Run `wails3 generate bindings -ts` in the app root and call the generated method through a wrapper in `frontend/src/services/`. Review the generated module directory when changing `go.mod` and update wrapper imports to match. Keep validation and native operations in Go.

To add a shadcn-vue component, run this command from `frontend/`:

```sh
pnpm dlx shadcn-vue@2.9.0 add dialog
```

The container equivalent is `docker compose run --rm --workdir /workspace/frontend dev pnpm dlx shadcn-vue@2.9.0 add dialog`. Review the component source, dependency changes, and lockfile before committing. If the CLI adds a hosted font import, remove it to keep the starter usable offline.
