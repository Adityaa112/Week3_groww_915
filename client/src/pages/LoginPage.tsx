import { FormEvent, useState } from "react";
import axios from "axios";
import { authConfig, AUTH_TOKEN_STORAGE_KEY, login, preAuthHandshake, validateOtp } from "@/services/api/auth";

type LoginPageProps = {
  onLoginSuccess: (token: string) => void;
};

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState(authConfig.staticUsername);
  const [password, setPassword] = useState(authConfig.staticPassword);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"requestOtp" | "validateOtp">("requestOtp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("Use your username/password, then complete OTP authentication.");

  function getErrorMessage(err: unknown) {
    if (axios.isAxiosError(err)) {
      const apiMessage =
        (err.response?.data as { message?: string } | undefined)?.message ??
        (err.response?.data as { error?: string } | undefined)?.error;
      if (apiMessage) return apiMessage;
      if (err.response) return `Request failed (${err.response.status})`;
      return err.message;
    }
    if (err instanceof Error) return err.message;
    return "Unknown error";
  }

  async function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      // Handshake is best-effort: some environments reject it even when login works.
      try {
        await preAuthHandshake();
      } catch (err) {
        console.warn("preAuthHandshake failed, continuing login flow:", getErrorMessage(err));
      }

      await login({ username, password });
      setStep("validateOtp");
      setInfo("OTP sent. Enter OTP to complete login.");
    } catch (err) {
      setError(`Unable to request OTP: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleValidateOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await validateOtp({ username, otp });
      const token =
        response?.data?.token ??
        response?.token ??
        response?.data?.accessToken ??
        response?.accessToken;
      const storedToken = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

      if (typeof token === "string" && token.length > 0) {
        onLoginSuccess(token);
        return;
      }
      if (storedToken) {
        onLoginSuccess(storedToken);
        return;
      }
      throw new Error("Bearer token missing in OTP response");
    } catch (err) {
      setError(`OTP validation failed: ${getErrorMessage(err)}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "radial-gradient(circle at 20% 20%, rgba(0, 200, 124, 0.12), transparent 40%), radial-gradient(circle at 80% 80%, rgba(56, 139, 253, 0.12), transparent 45%), var(--bg-void)",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          background: "var(--bg-panel)",
          padding: "24px",
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.25)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            marginBottom: "6px",
          }}
        >
          Groww-915 Login
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "12px" }}>{info}</p>

        {step === "requestOtp" ? (
          <form onSubmit={handleRequestOtp} style={{ display: "grid", gap: "12px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11px", color: "var(--text-secondary)" }}>
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                placeholder="Enter username"
                required
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>
            <label style={{ display: "grid", gap: "6px", fontSize: "11px", color: "var(--text-secondary)" }}>
              Password
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                type="password"
                required
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                border: "1px solid transparent",
                borderRadius: "var(--radius)",
                background: "var(--green)",
                color: "#03160f",
                padding: "10px 12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              {loading ? "Requesting OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleValidateOtp} style={{ display: "grid", gap: "12px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "11px", color: "var(--text-secondary)" }}>
              OTP
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.trim())}
                placeholder="Enter OTP"
                required
                style={{
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-primary)",
                  padding: "10px 12px",
                  borderRadius: "var(--radius)",
                  fontFamily: "var(--font-mono)",
                }}
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                border: "1px solid transparent",
                borderRadius: "var(--radius)",
                background: "var(--green)",
                color: "#03160f",
                padding: "10px 12px",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              {loading ? "Validating..." : "Login"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setStep("requestOtp");
                setOtp("");
                setError("");
                setInfo("Use your username/password, then complete OTP authentication.");
              }}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                background: "transparent",
                color: "var(--text-primary)",
                padding: "10px 12px",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
              }}
            >
              Back
            </button>
          </form>
        )}

        {error ? (
          <p style={{ marginTop: "12px", color: "var(--red)", fontSize: "12px" }}>{error}</p>
        ) : null}
      </div>
    </div>
  );
}
