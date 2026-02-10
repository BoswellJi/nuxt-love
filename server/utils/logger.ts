import dayjs from 'dayjs';
import type { LoggerOptions, Logger } from 'winston';
import { createLogger, format, transports } from 'winston';
import * as Transport from 'winston-transport';
import utc from 'dayjs/plugin/utc';
import { context, trace } from '@opentelemetry/api';

export interface WinstonConfig extends LoggerOptions {}
export interface RawWinstonLogger extends Logger {}
export interface SkynetLoggerConfig {
  level?: string;
  traceIdProvider: () => string;
  appName: string;
  winstonConfig?: WinstonConfig;
  logPath: string;
  enableFileLog: boolean;
}

dayjs.extend(utc);

export function createSkynetLogger(config: SkynetLoggerConfig): RawWinstonLogger {
  const finalConfig = { ...config };

  const transport: Transport[] = [new transports.Console()];
  const logFilePath = config.logPath;
  if (config.enableFileLog) {
    transport.push(
      new transports.File({
        filename: logFilePath,
        level: finalConfig.level,
      }),
    );
  }

  const logger = createLogger({
    level: finalConfig.level,
    format: format.combine(
      format.timestamp({
        format: () => dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss.SSS'),
      }),
      format.printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level.toUpperCase()} ${message}`;
      }),
    ),
    transports: transport,
    ...finalConfig.winstonConfig,
  });

  const wrapLogMethod = (originalMethod: any) => {
    return function (message: any, ...args: any[]) {
      const trace_id = finalConfig.traceIdProvider?.();
      const formattedMessage =
        (trace_id ? `$apmTxId:${trace_id || ''}$ ` : '') + '[默认][默认][默认][][]' + message;

      return originalMethod.call(logger, formattedMessage, ...args);
    };
  };

  logger.error = wrapLogMethod(logger.error.bind(logger));
  logger.warn = wrapLogMethod(logger.warn.bind(logger));
  logger.info = wrapLogMethod(logger.info.bind(logger));
  logger.debug = wrapLogMethod(logger.debug.bind(logger));

  return logger;
}

export const traceIdProvider = () => {
  const active = context.active();
  if (active) {
    const span = trace.getSpan(active);
    if (span) {
      const span_context = span.spanContext();
      if (span_context) {
        return `${span_context?.traceId || ''}@@${span_context?.spanId || ''}`;
      }
    }
  }
  return '';
};

const runtimeConfig = useRuntimeConfig();
export const logger = createSkynetLogger({
  traceIdProvider: traceIdProvider,
  appName: runtimeConfig.appName,
  logPath: runtimeConfig.logPath,
  enableFileLog: true,
});
