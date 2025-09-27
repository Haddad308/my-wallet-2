export type AssetType = "currency" | "gold"
export type GoldKarat = "18k" | "21k" | "22k" | "24k"

export interface SavingsEntry {
  id?: string
  assetType: AssetType
  usdAmount: number
  goldGrams: number
  goldKarat?: GoldKarat
  createdAt: Date
  updatedAt: Date
}

export interface ExchangeRates {
  usdToEgp: number
  goldPricePerGram: number
  timestamp: number
}

export interface ApiResponse {
  status: string
  data: {
    timestamp: number
    base_currency: string
    metal_prices: {
      XAU: {
        price: number
        change: number
        change_percentage: number
      }
    }
    currency_rates: {
      USD: number
    }
  }
}
