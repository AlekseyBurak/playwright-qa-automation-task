import 'dotenv/config';

type Environment = {
  baseUrl: string;
  xAccessKey?: string;
  logLevel: string;
  requireAnalyticsBasicAuth: () => { username: string; password: string };
  requireTestUser: () => { email: string; password: string };
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
  xAccessKey: getOptional('API_TOKEN'),
  logLevel: getOptional('LOG_LEVEL') ?? 'CRITICAL',
  requireAnalyticsBasicAuth: () => ({
    username: getRequired('ANALYTICS_BASIC_USER'),
    password: getRequired('ANALYTICS_BASIC_PASSWORD'),
  }),
  requireTestUser: () => ({
    email: getRequired('TEST_USER_EMAIL'),
    password: getRequired('TEST_USER_PASSWORD'),
  }),
};
