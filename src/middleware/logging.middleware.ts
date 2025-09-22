import { NextFunction, Request, Response } from "express";
import WinstonLogger from "../common/winston.logger";

const logger = WinstonLogger();

export default (req: Request, _: Response, next: NextFunction) => {
  logger.info(`${req.method.padEnd(3)} - ${req.originalUrl}`);
  next();
};
