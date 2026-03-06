import { create } from "zustand";
import { fetchDashboardConfig, DashboardFeature } from "@/services/api/dashboard/dashboardConfigService";

type DashboardState = {
  features: DashboardFeature[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  features: [],
  loading: false,
  loaded: false,
  error: null,

  loadDashboard: async () => {
    const { loaded, loading } = get();

    // Prevent duplicate API calls
    if (loaded || loading) return;

    try {
      set({ loading: true });

      const features = await fetchDashboardConfig();

      set({
        features,
        loading: false,
        loaded: true,
      });
    } catch (err) {
      console.error("[dashboard] load failed", err);

      set({
        error: "Failed to load dashboard config",
        loading: false,
      });
    }
  },
}));