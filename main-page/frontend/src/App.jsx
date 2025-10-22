import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./pages/MainPage";

function App() {
  const isAuthenticated = !!localStorage.getItem("loggedIn");

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={isAuthenticated ? <MainPage /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;