"use client";

import { useState, useEffect } from "react";
import type { ExchangeRates } from "@/lib/types";

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRates = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add cache-busting query parameter and headers
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/rates?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch rates");
      }

      const data = await response.json();

      setRates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();

    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { rates, isLoading, error, refetch: fetchRates };
}
