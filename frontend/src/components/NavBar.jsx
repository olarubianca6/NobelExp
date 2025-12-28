import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, deleteAccount } = useAuthStore();
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isOnStatistics = location.pathname.startsWith("/statistics")

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.error || "Logout failed");
    }
  };

  const handleDelete = async () => {
    setError("");
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteAccount();
      navigate("/register");
    } catch (err) {
      setError(err?.response?.data?.error || "Delete failed");
    }
  };

  return (
    <nav className="h-[80px] bg-white shadow-md px-6 py-3 flex justify-between items-center relative">
      <Link to="/" className="hidden md:flex text-cyan-700 text-3xl font-semibold">
        Nobel Prize Explorer
      </Link>
      <Link to="/" className="flex md:hidden text-cyan-700 text-3xl font-semibold">
        NPE
      </Link>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <Link
                 to={isOnStatistics ? "/" : "/statistics"}
              className="text-cyan-800 hover:text-cyan-900"
            >
              {isOnStatistics ? "Prizes" : "Statistics"}
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 text-cyan-800 font-medium hover:text-cyan-900 focus:outline-none"
              >
                👤 {user || "User"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isMenuOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full h-10 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full h-10 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {error && (
        <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 text-red-500 text-sm">
          {error}
        </div>
      )}
    </nav>
  );
}
