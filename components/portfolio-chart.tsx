"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatEgpCurrency } from "@/lib/calculations"

interface PortfolioChartProps {
  totalUsdInEgp: number
  totalGoldInEgp: number
}

export function PortfolioChart({ totalUsdInEgp, totalGoldInEgp }: PortfolioChartProps) {
  const total = totalUsdInEgp + totalGoldInEgp

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Distribution</CardTitle>
          <CardDescription>Your asset allocation breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No data to display. Add some savings to see your portfolio distribution.
          </div>
        </CardContent>
      </Card>
    )
  }

  const usdPercentage = (totalUsdInEgp / total) * 100
  const goldPercentage = (totalGoldInEgp / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Distribution</CardTitle>
        <CardDescription>Your asset allocation breakdown</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Chart */}
        <div className="relative h-48 w-48 mx-auto">
          <div className="absolute inset-0 rounded-full border-8 border-muted"></div>

          {/* USD Segment */}
          {usdPercentage > 0 && (
            <div
              className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-500 border-r-green-500"
              style={{
                transform: `rotate(${(usdPercentage / 100) * 360}deg)`,
                clipPath:
                  usdPercentage >= 50 ? "none" : "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)",
              }}
            ></div>
          )}

          {/* Gold Segment */}
          {goldPercentage > 0 && (
            <div
              className="absolute inset-0 rounded-full border-8 border-transparent border-b-yellow-500 border-l-yellow-500"
              style={{
                transform: `rotate(${(usdPercentage / 100) * 360}deg)`,
              }}
            ></div>
          )}

          {/* Center Circle */}
          <div className="absolute inset-6 rounded-full bg-background border-2 border-border flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold">{formatEgpCurrency(total)}</div>
              <div className="text-xs text-muted-foreground">Total Value</div>
            </div>
          </div>
        </div>

        {/* Legend and Stats */}
        <div className="space-y-4">
          {totalUsdInEgp > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">💵</span>
                  <span className="font-medium">USD Holdings</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatEgpCurrency(totalUsdInEgp)}</div>
                <div className="text-sm text-muted-foreground">{usdPercentage.toFixed(1)}%</div>
              </div>
            </div>
          )}

          {totalGoldInEgp > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600">🪙</span>
                  <span className="font-medium">Gold Holdings</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">{formatEgpCurrency(totalGoldInEgp)}</div>
                <div className="text-sm text-muted-foreground">{goldPercentage.toFixed(1)}%</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
