"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (status === "authenticated") {
      fetchWishlist();
    }
  }, [status, session]);

  const fetchWishlist = async () => {
    setIsLoading(true);
    try {
      // Get wishlist IDs
      const wishlistRes = await fetch("/api/wishlist");
      const wishlistData = await wishlistRes.json();
      const productIds = wishlistData.productIds || [];
      setWishlistIds(productIds.map((id: any) => id.$oid || id.toString?.() || id));

      // Fetch full product details
      if (productIds.length > 0) {
        const products = await Promise.all(
          productIds.map((id: any) =>
            fetch(`/api/products/${id.$oid || id.toString?.() || id}`).then((res) =>
              res.json()
            )
          )
        );
        setWishlistProducts(products.filter(Boolean));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE"
      });
      setWishlistIds(wishlistIds.filter((id) => id !== productId));
      setWishlistProducts(wishlistProducts.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-accent fill-accent" />
            <h1 className="text-3xl font-bold text-primary">My Wishlist</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 ? "s" : ""} in
              your wishlist
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div key={product._id} className="relative">
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    description={product.description}
                  />
                  <Button
                    onClick={() => removeFromWishlist(product._id)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-accent hover:text-accent/80"
                  >
                    <Heart className="w-5 h-5 fill-accent" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
