import { expect, test } from '@playwright/test';
import { AuthApiClient } from '../../src';
import { env } from '../../src/config';

test.describe('Auth API', () => {
  test('admin login returns token', async ({ request }) => {
    const { email, password } = env.requireTestUser();
    const authApi = new AuthApiClient(request);

    const response = await authApi.login(email, password);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.token).toEqual(expect.any(String));
  });

  test('invalid login does not return token', async ({ request }) => {
    const authApi = new AuthApiClient(request);

    const response = await authApi.login('invalid-user@example.com', 'invalid-password');
    const body = await response.json();

    expect(response.ok()).toBe(false);
    expect(body.token).toBeUndefined();
  });
});
