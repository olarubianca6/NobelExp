import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const submit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      await login(mail, password)
      navigate("/")
    } catch (e2) {
      setError(e2?.response?.data?.error || "Login failed")
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-40 max-md:py-10 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-600">
          Log in to Nobel Prize Explorer
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition
                         focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition
                         focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition
                       hover:bg-[#007e89] active:scale-[0.99]
                       focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          No account?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
