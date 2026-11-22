# Contributing

Read [Development](docs/DEVELOPMENT.md) for the Docker and native toolchains. Create a branch from the default branch. Keep commits focused and use a short imperative summary that describes the change.

Use `gofmt` for Go and the frontend Prettier configuration for Vue and TypeScript. Keep service validation in Go and call generated bindings through the frontend wrapper. Commit the lockfile with dependency changes.

Test the template from a separate directory. Export a clean source tree, run `wails3 init -n WailsVueStarter -t "<ABSOLUTE_TEMPLATE_PATH>" -mod example.org/wails/starter`, and run the [checks](docs/DEVELOPMENT.md) in the new app. Open the Wails window, submit a name and a blank value, toggle the theme, and confirm the production app runs. For packaging changes, test the relevant [installer](docs/BUILD_AND_RELEASE.md).

In the pull request, describe the change and why it is needed. List commands, platforms, and manual checks you ran. Include a desktop screenshot for visible changes. Report vulnerabilities [privately](SECURITY.md).
