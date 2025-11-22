// src/pages/login.tsx
import { useState } from 'react';
import { useAppContext } from '../components/AppContext';  // Perbaiki path import
import Link from 'next/link';

const Login = () => {
  const { login } = useAppContext() || { login: () => ({ success: false, message: 'Fallback' }) };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    setMessage(result.message);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Link href="/register">
        Don't have an account? Register here  {/* Hanya teks, tanpa <a> */}
      </Link>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;