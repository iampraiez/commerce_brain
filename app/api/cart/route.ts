import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const db = await getDB();
    const cartCollection = db.collection("cart");

    const cart = await cartCollection.findOne({
      userId: new ObjectId(session.user.id)
    });

    return NextResponse.json(cart?.items || [], { status: 200 });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, quantity } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const cartCollection = db.collection("cart");
    const productsCollection = db.collection("products");

    const product = await productsCollection.findOne({
      _id: new ObjectId(productId)
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    const userId = new ObjectId(session.user.id);

    const result = await cartCollection.findOneAndUpdate(
      { userId },
      {
        $push: {
          items: {
            _id: new ObjectId(productId),
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
          }
        }
      },
      { upsert: true, returnDocument: "after" }
    );

    return NextResponse.json(
      { message: "Added to cart", cart: result.value },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
