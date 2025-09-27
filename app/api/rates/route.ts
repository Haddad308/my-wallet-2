import { NextResponse } from "next/server"
import { fetchExchangeRates } from "@/lib/api"

export async function GET() {
  try {
    const rates = await fetchExchangeRates()
    return NextResponse.json(rates)
  } catch (error) {
    console.error("Error in rates API:", error)
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 })
  }
}
