import { User } from "../../domain/schema";

export {}; // ensures this file is treated as a module

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
