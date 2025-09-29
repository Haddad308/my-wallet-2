import { NextResponse } from "next/server";
import { fetchExchangeRates } from "@/lib/api";

export async function GET() {
  try {
    const rates = await fetchExchangeRates();
    
    // Create response with proper cache control headers
    const response = NextResponse.json(rates);
    
    // Prevent caching to ensure fresh data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error("Error in rates API:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
