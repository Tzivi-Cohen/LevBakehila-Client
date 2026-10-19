import { useState } from 'react';
import { apiRequest } from '../api.js';

export default function LoginPage({ onLogin }) {
  const [login, setLogin] = useState({ email: '', password: '' });
  const [register, setRegister] = useState({ fullName: '', email: '', password: '', neighborhood: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const doLogin = async (credentials) => {
    const data = await apiRequest('/api/auth/login', { method: 'POST', body: credentials });
    onLogin({ token: data.token, userId: data.userId, fullName: data.fullName, role: data.role });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await doLogin(login);
    } catch (err) {
      setError(err.message);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await apiRequest('/api/auth/register', { method: 'POST', body: register });
      setMessage('ההרשמה הצליחה! מתחברת...');
      await doLogin({ email: register.email, password: register.password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>לב בקהילה</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <div className="card">
        <h2>התחברות</h2>
        <form className="row" onSubmit={submitLogin}>
          <label>אימייל
            <input type="email" required value={login.email}
              onChange={(e) => setLogin({ ...login, email: e.target.value })} />
          </label>
          <label>סיסמה
            <input type="password" required value={login.password}
              onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          </label>
          <button type="submit">התחברות</button>
        </form>
      </div>

      <div className="card">
        <h2>הרשמה כמתנדבת</h2>
        <form className="row" onSubmit={submitRegister}>
          <label>שם מלא
            <input required minLength={2} value={register.fullName}
              onChange={(e) => setRegister({ ...register, fullName: e.target.value })} />
          </label>
          <label>אימייל
            <input type="email" required value={register.email}
              onChange={(e) => setRegister({ ...register, email: e.target.value })} />
          </label>
          <label>סיסמה (לפחות 8 תווים)
            <input type="password" required minLength={8} value={register.password}
              onChange={(e) => setRegister({ ...register, password: e.target.value })} />
          </label>
          <label>שכונה
            <input required minLength={2} value={register.neighborhood}
              onChange={(e) => setRegister({ ...register, neighborhood: e.target.value })} />
          </label>
          <button type="submit">הרשמה</button>
        </form>
      </div>
    </div>
  );
}
