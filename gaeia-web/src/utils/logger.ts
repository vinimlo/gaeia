/**
 * Simple logger utility for GAEIA-Web
 * In development: verbose logging
 * In production: errors only
 */

const isDev = import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_COLORS = {
  error: '\x1b[31m',  // Red
  warn: '\x1b[33m',   // Yellow
  info: '\x1b[36m',   // Cyan
  debug: '\x1b[90m',  // Gray
  reset: '\x1b[0m'
} as const;

/**
 * Format a log message with timestamp and level
 */
function formatMessage(level: LogLevel, message: string, context?: string): string {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : '';
  return `${LOG_COLORS[level]}[${timestamp}] [${level.toUpperCase()}]${contextStr}${LOG_COLORS.reset} ${message}`;
}

/**
 * Log an error message
 * Always logged in both dev and prod
 */
export function logError(message: string, error?: unknown, context?: string): void {
  const errorDetails = error instanceof Error ? `: ${error.message}` : error ? `: ${String(error)}` : '';
  console.error(formatMessage('error', `${message}${errorDetails}`, context));

  // Log stack trace in dev mode
  if (isDev && error instanceof Error && error.stack) {
    console.error(LOG_COLORS.debug + error.stack + LOG_COLORS.reset);
  }
}

/**
 * Log a warning message
 * Only logged in dev mode
 */
export function logWarn(message: string, context?: string): void {
  if (isDev) {
    console.warn(formatMessage('warn', message, context));
  }
}

/**
 * Log an info message
 * Only logged in dev mode
 */
export function logInfo(message: string, context?: string): void {
  if (isDev) {
    console.info(formatMessage('info', message, context));
  }
}

/**
 * Log a debug message
 * Only logged in dev mode
 */
export function logDebug(message: string, context?: string): void {
  if (isDev) {
    console.log(formatMessage('debug', message, context));
  }
}

/**
 * Create a scoped logger with a preset context
 */
export function createLogger(context: string) {
  return {
    error: (message: string, error?: unknown) => logError(message, error, context),
    warn: (message: string) => logWarn(message, context),
    info: (message: string) => logInfo(message, context),
    debug: (message: string) => logDebug(message, context)
  };
}
