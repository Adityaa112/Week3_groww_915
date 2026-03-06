import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchWatchlistScrips, Scrip } from "@/services/watchlistService";

export default function WatchlistDetailPage() {
  const { id } = useParams();
  const [scrips, setScrips] = useState<Scrip[]>([]);

  useEffect(() => {
    const loadScrips = async () => {
      try {
        const data = await fetchWatchlistScrips(Number(id));
        setScrips(data.scrips ?? []);
      } catch (error) {
        console.error("[watchlist] scrip load failed", error);
        setScrips([]);
      }
    };

    loadScrips();
  }, [id]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stocks</h2>

      {scrips.map((s) => (
        <div
          key={s.scripToken}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "8px",
            borderBottom: "1px solid #444",
          }}
        >
          <span>{s.symbolName}</span>
          <span>{s.lastTradedPrice}</span>
        </div>
      ))}
    </div>
  );
}