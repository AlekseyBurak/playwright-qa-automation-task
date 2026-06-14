import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export type UpdateProfilePayload = {
  name?: string;
  gender?: '0' | '1';
  photo?: string | null;
  internalAnalyticsConsent?: boolean;
};

export class ProfileApiClient extends BaseApiClient {
  async getProfile(token: string): Promise<APIResponse> {
    return this.get('/api/profile', {
      headers: this.authHeaders(token),
    });
  }

  async getProfileWithoutAccessKey(token: string): Promise<APIResponse> {
    return this.get('/api/profile', {
      headers: this.authHeaders(token),
      useAccessKey: false,
    });
  }

  async updateProfile(token: string, payload: UpdateProfilePayload): Promise<APIResponse> {
    return this.patch('/api/profile', payload, {
      headers: this.authHeaders(token),
    });
  }

  async changePassword(
    token: string,
    newPassword: string,
    confirmPassword = newPassword,
  ): Promise<APIResponse> {
    return this.post(
      '/api/profile/password',
      { newPassword, confirmPassword },
      { headers: this.authHeaders(token) },
    );
  }
}
