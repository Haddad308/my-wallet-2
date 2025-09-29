import type { ApiResponse, ExchangeRates } from "./types";

const API_KEY = "sk_da29aB735e31a71454420a852Fc3C91ea82E073A927F1098";
const API_URL =
  "https://gold.g.apised.com/v1/latest?metals=XAU,XAG,XPT,XPD&base_currency=EGP&currencies=EUR,KWD,GBP,USD&weight_unit=gram";

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "x-api-key": API_KEY,
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    // Convert USD rate to EGP (API gives EGP to USD, we need USD to EGP)
    const usdToEgp = 1 / data.data.currency_rates.USD;

    return {
      usdToEgp,
      goldPricePerGram: data.data.metal_prices.XAU.low,
      timestamp: data.data.timestamp,
    };
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Fallback rates
    return {
      usdToEgp: 48.33, // Approximate fallback
      goldPricePerGram: 5843.27, // Approximate fallback
      timestamp: Date.now(),
    };
  }
}
