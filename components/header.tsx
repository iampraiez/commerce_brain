"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ShoppingCart, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery(searchParams?.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString());
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    // Always reset page to 1 on new search
    params.delete("page"); 
    
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className="border-b border-border sticky top-0 z-40 bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-primary">Shop</h1>
          </Link>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/wishlist" className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span className="hidden sm:inline">Wishlist</span>
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/cart">Cart</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/account">Account</Link>
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>
      </div>
    </header>
  );
}
