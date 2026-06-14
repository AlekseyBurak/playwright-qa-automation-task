import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './base.api-client';

export type TodoListParams = {
  filter?: 'all' | 'active' | 'completed';
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
  tagIds?: string;
};

export type CreateTodoPayload = {
  tagIds?: string[];
  title: string;
};

export type UpdateTodoPayload = {
  completed?: boolean;
  tagIds?: string[];
  title?: string;
};

export class TodoApiClient extends BaseApiClient {
  async getTodos(token: string, params: TodoListParams = {}): Promise<APIResponse> {
    return this.get('/api/todos', {
      headers: this.authHeaders(token),
      params,
    });
  }

  async createTodo(token: string, payload: CreateTodoPayload): Promise<APIResponse> {
    return this.post('/api/todos', payload, {
      headers: this.authHeaders(token),
    });
  }

  async updateTodo(
    token: string,
    todoId: string,
    payload: UpdateTodoPayload,
  ): Promise<APIResponse> {
    return this.patch(`/api/todos/${todoId}`, payload, {
      headers: this.authHeaders(token),
    });
  }

  async deleteTodo(token: string, todoId: string): Promise<APIResponse> {
    return this.delete(`/api/todos/${todoId}`, {
      headers: this.authHeaders(token),
    });
  }
}
