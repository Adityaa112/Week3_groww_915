import { useEffect, useState } from "react";
import { fetchWatchlists, Watchlist } from "@/services/watchlistService";
import { useNavigate } from "react-router-dom";

export default function WatchlistPage() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWatchlists = async () => {
      try {
        const data = await fetchWatchlists();
        setWatchlists(data.userDefinedWatchlists ?? []);
      } catch (error) {
        console.error("[watchlist] list load failed", error);
        setWatchlists([]);
      }
    };

    loadWatchlists();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Watchlists</h2>

      {watchlists.map((w) => (
        <div
          key={w.watchlistId}
          onClick={() => navigate(`/watchlist/${w.watchlistId}`)}
          style={{
            padding: "12px",
            marginBottom: "10px",
            border: "1px solid #444",
            cursor: "pointer",
          }}
        >
          {w.watchlistName}
        </div>
      ))}
    </div>
  );
}