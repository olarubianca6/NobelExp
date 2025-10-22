export default function ItemCard({ prize }) {
  const { year, category, laureates } = prize;

  const readableCategory = category?.includes("/")
    ? decodeURIComponent(category.split("/").pop()).replace(/_/g, " ")
    : category || "";

  return (
    <article className="item-card">
      <header className="item-card-header">
        <h3 className="item-card-title">{readableCategory} — {year}</h3>
      </header>

      <section className="item-card-body">
        <h4 className="item-card-section-title">Laureates</h4>
        {Array.isArray(laureates) && laureates.length > 0 ? (
          <ul className="item-card-list">
            {laureates.map((l, idx) => (
              <li key={idx} className="item-card-list-item">{l.name}</li>
            ))}
          </ul>
        ) : (
          <p className="item-card-empty">No laureates listed.</p>
        )}
      </section>
    </article>
  );
}