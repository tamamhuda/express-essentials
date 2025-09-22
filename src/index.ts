import express, { Request, Response } from "express";
import config from "./config/env.config";
import logging from "./middleware/logging.middleware";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.config";
import AuthJwtMiddleware from "./middleware/auth-jwt.middleware";
import { sendMail, SendMail } from "./services/mail.service";
import winstonLogger from "./common/winston.logger";
import { checkDatabaseConnection } from "./db";

const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

const app = express();

const logger = winstonLogger();

app.use(express.json());

app.use(logging);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.get("/", AuthJwtMiddleware, (_: Request, res: Response) => {
  return res.status(200).json({
    message: "OK",
  });
});

app.post("/mail/send", async (req: Request, res: Response) => {
  const { subject, from, receipts }: SendMail = req.body;
  try {
    await sendMail(subject, from, receipts);
    return res.status(200).json({
      message: "Email send successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Email send failed.",
    });
  }
});

app.listen(PORT, async () => {
  await checkDatabaseConnection();
  logger.info(`app running successfully in ${NODE_ENV} mode on PORT ${PORT}`);
});
