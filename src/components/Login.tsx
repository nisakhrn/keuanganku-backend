// src/components/Login.tsx
import { useState } from 'react';
import { useAppContext } from './AppContext';

const Login = () => {
  const { login } = useAppContext() || { login: () => ({ success: false, message: 'Fallback' }) };  // Fallback jika AppContext null
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);  // Memanggil fungsi login
    setMessage(result.message);  // Menampilkan pesan dari hasil login
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
      {message && <p>{message}</p>} {/* Menampilkan pesan status */}
    </div>
  );
};

export default Login;