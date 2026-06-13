import { expect, test } from '@playwright/test';
import { AdminApiClient, AuthApiClient } from '../../src';
import { env } from '../../src/config';

test.describe('Admin API', () => {
  test('overview returns users and pagination', async ({ request }) => {
    const { email, password } = env.requireTestUser();
    const authApi = new AuthApiClient(request);
    const adminApi = new AdminApiClient(request);

    const loginResponse = await authApi.login(email, password);
    const loginBody = await loginResponse.json();

    expect(loginResponse.status()).toBe(200);
    expect(loginBody.token).toEqual(expect.any(String));

    const overviewResponse = await adminApi.getOverview(loginBody.token);
    const overviewBody = await overviewResponse.json();

    expect(overviewResponse.status()).toBe(200);
    expect(overviewBody.applicationId).toEqual(expect.any(String));
    expect(Array.isArray(overviewBody.users)).toBe(true);
    expect(overviewBody.pagination).toEqual(
      expect.objectContaining({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }),
    );
  });
});
