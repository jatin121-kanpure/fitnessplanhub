import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          💪 FitPlanHub
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-item">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/feed" className="nav-item">
                Feed
              </Link>

              {user.role === "trainer" && (
                <Link to="/trainer-dashboard" className="nav-item">
                  Dashboard
                </Link>
              )}

              <div className="nav-user">
                <span className="user-name">{user.name}</span>
                <span className="user-role">({user.role})</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                Login
              </Link>
              <Link to="/signup" className="nav-item nav-signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
