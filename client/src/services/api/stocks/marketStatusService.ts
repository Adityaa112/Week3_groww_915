import { authClient, getAuthHeaders } from "@/services/api/auth/config";
import axios from "axios";
export interface MarketStatusItem {
  marketStatus?: string;
  market_status?: string;
  status?: string;
  exchange?: string;
  exchangeName?: string;
  exchange_name?: string;
}

interface MarketStatusResponse {
  market_status?: MarketStatusItem[];
  marketStatus?: MarketStatusItem[];
  data?: {
    market_status?: MarketStatusItem[];
    marketStatus?: MarketStatusItem[];
  };
}

export interface ParsedMarketStatus {
  exchange: string;
  status: "Open" | "Close";
}

const MARKET_STATUS_ENDPOINTS = [
  "/v2/api/stocks/market-status",
  "/v1/api/stocks/market-status",
] as const;
let hasLoggedMissingMarketStatusEndpoint = false;

function extractMarkets(payload: MarketStatusResponse): MarketStatusItem[] {
  return (
    payload?.market_status ??
    payload?.marketStatus ??
    payload?.data?.market_status ??
    payload?.data?.marketStatus ??
    []
  );
}

export async function fetchMarketStatus(): Promise<ParsedMarketStatus[]> {
  let markets: MarketStatusItem[] = [];
  let lastError: unknown = null;
  let allEndpointsNotFound = true;

  for (const endpoint of MARKET_STATUS_ENDPOINTS) {
    try {
      const response = await authClient.post<MarketStatusResponse>(endpoint, {}, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      });

      markets = extractMarkets(response.data);
      break;
    } catch (error) {
      lastError = error;

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        continue;
      }

      allEndpointsNotFound = false;
      throw error;
    }
  }

  if (!markets.length && lastError && allEndpointsNotFound) {
    if (!hasLoggedMissingMarketStatusEndpoint) {
      console.warn(
        "[market-status] endpoint not available in this environment. Tried:",
        MARKET_STATUS_ENDPOINTS.join(", ")
      );
      hasLoggedMissingMarketStatusEndpoint = true;
    }
    return [];
  }

  return markets.map((m) => {
    const text = (m.marketStatus ?? m.market_status ?? m.status ?? "Close").toLowerCase();

    let status: "Open" | "Close" = "Close";

    if (text.includes("open")) status = "Open";
    if (text.includes("close")) status = "Close";

    return {
      exchange: m.exchange ?? m.exchangeName ?? m.exchange_name ?? "UNKNOWN",
      status,
    };
  });
}
