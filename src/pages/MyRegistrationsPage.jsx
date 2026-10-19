import { useEffect, useState } from 'react';
import { apiRequest, formatDate } from '../api.js';

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => apiRequest('/api/registrations/mine').then(setRegistrations).catch((err) => setError(err.message));

  useEffect(() => { load(); }, []);

  const cancel = async (id) => {
    setMessage('');
    setError('');
    try {
      await apiRequest(`/api/registrations/${id}`, { method: 'DELETE' });
      setMessage('ההרשמה בוטלה.');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>ההרשמות שלי</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <table>
        <thead><tr><th>פעילות</th><th>מועד</th><th>סטטוס</th><th></th></tr></thead>
        <tbody>
          {registrations.map((r) => (
            <tr key={r.id}>
              <td>{r.activityTitle}</td>
              <td>{formatDate(r.activityStartTime)}</td>
              <td>{r.status === 'Active' ? 'פעילה' : 'בוטלה'}</td>
              <td>{r.status === 'Active' && <button onClick={() => cancel(r.id)}>ביטול הרשמה</button>}</td>
            </tr>
          ))}
          {registrations.length === 0 && <tr><td colSpan={4} className="muted">אין הרשמות</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
