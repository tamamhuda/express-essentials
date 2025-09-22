import { db } from "../db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer, jwt } from "better-auth/plugins";
import * as schema from "../domain/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  plugins: [
    jwt({
      jwks: {
        keyPairConfig: {
          alg: "EdDSA",
          crv: "Ed25519",
        },
      },
      jwt: {
        issuer: "https://localhost:3000",
        getSubject: (auth) => auth.session.token,
        expirationTime: "15m",
        definePayload: (session) => {
          return {
            email: session.user.email,
          };
        },
      },
    }),
    bearer(),
  ],
  emailAndPassword: {
    enabled: true,
  },
});
