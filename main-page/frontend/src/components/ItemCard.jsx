import { useNavigate } from "react-router-dom";

export default function ItemCard({ prize }) {
  const { year, category, laureates } = prize;
  const navigate = useNavigate();

  const readableCategory = category?.includes("/")
    ? decodeURIComponent(category.split("/").pop()).replace(/_/g, " ")
    : category || "";

  return (
    <article className="item-card">
      <header className="item-card-header">
        <h3 className="item-card-title">
          {readableCategory} — {year}
        </h3>
      </header>

      <section className="item-card-body">
        <h4 className="item-card-section-title">Laureates</h4>
        {Array.isArray(laureates) && laureates.length > 0 ? (
          <ul className="item-card-list">
            {laureates.map((l, idx) => {
              const shortId = l.id?.split("/").pop();

              return (
                <li
                  key={idx}
                  className="item-card-list-item hover:underline"
                  onClick={() => shortId && navigate(`/laureates/${shortId}`)}
                  style={{
                    cursor: shortId ? "pointer" : "default",
                    transition: "text-decoration 0.2s ease",
                  }}
                >
                  {l.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="item-card-empty">No laureates listed.</p>
        )}
      </section>
    </article>
  );
}
