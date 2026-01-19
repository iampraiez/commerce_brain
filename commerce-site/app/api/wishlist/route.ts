import { getDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const wishlistCollection = db.collection("wishlists");

    let wishlist = await wishlistCollection.findOne({
      userId: new ObjectId(session.user.id),
    });

    if (!wishlist) {
      wishlist = {
        userId: new ObjectId(session.user.id),
        productIds: [],
      };
    }

    return NextResponse.json(wishlist, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    const db = await getDB();
    const wishlistCollection = db.collection("wishlists");

    await wishlistCollection.findOneAndUpdate(
      { userId: new ObjectId(session.user.id) },
      {
        $addToSet: { productIds: new ObjectId(productId) },
      },
      { upsert: true },
    );

    return NextResponse.json({ message: "Added to wishlist" }, { status: 200 });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const productId = searchParams.get("productId");

    const db = await getDB();
    const wishlistCollection = db.collection("wishlists");

    await wishlistCollection.findOneAndUpdate(
      { userId: new ObjectId(session.user.id) },
      { $pull: { productIds: new ObjectId(productId) } },
    );

    return NextResponse.json(
      { message: "Removed from wishlist" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
