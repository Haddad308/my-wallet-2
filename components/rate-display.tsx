"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ExchangeRates } from "@/lib/types"
import { RefreshCw, TrendingUp, Clock } from "lucide-react"

interface RateDisplayProps {
  rates: ExchangeRates | null
  isLoading: boolean
  onRefresh: () => void
}

function formatDateTime(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(timestamp))
}

export function RateDisplay({ rates, isLoading, onRefresh }: RateDisplayProps) {
  if (!rates) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            {isLoading ? "Loading rates..." : "Failed to load rates"}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Current Exchange Rates</CardTitle>
          <CardDescription className="flex items-center gap-1 mt-1">
            <Clock className="h-3 w-3" />
            Last updated: {formatDateTime(rates.timestamp)}
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">USD to EGP</span>
              <Badge variant="secondary">
                <TrendingUp className="h-3 w-3 mr-1" />
                Currency
              </Badge>
            </div>
            <div className="text-2xl font-bold">{rates.usdToEgp.toFixed(4)} EGP</div>
            <p className="text-xs text-muted-foreground">1 USD = {rates.usdToEgp.toFixed(2)} Egyptian Pounds</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gold Price</span>
              <Badge variant="outline">
                <TrendingUp className="h-3 w-3 mr-1" />
                Precious Metal
              </Badge>
            </div>
            <div className="text-2xl font-bold">{rates.goldPricePerGram.toFixed(0)} EGP</div>
            <p className="text-xs text-muted-foreground">Per gram (24k gold)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
