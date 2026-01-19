"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSearchParams } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  stock: number;
}

interface PaginationData {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const CATEGORIES = [
  "All",
  "Home & Office",
  "Phones & Tablets",
  "Fashion",
  "Health & Beauty",
  "Electronics",
  "Computing",
  "Grocery",
  "Garden & Outdoors",
  "Automobile",
  "Sporting Goods",
  "Gaming",
  "Baby Products",
];

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const searchQuery = searchParams?.get("search") || "";
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams?.get("category") || "All",
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts(1);
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "12");
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "All")
        params.append("category", selectedCategory);

      const response = await fetch(`/api/products?${params}`);
      const data: PaginationData = await response.json();
      setProducts(data.products);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">
            Categories
          </h2>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryChange(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <Suspense fallback={<LoadingSpinner />}>
          {isLoading ? (
            <div className="text-center py-12 flex flex-col items-center">
              <LoadingSpinner />
              <p className="text-muted-foreground mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No products found</p>
              <Button onClick={() => handleCategoryChange("All")}>
                Browse All Products
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 py-8">
                  <Button
                    onClick={() => fetchProducts(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum =
                        currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          onClick={() => fetchProducts(pageNum)}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    onClick={() => fetchProducts(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </Suspense>
      </main>
    </div>
  );
}
