// src/components/Register.tsx
import { useState } from 'react';
import { useAppContext } from './AppContext';

const Register = () => {
  const { register } = useAppContext() || { register: () => ({ success: false, message: 'Fallback' }) };  // Fallback jika AppContext null
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = register(name, email, password);  // Memanggil fungsi register
    setMessage(result.message);  // Menampilkan pesan dari hasil registrasi
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
      {message && <p>{message}</p>} {/* Menampilkan pesan status */}
    </div>
  );
};

export default Register;