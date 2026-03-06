import { useMemo, useState } from "react";
import { useWebSocket } from "@/shared/hooks/useWebSocket";
import { Header } from "@/shared/components/Header";
import { NotificationStack } from "@/shared/components/NotificationStack";
import { DashboardPage } from "@/pages/DashboardPage";
import { LoginPage } from "@/pages/LoginPage";
import { PortfolioPage } from "@/features/portfolio-overview/PortfolioPage";
import { OrderBookPage } from "@/features/order-book/OrderBookPage";
import { WatchlistPage } from "@/features/dashboard/WatchlistPage";
import { useUIStore } from "@/store/ui.store";
import { AUTH_TOKEN_STORAGE_KEY } from "@/services/api/auth";
import { Header2 } from "@/shared/components/Header2";

function TradingApp({ onLogout }: { onLogout: () => void }) {
  useWebSocket();

  const activeTab = useUIStore((s) => s.activeTab);

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "portfolio":
        return <PortfolioPage />;
      case "orderbook":
        return <OrderBookPage />;
      case "watchlist":
        return <WatchlistPage />;
      default:
        return <DashboardPage />;
    }
  };

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
        {renderTab()}
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
  const [token, setToken] = useState<string>(() => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) ?? "");

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
    <TradingApp
      onLogout={() => {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setToken("");
      }}
    />
  );
}
