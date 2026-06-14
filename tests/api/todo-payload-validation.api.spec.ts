import { test } from './fixtures/api.fixtures';
import { authHeaders, expectPayloadRejected } from './helpers/payload';
import { entityId, testData } from './helpers/test-data';

test.describe('Todos API payload validation @api @todos', () => {
  const invalidCreatePayloads = [
    { payload: { title: 123 }, title: 'POST /api/todos rejects numeric title' },
    {
      payload: { tagIds: 'not-array', title: testData.todoTitle() },
      title: 'POST /api/todos rejects string tagIds @negative @validation @regression',
    },
  ];

  for (const { payload, title } of invalidCreatePayloads) {
    test(title, async ({ apiRequest, sharedUser }) => {
      const response = await apiRequest.post('/api/todos', {
        data: payload,
        headers: authHeaders(sharedUser.token),
      });

      await expectPayloadRejected(response);
    });
  }

  const invalidUpdatePayloads = [
    { payload: { title: 123 }, title: 'PATCH /api/todos/{id} rejects numeric title' },
    {
      payload: { completed: 'true' },
      title: 'PATCH /api/todos/{id} rejects string completed @negative @validation @regression',
    },
    {
      payload: { tagIds: 'not-array' },
      title: 'PATCH /api/todos/{id} rejects string tagIds @negative @validation @regression',
    },
  ];

  for (const { payload, title } of invalidUpdatePayloads) {
    test(title, async ({ apiRequest, sharedUser }) => {
      const createResponse = await apiRequest.post('/api/todos', {
        data: { title: testData.todoTitle() },
        headers: authHeaders(sharedUser.token),
      });
      const todoId = entityId(await createResponse.json());

      const response = await apiRequest.patch(`/api/todos/${todoId}`, {
        data: payload,
        headers: authHeaders(sharedUser.token),
      });

      await expectPayloadRejected(response);
    });
  }
});
