import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./navbar.css";
import checkSession from "./checkSession";

const Navbar = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const [loggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSession().then((data) => {
      if (data) {
        setIsLoggedIn(true);
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "DELETE",
        credentials: "include",
      });
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header>
      <nav>
      <div className={`navbar-right ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="navbar-left">
          <div className="navbar-links">
            <div className="logo-container">
            <img src="exchangeeaselogo.png" alt="Exchange Ease Logo" />
               </div>
                  <Link to="/">About Us</Link>
                  <Link to="/faq">FAQ</Link>
                  {!loggedIn ? <Link to="/login">Login</Link> : null}
            {!loggedIn ? (
              <button
                onClick={() => navigate("/registration")}
                className="signup-button"
              >
                Sign Up
              </button>
            ) : null}
            {loggedIn ? <Link to="/userdashboard">My Account</Link> : null}
            {loggedIn ? <Link to="/searchpage">Discover</Link> : null}
            {loggedIn && (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            )}
          <div className="toggle-container">
            <input
              type="checkbox"
              id="themeToggle"
              className="toggle-input"
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <label htmlFor="themeToggle" className="toggle-slider"></label>
          </div>
               </div>
             </div>
         

        <div className="auth-links" style={{ margin: "0 80px" }}>
           
          </div>
          {/* Toggle Container */}

        </div>
      </nav>
    </header>
  );
};

export default Navbar;
