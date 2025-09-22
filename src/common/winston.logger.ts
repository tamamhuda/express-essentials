import winston from "winston";
import { loggerConfig } from "../config/winston.config";

export default function () {
  return winston.createLogger(
    process.env.NODE_ENV === "production"
      ? loggerConfig.file
      : loggerConfig.console,
  );
}
