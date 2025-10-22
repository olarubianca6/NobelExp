import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        setError("All fields are required");
        return;
      }
      await login(username, password);
      localStorage.setItem("loggedIn", "true");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-80">
        <h2 className="text-2xl mb-4">Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} className="border p-2"/>
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2"/>
        <button type="submit" className="bg-green-500 text-white p-2 mt-2 rounded">Login</button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}