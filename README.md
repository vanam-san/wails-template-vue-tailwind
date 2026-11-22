# Wails Vue Tailwind TypeScript

A Wails v3 template for desktop apps with a Go backend, a Vue 3 frontend, and editable shadcn-vue components. Develop in Docker or with a native toolchain, then ship an executable with the frontend embedded.

[Install the app](#install-the-app) · [Quick start for developers](#quick-start-for-developers) · [Build and release](#build-and-release) · [Project layout](#project-layout)

## What you get

| View | Try it |
| --- | --- |
| **Starter** | Enter a name and call a real Go service through generated Wails bindings. The form shows validation, loading, and the response. |
| **Components** | Change the notification schedule, toggle preferences, and confirm your choices in a dialog. |
| **Checklist** | Check individual tasks or use the bulk actions. Watch the badges, progress bar, and completion alert update. |

The starter includes light and dark themes, Lucide icons, strict TypeScript, and Tailwind CSS v4. The shadcn-vue component source lives in the project and can be edited directly.

_Desktop screenshot or GIF goes here._

## Install the app

Download the installer for your operating system from [GitHub Releases](https://github.com/vanam-san/wails-template-vue-tailwind/releases) when one is available. If you already have the installer file, start with the matching row below. Running a packaged app requires no development toolchain.

| Platform | Install |
| --- | --- |
| Windows x64 | Open the downloaded `*-installer.exe` and follow the setup wizard. The installer includes a WebView2 bootstrapper. |
| Debian 13 amd64 | Open a terminal in the download folder. Run `sudo apt install ./wailsvuestarter.deb`, using the actual downloaded filename. Then open the app from your application menu. |
| macOS | Open a macOS `.dmg` built for your Mac and drag the app to **Applications**. |

If the Releases page is empty, the developer steps below explain how to generate and build the starter locally.

## Quick start for developers

Choose [Docker](#2a-run-with-docker) for a self-contained development environment, or use the [native toolchain](#2b-run-natively) to open the app directly on your operating system. Both routes create a separate app folder that you can edit.

### 1. Prepare the template source

Install Git for the developer setup and check that `git --version` runs in your terminal. If you already have this repository locally, open a terminal in the folder containing `template.yaml`. Once source has been published to GitHub, you can get a copy with Git.

```sh
git clone https://github.com/vanam-san/wails-template-vue-tailwind.git
cd wails-template-vue-tailwind
```

Run the block for your shell from that folder. It creates `wails-starter-workspace` beside the repository and copies the source into `template-ts`, using Git's list of source files to leave `.git/` and ignored build files behind. If `wails-starter-workspace` already exists, change that name in the first command. Keep this terminal open for the next step so the path variables are available.

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

### 2A. Run with Docker

1. Install and start [Docker with Compose](https://docs.docker.com/get-docker/). Check that `docker compose version` runs in your terminal. On Windows, use Docker Desktop in Linux container mode. On Linux, if your user or group ID differs from 1000, run `export LOCAL_UID="$(id -u)" LOCAL_GID="$(id -g)"` before building so the container can write to your workspace.
2. Build the development image and generate the starter. The commands below work in the same terminal you used in step 1. The first build downloads the development tools and can take a few minutes.

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

### 2B. Run natively

1. Install [Go](https://go.dev/dl/) 1.26 or newer, [Node.js](https://nodejs.org/en/download) 24 or 26 LTS, and the [Wails platform dependencies](https://v3.wails.io/getting-started/installation/). Windows uses WebView2, macOS uses Xcode Command Line Tools, and Linux uses GTK4 and WebKitGTK 6.0.
2. Install the Wails CLI and pnpm. The Node.js installer supplies `npm`.

   ```sh
   go install github.com/wailsapp/wails/v3/cmd/wails3@v3.1.0
   npm install --global pnpm@11.25.0
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

3. From the same terminal you used in step 1, generate the app and launch the native Wails window.

   ```sh
   cd "$ProjectRoot"
   wails3 init -n WailsVueStarter -t "$TemplateSource" -mod example.org/wails/starter -productname "Wails Vue Starter"
   cd WailsVueStarter
   wails3 dev
   ```

   The first run installs frontend dependencies and generates bindings. When the window opens, enter a name and select **Greet from Go**. Press Ctrl+C in the terminal to stop the session.

**Using the GitHub template URL.** Native-toolchain users can skip the snapshot and use the `v1.0.0` release. Run the following from the parent directory where you want a new `WailsVueStarter` folder.

```sh
wails3 init -n WailsVueStarter -t https://github.com/vanam-san/wails-template-vue-tailwind@v1.0.0 -mod example.org/wails/starter -productname "Wails Vue Starter"
cd WailsVueStarter
wails3 dev
```

Replace `example.org/wails/starter` with your own Go module path when starting a real app. The local `template-ts` snapshot selects TypeScript bindings automatically in Wails v3.1.0. You can also run `wails3 generate bindings -ts` explicitly from the generated app folder.

## Build and release

Run these commands from the **generated app directory**. Each installer lands in `bin/`.

| Target | Command | Output |
| --- | --- | --- |
| Current desktop host | `wails3 build` | Executable with the Vue bundle embedded |
| Windows x64 from Docker | `docker compose run --rm dev wails3 package GOOS=windows ARCH=amd64 FORMAT=nsis INSTALL_SCOPE=user` | NSIS `*-installer.exe` |
| Debian 13 from Docker | `docker compose run --rm dev wails3 task linux:create:deb` | Debian `.deb` package |
| macOS on a Mac | `wails3 task darwin:package:dmg` | Disk image containing the app |

Stop the Docker development session before packaging. Set the product identifier, version, icon, and release metadata before distributing an app. See [Build and release](docs/BUILD_AND_RELEASE.md) for install commands, signing, and platform requirements.

## Project layout

| Path in the template | Purpose |
| --- | --- |
| `template.yaml`, `main.go.tmpl`, `go.mod.tmpl`, `Taskfile.tmpl.yml` | Metadata and files rendered by `wails3 init` |
| `greetservice.go` | Example Go service and input validation |
| `frontend/src/views/` | Starter, Components, and Checklist views |
| `frontend/src/components/ui/` | Editable shadcn-vue components |
| `frontend/src/services/` | Typed wrapper for the generated Wails service bindings |
| `compose.yml`, `docker/` | Container toolchain and development desktop |
| `.github/workflows/ci.yml`, `docs/` | Build matrix, installer jobs, and developer guides |

Wails creates platform assets under `build/` in the generated app. Change a Go service, then run `wails3 generate bindings -ts` from the app root to update `frontend/bindings/`. The files there are regenerated by Wails. To add a shadcn-vue component, run `pnpm --dir frontend dlx shadcn-vue@2.9.0 add separator`.

## Checks

Run the following from a freshly generated app. The frontend build produces the assets that Go embeds.

```sh
wails3 generate bindings -ts
pnpm --dir frontend install --frozen-lockfile
pnpm --dir frontend format:check
pnpm --dir frontend lint
pnpm --dir frontend typecheck
pnpm --dir frontend test
pnpm --dir frontend build
go test ./...
go vet ./...
```

With Docker, use `docker compose run --rm dev` before a command to run it in the toolchain container. GitHub Actions defines native checks for Windows, macOS, and Ubuntu, plus a Docker job for the Windows and Debian installers.

## Further reading

- [Architecture](docs/ARCHITECTURE.md) covers Vue, the Go service bridge, and embedded assets.
- [Development](docs/DEVELOPMENT.md) covers hot reload, formatting, and adding services and UI.
- [Troubleshooting](docs/TROUBLESHOOTING.md) covers Docker, webviews, bindings, and build errors.
- [Design decisions](docs/DECISIONS.md) explains the choice of framework, CSS, components, and build tools.
- [Wails](https://wails.io/) and [shadcn-vue](https://shadcn-vue.com/docs) provide upstream documentation.

## Contributing

Use the [contribution guide](CONTRIBUTING.md) to test a change in a fresh generated project. See the [changelog](CHANGELOG.md) and [template release guide](docs/BUILD_AND_RELEASE.md#template-releases) for the release history and versioning rules.

README structure inspired by [Wails Template Vue](https://github.com/misitebao/wails-template-vue).

[MIT license](LICENSE) · [Code of conduct](CODE_OF_CONDUCT.md) · [Security policy](SECURITY.md)
