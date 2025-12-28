import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}
