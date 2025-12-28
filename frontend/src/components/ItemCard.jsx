import { useNavigate } from "react-router-dom";

export default function ItemCard({ prize }) {
  const { year, category, laureates } = prize;
  const navigate = useNavigate();

  const readableCategory = category?.includes("/")
    ? decodeURIComponent(category.split("/").pop()).replace(/_/g, " ")
    : category || "";

  return (
    <article
      className="h-[300px] bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 p-8 flex flex-col justify-between cursor-default transform hover:-translate-y-2 hover:scale-[1.02]"
    >
      <header className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-cyan-700 font-semibold text-2xl capitalize tracking-wide">
            {readableCategory}
          </span>
          <span className="bg-cyan-100 text-cyan-800 text-base font-semibold px-4 py-1.5 rounded-full">
            {year}
          </span>
        </div>
        <div className="h-[4px] bg-gradient-to-r from-cyan-600 to-blue-400 rounded-full w-1/3"></div>
      </header>

      <section>
        <h4 className="text-gray-700 font-semibold mb-3 text-base uppercase tracking-wide">
          Laureates
        </h4>

        {Array.isArray(laureates) && laureates.length > 0 ? (
          <ul className="space-y-2">
            {laureates.map((l, idx) => {
              const shortId = l.id?.split("/").pop();
              return (
                <li
                  key={idx}
                  className="text-gray-800 hover:text-cyan-700 transition-colors cursor-pointer text-base leading-relaxed"
                  onClick={() => shortId && navigate(`/laureates/${shortId}`)}
                >
                  • {l.name}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-gray-500 text-base italic">No laureates listed.</p>
        )}
      </section>
    </article>
  );
}
