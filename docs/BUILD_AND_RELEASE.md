# Build and release

Run build and release commands from the generated app root. Update the app name, company, reverse-DNS identifier, version, description, copyright, and icon before distribution. Pass `-product*` flags at initialization to fill the generated platform assets. Maintain the corresponding values in `build/config.yml` before running `wails3 task common:update:build-assets`. Wails v3.1.0 seeds that config with sample metadata even when initial platform assets use the supplied flags. Review changes after regeneration and replace `build/appicon.png` with your app icon.

## Docker installers

Stop a running development container before packaging so the workflows can safely regenerate the same bindings and assets. Use `docker compose build` if the image has yet to be created.

| Target | Command | Installer and installation |
| --- | --- | --- |
| Windows x64 | `docker compose run --rm dev wails3 package GOOS=windows ARCH=amd64 FORMAT=nsis INSTALL_SCOPE=user` | Run the `*-installer.exe` under `bin/`. The installer includes the WebView2 bootstrapper. |
| Debian 13 Linux | `docker compose run --rm dev wails3 task linux:create:deb` | Install the package under `bin/` with `sudo apt install ./bin/<package>.deb`. Build on the architecture you intend to distribute. |

Before distributing a Debian package, provide a real maintainer name and contact email in the generated nfpm configuration or pass GIT_COMMITTER_NAME and GIT_COMMITTER_EMAIL into the packaging container with docker compose run -e. The sample installer uses the upstream default fields.

The Windows target uses Go's CGO-free Wails backend and NSIS in a Linux container. Linux binaries link to the container's system libraries, so test on the supported distribution and architecture. Users installing a release need the system webview for their platform. They can run the app without the development toolchain or Vite.

## Native builds and macOS

Run `wails3 build` to create a standalone executable in `bin/`. On Windows, install WebView2 and use `wails3 package` with NSIS to create the installer locally. On macOS, install Xcode Command Line Tools and run `wails3 task darwin:package:dmg`. Open the DMG and drag the app into Applications. Linux native builds require a C compiler, pkg-config, GTK4, and WebKitGTK 6.0 development headers. [Wails installation and dependencies](https://wails.io/getting-started/installation/)

Use a Mac for building, signing, and notarizing a macOS release. Sign the Windows app and installer with an Authenticode certificate for public distribution. Keep certificates, passwords, signing identities, and notarization credentials in a keychain or CI secrets. Never commit credentials. Test install, launch, and uninstall on the target OS before publishing installers. [Wails signing and distribution](https://wails.io/reference/cli/#code-signing--packaging)

The GitHub Actions workflow uploads unsigned Windows NSIS, Debian, and macOS DMG artifacts. Download and test them before attaching signed releases to a GitHub release. Mobile and store distribution require their own configuration.
