import { useState } from 'react';
import { apiRequest } from '../api.js';
import { Alert, EmptyState, Icon } from '../ui.jsx';

// PLAN 3.1 (9): the coordinator manages the basic skills.
// Deleting a skill removes only its links to volunteers and activities (UserSkills / ActivitySkills).
export default function SkillsAdmin({ skills, onChanged }) {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const run = async (action, successText) => {
    setMessage('');
    setError('');
    try {
      await action();
      setMessage(successText);
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const create = (e) => {
    e.preventDefault();
    run(async () => {
      await apiRequest('/api/skills', { method: 'POST', body: { name } });
      setName('');
    }, 'המיומנות נוספה.');
  };

  const rename = (e) => {
    e.preventDefault();
    run(async () => {
      await apiRequest(`/api/skills/${editing.id}`, { method: 'PUT', body: { name: editing.name } });
      setEditing(null);
    }, 'המיומנות עודכנה.');
  };

  const remove = (skill) => {
    if (!window.confirm(`למחוק את המיומנות "${skill.name}"? היא תוסר מהמתנדבות ומהפעילויות.`)) return;
    run(() => apiRequest(`/api/skills/${skill.id}`, { method: 'DELETE' }), 'המיומנות נמחקה.');
  };

  return (
    <div className="card skills-admin">
      <div className="card-head">
        <div className="card-title">
          <span className="icon-wrap peach"><Icon name="award" /></span>
          <h3>ניהול מיומנויות</h3>
        </div>
        <span className="badge badge-muted">{skills.length}</span>
      </div>

      <div className="stack" style={{ gap: 10, marginBottom: message || error ? 14 : 0 }}>
        <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>
        <Alert type="error" onClose={() => setError('')}>{error}</Alert>
      </div>

      <form className="inline-form" onSubmit={create}>
        <label className="field">מיומנות חדשה
          <input className="input" required minLength={2} placeholder="למשל: עזרה במתמטיקה" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary" aria-label="הוספה"><Icon name="plus" /> הוספה</button>
      </form>

      {skills.length === 0 ? (
        <EmptyState icon="award" title="אין מיומנויות">הוסיפי את המיומנות הראשונה.</EmptyState>
      ) : (
        <ul className="skill-list">
          {skills.map((s) => (
            <li key={s.id} className="skill-row">
              {editing?.id === s.id ? (
                <form onSubmit={rename}>
                  <input className="input" aria-label="שם המיומנות" required minLength={2} autoFocus value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  <button type="submit" className="icon-btn" title="שמירה" aria-label="שמירה"><Icon name="check" size={17} /></button>
                  <button type="button" className="icon-btn" title="ביטול" aria-label="ביטול" onClick={() => setEditing(null)}><Icon name="x" size={17} /></button>
                </form>
              ) : (
                <>
                  <span className="name"><Icon name="sparkles" size={15} />{s.name}</span>
                  <button type="button" className="icon-btn" title="שינוי שם" aria-label={`שינוי שם ${s.name}`}
                    onClick={() => setEditing({ id: s.id, name: s.name })}><Icon name="edit" size={16} /></button>
                  <button type="button" className="icon-btn danger" title="מחיקה" aria-label={`מחיקת ${s.name}`}
                    onClick={() => remove(s)}><Icon name="trash" size={16} /></button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
