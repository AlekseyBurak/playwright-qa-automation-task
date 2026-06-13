import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export class TodoApiClient extends BaseApiClient {
  async getTodos(token: string): Promise<APIResponse> {
    return this.get('/api/todos', {
      headers: this.authHeaders(token),
    });
  }
}
