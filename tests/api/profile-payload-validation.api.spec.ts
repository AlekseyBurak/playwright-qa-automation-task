import { test } from './fixtures/api.fixtures';
import { authHeaders, expectPayloadRejected } from './helpers/payload';

test.describe('Profile API payload validation', () => {
  const invalidProfilePayloads = [
    { payload: { name: 123 }, title: 'PATCH /api/profile rejects numeric name' },
    { payload: { gender: 1 }, title: 'PATCH /api/profile rejects numeric gender' },
    {
      payload: { internalAnalyticsConsent: 'false' },
      title: 'PATCH /api/profile rejects string analytics consent',
    },
  ];

  for (const { payload, title } of invalidProfilePayloads) {
    test(title, async ({ apiRequest, sharedUser }) => {
      const response = await apiRequest.patch('/api/profile', {
        data: payload,
        headers: authHeaders(sharedUser.token),
      });

      await expectPayloadRejected(response);
    });
  }

  const invalidPasswordPayloads = [
    {
      payload: { confirmPassword: 'Password_123', newPassword: 123 },
      title: 'POST /api/profile/password rejects numeric newPassword',
    },
    {
      payload: { confirmPassword: 123, newPassword: 'Password_123' },
      title: 'POST /api/profile/password rejects numeric confirmPassword',
    },
  ];

  for (const { payload, title } of invalidPasswordPayloads) {
    test(title, async ({ apiRequest, sharedUser }) => {
      const response = await apiRequest.post('/api/profile/password', {
        data: payload,
        headers: authHeaders(sharedUser.token),
      });

      await expectPayloadRejected(response);
    });
  }
});
