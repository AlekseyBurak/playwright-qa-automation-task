import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { AuthApiClient, type RegisterUserPayload } from '../../../src';
import { env } from '../../../src/config';
import { testData } from './test-data';

export type RegisteredUser = RegisterUserPayload & {
  token: string;
};

let cachedAdminToken: string | undefined;

export function userPayload(overrides: Partial<RegisterUserPayload> = {}): RegisterUserPayload {
  return {
    email: testData.email(),
    gender: '0',
    internalAnalyticsConsent: true,
    name: testData.name(),
    password: testData.password(),
    ...overrides,
  };
}

export async function registerUser(
  request: APIRequestContext,
  overrides: Partial<RegisterUserPayload> = {},
): Promise<RegisteredUser> {
  const authApi = new AuthApiClient(request);
  const user = userPayload(overrides);

  const registerResponse = await authApi.register(user);
  expect(registerResponse.ok()).toBe(true);

  const loginResponse = await authApi.login(user.email, user.password);
  const loginBody = await loginResponse.json();

  expect(loginResponse.status()).toBe(200);
  expect(loginBody.token).toEqual(expect.any(String));

  return {
    ...user,
    token: loginBody.token,
  };
}

export async function adminToken(request: APIRequestContext): Promise<string> {
  if (cachedAdminToken) {
    return cachedAdminToken;
  }

  const authApi = new AuthApiClient(request);
  const { email, password } = env.requireTestUser();

  const response = await authApi.login(email, password);
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.token).toEqual(expect.any(String));

  cachedAdminToken = body.token as string;

  return cachedAdminToken;
}
