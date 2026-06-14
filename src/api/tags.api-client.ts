import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export type TagListParams = {
  search?: string;
};

export type CreateTagPayload = {
  color: string;
  name: string;
};

export class TagsApiClient extends BaseApiClient {
  async getPalette(token: string): Promise<APIResponse> {
    return this.get('/api/tags/palette', {
      headers: this.authHeaders(token),
    });
  }

  async getTags(token: string, params: TagListParams = {}): Promise<APIResponse> {
    return this.get('/api/tags', {
      headers: this.authHeaders(token),
      params,
    });
  }

  async createTag(token: string, payload: CreateTagPayload): Promise<APIResponse> {
    return this.post('/api/tags', payload, {
      headers: this.authHeaders(token),
    });
  }

  async ensureTag(token: string, name: string): Promise<APIResponse> {
    return this.post(
      '/api/tags/ensure',
      { name },
      {
        headers: this.authHeaders(token),
      },
    );
  }

  async deleteTag(token: string, tagId: string): Promise<APIResponse> {
    return this.delete(`/api/tags/${tagId}`, {
      headers: this.authHeaders(token),
    });
  }
}
