import { expect, test } from '@playwright/test';
import { AnalyticsApiClient } from '../../src';

test.describe('Analytics API', () => {
  test('events endpoint returns event array', async ({ request }) => {
    const analyticsApi = new AnalyticsApiClient(request);

    const response = await analyticsApi.getEvents();
    const events = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(events)).toBe(true);

    for (const event of events) {
      expect(event.type).toEqual(expect.any(String));
      expect(event.timestamp).toEqual(expect.any(String));

      if (event.status !== undefined) {
        expect(['success', 'failed']).toContain(event.status);
      }
    }
  });
});
