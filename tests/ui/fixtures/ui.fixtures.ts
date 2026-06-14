import {
  type APIRequestContext,
  test as base,
  expect,
  request as playwrightRequest,
} from '@playwright/test';
import { env } from '../../../src/config';
import {
  adminToken as createAdminToken,
  type RegisteredUser,
  registerUser,
} from '../../api/helpers/auth';

type UiWorkerFixtures = {
  apiRequest: APIRequestContext;
  adminCredentials: {
    email: string;
    password: string;
  };
  adminToken: string;
  sharedUser: RegisteredUser;
};

// biome-ignore lint/complexity/noBannedTypes: Playwright uses {} for "no test fixtures".
export const test = base.extend<{}, UiWorkerFixtures>({
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
  adminCredentials: [
    // biome-ignore lint/correctness/noEmptyPattern: Playwright fixtures require object destructuring.
    async ({}, use) => {
      await use(env.requireTestUser());
    },
    { scope: 'worker' },
  ],
  sharedUser: [
    async ({ apiRequest }, use) => {
      await use(await registerUser(apiRequest));
    },
    { scope: 'worker' },
  ],
  adminToken: [
    async ({ apiRequest }, use) => {
      await use(await createAdminToken(apiRequest));
    },
    { scope: 'worker' },
  ],
});

export { expect };
