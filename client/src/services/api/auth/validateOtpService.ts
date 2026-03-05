import { authClient, authConfig, AUTH_TOKEN_STORAGE_KEY, getAuthHeaders } from "./config";
import { extractBearerToken } from "./tokenUtils";

type ValidateOtpParams = {
  username?: string;
  otp: string | number;
};

export async function validateOtp(params: ValidateOtpParams) {
  const otpNumber = Number(params.otp);
  if (!Number.isFinite(otpNumber)) {
    throw new Error("OTP must be numeric");
  }

  const response = await authClient.post(
    "/v2/api/auth/validate-otp",
    {
      username: params.username ?? authConfig.staticUsername,
      otp: otpNumber,
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
    console.log("[auth][validate-otp] bearer token:", token);
  }

  // Temporary diagnostic logs to verify backend token location.
  console.log("[auth][validate-otp] keys:", Object.keys(body as Record<string, unknown>));
  console.log("[auth][validate-otp] token found:", Boolean(token));

  return { ...body, token };
}
