import { useNavigate } from "react-router-dom";
import { logout, deleteAccount } from "../services/authService";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await deleteAccount();
        localStorage.removeItem("loggedIn");
        navigate("/register");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-200">
      <h1 className="text-xl font-bold">Nobel Prize Explorer</h1>
      <div className="flex gap-3">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
        <button
          onClick={handleDeleteAccount}
          className="bg-black text-white p-2 rounded"
        >
          Delete Account
        </button>
      </div>
    </nav>
  );
}