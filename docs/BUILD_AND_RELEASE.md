# Build and release

## Template releases

The first template release is `v1.0.0`. Choose the next version by taking the largest increment required by the changes since the last published release.

| Change | Increment | Example after `v1.0.0` |
| --- | --- | --- |
| Backward-compatible fixes, such as `fix:` | Patch `+0.0.1` | `v1.0.1` |
| Backward-compatible features, such as `feat:` | Minor `+0.1.0` | `v1.1.0` |
| Breaking changes or an incompatible overhaul, marked with `!` or `BREAKING CHANGE` | Major, reset minor and patch | `v2.0.0` |

1. Update `template.yaml` and move the relevant changelog entries from **Unreleased** into a dated version section. Commit those changes with a Conventional Commit such as `chore(release): prepare v1.0.1`.
2. Verify the checks on `master`. Create an annotated `vMAJOR.MINOR.PATCH` tag for the verified commit and push the tag to `origin`.
3. Wait for **Template checks and installers** to attach the starter app installers to a draft GitHub release for the tag. Review the assets, add the matching changelog section as release notes, and publish the draft. The tag and source archives version the template. Installer versions are set separately when generating or configuring an application.

[Semantic Versioning](https://semver.org/) · [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## Application releases

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

The GitHub Actions workflow uploads a Windows x64 NSIS installer, a Debian 13 amd64 package, a universal macOS DMG for Apple silicon and Intel, and a dependency inventory as run artifacts. On a version tag push, the workflow attaches the installers and the CycloneDX SBOM to the matching draft GitHub release after the checks and builds pass. The automated builds use no distribution signing credentials. Mobile and store distribution require their own configuration. [Dependency inventory scope](COMPATIBILITY.md#dependency-checks)
