import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { useEffect, useRef, useState } from "react"

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, user, logout, deleteAccount } = useAuthStore()
  const [error, setError] = useState("")
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const mobileMenuRef = useRef(null)
  const userMenuRef = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname.startsWith(path)
  }

  const linkClass = (path) =>
    [
      "text-cyan-800 hover:text-cyan-900 transition",
      isActive(path)
        ? "underline underline-offset-5 decoration-1 decoration-[#0097a7]"
        : "no-underline",
    ].join(" ")

  const mobileLinkClass = (path) =>
    [
      "block w-full rounded-xl px-3 py-2 text-sm font-semibold transition",
      isActive(path)
        ? "bg-[#0097a7]/10 text-cyan-900 underline underline-offset-4 decoration-[#0097a7]"
        : "text-slate-700 hover:bg-slate-50",
    ].join(" ")

  const handleLogout = async () => {
    setError("")
    try {
      await logout()
      setIsUserMenuOpen(false)
      setIsMobileMenuOpen(false)
      navigate("/login")
    } catch (err) {
      setError(err?.response?.data?.error || "Logout failed")
    }
  }

  const handleDelete = async () => {
    setError("")
    if (!window.confirm("Are you sure you want to delete your account?")) return
    try {
      await deleteAccount()
      setIsUserMenuOpen(false)
      setIsMobileMenuOpen(false)
      navigate("/register")
    } catch (err) {
      setError(err?.response?.data?.error || "Delete failed")
    }
  }

  return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-3 relative">
      <div className="h-[56px] flex items-center justify-between">
        <Link to="/" className="text-cyan-700 text-2xl sm:text-3xl font-semibold">
          <span className="hidden md:inline">Nobel Prize Explorer</span>
          <span className="md:hidden">NPE</span>
        </Link>

        {isAuthenticated ? (
          <>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className={linkClass("/")}>
                Prizes
              </Link>
              <Link to="/statistics" className={linkClass("/statistics")}>
                Statistics
              </Link>
              <Link to="/favorites" className={linkClass("/favorites")}>
                Favorites
              </Link>

              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 text-cyan-800 font-medium hover:text-cyan-900 focus:outline-none"
                >
                  👤 {user || "User"}
                  <svg
                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    <button
                      onClick={handleLogout}
                      className="w-full h-10 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full h-10 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete Account
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((p) => !p)}
                className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-slate-700 hover:bg-slate-50 transition"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>

              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-lg z-30 p-2">
                  <div className="px-3 py-2 text-xs text-slate-500">
                    Signed in as <span className="font-semibold text-slate-700">{user || "User"}</span>
                  </div>

                  <div className="h-px bg-slate-100 my-1" />

                  <Link
                    to="/"
                    className={mobileLinkClass("/")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Prizes
                  </Link>
                  <Link
                    to="/statistics"
                    className={mobileLinkClass("/statistics")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Statistics
                  </Link>
                  <Link
                    to="/favorites"
                    className={mobileLinkClass("/favorites")}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Favorites
                  </Link>

                  <div className="h-px bg-slate-100 my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition text-left"
                  >
                    Logout
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition text-left"
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>

      {error && (
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 text-red-500 text-sm">
          {error}
        </div>
      )}
    </nav>
  )
}
