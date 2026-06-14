# QA Automation Playwright Task

TypeScript automation framework for the recruitment test app. The repository
covers API, UI, and E2E layers with Playwright, uses Page Object Model for UI
coverage, Biome for quality checks, Winston for logging, Faker for generated test
data, and GitHub Actions for CI.

## Stack

- TypeScript
- Playwright
- Biome
- Faker
- Winston
- GitHub Actions
- Dotenv-based configuration

## Quick Start

```bash
npm install
npx playwright install
cp .env.example .env
```

Update `.env` with the target app credentials and access key, then run the checks
you need:

```bash
npm run typecheck
npm run lint
npm run test:api
npm run test:ui
npm run test:e2e
```

Real `.env` files are ignored by git.

## Commands

| Command | Purpose |
| --- | --- |
| `npm test` | Run the full Playwright suite with the default Chromium project. |
| `npm run test:all-browsers` | Run the full suite in Chromium, Firefox, and WebKit. |
| `npm run test:api` | Run API tests from `tests/api`. |
| `npm run test:ui` | Run browser UI tests from `tests/ui`. |
| `npm run test:ui:all-browsers` | Run UI tests in Chromium, Firefox, and WebKit. |
| `npm run test:e2e` | Run pure UI E2E journeys from `tests/e2e`. |
| `npm run test:smoke` | Run tests tagged as critical smoke coverage. |
| `npm run test:smoke:safe` | Run smoke tests excluding rate-sensitive and opt-in tests. |
| `npm run test:regression` | Run tests tagged for regular regression coverage. |
| `npm run test:regression:safe` | Run regression tests excluding rate-sensitive and opt-in tests. |
| `npm run test:positive` | Run tests tagged as positive scenarios. |
| `npm run test:negative` | Run tests tagged as negative scenarios. |
| `npm run test:validation` | Run payload and datatype validation tests. |
| `npm run test:headed` | Run Playwright in headed mode. |
| `npm run report` | Open the Playwright HTML report. |
| `npm run typecheck` | Run TypeScript checks without emitting files. |
| `npm run lint` | Run Biome lint and format checks. |
| `npm run format` | Format files with Biome. |

Default Playwright execution uses Chromium only. Set `RUN_ALL_BROWSERS=1` through
the provided scripts to include Firefox and WebKit.

## Configuration

Supported environment variables:

| Variable | Required for | Description |
| --- | --- | --- |
| `BASE_URL` | All tests | Tested app origin. API requests use the same origin. Defaults to `http://localhost:3000`. |
| `TEST_USER_EMAIL` | Admin UI/API/E2E | Admin account email issued for the task. |
| `TEST_USER_PASSWORD` | Admin UI/API/E2E | Password for `TEST_USER_EMAIL`. |
| `API_TOKEN` | API/UI access | Issued access key sent as the `X-Access-Key` header. |
| `ANALYTICS_BASIC_USER` | Analytics API tests | HTTP Basic Auth username for `GET /api/analytics/events`. |
| `ANALYTICS_BASIC_PASSWORD` | Analytics API tests | HTTP Basic Auth password for `GET /api/analytics/events`. |
| `RUN_APPLICATION_TESTS` | Opt-in API tests | Set to `1` to run application provisioning tests. |
| `RUN_ALL_BROWSERS` | Browser selection | Set to `1` to include Firefox and WebKit projects. |
| `LOG_LEVEL` | Logging | `DEBUG`, `INFO`, `WARNING`, `ERROR`, or `CRITICAL`. Defaults to `CRITICAL`. |

Typed config is exported from `src/config`:

```ts
import { env } from '../../src/config';
```

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

## Test Strategy

- `tests/api` covers API contracts with Playwright request fixtures and API
  clients from `src/api`.
- `tests/ui` covers browser-level behavior with page objects from `src/pages`.
- `tests/e2e` contains pure UI user journeys that avoid API setup and API
  response assertions.

Generated test data is centralized in `tests/api/helpers/test-data.ts`. Faker is
used for realistic names and unique values while keeping app-compatible email,
password, tag, and todo formats.

## Test Tags

Tests use Playwright title tags, so they can be selected with standard
`--grep`.

Tag groups:

- Layer: `@api`, `@ui`, `@e2e`.
- Feature: `@auth`, `@admin`, `@profile`, `@todos`, `@tags`, `@analytics`,
  `@applications`, `@navigation`, `@registration`, `@vacancy`.
- Scenario: `@positive`, `@negative`.
- Execution: `@smoke`, `@regression`, `@validation`, `@rate-sensitive`,
  `@opt-in`.

Every new test should include a layer tag, a feature tag, and one scenario tag.
Use `@smoke` only for critical happy-path coverage. Use `@rate-sensitive` for
tests that consume strict auth or application provisioning limits. Use `@opt-in`
for tests that require an explicit environment flag.

Regular tagged scripts run all matching tests. Use the `*:safe` scripts for
local checks that should avoid strict auth/application rate-limit flows. Tags do
not override explicit runtime guards, so provisioning tests still require
`RUN_APPLICATION_TESTS=1`.

Examples:

```bash
npm run test:smoke
npm run test:smoke:safe
npm run test:regression:safe
npm run test:negative
npm run test:validation
npx playwright test --grep "@api.*@auth"
```

## Tested App Screens

- `/index.html` - login.
- `/register.html` - registration.
- `/dashboard.html` - todos and tags dashboard.
- `/profile.html` - profile: name, gender, avatar, analytics consent, password change.
- `/admin.html` - admin login and admin users panel.
- `/vacancy-application.html` - access key and admin credentials application.

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

Example:

```ts
import { DashboardPage, LoginPage } from '../../src';
```

## API Helpers

API clients live in `src/api`:

- `ApplicationsApiClient`
- `AuthApiClient`
- `AdminApiClient`
- `AnalyticsApiClient`
- `ProfileApiClient`
- `TagsApiClient`
- `TodoApiClient`
- `UploadApiClient`

`BaseApiClient` automatically adds `X-Access-Key` when configured and provides
shared helpers for `GET`, `POST`, `PUT`, `PATCH`, and `DELETE`.

Application provisioning tests call `POST /api/applications`, create real admin
credentials, and are opt-in:

```bash
RUN_APPLICATION_TESTS=1 npm run test:api -- tests/api/application-provisioning.api.spec.ts
```

## Known Constraints

- The tested environment has strict rate limits. If the server returns `429`, the
  test fails; throttling is treated as a real environment failure.
- API fixtures reuse a shared regular user and admin token where possible to
  reduce auth traffic.
- Application provisioning is disabled by default because it creates real admin
  credentials and has a low hourly limit.

## Logging

Logging is implemented in `src/logger` with Winston.

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

- `quality` runs on `ubuntu-latest`, installs dependencies, runs TypeScript
  checks, and runs Biome checks.
- `test` waits for `quality`, runs inside
  `mcr.microsoft.com/playwright:v1.60.0-noble`, installs dependencies, and runs
  Playwright tests.

The test job reads these GitHub Actions secrets:

- `BASE_URL`
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`
- `API_TOKEN`
- `ANALYTICS_BASIC_USER`
- `ANALYTICS_BASIC_PASSWORD`

Playwright reports and test results are uploaded as artifacts when the test job
fails.
