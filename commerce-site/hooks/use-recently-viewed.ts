'use client';

import { useEffect, useState, useCallback } from "react";
import { openDB, IDBPDatabase } from "idb";

interface RecentlyViewedProduct {
  productId: string;
  timestamp: number;
}

const DB_NAME = "ecommerceDB";
const STORE_NAME = "recentlyViewed";

let db: IDBPDatabase | null = null;

const initDB = async () => {
  if (db) return db;

  db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "productId" });
      }
    }
  });

  return db;
};

export const useRecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState<RecentlyViewedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecentlyViewed = useCallback(async () => {
    try {
      const database = await initDB();
      const items = await database.getAll(STORE_NAME);
      const sorted = items.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
      setRecentProducts(sorted);
    } catch (error) {
      console.error("Error loading recently viewed:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addRecentlyViewed = useCallback(async (productId: string) => {
    try {
      const database = await initDB();
      await database.put(STORE_NAME, {
        productId,
        timestamp: Date.now()
      });
      await loadRecentlyViewed();
    } catch (error) {
      console.error("Error adding to recently viewed:", error);
    }
  }, [loadRecentlyViewed]);

  const clearRecentlyViewed = useCallback(async () => {
    try {
      const database = await initDB();
      await database.clear(STORE_NAME);
      setRecentProducts([]);
    } catch (error) {
      console.error("Error clearing recently viewed:", error);
    }
  }, []);

  useEffect(() => {
    loadRecentlyViewed();
  }, [loadRecentlyViewed]);

  return {
    recentProducts,
    isLoading,
    addRecentlyViewed,
    clearRecentlyViewed,
    loadRecentlyViewed
  };
};
