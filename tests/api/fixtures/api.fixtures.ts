import {
  type APIRequestContext,
  test as base,
  expect,
  request as playwrightRequest,
} from '@playwright/test';
import { AdminApiClient } from '../../../src';
import { env } from '../../../src/config';
import { adminToken as createAdminToken, type RegisteredUser, registerUser } from '../helpers/auth';

type ApiWorkerFixtures = {
  adminApi: AdminApiClient;
  adminToken: string;
  apiRequest: APIRequestContext;
  sharedUser: RegisteredUser;
};

// biome-ignore lint/complexity/noBannedTypes: Playwright uses {} for "no test fixtures".
export const test = base.extend<{}, ApiWorkerFixtures>({
  apiRequest: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright fixtures require object destructuring.
    async ({}, use) => {
      const context = await playwrightRequest.newContext({
        baseURL: env.baseUrl,
        extraHTTPHeaders: env.xAccessKey ? { 'X-Access-Key': env.xAccessKey } : {},
      });

      await use(context);
      await context.dispose();
    },
    { scope: 'worker' },
  ],
  adminToken: [
    async ({ apiRequest }, use) => {
      await use(await createAdminToken(apiRequest));
    },
    { scope: 'worker' },
  ],
  adminApi: [
    async ({ apiRequest }, use) => {
      await use(new AdminApiClient(apiRequest));
    },
    { scope: 'worker' },
  ],
  sharedUser: [
    async ({ apiRequest }, use) => {
      await use(await registerUser(apiRequest));
    },
    { scope: 'worker' },
  ],
});

export { expect };
