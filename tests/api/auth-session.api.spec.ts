import { AuthApiClient, ProfileApiClient } from '../../src';
import { expect, test } from './fixtures/api.fixtures';
import { registerUser, userPayload } from './helpers/auth';

test.describe('Auth API', () => {
  test('POST /api/auth/logout ends an authenticated user session', async ({ request }) => {
    const user = await registerUser(request);
    const authApi = new AuthApiClient(request);

    const logoutResponse = await authApi.logout(user.token);

    expect(logoutResponse.ok()).toBe(true);
  });

  test('POST /api/auth/login returns admin bearer token', async ({ adminToken }) => {
    expect(adminToken).toEqual(expect.any(String));
  });

  test('POST /api/auth/login rejects invalid credentials', async ({ request }) => {
    const authApi = new AuthApiClient(request);

    const response = await authApi.login('invalid-user@example.com', 'invalid-password');
    const body = await response.json();

    expect(response.ok()).toBe(false);
    expect(body.token).toBeUndefined();
  });

  test('POST /api/auth/register rejects duplicate email', async ({ request }) => {
    const authApi = new AuthApiClient(request);
    const payload = userPayload();

    const firstResponse = await authApi.register(payload);
    const duplicateResponse = await authApi.register(payload);

    expect(firstResponse.ok()).toBe(true);
    expect(duplicateResponse.ok()).toBe(false);
  });

  test('GET /api/profile rejects missing X-Access-Key header', async ({ request, adminToken }) => {
    const profileApi = new ProfileApiClient(request);

    const response = await profileApi.getProfileWithoutAccessKey(adminToken);

    expect(response.status()).toBe(401);
  });
});
