import { useEffect, useState } from 'react';
import { apiRequest, CATEGORIES, formatDate } from '../api.js';

const emptyForm = {
  title: '', description: '', category: 'HomeworkHelp', neighborhood: '', startTime: '', endTime: '', maxVolunteers: 1, requiredSkillIds: []
};

// "2026-10-20T16:00:00" -> "2026-10-20T16:00" for <input type="datetime-local">
const toInputDate = (value) => value.slice(0, 16);
// "2026-10-20T16:00" -> "2026-10-20T16:00:00" for the API
const toApiDate = (value) => (value.length === 16 ? `${value}:00` : value);

export default function AdminPage() {
  const [activities, setActivities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [registrations, setRegistrations] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () =>
    apiRequest('/api/activities?pageNumber=1&pageSize=50&sortBy=startTime&sortDirection=desc')
      .then((page) => setActivities(page.items))
      .catch((err) => setError(err.message));

  useEffect(() => {
    load();
    apiRequest('/api/skills').then(setSkills).catch((err) => setError(err.message));
  }, []);

  const run = async (action, successText) => {
    setMessage('');
    setError('');
    try {
      await action();
      setMessage(successText);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const body = {
      ...form,
      startTime: toApiDate(form.startTime),
      endTime: toApiDate(form.endTime),
      maxVolunteers: Number(form.maxVolunteers)
    };
    run(async () => {
      if (editingId) await apiRequest(`/api/activities/${editingId}`, { method: 'PUT', body });
      else await apiRequest('/api/activities', { method: 'POST', body });
      setForm(emptyForm);
      setEditingId(null);
    }, editingId ? 'הפעילות עודכנה.' : 'הפעילות נוצרה.');
  };

  const edit = (a) => {
    setEditingId(a.id);
    setForm({
      title: a.title, description: a.description, category: a.category, neighborhood: a.neighborhood,
      startTime: toInputDate(a.startTime), endTime: toInputDate(a.endTime), maxVolunteers: a.maxVolunteers,
      requiredSkillIds: a.requiredSkills.map((s) => s.id)
    });
  };

  const cancelActivity = (a) => {
    if (!window.confirm(`לבטל את "${a.title}"? כל ההרשמות אליה יבוטלו.`)) return;
    run(async () => {
      // Soft delete: the server marks the activity as cancelled, the row stays in the database
      await apiRequest(`/api/activities/${a.id}`, { method: 'DELETE' });
      // The server cancelled its registrations too - refresh the open registrations panel
      if (registrations?.activity.id === a.id) await showRegistrations(a);
    }, 'הפעילות בוטלה.');
  };

  const showRegistrations = async (a) => {
    setError('');
    try {
      const list = await apiRequest(`/api/registrations/activity/${a.id}`);
      setRegistrations({ activity: a, list });
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelRegistration = (id) =>
    run(async () => {
      await apiRequest(`/api/registrations/${id}`, { method: 'DELETE' });
      if (registrations) await showRegistrations(registrations.activity);
    }, 'ההרשמה בוטלה.');

  const toggleSkill = (skillId) => {
    const ids = form.requiredSkillIds;
    setForm({ ...form, requiredSkillIds: ids.includes(skillId) ? ids.filter((id) => id !== skillId) : [...ids, skillId] });
  };

  const field = (name) => ({ value: form[name], onChange: (e) => setForm({ ...form, [name]: e.target.value }) });

  return (
    <div>
      <h2>ניהול פעילויות</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form className="card" onSubmit={submit}>
        <h3>{editingId ? `עריכת פעילות #${editingId}` : 'פעילות חדשה'}</h3>
        <div className="row">
          <label>כותרת<input required minLength={3} {...field('title')} /></label>
          <label>סוג
            <select {...field('category')}>
              {Object.entries(CATEGORIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </label>
          <label>שכונה<input required minLength={2} {...field('neighborhood')} /></label>
          <label>התחלה<input type="datetime-local" required {...field('startTime')} /></label>
          <label>סיום<input type="datetime-local" required {...field('endTime')} /></label>
          <label>מספר מתנדבות<input type="number" min={1} max={100} required {...field('maxVolunteers')} /></label>
        </div>
        <label>תיאור<textarea rows={2} {...field('description')} /></label>
        {skills.length > 0 && (
          <fieldset>
            <legend>מיומנויות נדרשות</legend>
            {skills.map((s) => (
              <label key={s.id} style={{ display: 'inline-block', marginInlineEnd: 12 }}>
                <input type="checkbox" checked={form.requiredSkillIds.includes(s.id)} onChange={() => toggleSkill(s.id)} /> {s.name}
              </label>
            ))}
          </fieldset>
        )}
        <div className="row" style={{ marginTop: 8 }}>
          <button type="submit">{editingId ? 'שמירה' : 'יצירה'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>ביטול עריכה</button>}
        </div>
      </form>

      <table>
        <thead><tr><th>כותרת</th><th>מועד</th><th>שכונה</th><th>מקומות</th><th>סטטוס</th><th>פעולות</th></tr></thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{formatDate(a.startTime)}</td>
              <td>{a.neighborhood}</td>
              <td>{a.availableSpots} / {a.maxVolunteers}</td>
              <td>{a.isActive ? 'פעילה' : 'בוטלה'}</td>
              <td className="row">
                {a.isActive && <button onClick={() => edit(a)}>עריכה</button>}
                {a.isActive && <button onClick={() => cancelActivity(a)}>ביטול</button>}
                <button onClick={() => showRegistrations(a)}>נרשמות</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {registrations && (
        <div className="card">
          <h3>נרשמות ל־{registrations.activity.title}</h3>
          {registrations.list.length === 0 && <p className="muted">אין נרשמות</p>}
          <ul>
            {registrations.list.map((r) => (
              <li key={r.id}>
                {r.userFullName} – {r.status === 'Active' ? 'פעילה' : 'בוטלה'}
                {r.status === 'Active' && <button onClick={() => cancelRegistration(r.id)}> ביטול הרשמה</button>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
