// src/pages/register.tsx
import { useState } from 'react';
import { useAppContext } from '../components/AppContext';  // Perbaiki path import
import Link from 'next/link';  // Import Link untuk navigasi

const Register = () => {
  const { register } = useAppContext() || { register: () => ({ success: false, message: 'Fallback' }) };
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [success, setSuccess] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors({});
    const { name, value } = e.target;
    if (name === 'passwordConfirmation' && value !== password) {
      setErrors({ ...errors, passwordConfirmation: 'Password tidak sama' });
    }
    if (name === 'email' && !/^\S+@\S+\.\S+$/.test(value)) {
      setErrors({ ...errors, email: 'Email tidak valid' });
    }
    // Handle other field changes
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'passwordConfirmation') setPasswordConfirmation(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setErrors({ passwordConfirmation: 'Password tidak sama' });
      return;
    }

    const result = register(name, email, password);
    if (result.success) {
      setSuccess('Registrasi berhasil! Silakan login.');
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
    } else {
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="register-wrapper">
      {/* Back to Landing Page */}
      <Link href="/" className="back-arrow">←</Link>

      {/* Register Card */}
      <div className="register-card">
        <h2 className="register-title">Register</h2>

        {success && <p className="register-success">{success}</p>}
        {errors.general && <p className="register-error">{errors.general}</p>}

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={name}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Name</label>
            {errors.name && <p className="register-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Email</label>
            {errors.email && <p className="register-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Password</label>
            {errors.password && <p className="register-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={handleChange}
              required
              className="form-input"
            />
            <label className="form-label">Confirm Password</label>
            {errors.passwordConfirmation && (
              <p className="register-error">{errors.passwordConfirmation}</p>
            )}
          </div>

          <button type="submit" className="btn-register">Register</button>
        </form>

        {/* Link to Login */}
        <p className="register-login">
          Already have an account?{' '}
          <Link href="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;