import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, deleteAccount } = useAuthStore();
  const [error, setError] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <nav className="navbar bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="navbar-brand text-xl font-semibold text-gray-900">
        Nobel Prize Explorer
      </Link>

      <div className="flex items-center gap-6 relative">
        <Link to="/statistics" className="navbar-link text-gray-700 hover:text-blue-600">
          Statistics
        </Link>

        {!isAuthenticated && (
          <>
            <Link to="/login" className="navbar-link text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="navbar-link text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}

        {isAuthenticated && (
          <div className="relative">
            {/* username button */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-2 text-gray-800 font-medium hover:text-blue-600 focus:outline-none"
            >
              👤 {user || "User"}
              <svg
                className={`w-4 h-4 transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20">
                <button
                  onClick={handleLogout}
                  className="w-full items-center h-10 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full items-center h-10 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {error && <div className="navbar-error text-red-500 text-sm mt-2">{error}</div>}
    </nav>
  );
}
