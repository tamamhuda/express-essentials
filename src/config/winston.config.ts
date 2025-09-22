import { format, LoggerOptions, transports } from "winston";
import {
  ConsoleTransportOptions,
  FileTransportOptions,
} from "winston/lib/winston/transports";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import config from "../config/env.config";
import chalk from "chalk";

const levelColors: Record<string, (txt: string) => string> = {
  error: chalk.red.bold,
  warn: chalk.yellow.bold,
  info: chalk.green.bold,
  http: chalk.magenta,
  verbose: chalk.cyan,
  debug: chalk.blue,
  silly: chalk.gray,
};

const formatLogger = format.printf(({ level, message, stack, timestamp }) => {
  const lvl = levelColors[level]
    ? levelColors[level](level.toUpperCase().padEnd(7))
    : level.toUpperCase().padEnd(7);

  const time = chalk.gray(timestamp as string);

  return `[${String(process.env.APP_NAME ?? "EXPRESS_APP").toUpperCase()}] - ${time} - [${lvl}] - ${message || stack}`;
});

type LoggerMode = "console" | "file";
type FileLevelTransportOptions = Record<"error" | "info", FileTransportOptions>;

const logtail = new Logtail(config.SOURCE_TOKEN, {
  endpoint: `https://${config.INGEST_HOST}`,
});

const transportsOptions: Record<
  LoggerMode,
  FileLevelTransportOptions | ConsoleTransportOptions
> = {
  console: {
    level: "silly",
  },
  file: {
    error: {
      filename: "logs/error.log",
      level: "error",
    },
    info: {
      filename: "logs/info.log",
      level: "info",
    },
  },
};

export const loggerConfig: Record<"console" | "file", LoggerOptions> = {
  console: {
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      formatLogger,
    ),
    transports: [
      new transports.Console(
        transportsOptions.console as ConsoleTransportOptions,
      ),
    ],
  },
  file: {
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.json(),
    ),
    transports: [
      new transports.File(
        (transportsOptions.file as FileLevelTransportOptions).info,
      ),
      new transports.File(
        (transportsOptions.file as FileLevelTransportOptions).error,
      ),
      new LogtailTransport(logtail),
    ],
  },
};
