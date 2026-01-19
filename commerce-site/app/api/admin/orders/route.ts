import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";

async function isAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin";
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const db = await getDB();
    const ordersCollection = db.collection("orders");

    const orders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
