import { useEffect, useMemo, useRef, useState } from "react"
import { useNobelStore } from "../store/nobelStore"
import { useRdfStore } from "../store/rdfStore"
import ItemCard from "../components/ItemCard"
import Pagination from "../components/Pagination"

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "all" },
  { label: "Chemistry", value: "http://data.nobelprize.org/terms/Chemistry" },
  { label: "Physics", value: "http://data.nobelprize.org/terms/Physics" },
  { label: "Literature", value: "http://data.nobelprize.org/terms/Literature" },
  { label: "Peace", value: "http://data.nobelprize.org/terms/Peace" },
  { label: "Physiology/Medicine", value: "http://data.nobelprize.org/terms/Physiology_or_Medicine" },
  { label: "Economic Sciences", value: "http://data.nobelprize.org/terms/Economic_Sciences" },
]

const LIMIT_OPTIONS = [
  { label: "6", value: "6" },
  { label: "12", value: "12" },
  { label: "18", value: "18" },
  { label: "24", value: "24" },
  { label: "50", value: "50" },
]

const inputCls =
  "mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15"

const btnPrimary =
  "rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition hover:bg-[#007e89] focus:outline-none focus:ring-4 focus:ring-[#0097a7]/25 disabled:opacity-50 disabled:hover:bg-[#0097a7] disabled:cursor-not-allowed"

const btnSecondary =
  "rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"

export default function MainPage() {
  const { prizes, total, loading, error, fetchNobelPrizes, fetchTotalCount } = useNobelStore()
  const { fetchLikes } = useRdfStore()

  const [category, setCategory] = useState("all")
  const [limit, setLimit] = useState("12")

  const [categoryDraft, setCategoryDraft] = useState("all")
  const [limitDraft, setLimitDraft] = useState("12")

  const [page, setPage] = useState(1)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const filtersRef = useRef(null)

  const perPage = useMemo(() => {
    const n = Number(limit)
    if (!Number.isFinite(n) || n <= 0) return 12
    return Math.min(n, 50)
  }, [limit])

  const offset = useMemo(() => (page - 1) * perPage, [page, perPage])

  useEffect(() => {
    fetchLikes()
  }, [fetchLikes])

  useEffect(() => {
    fetchTotalCount(category)
  }, [fetchTotalCount, category])

  useEffect(() => {
    fetchNobelPrizes(perPage, offset, category)
  }, [fetchNobelPrizes, perPage, offset, category])

  useEffect(() => {
    const onDown = (e) => {
      if (!filtersRef.current) return
      if (!filtersRef.current.contains(e.target)) setFiltersOpen(false)
    }
    if (filtersOpen) document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [filtersOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setFiltersOpen(false)
    }
    if (filtersOpen) document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [filtersOpen])

  const isDirty = categoryDraft !== category || limitDraft !== limit

  const applyFilters = () => {
    setPage(1)
    setCategory(categoryDraft)
    setLimit(limitDraft)
    setFiltersOpen(false)
  }

  const resetDraft = () => {
    setCategoryDraft("all")
    setLimitDraft("12")
  }

  const showPagination = total > perPage
  const from = total === 0 ? 0 : offset + 1
  const to = Math.min(offset + (prizes?.length || 0), total)

  return (
    <div
      className="max-w-full mx-auto px-5 md:px-20 py-6"
      prefix="schema: https://schema.org/"
      typeof="schema:CollectionPage"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Nobel Prize Explorer</h1>
          <p className="text-slate-600 mt-1">Browse prizes and save favorites (stored as RDF likes).</p>
          <p className="text-sm text-slate-500 mt-2">
            Showing <span className="font-medium text-slate-700">{from}</span>–{" "}
            <span className="font-medium text-slate-700">{to}</span> of{" "}
            <span className="font-medium text-slate-700">{total}</span>
          </p>
        </div>

        <div className="relative" ref={filtersRef}>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex items-center justify-center h-11 w-11 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition focus:outline-none focus:ring-4 focus:ring-slate-200"
            aria-label="Open filters"
            aria-expanded={filtersOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {filtersOpen && (
            <div className="absolute right-0 mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white shadow-lg p-4 z-50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Filters</p>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                  aria-label="Close"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select
                  className={inputCls}
                  value={categoryDraft}
                  onChange={(e) => setCategoryDraft(e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-slate-700">Limit</label>
                <select className={inputCls} value={limitDraft} onChange={(e) => setLimitDraft(e.target.value)}>
                  {LIMIT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" className={btnSecondary} onClick={resetDraft}>
                  Reset
                </button>
                <button type="button" className={btnPrimary} onClick={applyFilters} disabled={!isDirty}>
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center py-10 text-slate-600">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(prizes || []).map((p) => (
              <ItemCard key={p.id} prize={p} />
            ))}
          </div>

          {showPagination && (
            <Pagination
              currentPage={page}
              totalItems={total}
              itemsPerPage={perPage}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
