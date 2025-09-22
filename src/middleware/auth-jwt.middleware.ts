import { Request, Response, NextFunction } from "express";
import { auth } from "../config/auth.config";
import { jwtVerify, createLocalJWKSet } from "jose";
import WinstonLogger from "../common/winston.logger";

const logger = WinstonLogger();

async function verifyJwt(token: string) {
  try {
    const jwks = await auth.api.getJwks();
    const JWKS = createLocalJWKSet(jwks);

    const { payload } = await jwtVerify(token, JWKS);
    return payload;
  } catch (err) {
    logger.error("Invalid JWT", (err as Error).message);
    return null;
  }
}

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const Authorization = req.headers.authorization?.substring(7);
    const payload = Authorization ? await verifyJwt(Authorization) : null;

    if (payload) {
      const token = payload.sub;
      const header = new Headers();
      header.set("Authorization", `Bearer ${token}`);

      const session = await auth.api.getSession({
        headers: header,
      });

      if (!session) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = session.user;

      next();
    }

    return res.status(401).json({ message: "Unauthorized" });
  } catch (e) {
    next(e);
  }
}
