import { expect, test } from '@playwright/test';
import { ApplicationsApiClient } from '../../src';
import { expectPayloadRejected } from './helpers/payload';
import { testData } from './helpers/test-data';

test.describe('Applications API', () => {
  test.skip(
    process.env.RUN_APPLICATION_TESTS !== '1',
    'Application provisioning is opt-in because it creates real admin credentials.',
  );

  test('POST /api/applications creates application credentials', async ({ request }) => {
    const applicationsApi = new ApplicationsApiClient(request);

    const response = await applicationsApi.createApplication(testData.applicationFullName());
    const body = await response.json();

    expect(response.status()).toBe(201);
    expect(body.accessKey).toEqual(expect.any(String));
    expect(body.adminEmail).toEqual(expect.any(String));
    expect(body.adminPassword).toEqual(expect.any(String));
  });

  test('POST /api/applications rejects missing fullName', async ({ request }) => {
    const applicationsApi = new ApplicationsApiClient(request);

    const response = await applicationsApi.createApplication('');

    expect(response.ok()).toBe(false);
  });

  test('POST /api/applications rejects numeric fullName', async ({ request }) => {
    const response = await request.post('/api/applications', {
      data: { fullName: 123 },
    });

    await expectPayloadRejected(response);
  });
});
