import type { APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../config';
import { createLogger } from '../logger';

type RequestOptions = {
  data?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
};

export abstract class BaseApiClient {
  private readonly log = createLogger(this.constructor.name);
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected async get(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const url = this.withParams(path, options.params);
    const headers = this.headers(options.headers);
    this.logRequest('GET', url, { headers, params: options.params });
    const response = await this.request.get(url, {
      headers,
    });
    this.logResponse('GET', url, response);

    return response;
  }

  protected async post(
    path: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<APIResponse> {
    const headers = this.headers(options.headers);
    this.logRequest('POST', path, { data, headers });
    const response = await this.request.post(path, {
      data,
      headers,
    });
    this.logResponse('POST', path, response);

    return response;
  }

  protected async patch(
    path: string,
    data?: unknown,
    options: RequestOptions = {},
  ): Promise<APIResponse> {
    const headers = this.headers(options.headers);
    this.logRequest('PATCH', path, { data, headers });
    const response = await this.request.patch(path, {
      data,
      headers,
    });
    this.logResponse('PATCH', path, response);

    return response;
  }

  protected async delete(path: string, options: RequestOptions = {}): Promise<APIResponse> {
    const url = this.withParams(path, options.params);
    const headers = this.headers(options.headers);
    this.logRequest('DELETE', url, { headers, params: options.params });
    const response = await this.request.delete(url, {
      headers,
    });
    this.logResponse('DELETE', url, response);

    return response;
  }

  protected authHeaders(token?: string): Record<string, string> {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private headers(headers: Record<string, string> = {}): Record<string, string> {
    return {
      ...(env.xAccessKey ? { 'X-Access-Key': env.xAccessKey } : {}),
      ...headers,
    };
  }

  private logRequest(method: string, path: string, metadata: unknown): void {
    this.log.debug('API request', { method, path, ...this.asObject(metadata) });
  }

  private logResponse(method: string, path: string, response: APIResponse): void {
    this.log.debug('API response', { method, path, status: response.status() });
  }

  private asObject(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  }

  private withParams(path: string, params: RequestOptions['params']): string {
    if (!params) {
      return path;
    }

    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }

    const query = searchParams.toString();

    return query ? `${path}?${query}` : path;
  }
}
