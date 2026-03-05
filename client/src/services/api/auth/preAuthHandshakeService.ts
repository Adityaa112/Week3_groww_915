import { authClient, authConfig, getAuthHeaders } from "./config";

export async function preAuthHandshake() {
  const response = await authClient.post(
    "/v1/api/auth/pre-auth-handshake",
    { devicePublicKey: authConfig.devicePublicKey },
    { headers: getAuthHeaders() }
  );
  return response.data;
}
