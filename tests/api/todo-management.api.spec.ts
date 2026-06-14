import { TodoApiClient } from '../../src';
import { expect, test } from './fixtures/api.fixtures';
import { entityId, testData } from './helpers/test-data';

const unknownId = '000000000000000000000000';

type TodoResponse = {
  todo: {
    completed: boolean;
    title: string;
  };
};

function todoItems(body: unknown): unknown[] {
  if (Array.isArray(body)) {
    return body;
  }

  const value = body as { items?: unknown[]; todos?: unknown[] };

  return value.todos ?? value.items ?? [];
}

test.describe('Todos API @api @todos', () => {
  test('POST /api/todos creates todo and DELETE /api/todos/{id} removes it @positive @smoke @regression', async ({
    request,
    sharedUser,
  }) => {
    const todoApi = new TodoApiClient(request);
    const title = testData.todoTitle();

    const createResponse = await todoApi.createTodo(sharedUser.token, { title });
    const createdTodo = await createResponse.json();
    const todoId = entityId(createdTodo);

    expect(createResponse.status()).toBe(201);

    const listResponse = await todoApi.getTodos(sharedUser.token, { search: title });
    const listBody = await listResponse.json();

    expect(listResponse.status()).toBe(200);
    expect(todoItems(listBody).length).toBeGreaterThan(0);

    const nextTitle = testData.todoTitle();
    const updateResponse = await todoApi.updateTodo(sharedUser.token, todoId, {
      completed: true,
      title: nextTitle,
    });
    const updatedTodo = await updateResponse.json();

    expect(updateResponse.status()).toBe(200);
    expect((updatedTodo as TodoResponse).todo.title).toBe(nextTitle);
    expect((updatedTodo as TodoResponse).todo.completed).toBe(true);

    const deleteResponse = await todoApi.deleteTodo(sharedUser.token, todoId);

    expect(deleteResponse.ok()).toBe(true);
  });

  test('POST /api/todos rejects empty title @negative @regression', async ({
    request,
    sharedUser,
  }) => {
    const todoApi = new TodoApiClient(request);

    const response = await todoApi.createTodo(sharedUser.token, { title: '' });

    expect(response.ok()).toBe(false);
  });

  test('PATCH /api/todos/{id} rejects unknown id @negative @regression', async ({
    request,
    sharedUser,
  }) => {
    const todoApi = new TodoApiClient(request);

    const response = await todoApi.updateTodo(sharedUser.token, unknownId, {
      title: testData.todoTitle(),
    });

    expect(response.ok()).toBe(false);
  });

  test('DELETE /api/todos/{id} rejects unknown id @negative @regression', async ({
    request,
    sharedUser,
  }) => {
    const todoApi = new TodoApiClient(request);

    const response = await todoApi.deleteTodo(sharedUser.token, unknownId);

    expect(response.ok()).toBe(false);
  });

  test('GET /api/todos rejects missing bearer token @negative @regression', async ({ request }) => {
    const todoApi = new TodoApiClient(request);

    const response = await todoApi.getTodos('');

    expect(response.status()).toBe(401);
  });
});
