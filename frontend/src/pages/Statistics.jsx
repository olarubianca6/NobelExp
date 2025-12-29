import { useEffect, useMemo, useState } from "react"
import { useNobelStore } from "../store/nobelStore"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "all" },
  { label: "Chemistry", value: "http://data.nobelprize.org/terms/Chemistry" },
  { label: "Physics", value: "http://data.nobelprize.org/terms/Physics" },
  { label: "Literature", value: "http://data.nobelprize.org/terms/Literature" },
  { label: "Peace", value: "http://data.nobelprize.org/terms/Peace" },
  { label: "Physiology/Medicine", value: "http://data.nobelprize.org/terms/Physiology_or_Medicine" },
  { label: "Economic Sciences", value: "http://data.nobelprize.org/terms/Economic_Sciences" },
]

const COLORS = ["#00ACC1", "#26C6DA", "#4DD0E1", "#80DEEA", "#B2EBF2", "#0097A7"]

export default function Statistics() {
  const { stats, loading, error, fetchStatistics } = useNobelStore()

  const [category, setCategory] = useState("all")
  const [yearFrom, setYearFrom] = useState("")
  const [yearTo, setYearTo] = useState("")
  const [mode, setMode] = useState("prizes")

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  const appliedCategory = stats?.filters?.category || "all"
  const appliedYearFrom = stats?.filters?.yearFrom || ""
  const appliedYearTo = stats?.filters?.yearTo || ""

  const dataSource = useMemo(() => {
    if (!stats) return {}
    if (mode === "laureates" && stats.laureatesPerCategory) return stats.laureatesPerCategory
    return stats.categories || {}
  }, [stats, mode])

  const chartData = useMemo(() => {
    return Object.entries(dataSource).map(([cat, count]) => ({
      name: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: Number(count) || 0,
    }))
  }, [dataSource])

  const appliedCategoryLabel = useMemo(() => {
    if (appliedCategory === "all") return "All categories"
    const opt = CATEGORY_OPTIONS.find((o) => o.value === appliedCategory)
    return opt?.label || "Selected category"
  }, [appliedCategory])

  const selectedValue = useMemo(() => {
    if (appliedCategory === "all") return 0
    return chartData.reduce((acc, x) => acc + (Number(x.value) || 0), 0)
  }, [appliedCategory, chartData])

  const applyFilters = async () => {
    await fetchStatistics({
      category,
      yearFrom: yearFrom.trim(),
      yearTo: yearTo.trim(),
    })
  }

  const resetFilters = async () => {
    setCategory("all")
    setYearFrom("")
    setYearTo("")
    setMode("prizes")
    await fetchStatistics()
  }

  if (loading) return <p className="text-center py-10">Loading statistics…</p>
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>
  if (!stats) return null

  const showLaureatesToggle = !!stats.laureatesPerCategory
  const showPieChart = appliedCategory === "all" && chartData.length > 1

  const rangeText =
    appliedYearFrom || appliedYearTo
      ? ` in selected range${appliedYearFrom ? ` (from ${appliedYearFrom}` : ""}${appliedYearTo ? `${appliedYearFrom ? " " : " ("}to ${appliedYearTo}` : ""}${appliedYearFrom || appliedYearTo ? ")" : ""}`
      : ""

  return (
    <div className="stats-container max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-semibold text-primary text-center mb-8">
        Nobel Prize Statistics
      </h1>

      <div className="bg-white border border-primaryLight rounded-xl shadow-sm p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Category</span>
            <select
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Year from</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              placeholder="e.g. 1950"
              inputMode="numeric"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-600">Year to</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              placeholder="e.g. 2024"
              inputMode="numeric"
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-4">
          <div className="flex gap-2">
            <button 
              className="w-full rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition
                hover:bg-[#007e89] active:scale-[0.99]
                focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0097a7]"
                type="button" 
                onClick={applyFilters}
              >
              Apply
            </button>
            <button
              className="w-full rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition
                       hover:bg-[#007e89] active:scale-[0.99]
                       focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0097a7]"
              type="button"
              onClick={resetFilters}
              style={{ opacity: 0.9 }}
            >
              Reset
            </button>
          </div>

          {showLaureatesToggle && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Chart:</span>
              <button
                type="button"
                className={mode === "prizes" ? "w-full rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition hover:bg-[#007e89] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0097a7]" : "text-[#0097a7] no-underline hover:text-[#007e89] cursor-pointer font-semibold"}
                onClick={() => setMode("prizes")}
              >
                Prizes
              </button>
              <button
                type="button"
                className={mode === "laureates" ? "w-full rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition hover:bg-[#007e89] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0097a7]" : "text-[#0097a7] no-underline hover:text-[#007e89] cursor-pointer font-semibold"}
                onClick={() => setMode("laureates")}
              >
                Laureates
              </button>
            </div>
          )}
        </div>
      </div>

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
        {mode === "laureates" ? "Laureates per Category" : "Prizes per Category"}
      </h2>

      {showPieChart ? (
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
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} ${mode === "laureates" ? "laureates" : "prizes"}`,
                    name,
                  ]}
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
      ) : (
        <div className="flex justify-center mb-10">
          <div className="w-full bg-white border border-primaryLight rounded-xl shadow-sm p-6 text-center">
            <p className="text-sm text-gray-600 mb-1">{appliedCategoryLabel}</p>
            <p className="text-4xl font-semibold text-primary">{selectedValue}</p>
            <p className="text-gray-600 text-sm mt-1">
              {mode === "laureates" ? "Laureates" : "Prizes"}
              {rangeText}
            </p>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {chartData.map((cat) => (
          <li
            key={cat.name}
            className="bg-white border border-primaryLight rounded-md p-4 shadow-sm flex justify-between items-center hover:shadow-md transition"
          >
            <span className="capitalize font-medium text-gray-700">{cat.name}</span>
            <span className="font-semibold text-primary">{cat.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
