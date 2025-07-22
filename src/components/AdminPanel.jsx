// src/components/AdminPanel.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

export default function AdminPanel() {
  const { token, user } = useContext(AuthContext);
  const [stats, setStats] = useState({ userCount: 0, animeCount: 0 });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || user?.role !== 'admin') return;

    // Fetch stats
    fetch('http://localhost:5000/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
      .then(data => setStats(data))
      .catch(() => setError('Failed to load stats'));

    // Fetch users
    fetch('http://localhost:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => res.json())
      .then(setUsers)
      .catch(() => setError('Failed to load users'));
  }, [token, user]);

  if (!user || user.role !== 'admin') {
    return <p>Access denied. Admins only.</p>;
  }

  const changeRole = async (userId, newRole) => {
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to update role');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <h3>Stats</h3>
      <p>Registered Users: {stats.userCount}</p>
      <p>Animes Available: {stats.animeCount}</p>

      <h3>Users</h3>
      {error && <p style={{color:'red'}}>{error}</p>}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Username</th><th>Email</th><th>Role</th><th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== 'admin' && <button onClick={() => changeRole(u._id, 'admin')}>Make Admin</button>}
                {u.role !== 'member' && <button onClick={() => changeRole(u._id, 'member')}>Make Member</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
