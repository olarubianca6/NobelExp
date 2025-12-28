import { useEffect } from "react";
import { useNobelStore } from "../store/nobelStore";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Statistics() {
  const { stats, loading, error, fetchStatistics } = useNobelStore();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  if (loading) return <p className="text-center py-10">Loading statistics…</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;
  if (!stats) return null;

  const chartData = Object.entries(stats.categories).map(([cat, count]) => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    value: count,
  }));

  const COLORS = [
    "#00ACC1",
    "#26C6DA",
    "#4DD0E1",
    "#80DEEA",
    "#B2EBF2",
    "#0097A7",
  ];

  return (
    <div className="stats-container max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-semibold text-primary text-center mb-8">
        Nobel Prize Statistics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-lg">
        <div className="bg-primaryLight text-gray-800 px-6 py-4 rounded-xl shadow-sm text-center border border-primary/30">
          <p className="text-2xl font-semibold">🏆 {stats.totalPrizes}</p>
          <p className="text-gray-600 text-sm mt-1">Total Prizes</p>
        </div>
        <div className="bg-primaryLight text-gray-800 px-6 py-4 rounded-xl shadow-sm text-center border border-primary/30">
          <p className="text-2xl font-semibold">👩‍🔬 {stats.totalLaureates}</p>
          <p className="text-gray-600 text-sm mt-1">Total Laureates</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-center text-primary mb-6">
        Prizes per Category
      </h2>

      <div className="flex justify-center mb-10">
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(1)}%`
                }
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#fff"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} prizes`, name]}
                contentStyle={{
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                }}
              />
              <Legend verticalAlign="bottom" height={40} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {chartData.map((cat) => (
          <li
            key={cat.name}
            className="bg-white border border-primaryLight rounded-md p-4 shadow-sm flex justify-between items-center hover:shadow-md transition"
          >
            <span className="capitalize font-medium text-gray-700">
              {cat.name}
            </span>
            <span className="font-semibold text-primary">{cat.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
