import { test } from './fixtures/api.fixtures';
import { userPayload } from './helpers/auth';
import { expectPayloadRejected } from './helpers/payload';

test.describe('Auth API payload validation', () => {
  const invalidLoginPayloads = [
    {
      payload: { email: 123, password: 'password' },
      title: 'POST /api/auth/login rejects numeric email',
    },
    {
      payload: { email: { value: 'user@example.com' }, password: 'password' },
      title: 'POST /api/auth/login rejects object email',
    },
    {
      payload: { email: 'user@example.com', password: 123 },
      title: 'POST /api/auth/login rejects numeric password',
    },
    {
      payload: { email: 'user@example.com', password: { value: 'password' } },
      title: 'POST /api/auth/login rejects object password',
    },
  ];

  for (const { payload, title } of invalidLoginPayloads) {
    test(title, async ({ apiRequest }) => {
      const response = await apiRequest.post('/api/auth/login', { data: payload });

      await expectPayloadRejected(response);
    });
  }

  const invalidRegisterPayloads = [
    {
      override: { name: { value: 'QA User' } },
      title: 'POST /api/auth/register rejects object name',
    },
    {
      override: { email: { value: 'qa-user@example.com' } },
      title: 'POST /api/auth/register rejects object email',
    },
    {
      override: { gender: { value: '0' } },
      title: 'POST /api/auth/register rejects object gender',
    },
    { override: { password: 123 }, title: 'POST /api/auth/register rejects numeric password' },
    {
      override: { internalAnalyticsConsent: 'true' },
      title: 'POST /api/auth/register rejects string analytics consent',
    },
  ];

  for (const { override, title } of invalidRegisterPayloads) {
    test(title, async ({ apiRequest }) => {
      const response = await apiRequest.post('/api/auth/register', {
        data: {
          ...userPayload(),
          ...override,
        },
      });

      await expectPayloadRejected(response);
    });
  }
});
