import { resolve } from 'path';
import * as winston from 'winston';
import { logger } from '../config/config.json';

// modified from https://github.com/winstonjs/winston/issues/1017#issuecomment-450754806
export class LogManager {
    public static getLogger(label: string): winston.Logger {
        if (!winston.loggers.has(label)) {
            winston.loggers.add(label, {
                format: winston.format.label({ label }),
                transports: [LogManager.consoleTransport, LogManager.fileTransport]
            });
        }

        return winston.loggers.get(label);
    }

    private static logFormatTemplate(i: { level: string, message: string, [key: string]: any }) {
        return `${i.timestamp} ${i.level.toUpperCase()} [${i.label}]: ${i.message}`;
    }

    private static readonly consoleTransport = new winston.transports.Console({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(LogManager.logFormatTemplate)
        )
    });

    private static readonly fileTransport = new winston.transports.File({
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(LogManager.logFormatTemplate)
        ),
        filename: resolve(logger.resolve),
        level: logger.level
    });
}