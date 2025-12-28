export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  const pages = [];
  const windowSize = 5;
  const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className="pagination">
      <button className="pagination-button" disabled={!canPrev} onClick={() => go(1)}>First</button>
      <button className="pagination-button" disabled={!canPrev} onClick={() => go(currentPage - 1)}>Prev</button>

      <div className="pagination-numbers">
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination-number ${p === currentPage ? "active" : ""}`}
            onClick={() => go(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <button className="pagination-button" disabled={!canNext} onClick={() => go(currentPage + 1)}>Next</button>
      <button className="pagination-button" disabled={!canNext} onClick={() => go(totalPages)}>Last</button>

      <span className="pagination-info">
        Page {currentPage} of {totalPages} • {totalItems} results
      </span>
    </div>
  );
}