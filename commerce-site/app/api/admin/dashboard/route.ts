import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDB } from "@/lib/db";

async function isAdmin(request: NextRequest) {
  const session = await getServerSession(authOptions);
  return (session?.user as any).role === "admin";
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

    // Get totals
    const ordersCollection = db.collection("orders");
    const productsCollection = db.collection("products");
    const usersCollection = db.collection("users");

    const totalOrders = await ordersCollection.countDocuments();
    const totalProducts = await productsCollection.countDocuments();
    const totalCustomers = await usersCollection.countDocuments({ role: "customer" });

    // Calculate total revenue
    const orders = await ordersCollection.find({}).toArray();
    const totalRevenue = Array.isArray(orders) && orders.length > 0
      ? orders.reduce((sum, order) => sum + (order.total || 0), 0)
      : 0;

    // Get recent orders
    const recentOrders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    // Get low stock products
    const lowStockProducts = await productsCollection
      .find({ stock: { $lt: 10 } })
      .limit(5)
      .toArray();

    // Calculate daily revenue (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const revenueByDay: Record<string, number> = {};
    orders.forEach(order => {
      if (new Date(order.createdAt) > sevenDaysAgo) {
        const day = new Date(order.createdAt).toLocaleDateString();
        revenueByDay[day] = (revenueByDay[day] || 0) + (order.total || 0);
      }
    });

    return NextResponse.json(
      {
        stats: {
          totalOrders,
          totalProducts,
          totalCustomers,
          totalRevenue: parseFloat(totalRevenue.toFixed(2))
        },
        recentOrders: recentOrders.map(order => ({
          _id: order._id.toString(),
          total: order.total,
          status: order.status,
          userEmail: order.userEmail,
          createdAt: order.createdAt
        })),
        lowStockProducts: lowStockProducts.map(product => ({
          _id: product._id.toString(),
          name: product.name,
          stock: product.stock
        })),
        revenueByDay
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
