# Changelog

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.2.0] - 2026-11-24

### Added

- Explain the Wails service bridge, Vue state, UI wrappers, and build infrastructure with source comments.
- Add a source map and a walkthrough of the greeting request to the architecture guide.
- Document the tested toolchains, platform prerequisites, and installer targets in a compatibility matrix.
- Configure weekly Renovate updates for dependencies and the Bun lockfile.
- Run Go and frontend vulnerability checks in CI. Publish a CycloneDX SBOM and dependency license inventory, and attach the SBOM to release drafts.
- Check pull request commit messages with Commitlint and propose CODEOWNERS updates for contributors with repository write access.

### Fixed

- Include Go and Bun dependencies in the Ubuntu SBOM by using a Syft version with Bun lockfile support.
- Keep the shadcn-vue stylesheet in the starter while running the CLI on demand. This removes the vulnerable CLI dependencies from the app's lockfile.

## [1.1.0] - 2026-11-22

### Added

- Attach Windows x64, Debian 13 amd64, and universal macOS installers to a draft GitHub release on version tag pushes.

### Changed

- Use Bun for frontend dependency management and scripts in generated apps, Docker, and GitHub Actions.
- Simplify the README with installation instructions, a sample app walkthrough, and a Windows screenshot.

## [1.0.0] - 2026-11-22

### Added

- Wails v3 template with Vue, Vite, TypeScript, Tailwind CSS v4, and local shadcn-vue components.
- Go greeting service, typed frontend wrapper, and light and dark dashboard.
- Interactive shadcn-vue showcase with tabs, a switch, a select, a checkbox, dialogs, alerts, tooltips, and a launch checklist with live progress.
- Docker development desktop, native build checks, and platform installer workflows.

### Fixed

- Prepare Git archives and pass app paths using native paths on Windows CI.

[Unreleased]: https://github.com/vanam-san/wails-template-vue-tailwind/compare/v1.2.0...master
[1.2.0]: https://github.com/vanam-san/wails-template-vue-tailwind/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/vanam-san/wails-template-vue-tailwind/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/vanam-san/wails-template-vue-tailwind/releases/tag/v1.0.0
