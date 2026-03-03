import { NextRequest } from "next/server";
import { getSessionCompany } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import stripe from "@/lib/stripe";

export async function GET() {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const db = await getDatabase();
    const subscription = await db.collection("subscriptions").findOne({
      companyId: company._id,
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return createSuccessResponse({ plan: company.plan || "free" });
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    return createSuccessResponse({
      plan: company.plan,
      status: stripeSubscription.status,
      currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
      canceledAt: (stripeSubscription as any).canceled_at
        ? new Date((stripeSubscription as any).canceled_at * 1000)
        : null,
      items: stripeSubscription.items.data.map((item) => ({
        id: item.id,
        priceId: item.price.id,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    console.error("Subscription fetch error:", error);
    return createErrorResponse("Failed to fetch subscription", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const { action } = await request.json();
    const db = await getDatabase();

    const subscription = await db.collection("subscriptions").findOne({
      companyId: company._id,
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return createErrorResponse("No active subscription found", 404);
    }

    if (action === "cancel") {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

      // Update in database
      await db.collection("subscriptions").updateOne(
        { _id: subscription._id },
        {
          $set: {
            status: "canceled",
            canceledAt: new Date(),
            updatedAt: new Date(),
          },
        }
      );

      // Downgrade company plan
      await db.collection("companies").updateOne(
        { _id: company._id },
        {
          $set: {
            plan: "free",
            updatedAt: new Date(),
          },
        }
      );

      return createSuccessResponse({}, 200, "Subscription canceled successfully");
    }

    if (action === "resume") {
      const stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { pause_collection: null }
      );

      await db.collection("subscriptions").updateOne(
        { _id: subscription._id },
        {
          $set: {
            status: stripeSubscription.status,
            updatedAt: new Date(),
          },
        }
      );

      return createSuccessResponse({}, 200, "Subscription resumed successfully");
    }

    return createErrorResponse("Invalid action", 400);
  } catch (error) {
    console.error("Subscription update error:", error);
    return createErrorResponse("Failed to update subscription", 500);
  }
}
