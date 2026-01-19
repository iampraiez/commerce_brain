import { getDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const productsCollection = db.collection("products");

    const products = await productsCollection.find({}).toArray();

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, price, description, category, image, stock } = body;

    if (!name || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDB();
    const productsCollection = db.collection("products");

    const result = await productsCollection.insertOne({
      name,
      price: parseFloat(price),
      description,
      category,
      image: image || "https://via.placeholder.com/300x300?text=Product",
      stock: parseInt(stock),
      createdAt: new Date()
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        productId: result.insertedId
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
