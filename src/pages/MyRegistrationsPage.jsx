import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';
import {
  Alert, DateBlock, EmptyState, Icon, PageHeader, RegistrationStatus, formatLongDate, formatTime
} from '../ui.jsx';

const VIEWS = [
  { key: 'all', label: 'הכל' },
  { key: 'Active', label: 'פעילות' },
  { key: 'Cancelled', label: 'מבוטלות' }
];

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState(null);
  const [view, setView] = useState('all');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => apiRequest('/api/registrations/mine').then(setRegistrations).catch((err) => setError(err.message));

  useEffect(() => { load(); }, []);

  const cancel = async (r) => {
    if (!window.confirm(`לבטל את ההרשמה ל"${r.activityTitle}"?`)) return;
    setMessage('');
    setError('');
    try {
      await apiRequest(`/api/registrations/${r.id}`, { method: 'DELETE' });
      setMessage('ההרשמה בוטלה.');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const list = registrations ?? [];
  const count = (key) => (key === 'all' ? list.length : list.filter((r) => (key === 'Active' ? r.status === 'Active' : r.status !== 'Active')).length);
  const visible = list.filter((r) => view === 'all' || (view === 'Active' ? r.status === 'Active' : r.status !== 'Active'));

  return (
    <div>
      <PageHeader eyebrow="האזור האישי" icon="heart" title="ההרשמות שלי"
        subtitle="כל הפעילויות שנרשמת אליהן, במקום אחד.">
        {registrations && list.length > 0 && (
          <div className="tabs" role="tablist">
            {VIEWS.map((v) => (
              <button key={v.key} role="tab" aria-selected={view === v.key} className={`tab ${view === v.key ? 'active' : ''}`}
                onClick={() => setView(v.key)}>
                {v.label} <span className="count">{count(v.key)}</span>
              </button>
            ))}
          </div>
        )}
      </PageHeader>

      <div className="stack" style={{ gap: 12, marginBottom: message || error ? 18 : 0 }}>
        <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>
        <Alert type="error" onClose={() => setError('')}>{error}</Alert>
      </div>

      {!registrations && !error && (
        <div className="reg-list">
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton" style={{ height: 92 }} />)}
        </div>
      )}

      {registrations && visible.length === 0 && (
        <div className="card">
          <EmptyState icon="calendar" title={list.length === 0 ? 'אין הרשמות' : 'אין הרשמות בתצוגה זו'}>
            {list.length === 0 ? 'עוד לא נרשמת לפעילות. הפעילויות הפתוחות מחכות לך במסך "פעילויות".' : 'נסי לבחור תצוגה אחרת.'}
          </EmptyState>
        </div>
      )}

      {visible.length > 0 && (
        <div className="reg-list">
          {visible.map((r, i) => (
            <div key={r.id} className={`reg-item ${r.status === 'Active' ? '' : 'cancelled'}`} style={{ animationDelay: `${i * 50}ms` }}>
              <DateBlock value={r.activityStartTime} />
              <div className="reg-main">
                <div className="row" style={{ gap: 10 }}>
                  <h3>{r.activityTitle}</h3>
                  <RegistrationStatus status={r.status} />
                </div>
                <div className="reg-meta">
                  <span><Icon name="calendar" size={14} />{formatLongDate(r.activityStartTime)}</span>
                  <span><Icon name="clock" size={14} />{formatTime(r.activityStartTime)} – {formatTime(r.activityEndTime)}</span>
                </div>
              </div>
              {r.status === 'Active' && (
                <button className="btn btn-danger btn-sm" onClick={() => cancel(r)}>
                  <Icon name="x" size={15} /> ביטול הרשמה
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
