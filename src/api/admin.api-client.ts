import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export type AdminOverviewParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export class AdminApiClient extends BaseApiClient {
  async getOverview(token: string, params: AdminOverviewParams = {}): Promise<APIResponse> {
    return this.get('/api/admin/overview', {
      headers: this.authHeaders(token),
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 5,
        search: params.search,
      },
    });
  }
}
