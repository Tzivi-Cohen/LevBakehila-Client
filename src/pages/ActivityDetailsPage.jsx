import { useEffect, useState } from 'react';
import { apiRequest } from '../api.js';
import {
  ActivityStatus, Alert, CapacityBar, CategoryBadge, Icon, Loader, formatLongDate, formatTime
} from '../ui.jsx';

export default function ActivityDetailsPage({ id, isAdmin, onBack }) {
  const [activity, setActivity] = useState(null);
  const [mySkillIds, setMySkillIds] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => apiRequest(`/api/activities/${id}`).then(setActivity).catch((err) => setError(err.message));

  useEffect(() => { load(); }, [id]);

  // The volunteer's own skills, to show which of the required skills she already has
  useEffect(() => {
    if (isAdmin) return;
    apiRequest('/api/users/me').then((me) => setMySkillIds(me.skills.map((s) => s.id))).catch(() => setMySkillIds([]));
  }, [isAdmin]);

  const register = async () => {
    setMessage('');
    setError('');
    setBusy(true);
    try {
      await apiRequest('/api/registrations', { method: 'POST', body: { activityId: id } });
      setMessage('נרשמת בהצלחה לפעילות!');
    } catch (err) {
      // 409 = full activity, duplicate, overlap, or another volunteer took the last spot at the same moment
      setError(err.status === 409 ? `לא ניתן להירשם: ${err.message}` : err.message);
    }
    await load();
    setBusy(false);
  };

  const backButton = (
    <button className="btn btn-ghost back-link" onClick={onBack}>
      <Icon name="arrow-right" /> חזרה לרשימה
    </button>
  );

  if (!activity) {
    return error
      ? <div>{backButton}<Alert type="error">{error}</Alert></div>
      : <Loader text="טוען את פרטי הפעילות..." />;
  }

  const full = activity.availableSpots === 0;
  const required = activity.requiredSkills;
  const matched = mySkillIds ? required.filter((s) => mySkillIds.includes(s.id)).length : 0;

  return (
    <div>
      {backButton}

      <section className="detail-hero">
        <div className="row">
          <CategoryBadge category={activity.category} />
          {!activity.isActive && <ActivityStatus isActive={false} />}
        </div>
        <h2>{activity.title}</h2>
        <div className="hero-sub">
          <span><Icon name="pin" size={16} />{activity.neighborhood}</span>
          <span><Icon name="calendar" size={16} />{formatLongDate(activity.startTime)}</span>
          <span><Icon name="clock" size={16} />{formatTime(activity.startTime)} – {formatTime(activity.endTime)}</span>
        </div>
        <span className="hero-accent" aria-hidden="true" />
      </section>

      <div className="detail-grid">
        <div className="card">
          <div className="info-tiles">
            <div className="info-tile">
              <span className="icon-wrap"><Icon name="calendar" /></span>
              <div><small>התחלה</small><b>{formatLongDate(activity.startTime)}</b><span className="muted">{formatTime(activity.startTime)}</span></div>
            </div>
            <div className="info-tile">
              <span className="icon-wrap peach"><Icon name="clock" /></span>
              <div><small>סיום</small><b>{formatLongDate(activity.endTime)}</b><span className="muted">{formatTime(activity.endTime)}</span></div>
            </div>
            <div className="info-tile">
              <span className="icon-wrap navy"><Icon name="pin" /></span>
              <div><small>שכונה</small><b>{activity.neighborhood}</b></div>
            </div>
          </div>

          {activity.description && (
            <>
              <div className="section-label">על הפעילות</div>
              <p className="description">{activity.description}</p>
            </>
          )}

          {required.length > 0 && (
            <>
              <div className="section-label">
                מיומנויות נדרשות
                {mySkillIds && <span className="muted" style={{ fontWeight: 600 }}> · יש לך {matched} מתוך {required.length}</span>}
              </div>
              <div className="pill-group">
                {required.map((s) => {
                  if (!mySkillIds) return <span key={s.id} className="skill-chip">{s.name}</span>;
                  const have = mySkillIds.includes(s.id);
                  return (
                    <span key={s.id} className={`skill-chip ${have ? 'have' : 'missing'}`}>
                      <Icon name={have ? 'check' : 'x'} size={14} />{s.name}
                    </span>
                  );
                })}
              </div>
              {mySkillIds && (
                <p className="muted" style={{ fontSize: '.84rem', marginTop: 10 }}>
                  <Icon name="info" size={14} /> מידע מנחה בלבד – לא חוסם הרשמה. אפשר לעדכן מיומנויות ב"הפרופיל שלי".
                </p>
              )}
            </>
          )}
        </div>

        <aside className="card register-panel">
          <div>
            <div className="section-label" style={{ marginTop: 0 }}>מקומות פנויים</div>
            <div className="big-number"><b>{activity.availableSpots}</b><span>מתוך {activity.maxVolunteers}</span></div>
          </div>
          <CapacityBar available={activity.availableSpots} max={activity.maxVolunteers} />

          {!activity.isActive && <Alert type="error">הפעילות בוטלה</Alert>}

          {!isAdmin && (
            <button className="btn btn-primary btn-lg btn-block" disabled={!activity.isActive || full || busy} onClick={register}>
              {busy ? <span className="spinner" /> : <Icon name={full ? 'ban' : 'heart'} />}
              {full ? 'אין מקומות פנויים' : 'הרשמה לפעילות'}
            </button>
          )}
          {isAdmin && <Alert type="info">צפייה כרכזת – ניהול הנרשמות מתבצע במסך "ניהול".</Alert>}

          <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>
          <Alert type="error" onClose={() => setError('')}>{error}</Alert>
        </aside>
      </div>
    </div>
  );
}
