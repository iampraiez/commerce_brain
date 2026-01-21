"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  stock?: number;
  viewMode?: "grid" | "list";
}

export function ProductCard({
  id,
  name,
  price,
  image,
  description,
  stock,
  viewMode = "grid",
}: ProductCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isCheckingWishlist, setIsCheckingWishlist] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (!session?.user) return;

    const checkWishlist = async () => {
      setIsCheckingWishlist(true);
      try {
        const response = await fetch("/api/wishlist");
        if (!response.ok) return;
        
        const data = await response.json();
        const isIn = data.productIds?.some(
          (productId: any) => (productId.$oid || productId.toString?.() || productId) === id,
        );
        setIsInWishlist(!!isIn);
      } catch (error) {
        console.error("Error checking wishlist:", error);
      } finally {
        setIsCheckingWishlist(false);
      }
    };

    checkWishlist();
  }, [session?.user, id]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling

    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    // Optimistic update
    const previousState = isInWishlist;
    setIsInWishlist(!previousState);

    try {
      if (previousState) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove");
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: id }),
        });
        if (!response.ok) throw new Error("Failed to add");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      // Revert on error
      setIsInWishlist(previousState);
    }
  };

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 relative flex flex-row group border-none bg-card/50 backdrop-blur-sm hover:bg-card">
        {/* Wishlist Button */}
        {session?.user && (
          <button
            onClick={handleToggleWishlist}
            disabled={isCheckingWishlist}
            className="absolute top-2 right-2 z-10 p-1.5 bg-background/60 backdrop-blur-md rounded-full hover:bg-background transition-all shadow-sm disabled:opacity-50 sm:opacity-0 group-hover:opacity-100"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isInWishlist
                  ? "fill-accent text-accent"
                  : "text-foreground hover:text-accent"
              }`}
            />
          </button>
        )}

        <Link href={`/products/${id}`} className="w-28 h-28 sm:w-40 sm:h-40 shrink-0 relative overflow-hidden m-2 rounded-lg">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            fill
            sizes="(max-width: 640px) 112px, 160px"
          />
        </Link>

        <div className="flex flex-col flex-1 p-3 sm:p-4 justify-between min-w-0">
          <div className="space-y-1">
            <div className="flex justify-between items-start gap-2">
              <Link href={`/products/${id}`} className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-lg hover:text-accent transition-colors truncate">
                  {name}
                </h3>
              </Link>
            </div>
            
            {description && (
              <p className="text-muted-foreground line-clamp-1 sm:line-clamp-2 text-[10px] sm:text-xs leading-relaxed">
                {description}
              </p>
            )}
            
            <p className="text-base sm:text-xl font-black text-accent mt-1">
              ${price.toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end items-center mt-2">
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-bold hover:bg-accent hover:text-accent-foreground transition-all rounded-full"
            >
              <Link href={`/products/${id}`}>
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Details
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 relative group border-none bg-card/50 backdrop-blur-sm hover:bg-card">
      {/* Wishlist Button */}
      {session?.user && (
        <button
          onClick={handleToggleWishlist}
          disabled={isCheckingWishlist}
          className="absolute top-3 right-3 z-10 p-2 bg-background/60 backdrop-blur-md rounded-full hover:bg-background transition-all shadow-lg disabled:opacity-50 sm:opacity-0 group-hover:opacity-100"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 transition-colors ${
              isInWishlist
                ? "fill-accent text-accent"
                : "text-foreground hover:text-accent"
              }`}
          />
        </button>
      )}

      <Link href={`/products/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
        </div>
      </Link>

      <CardContent className="p-4 space-y-2">
        <Link href={`/products/${id}`}>
          <h3 className="font-bold text-base sm:text-lg hover:text-accent transition-colors truncate">
            {name}
          </h3>
        </Link>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between pt-2">
          <p className="text-lg sm:text-xl font-black text-accent">
            ${price.toFixed(2)}
          </p>
          <Button
            asChild
            size="icon"
            variant="secondary"
            className="rounded-full h-8 w-8 sm:h-10 sm:w-10 hover:bg-accent hover:text-accent-foreground transition-all shadow-md"
          >
            <Link href={`/products/${id}`}>
              <ShoppingCart className="w-4 h-4" />
              <span className="sr-only">View Details</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
