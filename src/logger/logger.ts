import winston from 'winston';

type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

const logLevels: Record<LogLevel, number> = {
  CRITICAL: 0,
  ERROR: 1,
  WARNING: 2,
  INFO: 3,
  DEBUG: 4,
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

const redactFormat = winston.format((info) => {
  for (const [key, value] of Object.entries(info)) {
    if (key === 'level' || key === 'message') {
      continue;
    }

    info[key] = shouldRedact(key) ? '[REDACTED]' : redactMetadata(value);
  }

  return info;
});

const messageFormat = winston.format.printf((info) => {
  const { level, message, scope, ...metadata } = info;
  const normalizedLevel = String(level).toUpperCase();
  const metadataText =
    Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata, null, 2)}` : '';

  return `[${normalizedLevel}] [${String(scope)}] ${String(message)}${metadataText}`;
});

const baseLogger = winston.createLogger({
  levels: logLevels,
  level: parseLevel(process.env.LOG_LEVEL),
  format: winston.format.combine(redactFormat(), messageFormat),
  transports: [new winston.transports.Console()],
});

function write(level: LogLevel, scope: string, message: string, metadata?: unknown): void {
  baseLogger.log(level, message, {
    scope,
    ...(metadata && typeof metadata === 'object' && !Array.isArray(metadata)
      ? (metadata as Record<string, unknown>)
      : metadata === undefined
        ? {}
        : { metadata }),
  });
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
