import { useEffect, useRef, useState } from 'react';
import { apiRequest, CATEGORIES, fromIsraelInput, toIsraelInput } from '../api.js';
import {
  ActivityStatus, Alert, Avatar, CapacityBar, CategoryBadge, EmptyState, Icon, PageHeader, RegistrationStatus,
  formatShortDate, formatTime
} from '../ui.jsx';
import SkillsAdmin from './SkillsAdmin.jsx';

const emptyForm = {
  title: '', description: '', category: 'HomeworkHelp', neighborhood: '', startTime: '', endTime: '', maxVolunteers: 1, requiredSkillIds: []
};

// The form shows and accepts Israel time; the API receives and returns UTC

export default function AdminPage() {
  const [activities, setActivities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [registrations, setRegistrations] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const formRef = useRef(null);

  const load = () =>
    apiRequest('/api/activities?pageNumber=1&pageSize=50&sortBy=startTime&sortDirection=desc')
      .then((page) => setActivities(page.items))
      .catch((err) => setError(err.message));

  const loadSkills = () => apiRequest('/api/skills').then(setSkills).catch((err) => setError(err.message));

  useEffect(() => {
    load();
    loadSkills();
  }, []);

  // Close the registrations drawer with Escape
  useEffect(() => {
    if (!registrations) return;
    const onKey = (e) => e.key === 'Escape' && setRegistrations(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [registrations]);

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
      startTime: fromIsraelInput(form.startTime),
      endTime: fromIsraelInput(form.endTime),
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
      startTime: toIsraelInput(a.startTime), endTime: toIsraelInput(a.endTime), maxVolunteers: a.maxVolunteers,
      requiredSkillIds: a.requiredSkills.map((s) => s.id)
    });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
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
      const list = await apiRequest(`/api/activities/${a.id}/registrations`);
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

  const active = activities.filter((a) => a.isActive);
  const stats = [
    { label: 'סה"כ פעילויות', value: activities.length, icon: 'grid', tone: '' },
    { label: 'פעילויות פעילות', value: active.length, icon: 'check-circle', tone: 'peach' },
    { label: 'מקומות פנויים', value: active.reduce((sum, a) => sum + a.availableSpots, 0), icon: 'users', tone: 'navy' },
    { label: 'בוטלו', value: activities.length - active.length, icon: 'ban', tone: 'muted' }
  ];

  return (
    <div>
      <PageHeader eyebrow="ממשק רכזת" icon="shield" title="ניהול פעילויות"
        subtitle="יצירה, עריכה וביטול של פעילויות, מעקב אחר נרשמות וניהול מיומנויות." />

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className={`stat ${s.tone === 'muted' ? 'muted-stat' : ''}`}>
            <span className={`icon-wrap ${s.tone}`}><Icon name={s.icon} size={20} /></span>
            <div><small>{s.label}</small><b>{s.value}</b></div>
          </div>
        ))}
      </div>

      <div className="stack" style={{ gap: 12, marginBottom: message || error ? 18 : 0 }}>
        <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>
        <Alert type="error" onClose={() => setError('')}>{error}</Alert>
      </div>

      <div className="admin-layout">
        <form className="card" onSubmit={submit} ref={formRef} style={{ scrollMarginTop: 90 }}>
          <div className="card-head">
            <div className="card-title">
              <span className={`icon-wrap ${editingId ? 'peach' : ''}`}><Icon name={editingId ? 'edit' : 'plus'} /></span>
              <h3>{editingId ? `עריכת פעילות #${editingId}` : 'פעילות חדשה'}</h3>
            </div>
          </div>
          {editingId && (
            <div className="editing-banner"><Icon name="edit" size={16} /> את עורכת פעילות קיימת. שינוי שעות לא יאושר אם ייצור חפיפה לנרשמות.</div>
          )}

          <div className="form-grid">
            <label className="field span-all">כותרת<input className="input" required minLength={3} {...field('title')} /></label>
            <label className="field">סוג
              <select className="select" {...field('category')}>
                {Object.entries(CATEGORIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
            <label className="field">שכונה<input className="input" required minLength={2} {...field('neighborhood')} /></label>
            <label className="field">מספר מתנדבות<input className="input" type="number" min={1} max={100} required {...field('maxVolunteers')} /></label>
            <label className="field">התחלה (שעון ישראל)<input className="input" type="datetime-local" required {...field('startTime')} /></label>
            <label className="field">סיום (שעון ישראל)<input className="input" type="datetime-local" required {...field('endTime')} /></label>
            <label className="field span-all">תיאור<textarea className="textarea" rows={3} {...field('description')} /></label>
            {skills.length > 0 && (
              <fieldset className="fieldset span-all">
                <legend>מיומנויות נדרשות</legend>
                <div className="pill-group">
                  {skills.map((s) => (
                    <label key={s.id} className="pill-check">
                      <input type="checkbox" checked={form.requiredSkillIds.includes(s.id)} onChange={() => toggleSkill(s.id)} />
                      <span><Icon name="check" size={14} />{s.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <Icon name={editingId ? 'save' : 'plus'} /> {editingId ? 'שמירה' : 'יצירה'}
            </button>
            {editingId && <button type="button" className="btn" onClick={cancelEdit}>ביטול עריכה</button>}
          </div>
        </form>

        <aside className="admin-side">
          <SkillsAdmin skills={skills} onChanged={() => { loadSkills(); load(); }} />
        </aside>
      </div>

      <div className="table-wrap" style={{ marginTop: 20 }}>
        <div className="card-head">
          <div className="card-title">
            <span className="icon-wrap navy"><Icon name="list" /></span>
            <h3>כל הפעילויות</h3>
          </div>
          <span className="muted" style={{ fontSize: '.85rem' }}>{activities.length} פעילויות</span>
        </div>
        {activities.length === 0 ? (
          <EmptyState icon="calendar" title="אין עדיין פעילויות">צרי את הפעילות הראשונה בטופס למעלה.</EmptyState>
        ) : (
          <table className="table">
            <thead><tr><th>כותרת</th><th>מועד</th><th>שכונה</th><th>מקומות</th><th>סטטוס</th><th><span className="sr-only">פעולות</span></th></tr></thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a.id} className={editingId === a.id || registrations?.activity.id === a.id ? 'selected' : ''}>
                  <td className="title-cell">
                    <b>{a.title}</b>
                    <CategoryBadge category={a.category} />
                  </td>
                  <td data-label="מועד" className="date-cell">
                    <span>{formatShortDate(a.startTime)}<br /><small className="muted">{formatTime(a.startTime)} – {formatTime(a.endTime)}</small></span>
                  </td>
                  <td data-label="שכונה">{a.neighborhood}</td>
                  <td data-label="מקומות" className="capacity-cell"><CapacityBar available={a.availableSpots} max={a.maxVolunteers} /></td>
                  <td data-label="סטטוס"><ActivityStatus isActive={a.isActive} /></td>
                  <td>
                    <div className="actions">
                      <button className="btn btn-soft btn-sm" onClick={() => showRegistrations(a)}>
                        <Icon name="users" size={15} /> נרשמות
                      </button>
                      {a.isActive && (
                        <button className="icon-btn" title="עריכה" aria-label={`עריכת ${a.title}`} onClick={() => edit(a)}>
                          <Icon name="edit" size={17} />
                        </button>
                      )}
                      {a.isActive && (
                        <button className="icon-btn danger" title="ביטול פעילות" aria-label={`ביטול ${a.title}`} onClick={() => cancelActivity(a)}>
                          <Icon name="ban" size={17} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {registrations && (
        <>
          <div className="overlay" onClick={() => setRegistrations(null)} />
          <div className="drawer" role="dialog" aria-modal="true" aria-label={`נרשמות ל־${registrations.activity.title}`}>
            <div className="drawer-head">
              <span className="icon-wrap" style={{ background: 'rgba(255,255,255,.14)', color: '#ffd4bd' }}><Icon name="users" /></span>
              <div>
                <h3>נרשמות ל־{registrations.activity.title}</h3>
                <small>
                  {registrations.list.filter((r) => r.status === 'Active').length} רשומות פעילות · {formatShortDate(registrations.activity.startTime)}
                </small>
              </div>
              <button className="icon-btn" aria-label="סגירה" onClick={() => setRegistrations(null)} autoFocus>
                <Icon name="x" />
              </button>
            </div>
            <div className="drawer-body">
              <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>
              <Alert type="error" onClose={() => setError('')}>{error}</Alert>
              {registrations.list.length === 0 && <EmptyState icon="users" title="אין נרשמות">עדיין אף מתנדבת לא נרשמה לפעילות זו.</EmptyState>}
              {registrations.list.map((r, i) => (
                <div key={r.id} className={`person ${r.status === 'Active' ? '' : 'cancelled'}`} style={{ animationDelay: `${i * 40}ms` }}>
                  <Avatar name={r.userFullName} />
                  <div className="person-info">
                    <b>{r.userFullName}</b>
                    <RegistrationStatus status={r.status} />
                  </div>
                  {r.status === 'Active' && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancelRegistration(r.id)}>ביטול הרשמה</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
