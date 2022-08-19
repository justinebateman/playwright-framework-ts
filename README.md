# playwright-framework-ts

An automation framework for Playwright written in TypeScript  with common utils and tools for automated QA

This framework includes:

- Playwright base page object that can be extended from

```
class TestPage extends BasePage implements IPage {
  readonly page: Page;

  readonly url: string = "/your-url";

  constructor(page: Page) {
    super(page);
    this.page = page;
  }
```
The base page includes useful fluent waits and assertions

- Browser helpers for local storage management
- Element helpers with common fluent waits eg. waiting for an element to be visible, waiting for element text to equal expected, scrolling to an element etc.
- Auth0 and AWS cognito token helpers eg. get access token from local storage or storage state file
- General helpers for managing dates, currencies, strings etc.


## :wrench: Local Configuration

In order to be able to install this package from the GitHub Package Repository you must configure your per-user `.npmrc` configuration file.

- Locate the `$HOME/.npmrc` configuration file. If one doesn't exist, create it.
- Add the following to the `.npmrc` configuration file:

```
@justinebateman:registry = https://npm.pkg.github.com

```

Installing the package via yarn:

- Latest

```
yarn add @justinebateman/playwright-framework-ts
yarn add @justinebateman/playwright-framework-ts@latest
```

- Development

```
yarn add @justinebateman/playwright-framework-ts@dev
```

- Specific version

```
yarn add @justinebateman/playwright-framework-ts@<version>
```

## :muscle: GitHub Actions Configuration

When using this package as a dependency within a repository that runs GitHub Actions, the given action workflow will need to be configured in order to have access to the GitHub Package Registry `@justinebateman` scope.

You can do this in a few ways, here are two different options:

```
- name: Set Playwright framework private package registry
  run: |
    npm config set @justinebateman:registry https://npm.pkg.github.com
```

```
- uses: actions/setup-node@v3
    with:
      node-version: "14"
      check-latest: false
      registry-url: "https://npm.pkg.github.com"
      scope: "@justinebateman"
```

## :construction_worker_woman:️ Development

All changes to `main` need to go in via a Pull Request. In your local clone of
the repository, you'll need to create a branch of `main`, make your changes, update the version number in `package.json`
commit those changes, push the branch up and then create a Pull Request. Pull
requests need to be reviewed and approved before they can be merged.

When a new branch is pushed up, the CI/CD (Continuous Integration/Continuous
Delivery) pipeline will automatically run linting against the branch.