'use client';

import { useRecentlyViewed } from "./use-recently-viewed";
import { useCallback } from "react";

interface RecommendedProduct {
  productId: string;
  category: string;
  timestamp: number;
}

export const useRecommended = () => {
  const { recentProducts } = useRecentlyViewed();

  const getRecommendedCategories = useCallback(() => {
    // Get categories from recently viewed products
    const categoryMap = new Map<string, number>();

    recentProducts.forEach((item) => {
      // Extract category from product (simplified - in real scenario would fetch full product)
      const count = categoryMap.get(item.productId) || 0;
      categoryMap.set(item.productId, count + 1);
    });

    // Sort by frequency
    const topCategories = Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category]) => category);

    return topCategories;
  }, [recentProducts]);

  const getRecommendedProducts = useCallback(
    async (limit: number = 6) => {
      try {
        const categories = getRecommendedCategories();

        if (categories.length === 0) {
          // If no recently viewed, get random popular products
          const response = await fetch("/api/products?limit=" + limit);
          const data = await response.json();
          return data.products || [];
        }

        // Fetch products from recommended categories
        const categoryQuery = categories.join(",");
        const response = await fetch(`/api/products?categories=${categoryQuery}&limit=${limit}`);
        const data = await response.json();
        return data.products || [];
      } catch (error) {
        console.error("Error fetching recommended products:", error);
        return [];
      }
    },
    [getRecommendedCategories]
  );

  return { getRecommendedProducts, getRecommendedCategories };
};
