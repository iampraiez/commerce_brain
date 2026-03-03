import { NextRequest } from "next/server";
import { getSessionCompany } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-response";
import stripe, { PLANS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const company = await getSessionCompany();
    if (!company) {
      return createErrorResponse("Not authenticated", 401);
    }

    const { plan, currency } = await request.json();

    if (plan === "free") {
      const db = await getDatabase();
      await db.collection("companies").updateOne(
        { _id: company._id },
        {
          $set: {
            plan: "free",
            updatedAt: new Date(),
          },
        }
      );
      return createSuccessResponse({}, 200, "Plan updated to free");
    }

    const priceId = currency === "NGN" ? PLANS.pro.priceIdNgn : PLANS.pro.priceId;

    if (!priceId) {
      return createErrorResponse("Billing configuration error. Please contact support.", 500);
    }

    const sessionOptions: any = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?session={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing`,
      metadata: {
        companyId: company._id?.toString(),
        plan,
        currency: currency || "USD",
      },
    };

    if (company.stripeCustomerId) {
      sessionOptions.customer = company.stripeCustomerId;
    } else {
      sessionOptions.customer_email = company.email;
    }

    const session = await stripe.checkout.sessions.create(sessionOptions);

    return createSuccessResponse(
      { sessionId: session.id, url: session.url },
      200,
      "Checkout session created"
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return createErrorResponse("Failed to create checkout session", 500);
  }
}
