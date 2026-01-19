"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ChevronRight } from "lucide-react";

interface Order {
  _id: string;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  items: any[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-primary">My Orders</h1>
          <p className="text-muted-foreground mt-2">
            View and track your orders
          </p>
        </div>
      </header>

      {/* Orders List */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Loading your orders...</p>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="pt-12 text-center pb-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-6">
                No orders yet
              </p>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link key={order._id} href={`/orders/${order._id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Order ID
                        </p>
                        <p className="font-mono font-semibold mb-3">
                          {order._id.substring(0, 16)}...
                        </p>

                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Total
                            </p>
                            <p className="text-xl font-bold text-accent">
                              ${order.total.toFixed(2)}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">
                              Items
                            </p>
                            <p className="text-lg font-semibold">
                              {order.items.reduce(
                                (sum: number, item: any) => sum + item.quantity,
                                0,
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm text-muted-foreground">
                              Date
                            </p>
                            <p className="text-lg font-semibold">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <ChevronRight className="w-6 h-6 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
