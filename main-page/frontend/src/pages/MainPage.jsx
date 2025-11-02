import { useEffect, useState } from "react";
import { useNobelStore } from "../store/nobelStore";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";

export default function MainPage() {
  const { prizes, total, loading, error, fetchNobelPrizes, fetchTotalCount } = useNobelStore();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(18);

  useEffect(() => {
    fetchTotalCount();
  }, [fetchTotalCount]);

  useEffect(() => {
    const offset = (page - 1) * perPage;
    fetchNobelPrizes(perPage, offset);
  }, [page, perPage, fetchNobelPrizes]);

  if (loading) return <div className="main-loading">Loading…</div>;
  if (error) return <div className="main-error">{error}</div>;

  return (
    <div className="p-10">
      <section className="items-grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {prizes.map((p) => (
          <ItemCard key={p.id} prize={p} />
        ))}
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
