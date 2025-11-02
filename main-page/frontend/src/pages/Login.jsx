import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
      navigate("/");
    } catch (e2) {
      setError(e2?.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-label">
          <span className="auth-label-text">Username</span>
          <input
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />
        </label>
        <label className="auth-label">
          <span className="auth-label-text">Password</span>
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </label>
        <button className="auth-button" type="submit">Login</button>
      </form>
      {error && <p className="auth-error">{error}</p>}
      <p className="auth-switch">
        No account? <Link to="/register" className="auth-link">Register</Link>
      </p>
    </div>
  );
}
