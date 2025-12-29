import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import { Link } from "react-router-dom"

export default function Register() {
  const [mail, setMail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [error, setError] = useState("")
  const [registered, setRegistered] = useState(false)

  const { register } = useAuthStore()

  const submit = async (e) => {
    e.preventDefault()
    setMsg("")
    setError("")

    try {
      const res = await register(mail, password)

      setMsg(
        res?.message ||
          "Account created! Please check your inbox (and Spam) to confirm your email. After confirming, you can log in."
      )

      setRegistered(true)
      setPassword("")
    } catch (e2) {
      setError(e2?.response?.data?.error || e2?.message || "Registration failed")
    }
  }

  return (
    <div className="flex items-center justify-center px-4 py-40 max-md:py-10 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>
        <p className="mt-1 text-sm text-slate-600">
          Join Nobel Prize Explorer
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
              disabled={registered}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition
                         focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15
                         disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
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
              autoComplete="new-password"
              required
              disabled={registered}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition
                         focus:border-[#0097a7] focus:ring-4 focus:ring-[#0097a7]/15
                         disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {msg && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
              <p className="font-semibold">Almost done!</p>
              <p className="mt-1">{msg}</p>

              <div className="mt-3">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0097a7] px-3 py-2 font-semibold text-white transition
                             hover:bg-[#007e89] focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={registered}
            className="w-full rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition
                       hover:bg-[#007e89] active:scale-[0.99]
                       focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20
                       disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#0097a7]"
          >
            {registered ? "Check your email" : "Create account"}
          </button>

          {registered && (
            <p className="text-xs text-slate-500">
              Didn’t receive it? Check Spam, or register again with a different email.
            </p>
          )}
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
