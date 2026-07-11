import { supabase } from "./supabase";

// Asks the update-prices edge function to refresh CMPs from Yahoo Finance.
// The function is a no-op when prices are under 5 minutes old. Failures are
// swallowed so dashboards fall back to the last stored prices.
export async function refreshLivePrices(clientId: string): Promise<void> {
  try {
    await supabase.functions.invoke("update-prices", {
      body: { client_id: clientId },
    });
  } catch {
    // Prices may be delayed; dashboards show the last known CMP.
  }
}
