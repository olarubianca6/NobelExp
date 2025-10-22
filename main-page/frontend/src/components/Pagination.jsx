export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex gap-2 mt-4">
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`p-2 rounded ${p === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}