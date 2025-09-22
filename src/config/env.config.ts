import dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

interface Config {
  PORT: number;
  NODE_ENV: string | "development" | "production";
  ZEPTO_API_URL: string;
  ZEPTO_TOKEN: string;
  MAIL_SENDER: string;
  DATABASE_URL: string;
  INGEST_HOST: string;
  SOURCE_TOKEN: string;
}

const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  ZEPTO_API_URL: String(process.env.ZEPTO_API_URL),
  ZEPTO_TOKEN: String(process.env.ZEPTO_TOKEN),
  MAIL_SENDER: String(process.env.MAIL_SENDER),
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://express:express@127.0.0.1:5432/express_db",
  INGEST_HOST: String(process.env.INGEST_HOST || ""),
  SOURCE_TOKEN: String(process.env.SOURCE_TOKEN || ""),
};

export default config;
