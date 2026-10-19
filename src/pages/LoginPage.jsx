import { useState } from 'react';
import { apiRequest } from '../api.js';
import { Alert, Icon } from '../ui.jsx';
import { HeroIllustration } from '../illustrations.jsx';

const FEATURES = [
  { icon: 'smile', title: 'פעילויות עם ילדים', text: 'משחק, יצירה, לימודים ומפגשי שבת – מותאמים לכל ילד.' },
  { icon: 'calendar', title: 'נרשמות בלחיצה', text: 'המערכת שומרת שלא תירשמי פעמיים או לשתי פעילויות באותה שעה.' },
  { icon: 'home', title: 'קרוב לבית', text: 'מחפשות לפי שכונה וסוג פעילות, ורואות כמה מקומות נשארו.' }
];

export default function LoginPage({ onLogin, onHome, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [login, setLogin] = useState({ email: '', password: '' });
  const [register, setRegister] = useState({ fullName: '', email: '', password: '', neighborhood: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const doLogin = async (credentials) => {
    const data = await apiRequest('/api/auth/login', { method: 'POST', body: credentials });
    onLogin({ token: data.token, userId: data.userId, fullName: data.fullName, role: data.role });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await doLogin(login);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setBusy(true);
    try {
      await apiRequest('/api/auth/register', { method: 'POST', body: register });
      setMessage('ההרשמה הצליחה! מתחברת...');
      await doLogin({ email: register.email, password: register.password });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setMessage('');
  };

  return (
    <div className="auth">
      <section className="auth-hero">
        <div className="auth-hero-top">
          <button type="button" className="brand" onClick={onHome} aria-label="לב בקהילה – חזרה לדף הבית">
            <span className="brand-mark"><Icon name="heart" size={22} strokeWidth={2.2} /></span>
            <span className="brand-name">לב בקהילה<small>מתנדבות וילדים, יחד</small></span>
          </button>
          <button type="button" className="btn btn-ghost-light btn-sm" onClick={onHome}>
            <Icon name="arrow-right" size={15} /> לדף הבית
          </button>
        </div>

        <div>
          <h1>כל שעה שאת נותנת <em>יוצרת רגע של אושר</em> לילד.</h1>
          <p className="lead">מצטרפות לפעילויות עם ילדים עם צרכים מיוחדים – משחק ויצירה, עזרה בלימודים ומפגשי שבת – קרוב לבית.</p>
        </div>

        <div className="auth-art"><HeroIllustration /></div>

        <div className="features">
          {FEATURES.map((f) => (
            <div className="feature" key={f.title}>
              <span className="icon-wrap"><Icon name={f.icon} /></span>
              <div><b>{f.title}</b><span>{f.text}</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <h2>{mode === 'login' ? 'ברוכה השבה 👋' : 'הצטרפי אלינו'}</h2>
          <p className="sub">{mode === 'login' ? 'התחברי כדי לראות פעילויות ולהירשם.' : 'פתיחת חשבון מתנדבת לוקחת פחות מדקה.'}</p>

          <div className="segmented" role="tablist">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''}
              onClick={() => switchMode('login')}>התחברות</button>
            <button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'active' : ''}
              onClick={() => switchMode('register')}>הרשמה כמתנדבת</button>
          </div>

          <div className="stack" style={{ gap: 12, marginBottom: error || message ? 18 : 0 }}>
            <Alert type="error" onClose={() => setError('')}>{error}</Alert>
            <Alert type="success">{message}</Alert>
          </div>

          {mode === 'login' ? (
            <form className="auth-form" onSubmit={submitLogin} key="login">
              <label className="field">אימייל
                <span className="input-icon">
                  <Icon name="mail" size={17} />
                  <input className="input" type="email" required autoComplete="email" placeholder="name@example.com" dir="ltr"
                    value={login.email} onChange={(e) => setLogin({ ...login, email: e.target.value })} />
                </span>
              </label>
              <label className="field">סיסמה
                <span className="input-icon">
                  <Icon name="lock" size={17} />
                  <input className="input" type="password" required autoComplete="current-password" placeholder="••••••••" dir="ltr"
                    value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
                </span>
              </label>
              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
                {busy ? <span className="spinner" /> : <Icon name="arrow-left" />} התחברות
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={submitRegister} key="register">
              <label className="field">שם מלא
                <span className="input-icon">
                  <Icon name="user" size={17} />
                  <input className="input" required minLength={2} autoComplete="name"
                    value={register.fullName} onChange={(e) => setRegister({ ...register, fullName: e.target.value })} />
                </span>
              </label>
              <label className="field">אימייל
                <span className="input-icon">
                  <Icon name="mail" size={17} />
                  <input className="input" type="email" required autoComplete="email" placeholder="name@example.com" dir="ltr"
                    value={register.email} onChange={(e) => setRegister({ ...register, email: e.target.value })} />
                </span>
              </label>
              <label className="field">סיסמה <span className="muted" style={{ fontWeight: 400 }}>(לפחות 8 תווים)</span>
                <span className="input-icon">
                  <Icon name="lock" size={17} />
                  <input className="input" type="password" required minLength={8} autoComplete="new-password" dir="ltr"
                    value={register.password} onChange={(e) => setRegister({ ...register, password: e.target.value })} />
                </span>
              </label>
              <label className="field">שכונה
                <span className="input-icon">
                  <Icon name="pin" size={17} />
                  <input className="input" required minLength={2}
                    value={register.neighborhood} onChange={(e) => setRegister({ ...register, neighborhood: e.target.value })} />
                </span>
              </label>
              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
                {busy ? <span className="spinner" /> : <Icon name="sparkles" />} יצירת חשבון
              </button>
            </form>
          )}

          <p className="auth-foot">
            {mode === 'login'
              ? <>עדיין אין לך חשבון? <button type="button" className="link-btn" onClick={() => switchMode('register')}>להרשמה</button></>
              : <>כבר רשומה? <button type="button" className="link-btn" onClick={() => switchMode('login')}>להתחברות</button></>}
          </p>
        </div>
      </section>
    </div>
  );
}
