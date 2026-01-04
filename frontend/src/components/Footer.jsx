export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-sm text-slate-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Nobel Prize Explorer
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a
            href="https://www.nobelprize.org/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
          >
            Nobel Prize
          </a>
          <a
            href="https://www.dbpedia.org/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
          >
            DBpedia
          </a>
          <a
            href="https://www.wikidata.org/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
          >
            Wikidata
          </a>
        </div>
      </div>
    </footer>
  )
}
