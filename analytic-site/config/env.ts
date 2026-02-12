import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_NEXUS_API_KEY: z.string().default("demo-key"),
  NEXT_PUBLIC_NEXUS_PROJECT_ID: z.string().default("demo-project"),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  MONGODB_URI: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_FREE_PRICE_ID: z.string().min(1),
  STRIPE_PRO_PRICE_ID_NGN: z.string().min(1),
  STRIPE_PRO_PRICE_ID: z.string().min(1),

  SENDGRID_API_KEY: z.string().min(1),
  SENDER_EMAIL: z.string().email(),

  GEMINI_API_KEY: z.string().min(1),

  ALERT_CRON_SECRET: z.string().min(1),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
