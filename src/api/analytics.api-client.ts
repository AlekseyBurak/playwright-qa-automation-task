import type { APIResponse } from '@playwright/test';
import { env } from '../config';
import { BaseApiClient } from './base.api-client';

export class AnalyticsApiClient extends BaseApiClient {
  async getEvents(): Promise<APIResponse> {
    const { username, password } = env.requireAnalyticsBasicAuth();

    return this.getEventsWithBasicAuth(username, password);
  }

  async getEventsWithBasicAuth(username: string, password: string): Promise<APIResponse> {
    return this.get('/api/analytics/events', {
      headers: {
        Authorization: this.basicAuth(username, password),
      },
    });
  }

  async getEventsWithoutBasicAuth(): Promise<APIResponse> {
    return this.get('/api/analytics/events');
  }

  private basicAuth(username: string, password: string): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
  }
}
