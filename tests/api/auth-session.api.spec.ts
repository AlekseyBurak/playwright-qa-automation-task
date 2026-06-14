import { AuthApiClient, ProfileApiClient } from '../../src';
import { expect, test } from './fixtures/api.fixtures';
import { registerUser, userPayload } from './helpers/auth';

test.describe('Auth API @api @auth', () => {
  test('POST /api/auth/logout ends an authenticated user session @positive @regression @rate-sensitive', async ({
    request,
  }) => {
    const user = await registerUser(request);
    const authApi = new AuthApiClient(request);

    const logoutResponse = await authApi.logout(user.token);

    expect(logoutResponse.ok()).toBe(true);
  });

  test('POST /api/auth/login returns admin bearer token @positive @smoke @regression @rate-sensitive', async ({
    adminToken,
  }) => {
    expect(adminToken).toEqual(expect.any(String));
  });

  test('POST /api/auth/login rejects invalid credentials @negative @regression @rate-sensitive', async ({
    request,
  }) => {
    const authApi = new AuthApiClient(request);

    const response = await authApi.login('invalid-user@example.com', 'invalid-password');
    const body = await response.json();

    expect(response.ok()).toBe(false);
    expect(body.token).toBeUndefined();
  });

  test('POST /api/auth/register rejects duplicate email @negative @regression @rate-sensitive', async ({
    request,
  }) => {
    const authApi = new AuthApiClient(request);
    const payload = userPayload();

    const firstResponse = await authApi.register(payload);
    const duplicateResponse = await authApi.register(payload);

    expect(firstResponse.ok()).toBe(true);
    expect(duplicateResponse.ok()).toBe(false);
  });

  test('GET /api/profile rejects missing X-Access-Key header @negative @regression', async ({
    request,
    adminToken,
  }) => {
    const profileApi = new ProfileApiClient(request);

    const response = await profileApi.getProfileWithoutAccessKey(adminToken);

    expect(response.status()).toBe(401);
  });
});
