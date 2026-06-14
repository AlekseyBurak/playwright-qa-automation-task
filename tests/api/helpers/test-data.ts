import { faker } from '@faker-js/faker';

const suffix = (): string =>
  `${Date.now()}-${faker.string.alphanumeric({ casing: 'lower', length: 8 })}`;

export const testData = {
  applicationFullName: (): string => faker.person.fullName(),
  email: (): string => `qa-${suffix()}@vacancy.local`,
  name: (): string => faker.person.fullName(),
  password: (): string => `Qa_${suffix()}_A1!`,
  tagName: (): string => `qa-${faker.word.noun()}-${suffix()}`,
  todoTitle: (): string => `QA todo ${suffix()}`,
};

export function entityId(body: unknown): string {
  const value = body as {
    _id?: string;
    id?: string;
    tag?: { _id?: string; id?: string };
    todo?: { _id?: string; id?: string };
  };
  const id =
    value._id ?? value.id ?? value.todo?._id ?? value.todo?.id ?? value.tag?._id ?? value.tag?.id;

  if (!id) {
    throw new Error(`Response does not contain entity id: ${JSON.stringify(body)}`);
  }

  return id;
}
