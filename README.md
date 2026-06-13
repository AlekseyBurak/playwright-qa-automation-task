# QA Automation Playwright Task

TypeScript automation QA scaffold for UI, API, and E2E tests. Playwright is the
main test runner, Biome handles linting/format checks, and GitHub Actions runs
quality checks before browser tests.

## Stack

- TypeScript
- Playwright
- Biome
- GitHub Actions
- Dotenv-based local configuration

## Project Structure

```text
.
├── .github/workflows/ci.yml
├── src
│   ├── api
│   ├── config
│   ├── logger
│   └── pages
│       └── components
├── tests
│   ├── api
│   ├── e2e
│   └── ui
├── biome.json
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## Setup

Install dependencies:

```bash
npm install
```

Install Playwright browsers for local runs:

```bash
npx playwright install
```

Create local environment config:

```bash
cp .env.example .env
```

Real `.env` files are ignored by git.

## Commands

```bash
npm test
npm run test:ui
npm run test:api
npm run test:e2e
npm run test:headed
npm run report
npm run typecheck
npm run lint
npm run format
```

## Tested App Screens

- `/index.html` - login.
- `/register.html` - registration.
- `/dashboard.html` - todos and tags dashboard.
- `/profile.html` - profile: name, gender, avatar, analytics consent, password change.
- `/admin.html` - admin login and admin users panel.
- `/vacancy-application.html` - access key and admin credentials application.

## Test Organization

- `tests/ui` - browser-level UI tests.
- `tests/api` - API tests using Playwright request fixtures.
- `tests/e2e` - end-to-end user journey tests.

Current spec files are placeholders marked with `test.skip`. Replace them with
real test cases as coverage is added.

## Page Objects

Page objects live in `src/pages`:

- `LoginPage`
- `RegisterPage`
- `DashboardPage`
- `ProfilePage`
- `AdminPage`
- `VacancyApplicationPage`

Reusable components live in `src/pages/components`:

- `HeaderComponent`
- `TagsSidebarComponent`
- `DeleteTodoModalComponent`
- `AdminJsonModalComponent`

Locators avoid visible text and accessible names so tests are less sensitive to
localization. Prefer `data-ui`; otherwise use stable attributes such as `href`,
`type`, and `data-filter`.

Example:

```ts
import { DashboardPage, LoginPage } from '../../src';
```

## API Helpers

API clients live in `src/api`:

- `ApplicationsApiClient`
- `AuthApiClient`
- `AdminApiClient`
- `ProfileApiClient`
- `TodoApiClient`
- `UploadApiClient`

`BaseApiClient` automatically adds `X-Access-Key` when configured and provides
shared request helpers for `GET`, `POST`, `PATCH`, and `DELETE`.

## Configuration

Supported environment variables:

- `BASE_URL` - target app URL. Defaults to `http://localhost:3000`.
- `API_BASE_URL` - API URL when it differs from `BASE_URL`.
- `TEST_USER_EMAIL` - UI/E2E test user email.
- `TEST_USER_PASSWORD` - UI/E2E test user password.
- `API_TOKEN` - API token/access key fallback.
- `X_ACCESS_KEY` - access key sent as the `X-Access-Key` header. If omitted,
  `API_TOKEN` is used as fallback.
- `LOG_LEVEL` - `DEBUG`, `INFO`, `WARNING`, `ERROR`, or `CRITICAL`. Defaults to
  `CRITICAL`.

Use typed config from `src/config`:

```ts
import { env } from '../../src/config';
```

Ignored local files:

- `.env`
- `.env.*`
- `.auth/`
- `.playwright-mcp/`
- `playwright-report/`
- `test-results/`

## Logging

Logging is implemented in `src/logger` and has no external runtime dependency.

- Default level is `CRITICAL`.
- API helpers log request payloads/headers and response statuses at `DEBUG`.
- Page objects and components log high-level actions at `INFO`.
- Sensitive metadata keys such as passwords, tokens, authorization headers, and
  access keys are redacted.

Example:

```bash
LOG_LEVEL=DEBUG npm run test:api
```

## CI

GitHub Actions runs on pushes and pull requests to `main`.

The workflow has two jobs:

- `quality` runs on `ubuntu-latest`, installs dependencies, runs TypeScript
  checks, and runs Biome checks.
- `test` waits for `quality`, runs inside
  `mcr.microsoft.com/playwright:v1.60.0-noble`, installs dependencies, and runs
  Playwright tests.

The test job reads these GitHub Actions secrets:

- `BASE_URL`
- `API_BASE_URL`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `API_TOKEN`

Playwright reports and test results are uploaded as artifacts when the test job
fails.

## Publishing To GitHub

Before the first commit, confirm ignored files are not staged:

```bash
git status --short
```

Then initialize, commit, create an empty GitHub repo, add it as `origin`, and
push `main`. Do not commit `.env`.
