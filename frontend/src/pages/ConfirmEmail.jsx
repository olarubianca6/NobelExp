import { useEffect, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")

  const { confirmEmail } = useAuthStore()

  const [status, setStatus] = useState("loading")
  const [message, setMessage] = useState("Confirming your email…")
  const [details, setDetails] = useState("")

  const hasRunRef = useRef(false)

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Missing confirmation token.")
      setDetails("Please open the confirmation link from your email again.")
      return
    }

    if (hasRunRef.current) return
    hasRunRef.current = true

    const run = async () => {
      try {
        const res = await confirmEmail(token)
        setStatus("success")
        setMessage(res?.message || "Email confirmed successfully!")
        setDetails("You can now log in to your account.")
      } catch (err) {
        setStatus("error")
        setMessage(err?.response?.data?.error || "Confirmation failed.")
        setDetails(
          "The link might be invalid or expired. Try registering again or request a new confirmation email."
        )
      }
    }

    run()
  }, [token, confirmEmail])

  return (
    <div className="flex items-center justify-center px-4 py-40 max-md:py-10 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-900">
          Email confirmation
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Nobel Prize Explorer
        </p>

        {status === "loading" && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            {message}
          </div>
        )}

        {status === "success" && (
          <div className="mt-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
              <p className="font-semibold">{message}</p>
              {details && <p className="mt-1">{details}</p>}
            </div>

            <div className="mt-5">
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition
                           hover:bg-[#007e89] active:scale-[0.99]
                           focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6">
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
              <p className="font-semibold">{message}</p>
              {details && <p className="mt-1 text-slate-700">{details}</p>}
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2">
              <Link
                to="/register"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-800 transition
                           hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-[#0097a7]/15"
              >
                Back to Register
              </Link>

              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[#0097a7] px-4 py-2.5 font-semibold text-white transition
                           hover:bg-[#007e89] active:scale-[0.99]
                           focus:outline-none focus:ring-4 focus:ring-[#0097a7]/20"
              >
                Login
              </Link>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-slate-600">
          Need help?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#0097a7] hover:text-[#007e89] hover:underline"
          >
            Create a new account
          </Link>
        </p>
      </div>
    </div>
  )
}
