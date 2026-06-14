import { expect, test } from '@playwright/test';
import { AnalyticsApiClient } from '../../src';

test.describe('Analytics API @api @analytics', () => {
  test('GET /api/analytics/events returns analytics event records @positive @smoke @regression', async ({
    request,
  }) => {
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

  test('GET /api/analytics/events rejects missing Basic Auth @negative @regression', async ({
    request,
  }) => {
    const analyticsApi = new AnalyticsApiClient(request);

    const response = await analyticsApi.getEventsWithoutBasicAuth();

    expect(response.status()).toBe(401);
  });

  test('GET /api/analytics/events rejects invalid Basic Auth @negative @regression', async ({
    request,
  }) => {
    const analyticsApi = new AnalyticsApiClient(request);

    const response = await analyticsApi.getEventsWithBasicAuth('invalid-user', 'invalid-password');

    expect(response.status()).toBe(401);
  });
});
