import { useMemo } from "react"

function buildPages(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, total])
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) pages.add(p)
  }

  const sorted = Array.from(pages).sort((a, b) => a - b)
  const out = []
  for (let i = 0; i < sorted.length; i++) {
    out.push(sorted[i])
    if (i < sorted.length - 1 && sorted[i + 1] - sorted[i] > 1) out.push("…")
  }
  return out
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / (itemsPerPage || 1)))
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const pages = useMemo(
    () => buildPages(currentPage, totalPages),
    [currentPage, totalPages]
  )

  if (totalPages <= 1) return null

  const baseBtn =
    "inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold shadow-sm transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50"

  const navBtn =
    `${baseBtn} border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200`

  const numBtn =
    `${baseBtn} border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200`

  const activeNumBtn =
    `${baseBtn} border-[#0097a7] bg-[#0097a7] text-white hover:bg-[#007e89] focus:ring-[#0097a7]/25`

  return (
    <div className="flex flex-col gap-3 mt-6 sm:flex-row sm:items-center sm:justify-center">
      <button
        type="button"
        className={navBtn}
        disabled={!canPrev}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Prev
      </button>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`dots-${idx}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className={p === currentPage ? activeNumBtn : numBtn}
              aria-current={p === currentPage ? "page" : undefined}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        type="button"
        className={navBtn}
        disabled={!canNext}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>

      <div className="text-center text-sm text-slate-500 sm:ml-3">
        Page <span className="font-semibold text-slate-700">{currentPage}</span> of{" "}
        <span className="font-semibold text-slate-700">{totalPages}</span>
      </div>
    </div>
  )
}
