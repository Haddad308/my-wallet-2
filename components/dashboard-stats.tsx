"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatEgpCurrency } from "@/lib/calculations";
import type { ExchangeRates } from "@/lib/types";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Activity,
  BarChart3,
} from "lucide-react";

interface DashboardStatsProps {
  totalValueInEgp: number;
  totalUsdInEgp: number;
  totalGoldInEgp: number;
  rates: ExchangeRates | null;
  isLoading?: boolean;
}

export function DashboardStats({
  totalValueInEgp,
  totalUsdInEgp,
  totalGoldInEgp,
  rates,
  isLoading = false,
}: DashboardStatsProps) {
  const goldChangePercentage = rates
    ? ((rates.goldPricePerGram - 5800) / 5800) * 100
    : 0; // Assuming baseline of 5800 EGP

  const usdChangePercentage = rates ? ((rates.usdToEgp - 48) / 48) * 100 : 0; // Assuming baseline of 48 EGP

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card
            key={i}
            className="border-0 shadow-sm bg-gradient-to-br from-card to-card/50">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded-lg w-3/4 mb-3"></div>
                <div className="h-8 bg-muted rounded-lg w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Total Portfolio
          </CardTitle>
          <div className="p-2 rounded-lg bg-primary/10">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-3xl font-bold text-foreground mb-1">
            {formatEgpCurrency(totalValueInEgp)}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Combined USD + Gold holdings
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            USD Holdings
          </CardTitle>
          <div className="p-2 rounded-lg bg-green-500/10">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground mb-2">
            {formatEgpCurrency(totalUsdInEgp)}
          </div>
          <div className="flex items-center space-x-2">
            {usdChangePercentage >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <Badge
              variant={usdChangePercentage >= 0 ? "default" : "destructive"}
              className="text-xs font-medium px-2 py-0.5">
              {usdChangePercentage >= 0 ? "+" : ""}
              {usdChangePercentage.toFixed(2)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Gold Holdings
          </CardTitle>
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <Coins className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground mb-2">
            {formatEgpCurrency(totalGoldInEgp)}
          </div>
          <div className="flex items-center space-x-2">
            {goldChangePercentage >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <Badge
              variant={goldChangePercentage >= 0 ? "default" : "destructive"}
              className="text-xs font-medium px-2 py-0.5">
              {goldChangePercentage >= 0 ? "+" : ""}
              {goldChangePercentage.toFixed(2)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Live Rates
          </CardTitle>
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Activity className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                USD/EGP
              </span>
              <span className="text-sm font-bold text-foreground">
                {rates?.usdToEgp.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">
                Gold/g
              </span>
              <span className="text-sm font-bold text-foreground">
                {rates?.goldPricePerGram.toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
