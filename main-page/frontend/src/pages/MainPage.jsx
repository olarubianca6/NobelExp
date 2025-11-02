import { useEffect, useState } from "react";
import { useNobelStore } from "../store/nobelStore";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";

export default function MainPage() {
  const { prizes, total, loading, error, fetchNobelPrizes, fetchTotalCount } = useNobelStore();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(18);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    fetchTotalCount(category);
  }, [fetchTotalCount, category]);

  useEffect(() => {
    const offset = (page - 1) * perPage;
    fetchNobelPrizes(perPage, offset, category);
  }, [page, perPage, category, fetchNobelPrizes]);

  if (loading) return <div className="text-center py-10 text-gray-500">Loading…</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="p-10 max-w-full mx-auto">
       <div className="flex flex-wrap gap-4 mb-8 items-center justify-center">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-48 capitalize"
        >
          <option value="all">All Categories</option>
          <option value="http://data.nobelprize.org/terms/Chemistry">Chemistry</option>
          <option value="http://data.nobelprize.org/terms/Physics">Physics</option>
          <option value="http://data.nobelprize.org/terms/Literature">Literature</option>
          <option value="http://data.nobelprize.org/terms/Peace">Peace</option>
          <option value="http://data.nobelprize.org/terms/Physiology_or_Medicine">
            Physiology/Medicine
          </option>
          <option value="http://data.nobelprize.org/terms/Economic_Sciences">
            Economic Sciences
          </option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
        >
          {[18, 24, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {prizes.length > 0 ? (
          prizes.map((p) => <ItemCard key={p.id} prize={p} />)
        ) : (
          <p className="text-center text-gray-500 col-span-full">No prizes found.</p>
        )}
      </section>

      <div className="mt-10">
        <Pagination
          currentPage={page}
          totalItems={total}
          itemsPerPage={perPage}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
