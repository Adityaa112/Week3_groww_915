import { authClient, authConfig, AUTH_TOKEN_STORAGE_KEY, getAuthHeaders } from "./config";
import { extractBearerToken } from "./tokenUtils";

type LoginParams = {
  username?: string;
  password?: string;
};

export async function login(params?: LoginParams) {
  const response = await authClient.post(
    "/v1/api/auth/login",
    {
      username: params?.username ?? authConfig.staticUsername,
      password: params?.password ?? authConfig.staticPassword,
    },
    { headers: getAuthHeaders() }
  );

  const body = response.data ?? {};
  const authHeader = response.headers?.authorization ?? response.headers?.Authorization;
  const headerToken =
    typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : undefined;

  const token = extractBearerToken({
    headerAuthorization: headerToken,
    body,
  });

  if (typeof token === "string" && token.length > 0) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    console.log("[auth][login] bearer token:", token);
  }

  return { ...body, token };
}
