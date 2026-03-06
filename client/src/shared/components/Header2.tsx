import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard.store";

export function Header2() {
  const { features, loadDashboard, loading } = useDashboardStore();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Print features when they change
  useEffect(() => {
    if (features.length > 0) {
      console.log("Dashboard Features:", features);

      features.forEach((f, i) => {
        console.log(`Feature ${i + 1}:`, f.name);
      });
    }
  }, [features]);

  if (loading) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "6px",
        padding: "6px 24px",
        background: "var(--bg-panel)",
        borderBottom: "1px solid var(--border)",
        flexWrap: "wrap",
      }}
    >
      {features.map((feature) => (
        <button
          key={feature.name}
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
      ))}
    </div>
  );
}