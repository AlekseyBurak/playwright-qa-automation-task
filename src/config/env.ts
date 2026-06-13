import 'dotenv/config';

type TestUser = {
  email?: string;
  password?: string;
};

type Environment = {
  baseUrl: string;
  apiBaseUrl: string;
  apiToken?: string;
  xAccessKey?: string;
  analyticsBasicUser?: string;
  analyticsBasicPassword?: string;
  logLevel: string;
  testUser: TestUser;
  requireApiToken: () => string;
  requireXAccessKey: () => string;
  requireAnalyticsBasicAuth: () => { username: string; password: string };
  requireTestUser: () => Required<TestUser>;
};

function getOptional(name: string): string | undefined {
  const value = process.env[name]?.trim();

  return value || undefined;
}

function getRequired(name: string): string {
  const value = getOptional(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const baseUrl = getOptional('BASE_URL') ?? 'http://localhost:3000';

export const env: Environment = {
  baseUrl,
  apiBaseUrl: getOptional('API_BASE_URL') ?? baseUrl,
  apiToken: getOptional('API_TOKEN'),
  xAccessKey: getOptional('X_ACCESS_KEY') ?? getOptional('API_TOKEN'),
  analyticsBasicUser: getOptional('ANALYTICS_BASIC_USER'),
  analyticsBasicPassword: getOptional('ANALYTICS_BASIC_PASSWORD'),
  logLevel: getOptional('LOG_LEVEL') ?? 'CRITICAL',
  testUser: {
    email: getOptional('TEST_USER_EMAIL'),
    password: getOptional('TEST_USER_PASSWORD'),
  },
  requireApiToken: () => getRequired('API_TOKEN'),
  requireXAccessKey: () => getOptional('X_ACCESS_KEY') ?? getRequired('API_TOKEN'),
  requireAnalyticsBasicAuth: () => ({
    username: getRequired('ANALYTICS_BASIC_USER'),
    password: getRequired('ANALYTICS_BASIC_PASSWORD'),
  }),
  requireTestUser: () => ({
    email: getRequired('TEST_USER_EMAIL'),
    password: getRequired('TEST_USER_PASSWORD'),
  }),
};
