import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, deleteAccount } from "../services/authService";

export default function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("loggedIn");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
    } catch (err) {
      setError(err?.response?.data?.error || "Logout failed");
    }
    localStorage.removeItem("loggedIn");
    navigate("/", { replace: true });
    window.location.reload();
  };

  const handleDelete = async () => {
    setError("");
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await deleteAccount();
      localStorage.removeItem("loggedIn");
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err?.response?.data?.error || "Delete failed");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">Nobel Explorer</Link>
        <div className="navbar-links">
          {!isLoggedIn && (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/register" className="navbar-link">Register</Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
              <button onClick={handleDelete} className="navbar-button navbar-button-danger">Delete Account</button>
            </>
          )}
        </div>
      </div>
      {error && <div className="navbar-error">{error}</div>}
    </nav>
  );
}