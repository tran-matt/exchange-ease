// Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ onSuccessfulLogin }) => {
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = useState({
    username: '',
    password: '',
  });

  const updateLoginFormData = (e) => {
    setLoginFormData({ ...loginFormData, [e.target.name]: e.target.value });
  };

  const handleSuccessfulLogin = (data) => {
    sessionStorage.setItem('token', JSON.stringify(data));
    // Notify the parent component (if needed)
    onSuccessfulLogin();
    // Navigate to userdashboard
    navigate('/userdashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginFormData),
      });

      if (response.ok) {
        const user = await response.json();
        handleSuccessfulLogin(user);
      } else {
        const error = await response.json();
        console.error('Login failed:', error.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="center-content">
      <h1>Login</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            value={loginFormData.username}
            onChange={updateLoginFormData}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={loginFormData.password}
            onChange={updateLoginFormData}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
