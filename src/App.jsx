import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";

function ProtectedApp({ user, onLogout }) {
  return (
    <>
      <Navbar user={user} onLogout={onLogout} />

      <div className="app-layout">
        <Sidebar />

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("businessAppAuth") === "true";
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("businessAppUser");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("businessAppAuth", String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("businessAppUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("businessAppUser");
    }
  }, [user]);

  const handleLogin = (loggedUser, token) => {
    setUser(loggedUser);
    if (token) {
      localStorage.setItem("businessAppToken", token);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("businessAppToken");
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <ProtectedApp user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;