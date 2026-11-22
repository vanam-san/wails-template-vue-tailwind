# Development

## Set up

Use the [README quick start](../README.md#create-your-own-app) to generate an app directly from GitHub. The steps below cover Docker and development from a local checkout.

### Prepare a local template snapshot

Install Git and open a terminal in the folder containing `template.yaml`. To get a local copy, clone the repository.

```sh
git clone https://github.com/vanam-san/wails-template-vue-tailwind.git
cd wails-template-vue-tailwind
```

Run the block for your shell from that folder. It creates `wails-starter-workspace` beside the repository and copies the source into `template-ts`, using Git's list of source files to leave `.git/` and ignored build files behind. If `wails-starter-workspace` already exists, change that name in the first command. Keep this terminal open for the Docker or native steps so the path variables are available.

**Windows PowerShell**

```powershell
$ProjectRoot = Join-Path (Resolve-Path ..).Path 'wails-starter-workspace'
$TemplateSource = Join-Path $ProjectRoot 'template-ts'
New-Item -ItemType Directory -Path $TemplateSource -Force | Out-Null
git -c core.quotepath=false ls-files --cached --others --exclude-standard | Sort-Object -Unique | ForEach-Object {
    $destination = Join-Path $TemplateSource $_
    New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
    Copy-Item -LiteralPath $_ -Destination $destination
}
```

**macOS or Linux shell**

```sh
ProjectRoot="$(cd .. && pwd)/wails-starter-workspace"
TemplateSource="$ProjectRoot/template-ts"
mkdir -p "$TemplateSource"
git ls-files -z --cached --others --exclude-standard | tar -cf - --null -T - | tar -xf - -C "$TemplateSource"
```

### Run with Docker

1. Install and start [Docker with Compose](https://docs.docker.com/get-docker/). Check that `docker compose version` runs in your terminal. On Windows, use Docker Desktop in Linux container mode. On Linux, if your user or group ID differs from 1000, run `export LOCAL_UID="$(id -u)" LOCAL_GID="$(id -g)"` before building so the container can write to your workspace.
2. Build the development image and generate the starter. The commands below work in the same terminal where you prepared the snapshot. The first build downloads the development tools and can take a few minutes.

   ```sh
   cd "$TemplateSource"
   docker compose build
   docker run --rm --mount "type=bind,source=$TemplateSource,target=/template-ts,readonly" --mount "type=bind,source=$ProjectRoot,target=/projects" wails-vue-toolchain wails3 init -d /projects -n WailsVueStarter -t /template-ts -mod example.org/wails/starter -productname "Wails Vue Starter"
   ```

3. Enter the **generated app** and start its development desktop.

   ```sh
   cd "$ProjectRoot/WailsVueStarter"
   docker compose up --build
   ```

4. Open the [local desktop viewer](http://127.0.0.1:6080/vnc.html?autoconnect=1&resize=scale). Wait until the window shows **Wails + Vue Starter**, enter a name, and select **Greet from Go**. Edit the files in `WailsVueStarter` on your host to see changes in the window. Press Ctrl+C in the terminal to stop the session, or run `docker compose down` from the generated app folder.

### Run natively from a local checkout

1. Install [Go](https://go.dev/dl/) 1.26 or newer, [Bun](https://bun.sh/docs/installation) 1.4.5, [Node.js](https://nodejs.org/en/download) 24 or 26 LTS for the frontend tools, and the [Wails platform dependencies](https://v3.wails.io/getting-started/installation/). Windows uses WebView2, macOS uses Xcode Command Line Tools, and Linux uses GTK4 and WebKitGTK 6.0.
2. Install the Wails CLI.

   ```sh
   go install github.com/wailsapp/wails/v3/cmd/wails3@v3.1.0
   ```

   If your terminal cannot find `wails3`, use the block for your shell to add Go's executable directory for this session.

   **Windows PowerShell**

   ```powershell
   $GoBin = go env GOBIN
   if (-not $GoBin) { $GoBin = Join-Path (go env GOPATH) 'bin' }
   $env:Path = "$GoBin;$env:Path"
   ```

   **macOS or Linux shell**

   ```sh
   GoBin="$(go env GOBIN)"
   if [ -z "$GoBin" ]; then GoBin="$(go env GOPATH)/bin"; fi
   export PATH="$GoBin:$PATH"
   ```

   Check the platform setup before generating the app.

   ```sh
   wails3 doctor
   ```

3. From the same terminal where you prepared the snapshot, generate the app and launch the native Wails window.

   ```sh
   cd "$ProjectRoot"
   wails3 init -n WailsVueStarter -t "$TemplateSource" -mod example.org/wails/starter -productname "Wails Vue Starter"
   cd WailsVueStarter
   wails3 dev
   ```

   The first run installs frontend dependencies and generates bindings. When the window opens, enter a name and select **Greet from Go**. Press Ctrl+C in the terminal to stop the session.

Replace `example.org/wails/starter` with your own Go module path when starting a real app. The local `template-ts` snapshot selects TypeScript bindings automatically in Wails v3.1.0. You can also run `wails3 generate bindings -ts` explicitly from the generated app folder.

## Checks

From the generated root:

```sh
wails3 generate bindings -ts
cd frontend
bun install --frozen-lockfile
bun run format:check
bun run typecheck
bun run lint
bun run test
bun run build
cd ..
go test ./...
go vet ./...
```

Build the frontend before testing Go since its output is embedded. Use `gofmt -w` on Go files and run `bun run format` from `frontend/` to format frontend files. For Docker, prefix an app-root command with `docker compose run --rm dev` and a frontend command with `docker compose run --rm --workdir /workspace/frontend dev`. Stop the development session before running build commands that rewrite bindings or `frontend/dist`.

## Extend the app

Put app screens in `frontend/src/views/`, shared UI in `frontend/src/components/`, and stateful Vue logic in composables when it can be tested or shared independently. Use `<script setup lang="ts">` with types for component props and emits.

Add a public method to the Go service, or register a new service in `main.go`. Run `wails3 generate bindings -ts` in the app root and call the generated method through a wrapper in `frontend/src/services/`. Review the generated module directory when changing `go.mod` and update wrapper imports to match. Keep validation and native operations in Go.

To add a shadcn-vue component, run this command from `frontend/`:

```sh
bunx shadcn-vue@2.9.0 add dialog
```

The container equivalent is `docker compose run --rm --workdir /workspace/frontend dev bunx shadcn-vue@2.9.0 add dialog`. Review the component source, dependency changes, and lockfile before committing. If the CLI adds a hosted font import, remove it to keep the starter usable offline.
