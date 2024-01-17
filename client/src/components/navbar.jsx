import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import "./navbar.css";
import checkSession from "./checkSession";

const Navbar = () => {
  const { toggleTheme, isDarkMode } = useTheme();
  const [loggedIn, setIsLoggedIn] = useState(false)
  useEffect(()=>{
    checkSession()
    .then(data=> {
      if(data){
        setIsLoggedIn(true)
      }
    })
  },[])
 
 
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'DELETE',
        credentials: 'include',  
      });
      setIsLoggedIn(false); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header>
      <nav>
        <ul className={`navbar-right ${isDarkMode ? 'dark-mode' : ''}`}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
            {!loggedIn ? (
              <Link to="/login">Login</Link>
            ) : null}
          </li>
          <li>
            {!loggedIn ? (
            <Link to="/registration">Register</Link>
            ) : null}
          </li>
          <li>
            {loggedIn ? (
              <Link to="/userdashboard">User Dashboard</Link>
            ) : null}
          </li>
          <li>
            {loggedIn ? (
              <Link to="/searchpage">Search Page</Link>
            ) : null}
          </li>
          {/* Toggle theme button */}
          <li>
            <button onClick={toggleTheme}>Toggle Theme</button>
          </li>
          {/* Logout button */}
    <li>
      {loggedIn && <button onClick={handleLogout}>Logout</button>}
    </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
