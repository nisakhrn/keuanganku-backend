// src/pages/register.tsx
import { useState } from 'react';
import { useAppContext } from '../components/AppContext';  // Perbaiki path import
import Link from 'next/link';

const Register = () => {
  const { register } = useAppContext() || { register: () => ({ success: false, message: 'Fallback' }) };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = register(name, email, password);
    setMessage(result.message);
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      <Link href="/login">
        Already have an account? Log in here  {/* Hanya teks, tanpa <a> */}
      </Link>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;