import Stripe from "stripe";
import { env } from "@/config/env";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia" as any,
});

export default stripe;

export const PLANS = {
  free: {
    name: "Free",
    priceId: env.STRIPE_FREE_PRICE_ID || "",
    priceIdNgn: "",
    amount: 0,
    amountNgn: 0,
    eventsPerMonth: 10000,
    features: ["Basic analytics", "Limited retention"],
  },
  pro: {
    name: "Pro",
    priceId: env.STRIPE_PRO_PRICE_ID,
    priceIdNgn: env.STRIPE_PRO_PRICE_ID_NGN || "",
    amount: 9900,
    amountNgn: 1400000,
    eventsPerMonth: 1000000,
    features: [
      "Unlimited events",
      "Advanced analytics",
      "Full retention",
      "Email alerts",
      "Priority support",
      "Custom integrations",
    ],
  },
};
