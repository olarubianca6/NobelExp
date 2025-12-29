import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import MainPage from "./pages/MainPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Statistics from "./pages/Statistics"
import NavBar from "./components/NavBar"
import ProtectedRoute from "./components/ProtectedRoute"
import LaureatePage from "./pages/LaureatePage"
import ConfirmEmail from "./pages/ConfirmEmail" // ✅ adaugă

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <NavBar />
        <main className="app-main">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute>
                  <Statistics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laureates/:id"
              element={
                <ProtectedRoute>
                  <LaureatePage />
                </ProtectedRoute>
              }
            />
            <Route path="/confirm-email" element={<ConfirmEmail />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
