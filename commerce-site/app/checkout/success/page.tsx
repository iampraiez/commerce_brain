"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { clearCart } from "@/lib/cart";
import { Suspense } from "react";
import Loading from "./loading";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    // Clear the cart on success
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Suspense fallback={<Loading />}>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div>
              <p className="text-muted-foreground mb-2">
                Thank you for your order
              </p>
              {orderId && (
                <p className="text-sm font-mono bg-muted p-2 rounded">
                  Order ID: {orderId}
                </p>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a confirmation email to your inbox. You can track
              your order in your account.
            </p>

            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/orders">View My Orders</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
              >
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Suspense>
    </div>
  );
}
