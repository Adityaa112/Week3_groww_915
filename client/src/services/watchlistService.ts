import { authClient, getAuthHeaders } from "@/services/api/auth/config";

export interface Watchlist {
  watchlistId: number;
  watchlistName: string;
}

export interface WatchlistResponse {
  userDefinedWatchlists: Watchlist[];
  predefinedWatchlists: Watchlist[];
  defaultWatchlistId: number;
}

export interface Scrip {
  scripToken: string;
  symbolName: string;
  lastTradedPrice: number;
}

export interface WatchlistScripResponse {
  scrips: Scrip[];
  scripsCount: number;
}

/*
------------------------------------
GET WATCHLISTS
------------------------------------
GET /v1/api/watchlist/list
*/
export const fetchWatchlists = async (): Promise<WatchlistResponse> => {
  const response = await authClient.get("/v1/api/watchlist/list", {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

/*
------------------------------------
GET WATCHLIST SCRIPS
------------------------------------
POST /v1/api/watchlist/scrips/list
Body:
{
  watchlistId
}
*/
export const fetchWatchlistScrips = async (
  watchlistId: number
): Promise<WatchlistScripResponse> => {
  const response = await authClient.post(
    "/v1/api/watchlist/scrips/list",
    { watchlistId },
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};