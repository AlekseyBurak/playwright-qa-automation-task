import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export type RegisterUserPayload = {
  name: string;
  email: string;
  gender: '0' | '1';
  password: string;
  photo?: string;
  internalAnalyticsConsent: boolean;
};

export class AuthApiClient extends BaseApiClient {
  async login(email: string, password: string): Promise<APIResponse> {
    return this.post('/api/auth/login', { email, password });
  }

  async register(payload: RegisterUserPayload): Promise<APIResponse> {
    return this.post('/api/auth/register', payload);
  }
}
