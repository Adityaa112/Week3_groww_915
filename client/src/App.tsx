import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { Header } from "@/shared/components/Header";
import { NotificationStack } from "@/shared/components/NotificationStack";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { PortfolioPage } from "@/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "@/features/order-book/OrderBookPage";
import { AUTH_TOKEN_STORAGE_KEY } from "@/services/api/auth";
import { AUTH_EXPIRED_EVENT } from "@/services/api/auth/config";
import { Header2 } from "@/shared/components/Header2";
import WatchlistPage from "@/pages/WatchlistPage";
import WatchlistDetailPage from "@/pages/WatchlistDetailPage";

function TradingApp({ onLogout }: { onLogout: () => void }) {
  useWebSocket();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg-void)",
      }}
    >
      <Header />
      <Header2 />

      <main
        style={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/orderbook" element={<OrderBookPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/watchlist/:id" element={<WatchlistDetailPage />} />
        </Routes>
      </main>

      <footer
        style={{
          padding: "4px 20px",
          borderTop: "1px solid var(--border)",
          background: "var(--bg-panel)",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.5px",
          flexShrink: 0,
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span>ws://localhost:8080</span>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span>Groww-915 - Simulated data - for learning only</span>

          <button
            onClick={onLogout}
            style={{
              cursor: "pointer",
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              borderRadius: "var(--radius)",
              padding: "2px 8px",
              fontSize: "10px",
              fontFamily: "var(--font-mono)",
            }}
          >
            Logout
          </button>
        </div>
      </footer>

      <NotificationStack />
    </div>
  );
}

export default function App() {
  const [token, setToken] = useState<string>(
    () => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? ""
  );

  useEffect(() => {
    const handleAuthExpired = () => {
      setToken("");
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, []);

  const isAuthenticated = useMemo(() => token.length > 0, [token]);

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(nextToken) => {
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, nextToken);
          setToken(nextToken);
        }}
      />
    );
  }

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <TradingApp
            onLogout={() => {
              localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
              setToken("");
            }}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}