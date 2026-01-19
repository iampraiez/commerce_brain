"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ArrowLeft, Package, Trash2 } from "lucide-react";
import Image from "next/image";

interface Order {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800"
};

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) throw new Error("Order not found");
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError("Failed to load order");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrder();
  }, [params.id]);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/orders/${params.id}/cancel`, {
        method: "POST"
      });
      if (!response.ok) throw new Error("Failed to cancel order");
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setShowCancelDialog(false);
    } catch (err) {
      setError("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Button asChild variant="ghost" className="gap-2">
              <Link href="/orders">
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Link>
            </Button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-red-600">{error || "Order not found"}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button asChild variant="ghost" className="gap-2 mb-4">
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-primary">Order Details</h1>
        </div>
      </header>

      {/* Order Details */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
                  >
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0 relative">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-mono text-sm font-semibold break-all">
                    {order._id}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                    {order.status !== "delivered" &&
                      order.status !== "cancelled" && (
                        <Button
                          onClick={() => setShowCancelDialog(true)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    Order Date
                  </p>
                  <p className="font-semibold">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Amount
                  </p>
                  <p className="text-3xl font-bold text-accent">
                    ${order.total.toFixed(2)}
                  </p>
                </div>

                <Button
                  asChild
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
