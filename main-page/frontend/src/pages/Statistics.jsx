import { useEffect } from "react";
import { useNobelStore } from "../store/nobelStore";

export default function Statistics() {
  const { prizes, stats, loading, error, fetchNobelPrizes, computeStats } = useNobelStore();

  useEffect(() => {
    (async () => {
      if (prizes.length === 0) {
        await fetchNobelPrizes();
      }
      computeStats();
    })();
  }, [fetchNobelPrizes, computeStats]);

  const formatCategory = (uri) => {
    return uri.split("/").pop().replace(/_/g, " ");
  };

  if (loading) return <p className="stats-loading">Loading…</p>;
  if (error) return <p className="stats-error">{error}</p>;
  if (!stats) return <p className="stats-loading">No data yet…</p>;

  return (
    <div className="stats-container">
      <h1 className="stats-title">Nobel Statistics</h1>

      <div className="stats-summary">
        <p className="stats-item">Total Prizes: {stats.totalPrizes}</p>
        <p className="stats-item">Total Laureates: {stats.totalLaureates}</p>
      </div>

      <h2 className="stats-subtitle">Prizes per Category</h2>
      <ul className="stats-list">
        {Object.entries(stats.categories).map(([cat, count]) => (
          <li key={cat} className="stats-list-item">
            {formatCategory(cat)}: {count}
          </li>
        ))}
      </ul>
    </div>
  );
}
