import { useEffect, useState } from "react";
import { fetchNobelPrizes } from "../services/mainService";

export default function Statistics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const data = await fetchNobelPrizes();

      const categories = {};
      let totalLaureates = 0;

      data.forEach((item) => {
        categories[item.category] = (categories[item.category] || 0) + 1;
        totalLaureates += item.laureates.length;
      });

      const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]);
      const highestCount = sortedCategories[0][1];

      setStats({
        totalPrizes: data.length,
        totalLaureates,
        categories,
      });
    }

    fetchStats();
  }, []);

  const formatCategory = (uri) => {
    return uri.split("/").pop().replace(/_/g, " ");
  };

  if (!stats) return <p className="stats-loading">Loading...</p>;

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