import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export class ApplicationsApiClient extends BaseApiClient {
  async createApplication(fullName: string): Promise<APIResponse> {
    return this.post('/api/applications', { fullName });
  }
}
