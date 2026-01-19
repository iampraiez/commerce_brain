import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getDB } from "@/lib/db";
import { ObjectId } from "mongodb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-27.acpi.3"
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.orderId) {
          const db = await getDB();
          const ordersCollection = db.collection("orders");

          // Update order status to "paid"
          await ordersCollection.updateOne(
            { _id: new ObjectId(session.metadata.orderId) },
            {
              $set: {
                status: "paid",
                stripeSessionId: session.id,
                updatedAt: new Date()
              }
            }
          );

          console.log(`Order ${session.metadata.orderId} marked as paid`);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        
        if (charge.metadata?.orderId) {
          const db = await getDB();
          const ordersCollection = db.collection("orders");

          // Update order status to "cancelled"
          await ordersCollection.updateOne(
            { _id: new ObjectId(charge.metadata.orderId) },
            {
              $set: {
                status: "cancelled",
                refundedAt: new Date(),
                updatedAt: new Date()
              }
            }
          );

          console.log(`Order ${charge.metadata.orderId} marked as cancelled (refunded)`);
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        if (paymentIntent.metadata?.orderId) {
          const db = await getDB();
          const ordersCollection = db.collection("orders");

          // Update order status to "failed"
          await ordersCollection.updateOne(
            { _id: new ObjectId(paymentIntent.metadata.orderId) },
            {
              $set: {
                status: "cancelled",
                failureReason: paymentIntent.last_payment_error?.message,
                updatedAt: new Date()
              }
            }
          );

          console.log(`Order ${paymentIntent.metadata.orderId} payment failed`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json(
      { received: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
