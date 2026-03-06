import { create } from "zustand";
import { fetchMarketStatus, ParsedMarketStatus } from "@/services/api/stocks/marketStatusService";
import axios from "axios";

type MarketStatusState = {
  markets: ParsedMarketStatus[];
  loading: boolean;
  loadMarketStatus: () => Promise<void>;
};

export const useMarketStatusStore = create<MarketStatusState>((set) => ({
  markets: [],
  loading: false,

  loadMarketStatus: async () => {
    try {
      set({ loading: true });

      const markets = await fetchMarketStatus();

      set({
        markets,
        loading: false,
      });
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 412) {
        console.warn("[market-status] 412 from API. Session/token or request precondition may have expired.");
      } else {
        console.error("Market status error", err);
      }
      set({ loading: false });
    }
  },
}));
