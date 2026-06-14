import { TagsApiClient } from '../../src';
import { expect, test } from './fixtures/api.fixtures';
import { entityId, testData } from './helpers/test-data';

const fallbackColor = '#64748B';
const unknownId = '000000000000000000000000';

function firstPaletteColor(body: unknown): string {
  const colors = Array.isArray(body)
    ? body
    : ((body as { colors?: unknown[]; palette?: unknown[] }).colors ??
      (body as { colors?: unknown[]; palette?: unknown[] }).palette ??
      []);
  const first = colors[0];

  if (typeof first === 'string') {
    return first;
  }

  if (first && typeof first === 'object' && 'color' in first) {
    return String((first as { color: unknown }).color);
  }

  return fallbackColor;
}

function tagItems(body: unknown): unknown[] {
  if (Array.isArray(body)) {
    return body;
  }

  const value = body as { items?: unknown[]; tags?: unknown[] };

  return value.tags ?? value.items ?? [];
}

test.describe('Tags API', () => {
  test('POST /api/tags creates tag and DELETE /api/tags/{id} removes it', async ({
    request,
    sharedUser,
  }) => {
    const tagsApi = new TagsApiClient(request);

    const paletteResponse = await tagsApi.getPalette(sharedUser.token);
    const paletteBody = await paletteResponse.json();
    const color = firstPaletteColor(paletteBody);

    expect(paletteResponse.status()).toBe(200);

    const tagName = testData.tagName();
    const createResponse = await tagsApi.createTag(sharedUser.token, { color, name: tagName });
    const createdTag = await createResponse.json();
    const createdTagId = entityId(createdTag);

    expect(createResponse.ok()).toBe(true);

    const listResponse = await tagsApi.getTags(sharedUser.token, { search: tagName });
    const listBody = await listResponse.json();

    expect(listResponse.status()).toBe(200);
    expect(tagItems(listBody).length).toBeGreaterThan(0);

    const ensuredName = testData.tagName();
    const ensureResponse = await tagsApi.ensureTag(sharedUser.token, ensuredName);
    const ensuredTag = await ensureResponse.json();
    const ensuredTagId = entityId(ensuredTag);

    expect(ensureResponse.ok()).toBe(true);

    const deleteCreatedResponse = await tagsApi.deleteTag(sharedUser.token, createdTagId);
    const deleteEnsuredResponse = await tagsApi.deleteTag(sharedUser.token, ensuredTagId);

    expect(deleteCreatedResponse.ok()).toBe(true);
    expect(deleteEnsuredResponse.ok()).toBe(true);
  });

  test('POST /api/tags rejects empty name', async ({ request, sharedUser }) => {
    const tagsApi = new TagsApiClient(request);

    const response = await tagsApi.createTag(sharedUser.token, { color: fallbackColor, name: '' });

    expect(response.ok()).toBe(false);
  });

  test('DELETE /api/tags/{id} rejects unknown id', async ({ request, sharedUser }) => {
    const tagsApi = new TagsApiClient(request);

    const response = await tagsApi.deleteTag(sharedUser.token, unknownId);

    expect(response.ok()).toBe(false);
  });

  test('GET /api/tags rejects missing bearer token', async ({ request }) => {
    const tagsApi = new TagsApiClient(request);

    const response = await tagsApi.getTags('');

    expect(response.status()).toBe(401);
  });
});
