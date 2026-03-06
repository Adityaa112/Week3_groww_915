import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "@/store/dashboard.store";
import { useMarketStatusStore } from "@/store";

export function Header2() {
  const navigate = useNavigate();

  const { features, loadDashboard, loading } = useDashboardStore();
  const markets = useMarketStatusStore((s) => s.markets);
  const loadMarketStatus = useMarketStatusStore((s) => s.loadMarketStatus);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadMarketStatus();
    const interval = setInterval(loadMarketStatus, 30000);
    return () => clearInterval(interval);
  }, [loadMarketStatus]);

  const handleFeatureClick = (featureName: string) => {
    const name = featureName.toLowerCase();

    if (name === "watchlist") {
      navigate("/watchlist");
    }

    if (name === "portfolio") {
      navigate("/portfolio");
    }

    if (name === "orders") {
      navigate("/orders");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 24px",
        background: "var(--bg-panel)",
        borderBottom: "1px solid var(--border)",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {features.length > 0 ? (
          features.map((feature) => (
            <button
              key={feature.name}
              onClick={() => handleFeatureClick(feature.name)}
              style={{
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                borderRadius: "var(--radius)",
                padding: "4px 10px",
                fontSize: "10px",
                fontFamily: "var(--font-mono)",
                cursor: "pointer",
              }}
            >
              {feature.name}
            </button>
          ))
        ) : (
          <span
            style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {loading ? "Loading dashboard..." : "Dashboard unavailable"}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {markets.length > 0 ? (
          markets.map((m) => (
            <span
              key={m.exchange}
              style={{
                fontSize: "10px",
                fontWeight: "600",
                fontFamily: "var(--font-mono)",
                color: m.status === "Open" ? "var(--green)" : "var(--red)",
              }}
            >
              - {m.exchange} {m.status.toUpperCase()}
            </span>
          ))
        ) : (
          <span
            style={{
              fontSize: "10px",
              fontWeight: "600",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
            }}
          >
            Market status unavailable
          </span>
        )}
      </div>
    </div>
  );
}