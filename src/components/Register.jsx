// src/components/Register.js
import React, { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg('Registration successful! You can now log in.');
        setUsername('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.msg || 'Registration failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text" placeholder="Username"
          value={username} onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      {msg && <p style={{color:'green'}}>{msg}</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  );
}
