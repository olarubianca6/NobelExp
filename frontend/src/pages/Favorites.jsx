import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { useRdfStore } from "../store/rdfStore"

const linkCls = "font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"

function internalLinkForObject(uri) {
  const m = uri.match(/\/resource\/laureate\/(\d+)/)
  if (m) return `/laureates/${m[1]}`
  return null
}

export default function Favorites() {
  const { likes, loading, error, fetchLikes, removeLike } = useRdfStore()

  useEffect(() => {
    fetchLikes()
  }, [fetchLikes])

  const items = useMemo(() => likes || [], [likes])

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-10"
      prefix="schema: https://schema.org/ as: https://www.w3.org/ns/activitystreams# nexp: https://nobel-explorer.example/ns#"
      typeof="schema:CollectionPage"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Favorites</h1>
          <p className="text-slate-600 mt-1">Saved items stored in RDF (AS:Like)</p>
        </div>

      </div>

      {loading && <p className="text-center py-10 text-slate-600">Loading…</p>}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600">
          No favorites yet. Go save a prize and come back.
        </div>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((it, idx) => {
          const obj = it.object || ""
          const to = obj ? internalLinkForObject(obj) : null

          return (
            <li
              key={`${it.object}-${idx}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              typeof="as:Like"
            >
              <div className="text-xs text-slate-500">
                <span className="font-semibold">Kind:</span> {it.kind || "unknown"}
              </div>

              <div className="mt-2 break-words">
                <div className="text-sm text-slate-600 mb-1">Object</div>
                {to ? (
                  <Link to={to} className={linkCls} resource={obj}>
                    {obj}
                  </Link>
                ) : (
                  <a className={linkCls} href={obj} target="_blank" rel="noreferrer" resource={obj}>
                    {obj}
                  </a>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-500">
                <span className="font-semibold">Created:</span> {it.createdAt || "—"}
              </div>

              <button
                type="button"
                onClick={() => removeLike(obj)}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Remove
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
