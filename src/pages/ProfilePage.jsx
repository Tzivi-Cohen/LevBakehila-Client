import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';
import { Alert, Avatar, Icon, Loader, PageHeader } from '../ui.jsx';

// PLAN 3.2: the volunteer updates her profile - name, home neighborhood (used by "קודם בשכונה שלי") and skills.
// Role and email are not editable: the server never takes them from the request.
export default function ProfilePage({ onSaved }) {
  const [form, setForm] = useState(null);
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    Promise.all([apiRequest('/api/users/me'), apiRequest('/api/skills')])
      .then(([me, allSkills]) => {
        setForm({ email: me.email, role: me.role, fullName: me.fullName, neighborhood: me.neighborhood, skillIds: me.skills.map((s) => s.id) });
        setSkills(allSkills);
      })
      .catch((err) => setError(err.message));
  }, []);

  const toggleSkill = (id) => {
    const ids = form.skillIds;
    setForm({ ...form, skillIds: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setBusy(true);
    try {
      const saved = await apiRequest('/api/users/me', {
        method: 'PUT', body: { fullName: form.fullName, neighborhood: form.neighborhood, skillIds: form.skillIds }
      });
      setForm({ ...form, fullName: saved.fullName, neighborhood: saved.neighborhood, skillIds: saved.skills.map((s) => s.id) });
      setMessage('הפרופיל עודכן.');
      onSaved(saved.fullName);
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  };

  if (!form) return error ? <Alert type="error">{error}</Alert> : <Loader text="טוען את הפרופיל..." />;

  const isAdmin = form.role === 'Admin';

  return (
    <div>
      <PageHeader eyebrow="האזור האישי" icon="user" title="הפרופיל שלי"
        subtitle="השכונה משמשת למיון 'קודם בשכונה שלי', והמיומנויות מוצגות מול דרישות כל פעילות." />

      <div className="profile-layout">
        <div className="card profile-card">
          <div className="profile-cover" />
          <Avatar name={form.fullName} className="lg" />
          <div className="body">
            <h3>{form.fullName}</h3>
            <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-success'}`}>{isAdmin ? 'רכזת' : 'מתנדבת'}</span>
            <div className="profile-facts">
              <div><Icon name="mail" size={16} /><span dir="ltr">{form.email}</span></div>
              <div><Icon name="home" size={16} />{form.neighborhood}</div>
              <div><Icon name="award" size={16} />{form.skillIds.length} מיומנויות</div>
            </div>
          </div>
        </div>

        <form className="card" onSubmit={submit}>
          <div className="card-head">
            <div className="card-title">
              <span className="icon-wrap"><Icon name="edit" /></span>
              <h3>עריכת פרטים</h3>
            </div>
          </div>

          <div className="form-grid">
            <label className="field">שם מלא
              <input className="input" required minLength={2} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </label>
            <label className="field">שכונת מגורים
              <input className="input" required minLength={2} value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
            </label>
          </div>

          <fieldset className="fieldset" style={{ marginTop: 22 }}>
            <legend>המיומנויות שלי</legend>
            <div className="pill-group">
              {skills.map((s) => (
                <label key={s.id} className="pill-check">
                  <input type="checkbox" checked={form.skillIds.includes(s.id)} onChange={() => toggleSkill(s.id)} />
                  <span><Icon name="check" size={14} />{s.name}</span>
                </label>
              ))}
              {skills.length === 0 && <span className="muted">אין מיומנויות במערכת</span>}
            </div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? <span className="spinner" /> : <Icon name="save" />} שמירת פרופיל
            </button>
          </div>

          <div className="stack" style={{ gap: 10, marginTop: message || error ? 16 : 0 }}>
            <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>
            <Alert type="error" onClose={() => setError('')}>{error}</Alert>
          </div>
        </form>
      </div>
    </div>
  );
}
