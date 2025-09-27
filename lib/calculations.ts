import type { SavingsEntry, ExchangeRates, GoldKarat } from "./types"

export interface SavingsCalculation {
  totalUsdInEgp: number
  totalGoldInEgp: number
  totalValueInEgp: number
  breakdown: {
    usdAmount: number
    usdValueInEgp: number
    goldGrams: number
    goldValueInEgp: number
    goldKarat?: GoldKarat
  }[]
}

const GOLD_PURITY_MULTIPLIERS: Record<GoldKarat, number> = {
  "18k": 0.75, // 75% purity
  "21k": 0.875, // 87.5% purity
  "22k": 0.917, // 91.7% purity
  "24k": 0.999, // 99.9% purity
}

export function calculateTotalValue(entries: SavingsEntry[], rates: ExchangeRates): SavingsCalculation {
  let totalUsdInEgp = 0
  let totalGoldInEgp = 0

  const breakdown = entries.map((entry) => {
    const usdValueInEgp = entry.assetType === "currency" ? entry.usdAmount * rates.usdToEgp : 0

    let goldValueInEgp = 0
    if (entry.assetType === "gold" && entry.goldGrams > 0) {
      const purityMultiplier = entry.goldKarat ? GOLD_PURITY_MULTIPLIERS[entry.goldKarat] : 1
      goldValueInEgp = entry.goldGrams * rates.goldPricePerGram * purityMultiplier
    }

    totalUsdInEgp += usdValueInEgp
    totalGoldInEgp += goldValueInEgp

    return {
      usdAmount: entry.usdAmount,
      usdValueInEgp,
      goldGrams: entry.goldGrams,
      goldValueInEgp,
      goldKarat: entry.goldKarat,
    }
  })

  return {
    totalUsdInEgp,
    totalGoldInEgp,
    totalValueInEgp: totalUsdInEgp + totalGoldInEgp,
    breakdown,
  }
}

export function formatEgpCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-EG", {
    style: "currency",
    currency: "EGP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatUsdCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
