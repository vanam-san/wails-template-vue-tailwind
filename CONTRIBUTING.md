# Contributing

Read [Development](docs/DEVELOPMENT.md) for the Docker and native toolchains. Create a branch from `master`. Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) with a short imperative subject, such as `fix(ci): prepare template archives on Windows` or `feat(ui): add a theme preference`. Commitlint checks commit messages in pull requests. Use `!` or a `BREAKING CHANGE` footer when the change breaks compatibility. See the [template release guide](docs/BUILD_AND_RELEASE.md#template-releases) for version increments.

After a pull request merges into `master`, the **Update code owners** workflow refreshes the default CODEOWNERS list from merged pull request authors who already have repository write access. The workflow opens or updates one pull request for review. The repository owner remains responsible for `.github/`. You can also run the workflow manually from `master` after collaborator access changes. [CODEOWNERS](.github/CODEOWNERS)

Enable **Allow GitHub Actions to create and approve pull requests** in the repository's Actions settings so the workflow can open its update pull request. A maintainer with write access can approve CI runs on that pull request from its merge box. [GitHub Actions settings](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository#preventing-github-actions-from-creating-or-approving-pull-requests)

Use `gofmt` for Go and the frontend Prettier configuration for Vue and TypeScript. Keep service validation in Go and call generated bindings through the frontend wrapper. Commit the lockfile with dependency changes.

Test the template from a separate directory. Export a clean source tree, run `wails3 init -n WailsVueStarter -t "<ABSOLUTE_TEMPLATE_PATH>" -mod example.org/wails/starter`, and run the [checks](docs/DEVELOPMENT.md) in the new app. Open the Wails window, submit a name and a blank value, toggle the theme, and confirm the production app runs. For packaging changes, test the relevant [installer](docs/BUILD_AND_RELEASE.md).

In the pull request, describe the change and why it is needed. List commands, platforms, and manual checks you ran. Include a desktop screenshot for visible changes. Report vulnerabilities [privately](SECURITY.md).
