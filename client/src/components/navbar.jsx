// navbar.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./navbar.css";
import checkSession from "./checkSession";

const Navbar = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [togglePosition, setTogglePosition] = useState(isDarkMode ? "right" : "left");
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

  const handleToggleClick = () => {
    toggleTheme(); 
    setTogglePosition(isDarkMode ? "left" : "right");
  };

  return (
    <header>
      <nav className={`navbar ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img
              src="inventory.png"
              alt="Exchange Ease Logo"
              width="30"
              height="24"
              className="d-inline-block align-text-top"
            />
            Exchange Ease
          </Link>
        </div>
        <div className="navbar-links">
          <div className="left-links">
            <Link to="/">About Us</Link>
            <Link to="/faq">FAQ</Link>
            {loggedIn ? <Link to="/userdashboard">My Account</Link> : null}
            {loggedIn ? <Link to="/searchpage">Discover</Link> : null}
          </div>
          <div className="right-links">
            {!loggedIn ? <Link to="/login">Login</Link> : null}
            {!loggedIn ? (
              <button
                onClick={() => navigate("/registration")}
                className="signup-button"
              >
                Sign Up
              </button>
            ) : null}
            {loggedIn && (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            )}
          </div>
          <div
        className={`toggle-slider ${isDarkMode ? "dark-mode" : ""} ${togglePosition}`}
        onClick={handleToggleClick}
      ></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
