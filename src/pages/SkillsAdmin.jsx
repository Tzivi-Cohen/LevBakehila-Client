import { useState } from 'react';
import { apiRequest } from '../api.js';

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
      <h3>ניהול מיומנויות</h3>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form className="row" onSubmit={create}>
        <label>מיומנות חדשה<input required minLength={2} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <button type="submit">הוספה</button>
      </form>
      <ul>
        {skills.map((s) => (
          <li key={s.id}>
            {editing?.id === s.id ? (
              <form className="row" onSubmit={rename} style={{ display: 'inline-flex' }}>
                <input aria-label="שם המיומנות" required minLength={2} value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                <button type="submit">שמירה</button>
                <button type="button" onClick={() => setEditing(null)}>ביטול</button>
              </form>
            ) : (
              <>
                {s.name}{' '}
                <button type="button" onClick={() => setEditing({ id: s.id, name: s.name })}>שינוי שם</button>{' '}
                <button type="button" onClick={() => remove(s)}>מחיקה</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
