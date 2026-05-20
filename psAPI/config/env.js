import { config } from "dotenv";

config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export const {
  PORT,
  NODE_ENV,
  DB_URI,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  TAB_SECRET,
  Host,
  TELEGRAM_CHAT_ID, TELEGRAM_BOT_TOKEN
} = process.env;
