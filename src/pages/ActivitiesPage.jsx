import { useEffect, useState } from 'react';
import { apiRequest, CATEGORIES, formatDate } from '../api.js';

const PAGE_SIZE = 5;

export default function ActivitiesPage({ onOpen }) {
  const [filters, setFilters] = useState({
    neighborhood: '', category: '', onlyAvailable: false, myNeighborhoodFirst: false, sortBy: 'startTime', sortDirection: 'asc'
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Filtering, sorting and paging are done by the server (Skip/Take in SQL)
    const params = new URLSearchParams({
      pageNumber, pageSize: PAGE_SIZE, sortBy: filters.sortBy, sortDirection: filters.sortDirection,
      onlyAvailable: filters.onlyAvailable, myNeighborhoodFirst: filters.myNeighborhoodFirst
    });
    if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);
    if (filters.category) params.set('category', filters.category);

    setError('');
    apiRequest(`/api/activities?${params}`)
      .then(setResult)
      .catch((err) => setError(err.message));
  }, [filters, pageNumber]);

  const changeFilter = (field, value) => {
    setPageNumber(1);
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div>
      <h2>פעילויות התנדבות</h2>

      <div className="card row">
        <label>שכונה
          <input value={filters.neighborhood} onChange={(e) => changeFilter('neighborhood', e.target.value)} />
        </label>
        <label>סוג פעילות
          <select value={filters.category} onChange={(e) => changeFilter('category', e.target.value)}>
            <option value="">הכל</option>
            {Object.entries(CATEGORIES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
          </select>
        </label>
        <label>מיון לפי
          <select value={filters.sortBy} onChange={(e) => changeFilter('sortBy', e.target.value)}>
            <option value="startTime">מועד</option>
            <option value="title">כותרת</option>
            <option value="neighborhood">שכונה</option>
            <option value="availableSpots">מקומות פנויים</option>
          </select>
        </label>
        <label>כיוון
          <select value={filters.sortDirection} onChange={(e) => changeFilter('sortDirection', e.target.value)}>
            <option value="asc">עולה</option>
            <option value="desc">יורד</option>
          </select>
        </label>
        <label>
          <span><input type="checkbox" checked={filters.onlyAvailable}
            onChange={(e) => changeFilter('onlyAvailable', e.target.checked)} /> רק פעילויות פנויות</span>
        </label>
        <label>
          <span><input type="checkbox" checked={filters.myNeighborhoodFirst}
            onChange={(e) => changeFilter('myNeighborhoodFirst', e.target.checked)} /> קודם בשכונה שלי</span>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {result && (
        <>
          <table>
            <thead>
              <tr><th>כותרת</th><th>סוג</th><th>שכונה</th><th>מועד</th><th>מקומות פנויים</th><th>סטטוס</th><th></th></tr>
            </thead>
            <tbody>
              {result.items.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td>{CATEGORIES[a.category]}</td>
                  <td>{a.neighborhood}</td>
                  <td>{formatDate(a.startTime)}</td>
                  <td>{a.availableSpots} / {a.maxVolunteers}</td>
                  <td>{a.isActive ? 'פעילה' : 'בוטלה'}</td>
                  <td><button onClick={() => onOpen(a.id)}>פרטים</button></td>
                </tr>
              ))}
              {result.items.length === 0 && <tr><td colSpan={7} className="muted">לא נמצאו פעילויות</td></tr>}
            </tbody>
          </table>

          <div className="row" style={{ marginTop: 12 }}>
            <button disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>הקודם</button>
            <span>עמוד {result.pageNumber} מתוך {Math.max(result.totalPages, 1)} ({result.totalCount} פעילויות)</span>
            <button disabled={pageNumber >= result.totalPages} onClick={() => setPageNumber(pageNumber + 1)}>הבא</button>
          </div>
        </>
      )}
    </div>
  );
}
