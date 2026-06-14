import { AdminApiClient } from '../../src';
import { expect, test } from './fixtures/api.fixtures';

test.describe('Admin API @api @admin', () => {
  test('GET /api/admin/overview returns users with pagination metadata @positive @smoke @regression', async ({
    adminApi,
    adminToken,
  }) => {
    const overviewResponse = await adminApi.getOverview(adminToken);
    const overviewBody = await overviewResponse.json();

    expect(overviewResponse.status()).toBe(200);
    expect(overviewBody.applicationId).toEqual(expect.any(String));
    expect(Array.isArray(overviewBody.users)).toBe(true);
    expect(overviewBody.pagination).toEqual(
      expect.objectContaining({
        page: expect.any(Number),
        limit: expect.any(Number),
        total: expect.any(Number),
        totalPages: expect.any(Number),
      }),
    );
  });

  test('GET /api/admin/overview filters users by search query @positive @regression', async ({
    adminApi,
    adminToken,
  }) => {
    const overviewResponse = await adminApi.getOverview(adminToken, {
      limit: 10,
      search: 'admin',
    });
    const overviewBody = await overviewResponse.json();

    expect(overviewResponse.status()).toBe(200);
    expect(Array.isArray(overviewBody.users)).toBe(true);
  });

  test('GET /api/admin/overview rejects invalid bearer token @negative @regression', async ({
    request,
  }) => {
    const adminApi = new AdminApiClient(request);

    const response = await adminApi.getOverview('invalid-token');

    expect(response.status()).toBe(401);
  });
});
