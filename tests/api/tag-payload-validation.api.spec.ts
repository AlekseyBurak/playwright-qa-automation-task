import { test } from './fixtures/api.fixtures';
import { authHeaders, expectPayloadRejected } from './helpers/payload';

const fallbackColor = '#64748B';

test.describe('Tags API payload validation @api @tags', () => {
  const invalidCreatePayloads = [
    {
      payload: { color: fallbackColor, name: 123 },
      title: 'POST /api/tags rejects numeric name @negative @validation @regression',
    },
    {
      payload: { color: 123, name: 'invalid-color-type' },
      title: 'POST /api/tags rejects numeric color @negative @validation @regression',
    },
  ];

  for (const { payload, title } of invalidCreatePayloads) {
    test(title, async ({ apiRequest, sharedUser }) => {
      const response = await apiRequest.post('/api/tags', {
        data: payload,
        headers: authHeaders(sharedUser.token),
      });

      await expectPayloadRejected(response);
    });
  }

  test('POST /api/tags/ensure rejects numeric name @negative @validation @regression', async ({
    apiRequest,
    sharedUser,
  }) => {
    const response = await apiRequest.post('/api/tags/ensure', {
      data: { name: 123 },
      headers: authHeaders(sharedUser.token),
    });

    await expectPayloadRejected(response);
  });
});
