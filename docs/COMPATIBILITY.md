# Compatibility and dependency maintenance

## Toolchain

| Component | Template requirement | CI baseline |
| --- | --- | --- |
| Wails | Wails v3 with matching Go module, CLI, and `@wailsio/runtime` versions | 3.1.0 |
| Go | 1.26.0 minimum in the generated module | 1.26.11 in native CI and Docker |
| Bun | Use the `packageManager` pin in `frontend/package.json` and commit `frontend/bun.lock` | 1.4.5 in native CI and Docker |
| Node.js | 24.x or 26.x per the frontend manifest | 26.x in native CI and Docker. 24.x is declared compatible. |
| Frontend | Vue 3, Vite 8, TypeScript 5.9, Tailwind CSS 4 | Exact resolved versions are in `frontend/bun.lock`. |

## Platforms

| Platform | Native CI runner | Installer built in CI | Platform requirements |
| --- | --- | --- | --- |
| Windows | `windows-latest` | x64 NSIS via Docker | Microsoft Edge WebView2. The installer includes its bootstrapper. |
| macOS | `macos-latest` | Universal DMG for Apple silicon and Intel | System WebKit. Native builds require Xcode Command Line Tools. |
| Linux | `ubuntu-24.04` | Debian 13 amd64 DEB via Docker | GTK4 and WebKitGTK 6.0. Native builds also require a C compiler, pkg-config, and development headers. |

The CI matrix exercises template generation, frontend checks, Go tests, and native builds. See the release guide for manual install, launch, and uninstall checks on target systems. [Build and release](BUILD_AND_RELEASE.md)

## Dependency updates

Install the Renovate GitHub App for this repository to enable update pull requests. The repository configuration schedules updates and lockfile maintenance weekly. It covers Bun dependencies, GitHub Actions, Docker base images, and explicit Wails, `govulncheck`, and Syft pins. Updates require review before merge. [Renovate configuration](../.github/renovate.json)

Review the Wails CLI, Docker CLI, schema URL, and frontend runtime together when upgrading Wails. The template substitutes the generator version into `go.mod.tmpl`. Regenerate a sample app and review `go.sum.tmpl` when updating Wails. Update this matrix and any affected setup commands when the tested toolchain changes.

## Dependency checks

- `govulncheck ./...` scans the generated app for reachable known Go vulnerabilities on Windows, macOS, and Linux. [Go vulnerability management](https://go.dev/doc/security/vuln/)
- `bun audit` checks the frontend lockfile against registry advisories on Linux, including development dependencies. Both vulnerability checks can fail CI and run on pushes, pull requests, manual runs, and the weekly schedule. [Bun audit](https://bun.com/docs/pm/cli/audit)
- The Linux run publishes `starter.cdx.json` and `dependency-licenses.tsv` in the `dependency-inventory` artifact. Syft inventories Go and frontend dependencies visible in the generated app's Linux workspace after the build. The SBOM describes that workspace and can include build-time dependencies. Installer system libraries and dependencies specific to other operating systems may be outside its scope. [Syft catalogers](https://oss.anchore.com/docs/guides/sbom/catalogers/)
- Review the license inventory for new licenses and entries marked `UNKNOWN`. CI verifies that both ecosystems are present and reports missing license metadata in the run summary. License decisions require maintainer review.
