"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import Loading from "./loading"; // Import the Loading component

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

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (query) {
      fetchProducts(1);
    } else {
      setIsLoading(false);
    }
  }, [query]);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "12");
      params.append("search", query);

      const response = await fetch(`/api/products?${params}`);
      const data: PaginationData = await response.json();
      setProducts(data.products);
      setCurrentPage(data.pagination.page);
      setTotalPages(data.pagination.pages);
      setTotalResults(data.pagination.total);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Search className="w-6 h-6 text-accent" />
            <h1 className="text-3xl font-bold text-primary">Search Results</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {!query ? (
              "Enter a search term to get started"
            ) : isLoading ? (
              "Searching..."
            ) : (
              <>
                {totalResults} result{totalResults !== 1 ? "s" : ""} for "
                <span className="font-semibold">{query}</span>"
              </>
            )}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {!query ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No search query provided</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No products found for "{query}"</p>
            <Button asChild>
              <Link href="/">Browse All Products</Link>
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
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => fetchProducts(pageNum)}
                        variant={currentPage === pageNum ? "default" : "outline"}
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
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}> {/* Use the Loading component as fallback */}
      <SearchContent />
    </Suspense>
  );
}
