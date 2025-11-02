import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const res = await register(username, password);
      setMsg(res?.message || "Registered successfully!");
      setTimeout(() => navigate("/login"), 800);
    } catch (e2) {
      setError(
        e2?.response?.data?.error ||
        e2?.message ||
        "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <h2 className="auth-title">Register</h2>
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-label">
          <span className="auth-label-text">Username</span>
          <input
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
            required
          />
        </label>
        <label className="auth-label">
          <span className="auth-label-text">Password</span>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            required
          />
        </label>

        <button className="auth-button" type="submit">
          Create account
        </button>
      </form>

      {msg && <p className="auth-message">{msg}</p>}
      {error && <p className="auth-error">{error}</p>}

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login" className="auth-link">
          Login
        </Link>
      </p>
    </div>
  );
}
