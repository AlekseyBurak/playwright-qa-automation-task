import { ProfileApiClient } from '../../src';
import { expect, test } from './fixtures/api.fixtures';
import { testData } from './helpers/test-data';

type ProfileResponse = {
  user: {
    email: string;
    gender: string;
    internalAnalyticsConsent: boolean;
    name: string;
  };
};

test.describe('Profile API @api @profile', () => {
  test('PATCH /api/profile updates name, gender and analytics consent @positive @smoke @regression', async ({
    request,
    sharedUser,
  }) => {
    const profileApi = new ProfileApiClient(request);

    const getResponse = await profileApi.getProfile(sharedUser.token);
    const profile = await getResponse.json();

    expect(getResponse.status()).toBe(200);
    expect((profile as ProfileResponse).user.email).toBe(sharedUser.email);

    const nextName = testData.name();
    const updateResponse = await profileApi.updateProfile(sharedUser.token, {
      gender: '1',
      internalAnalyticsConsent: false,
      name: nextName,
    });
    const updatedProfile = await updateResponse.json();

    expect(updateResponse.status()).toBe(200);
    expect((updatedProfile as ProfileResponse).user.name).toBe(nextName);
    expect((updatedProfile as ProfileResponse).user.gender).toBe('1');
    expect((updatedProfile as ProfileResponse).user.internalAnalyticsConsent).toBe(false);
  });

  test('GET /api/profile rejects missing bearer token @negative @regression', async ({
    request,
  }) => {
    const profileApi = new ProfileApiClient(request);

    const response = await profileApi.getProfile('');

    expect(response.status()).toBe(401);
  });

  test('POST /api/profile/password rejects mismatched confirmation @negative @regression', async ({
    request,
    sharedUser,
  }) => {
    const profileApi = new ProfileApiClient(request);

    const response = await profileApi.changePassword(
      sharedUser.token,
      testData.password(),
      testData.password(),
    );

    expect(response.ok()).toBe(false);
  });
});
