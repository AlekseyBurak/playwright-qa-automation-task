import type { APIResponse } from '@playwright/test';
import { env } from '../config';
import { BaseApiClient } from './base.api-client';

export class AnalyticsApiClient extends BaseApiClient {
  async getEvents(): Promise<APIResponse> {
    const { username, password } = env.requireAnalyticsBasicAuth();
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');

    return this.get('/api/analytics/events', {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });
  }
}
