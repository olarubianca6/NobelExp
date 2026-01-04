import { Link } from "react-router-dom"
import { useMemo } from "react"
import { useRdfStore } from "../store/rdfStore"

const btnPrimary =
  "rounded-xl bg-white text-[#0097a7] px-3 py-2 text-sm font-semibold transition hover:outline-none hover:ring-3 hover:ring-[#0097a7]/25"
const btnGhost =
  "rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"

function laureateRouteFromUri(uri) {
  const id = uri?.split("/").pop()
  return id ? `/laureates/${id}` : "#"
}

export default function ItemCard({ prize }) {
  const { likes, addLike, removeLike } = useRdfStore()

  const liked = useMemo(
    () => (likes || []).some((l) => l.object === prize?.id),
    [likes, prize?.id]
  )

  const title = useMemo(() => {
    const cat = prize?._categoryLabel || "Nobel Prize"
    const year = prize?.year || ""
    return `${cat} (${year})`
  }, [prize?._categoryLabel, prize?.year])

  const toggleLike = async () => {
    if (!prize?.id) return
    if (liked) return removeLike(prize.id)
    return addLike({ objectUri: prize.id, kind: "prize" })
  }

  return (
    <article
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      prefix="schema: https://schema.org/"
      typeof="schema:Award"
      about={prize?.id}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900" property="schema:name">
            {title}
          </h3>

          <div className="mt-1 text-sm text-slate-600">
            <span className="font-semibold">Year:</span>{" "}
            <span property="schema:awardYear">{prize?.year}</span>
            {"  ·  "}
            <span className="font-semibold">Category:</span>{" "}
            <span property="schema:category">{prize?._categoryLabel}</span>
          </div>

          {prize?.id && (
            <a
              className="mt-2 inline-block text-sm font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
              href={prize.id}
              target="_blank"
              rel="noreferrer"
              property="schema:url"
            >
              Open Nobel resource
            </a>
          )}
        </div>

        <button type="button" onClick={toggleLike} className={liked ? btnGhost : btnPrimary}>
          {liked ? "Saved" : "Save"}
        </button>
      </div>

      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-700 mb-2">Laureates</div>

        <ul className="space-y-1">
          {(prize?.laureates || []).map((l) => (
            <li
              key={l.id}
              className="text-sm text-slate-700"
              typeof="schema:Person"
              resource={l.id}
            >
              <Link
                to={laureateRouteFromUri(l.id)}
                className="font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
                property="schema:recipient"
                resource={l.id}
              >
                <span property="schema:name">{l.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
