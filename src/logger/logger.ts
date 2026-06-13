type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

const levelPriority: Record<LogLevel, number> = {
  DEBUG: 10,
  INFO: 20,
  WARNING: 30,
  ERROR: 40,
  CRITICAL: 50,
};

const sensitiveKeys = [
  'authorization',
  'token',
  'password',
  'apitoken',
  'api_token',
  'x-access-key',
];

function parseLevel(value?: string): LogLevel {
  const normalized = value?.trim().toUpperCase();

  if (
    normalized === 'DEBUG' ||
    normalized === 'INFO' ||
    normalized === 'WARNING' ||
    normalized === 'ERROR' ||
    normalized === 'CRITICAL'
  ) {
    return normalized;
  }

  return 'CRITICAL';
}

function shouldRedact(key: string): boolean {
  const normalized = key.toLowerCase();

  return sensitiveKeys.some((sensitiveKey) => normalized.includes(sensitiveKey));
}

function redactMetadata(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactMetadata(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        shouldRedact(key) ? '[REDACTED]' : redactMetadata(entry),
      ]),
    );
  }

  return value;
}

function write(level: LogLevel, scope: string, message: string, metadata?: unknown): void {
  const configuredLevel = parseLevel(process.env.LOG_LEVEL);

  if (levelPriority[level] < levelPriority[configuredLevel]) {
    return;
  }

  const prefix = `[${level}] [${scope}] ${message}`;
  const redacted = metadata === undefined ? undefined : redactMetadata(metadata);

  switch (level) {
    case 'DEBUG':
      console.debug(prefix, redacted ?? '');
      break;
    case 'INFO':
      console.info(prefix, redacted ?? '');
      break;
    case 'WARNING':
      console.warn(prefix, redacted ?? '');
      break;
    case 'ERROR':
    case 'CRITICAL':
      console.error(prefix, redacted ?? '');
      break;
  }
}

export function createLogger(scope: string) {
  return {
    debug: (message: string, metadata?: unknown) => write('DEBUG', scope, message, metadata),
    info: (message: string, metadata?: unknown) => write('INFO', scope, message, metadata),
    warning: (message: string, metadata?: unknown) => write('WARNING', scope, message, metadata),
    error: (message: string, metadata?: unknown) => write('ERROR', scope, message, metadata),
    critical: (message: string, metadata?: unknown) => write('CRITICAL', scope, message, metadata),
  };
}

export type Logger = ReturnType<typeof createLogger>;
export type { LogLevel };
