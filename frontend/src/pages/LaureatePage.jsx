import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLaureateStore } from "../store/laureateStore";

export default function LaureatePage() {
  const { id } = useParams();
  const { laureate, loading, error, fetchLaureateById, clearLaureate } = useLaureateStore();

  useEffect(() => {
    fetchLaureateById(id);
    return () => clearLaureate();
  }, [id, fetchLaureateById, clearLaureate]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-lg text-gray-600 animate-pulse">
        Loading laureate info…
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-red-500 font-medium">
        {error}
      </div>
    );

  if (!laureate)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-500">
        No data found
      </div>
    );

  const info = [
    { label: "Gender", value: laureate.gender?.value, icon: "🚻" },
    { label: "Born", value: laureate.birthDate?.value, icon: "🎂" },
    { label: "Died", value: laureate.deathDate?.value, icon: "🕯️" },
    { label: "Birth Place", value: laureate.birthPlaceLabel?.value, icon: "🌍" },
    { label: "Death Place", value: laureate.deathPlaceLabel?.value, icon: "🪦" },
    { label: "Affiliation", value: laureate.affiliationLabel?.value, icon: "🎓" },
    { label: "Award", value: laureate.awardLabel?.value, icon: "🏅" },
    { label: "Prize", value: laureate.prizeLabel?.value, icon: "🥇" },
  ];

  const initials = `${laureate.givenName?.value?.[0] || ""}${laureate.familyName?.value?.[0] || ""}`.toUpperCase();

  return (
    <div className="relative md:mt-8 mb-4 2xl:mt-20 left-1/2 -translate-x-1/2 md:w-[80%] xl:w-[60%] bg-white shadow-xl md:rounded-3xl p-10">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-blue-100 to-cyan-700 md:rounded-t-3xl"></div>

      <div className="flex flex-col items-center relative z-10 mt-10">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-white flex items-center justify-center text-3xl font-semibold shadow-md">
          {initials}
        </div>
        <h2 className="mt-4 text-4xl font-semibold text-gray-900 text-center">
          {laureate.givenName?.value || ""} {laureate.familyName?.value || ""}
        </h2>
        {laureate.gender?.value && (
          <p className="text-gray-500 mt-1 capitalize">{laureate.gender.value}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10">
        {info
          .filter((i) => i.value)
          .map((i, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1 bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-md transition"
            >
              <p className="text-xl text-gray-500 font-medium flex items-center gap-1">
                <span className="text-2xl">{i.icon}</span> {i.label}
              </p>
              <p className="text-gray-800 mt-0.5 text-lg">{i.value}</p>
            </div>
          ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg shadow-md transition font-medium"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
