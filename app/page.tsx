"use client";

import { useState, useEffect } from "react";
import { SavingsForm } from "@/components/savings-form";
import { SavingsList } from "@/components/savings-list";
import { DashboardStats } from "@/components/dashboard-stats";
import { PortfolioChart } from "@/components/portfolio-chart";
import { RateDisplay } from "@/components/rate-display";
import { useExchangeRates } from "@/hooks/use-exchange-rates";
import { loadSavingsEntries } from "@/lib/storage";
import { calculateTotalValue } from "@/lib/calculations";
import type { SavingsEntry } from "@/lib/types";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { TrendingUp, Shield, Sparkles } from "lucide-react";

export default function HomePage() {
  const [entries, setEntries] = useState<SavingsEntry[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const {
    rates,
    isLoading: ratesLoading,
    refetch: refetchRates,
  } = useExchangeRates();

  const loadEntries = async () => {
    const data = await loadSavingsEntries();
    setEntries(data);
  };

  useEffect(() => {
    loadEntries();
  }, [refreshTrigger]);

  const handleSavingsAdded = () => {
    ("[v0] Savings added, refreshing...");
    setRefreshTrigger((prev) => prev + 1);
  };

  const calculation = rates
    ? calculateTotalValue(entries, rates)
    : {
        totalUsdInEgp: 0,
        totalGoldInEgp: 0,
        totalValueInEgp: 0,
        breakdown: [],
      };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/80">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-balance">
                    Wealth Portfolio
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    Professional asset tracking & analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  Secure & Private
                </div>
                <ModeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-8">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Portfolio Overview
                </h2>
              </div>
              <DashboardStats
                totalValueInEgp={calculation.totalValueInEgp}
                totalUsdInEgp={calculation.totalUsdInEgp}
                totalGoldInEgp={calculation.totalGoldInEgp}
                rates={rates}
                isLoading={ratesLoading}
              />
            </div>

            <div className="grid gap-8 xl:grid-cols-12">
              {/* Left Column - Forms and Rates */}
              <div className="xl:col-span-4 space-y-6">
                <SavingsForm onSavingsAdded={handleSavingsAdded} />
                <RateDisplay
                  rates={rates}
                  isLoading={ratesLoading}
                  onRefresh={refetchRates}
                />
              </div>

              {/* Middle Column - Portfolio Chart */}
              <div className="xl:col-span-4">
                <PortfolioChart
                  totalUsdInEgp={calculation.totalUsdInEgp}
                  totalGoldInEgp={calculation.totalGoldInEgp}
                />
              </div>

              {/* Right Column - Savings List */}
              <div className="xl:col-span-4">
                <SavingsList refreshTrigger={refreshTrigger} />
              </div>
            </div>

            {rates && (
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50 text-sm font-medium backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-muted-foreground">
                    Live market data • Updated every 5 minutes
                  </span>
                </div>
              </div>
            )}
          </div>
        </main>

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
