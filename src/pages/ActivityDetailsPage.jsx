import { useEffect, useState } from 'react';
import { apiRequest, CATEGORIES, formatDate } from '../api.js';

export default function ActivityDetailsPage({ id, isAdmin, onBack }) {
  const [activity, setActivity] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => apiRequest(`/api/activities/${id}`).then(setActivity).catch((err) => setError(err.message));

  useEffect(() => { load(); }, [id]);

  const register = async () => {
    setMessage('');
    setError('');
    try {
      await apiRequest('/api/registrations', { method: 'POST', body: { activityId: id } });
      setMessage('נרשמת בהצלחה לפעילות!');
    } catch (err) {
      // 409 = full activity, duplicate, overlap, or another volunteer took the last spot at the same moment
      setError(err.status === 409 ? `לא ניתן להירשם: ${err.message}` : err.message);
    }
    load();
  };

  if (!activity) return error ? <p className="error">{error}</p> : <p>טוען...</p>;

  return (
    <div className="card">
      <button onClick={onBack}>חזרה לרשימה</button>
      <h2>{activity.title}</h2>
      <p>{activity.description}</p>
      <p><b>סוג:</b> {CATEGORIES[activity.category]} | <b>שכונה:</b> {activity.neighborhood}</p>
      <p><b>מועד:</b> {formatDate(activity.startTime)} – {formatDate(activity.endTime)}</p>
      {activity.requiredSkills.length > 0 && (
        <p><b>מיומנויות נדרשות:</b> {activity.requiredSkills.map((s) => s.name).join(', ')}</p>
      )}
      <p><b>מקומות פנויים:</b> {activity.availableSpots} מתוך {activity.maxVolunteers}</p>
      {!activity.isActive && <p className="error">הפעילות בוטלה</p>}

      {!isAdmin && (
        <button disabled={!activity.isActive || activity.availableSpots === 0} onClick={register}>
          {activity.availableSpots === 0 ? 'אין מקומות פנויים' : 'הרשמה לפעילות'}
        </button>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
