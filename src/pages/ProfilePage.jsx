import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

// PLAN 3.2: the volunteer updates her profile - name, home neighborhood (used by "קודם בשכונה שלי") and skills.
// Role and email are not editable: the server never takes them from the request.
export default function ProfilePage({ onSaved }) {
  const [form, setForm] = useState(null);
  const [skills, setSkills] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
  };

  if (!form) return error ? <p className="error">{error}</p> : <p>טוען...</p>;

  return (
    <form className="card" onSubmit={submit}>
      <h2>הפרופיל שלי</h2>
      <p className="muted">{form.email} · {form.role === 'Admin' ? 'רכזת' : 'מתנדבת'}</p>
      <div className="row">
        <label>שם מלא
          <input required minLength={2} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </label>
        <label>שכונת מגורים
          <input required minLength={2} value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
        </label>
      </div>
      <fieldset>
        <legend>המיומנויות שלי</legend>
        {skills.map((s) => (
          <label key={s.id} style={{ display: 'inline-block', marginInlineEnd: 12 }}>
            <input type="checkbox" checked={form.skillIds.includes(s.id)} onChange={() => toggleSkill(s.id)} /> {s.name}
          </label>
        ))}
        {skills.length === 0 && <span className="muted">אין מיומנויות במערכת</span>}
      </fieldset>
      <button type="submit" style={{ marginTop: 8 }}>שמירת פרופיל</button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
