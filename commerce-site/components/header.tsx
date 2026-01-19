"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingCart, Search, Heart, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams?.get("search") || ""
  );
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString());
    if (debouncedSearchQuery) {
      params.set("search", debouncedSearchQuery);
    } else {
      params.delete("search");
    }
    // Always reset page to 1 on new search
    params.delete("page");

    // Only push if the query actually changed to avoid unnecessary history entries/refetches
    const currentSearch = searchParams?.get("search") || "";
    if (debouncedSearchQuery !== currentSearch) {
      router.push(`/?${params.toString()}`);
    }
  }, [debouncedSearchQuery, router, searchParams]);

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="w-full relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-9 bg-muted/50 border-transparent focus:bg-background focus:border-input transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary hidden sm:block">Shop</h1>
          </Link>

          <div className="flex-1 max-w-md mx-4">
            <Suspense fallback={<div className="h-10 bg-muted rounded-md w-full" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {session?.user ? (
              <>
                <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex">
                  <Link href="/wishlist">
                    <Heart className="w-5 h-5" />
                    <span className="sr-only">Wishlist</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/cart">
                    <ShoppingBag className="w-5 h-5" />
                    <span className="sr-only">Cart</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon">
                  <Link href="/account">
                    <User className="w-5 h-5" />
                    <span className="sr-only">Account</span>
                  </Link>
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
