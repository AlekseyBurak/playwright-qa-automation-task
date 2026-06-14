import type { APIResponse } from '@playwright/test';
import { expect } from '@playwright/test';

export async function expectPayloadRejected(response: APIResponse): Promise<void> {
  expect(response.status()).not.toBe(429);
  expect(response.ok()).toBe(false);
}

export function authHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
  };
}
