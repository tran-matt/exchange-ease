import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header>
      <nav>
        <ul>
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
            <Link to="/userdashboard">User Dashboard</Link>
          </li>
          <li>
            <Link to="/searchpage">Search Page</Link>
          </li>
          <li>
            <Link to="/tradepage">Trade Page</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
