import React from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./navbar.css";

function Navbar() {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <header>
      <nav>
        <ul className="navbar-right">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/registration">Register</Link>
          </li>
          <li>
            <Link to="/userdashboard">User Dashboard</Link>
          </li>
          <li>
            <Link to="/searchpage">Search Page</Link>
          </li>
          <li>
            <Link to="/tradepage">Trade Page</Link>
          </li>

          {/* Toggle theme button */}
          <li>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
