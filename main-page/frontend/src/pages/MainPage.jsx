import { useEffect, useMemo, useState } from "react";
import { useNobelStore } from "../store/nobelStore";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";

export default function MainPage() {
  const { prizes, loading, error, fetchNobelPrizes } = useNobelStore();
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState("year-desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetchNobelPrizes();
  }, [fetchNobelPrizes]);

  useEffect(() => {
    let list = [...prizes];

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const inCat = p._categoryLabel.toLowerCase().includes(q);
        const inYear = String(p.year).toLowerCase().includes(q);
        const inLaurs = (p.laureates || []).some((l) =>
          l.name.toLowerCase().includes(q)
        );
        return inCat || inYear || inLaurs;
      });
    }

    if (categoryFilter !== "all") {
      list = list.filter(
        (p) => p._categoryLabel.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    switch (sort) {
      case "year-asc":
        list.sort((a, b) => Number(a.year) - Number(b.year));
        break;
      case "year-desc":
        list.sort((a, b) => Number(b.year) - Number(a.year));
        break;
      case "category-asc":
        list.sort((a, b) => a._categoryLabel.localeCompare(b._categoryLabel));
        break;
      case "category-desc":
        list.sort((a, b) => b._categoryLabel.localeCompare(a._categoryLabel));
        break;
      default:
        break;
    }

    setFiltered(list);
    setPage(1);
  }, [prizes, search, categoryFilter, sort]);

  const categories = useMemo(() => {
    const set = new Set((prizes || []).map((p) => p._categoryLabel));
    return ["all", ...Array.from(set).sort()];
  }, [prizes]);

  const total = filtered.length;
  const start = (page - 1) * perPage;
  const end = start + perPage;
  const pageItems = filtered.slice(start, end);

  if (loading) return <div className="main-loading">Loading…</div>;
  if (error) return <div className="main-error">{error}</div>;

  return (
    <div className="main-page">
      <div className="main-controls">
        <input
          className="control-input"
          placeholder="Search by category, year, or laureate…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="control-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="control-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="year-desc">Year ↓</option>
          <option value="year-asc">Year ↑</option>
          <option value="category-asc">Category A→Z</option>
          <option value="category-desc">Category Z→A</option>
        </select>

        <select
          className="control-select"
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}/page
            </option>
          ))}
        </select>
      </div>

      <section className="items-grid">
        {pageItems.map((p) => (
          <ItemCard key={p.id} prize={p} />
        ))}
      </section>

      <Pagination
        currentPage={page}
        totalItems={total}
        itemsPerPage={perPage}
        onPageChange={setPage}
      />
    </div>
  );
}
