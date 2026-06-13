import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export class UploadApiClient extends BaseApiClient {
  async uploadPhoto(formData: FormData): Promise<APIResponse> {
    return this.post('/api/upload/photo', formData);
  }
}
