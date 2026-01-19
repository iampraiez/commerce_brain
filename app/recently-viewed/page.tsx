"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

export default function RecentlyViewedPage() {
  const router = useRouter();
  const { recentProducts, isLoading, clearRecentlyViewed } = useRecentlyViewed();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    if (recentProducts.length > 0) {
      fetchProducts();
    } else if (!isLoading) {
      setProductsLoading(false);
    }
  }, [recentProducts]);

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const productList = await Promise.all(
        recentProducts.map((item) =>
          fetch(`/api/products/${item.productId}`).then((res) => res.json())
        )
      );
      setProducts(productList.filter(Boolean));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Shop
              </Link>
            </Button>
            {products.length > 0 && (
              <Button
                onClick={clearRecentlyViewed}
                variant="outline"
                size="sm"
              >
                Clear History
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-6 h-6 text-accent" />
            <h1 className="text-3xl font-bold text-primary">Recently Viewed</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {productsLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading recently viewed products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">You haven't viewed any products yet</p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {products.length} item{products.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  description={product.description}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
