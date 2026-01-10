import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useLaureateStore } from "../store/laureateStore";
import {
  User,
  Calendar,
  MapPin,
  Building2,
  Award,
  Trophy,
  Skull,
} from "lucide-react";

function fmtDate(value) {
  if (!value) return "";
  return value;
}

export default function LaureatePage() {
  const { id } = useParams();
  const { laureate, loading, error, fetchLaureateById, clearLaureate } =
    useLaureateStore();

  useEffect(() => {
    fetchLaureateById(id);
    return () => clearLaureate();
  }, [id, fetchLaureateById, clearLaureate]);

  const fullName = useMemo(() => {
    const given = laureate?.givenName?.value || "";
    const family = laureate?.familyName?.value || "";
    return `${given} ${family}`.trim();
  }, [laureate]);

  const initials = useMemo(() => {
    const g = laureate?.givenName?.value?.[0] || "";
    const f = laureate?.familyName?.value?.[0] || "";
    return `${g}${f}`.toUpperCase() || "L";
  }, [laureate]);

  const info = useMemo(
    () => [
      {
        label: "Gender",
        value: laureate?.gender?.value,
        Icon: User,
      },
      {
        label: "Born",
        value: fmtDate(laureate?.birthDate?.value),
        Icon: Calendar,
      },
      {
        label: "Died",
        value: fmtDate(laureate?.deathDate?.value),
        Icon: Skull,
      },
      {
        label: "Birth place",
        value: laureate?.birthPlaceLabel?.value,
        Icon: MapPin,
      },
      {
        label: "Death place",
        value: laureate?.deathPlaceLabel?.value,
        Icon: MapPin,
      },
      {
        label: "Affiliation",
        value: laureate?.affiliationLabel?.value,
        Icon: Building2,
      },
      {
        label: "Award",
        value: laureate?.awardLabel?.value,
        Icon: Award,
      },
      {
        label: "Prize",
        value: laureate?.prizeLabel?.value,
        Icon: Trophy,
      },
    ],
    [laureate]
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex items-center gap-3 text-gray-600">
          <span className="inline-block h-4 w-4 rounded-full bg-cyan-700 animate-pulse" />
          <p className="text-lg">Loading laureate info…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-[70vh] px-4">
        <div className="w-full max-w-xl bg-white border border-red-100 shadow-sm rounded-2xl p-6">
          <p className="text-red-600 font-semibold">Something went wrong</p>
          <p className="text-red-500 mt-1">{error}</p>
          <div className="mt-5">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg transition font-medium"
            >
              Go back
            </Link>
          </div>
        </div>
      </div>
    );

  if (!laureate)
    return (
      <div className="flex justify-center items-center min-h-[70vh] text-gray-500">
        No data found
      </div>
    );

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-full md:w-[88%] xl:w-[68%] 2xl:w-[60%] md:mt-10 mb-10 px-4">
      <div className="relative overflow-hidden bg-white shadow-xl md:rounded-3xl">
        <div className="h-44 bg-gradient-to-r from-blue-50 via-cyan-100 to-cyan-700" />

        <div className="p-7 sm:p-10 -mt-16 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl font-semibold shadow-lg ring-4 ring-white">
                {initials}
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                  {fullName || "Unknown laureate"}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {laureate?.gender?.value && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm capitalize">
                      <User className="w-4 h-4" />
                      {laureate.gender.value}
                    </span>
                  )}

                  {(laureate?.awardLabel?.value || laureate?.prizeLabel?.value) && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 text-cyan-900 text-sm">
                      <Award className="w-4 h-4" />
                      {laureate?.awardLabel?.value || laureate?.prizeLabel?.value}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="sm:pb-1">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl shadow-md transition font-medium"
              >
                Go back
              </Link>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-8">
            {info
              .filter((i) => i.value)
              .map(({ label, value, Icon }, idx) => (
                <div
                  key={idx}
                  className="group flex gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:bg-white transition"
                >
                  <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:border-cyan-200">
                    <Icon className="w-5 h-5 text-cyan-700" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-600">
                      {label}
                    </p>
                    <p className="text-gray-900 mt-1 text-base sm:text-lg break-words">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl shadow-md transition font-medium"
            >
              Go back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
