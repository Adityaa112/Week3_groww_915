import { authClient, getAuthHeaders, AUTH_TOKEN_STORAGE_KEY } from "@/services/api/auth/config";

export interface DashboardFeature {
  name: string;
}

export interface DashboardConfigResponse {
  dashboard: {
    features: DashboardFeature[];
  };
}

export async function fetchDashboardConfig(): Promise<DashboardFeature[]> {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  // Prevent API call if token is not ready
  if (!token) {
    console.warn("[dashboard] token not found, skipping request");
    return [];
  }

  const response = await authClient.get<DashboardConfigResponse>(
    "/v1/api/profile/dashboard-config",
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    }
  );

  return response.data?.dashboard?.features ?? [];
}