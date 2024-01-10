import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Registration = () => {
  const history = useHistory();

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();

    // Implement your registration logic here
    // You can make a request to your server to handle user registration

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, password, email }),
      });

      if (response.ok) {
        // Redirect to login after successful registration
        history.push('/login');
      } else {
        // Handle registration error
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div>
      <h1>Registration</h1>
      <form onSubmit={handleRegistration}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={handleNameChange} required />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={handleUsernameChange} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;
