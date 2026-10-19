import { useEffect, useState } from 'react';
import { apiRequest, CATEGORIES } from '../api.js';
import {
  ActivityStatus, Alert, CapacityBar, CategoryBadge, DateBlock, EmptyState, Icon, PageHeader, formatShortDate, formatTime
} from '../ui.jsx';

const PAGE_SIZE = 5;

// Page numbers with gaps: 1 … 4 5 6 … 12
function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['gap' + p, p] : [p]));
}

export default function ActivitiesPage({ onOpen, isAdmin, initialCategory }) {
  const [filters, setFilters] = useState({
    neighborhood: '', category: initialCategory ?? '', onlyAvailable: false, myNeighborhoodFirst: false, sortBy: 'startTime', sortDirection: 'asc'
  });
  const [pageNumber, setPageNumber] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  // Ids of the activities the volunteer is actively registered to - shown as a badge on each card
  const [myActivityIds, setMyActivityIds] = useState([]);

  useEffect(() => {
    if (isAdmin) return;
    apiRequest('/api/registrations/mine')
      .then((list) => setMyActivityIds(list.filter((r) => r.status === 'Active').map((r) => r.activityId)))
      .catch(() => setMyActivityIds([]));
  }, [isAdmin]);

  useEffect(() => {
    // Filtering, sorting and paging are done by the server (Skip/Take in SQL)
    const params = new URLSearchParams({
      pageNumber, pageSize: PAGE_SIZE, sortBy: filters.sortBy, sortDirection: filters.sortDirection,
      onlyAvailable: filters.onlyAvailable, myNeighborhoodFirst: filters.myNeighborhoodFirst
    });
    if (filters.neighborhood) params.set('neighborhood', filters.neighborhood);
    if (filters.category) params.set('category', filters.category);

    setError('');
    setLoading(true);
    apiRequest(`/api/activities?${params}`)
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [filters, pageNumber]);

  const changeFilter = (field, value) => {
    setPageNumber(1);
    setFilters({ ...filters, [field]: value });
  };

  const hasFilters = filters.neighborhood || filters.category || filters.onlyAvailable || filters.myNeighborhoodFirst;
  const clearFilters = () => {
    setPageNumber(1);
    setFilters({ ...filters, neighborhood: '', category: '', onlyAvailable: false, myNeighborhoodFirst: false });
  };

  return (
    <div>
      <PageHeader eyebrow="מצאי את המקום שלך" icon="sparkles" title="פעילויות עם הילדים"
        subtitle="בחרי פעילות לפי שכונה וסוג, ראי כמה מקומות נשארו והירשמי בלחיצה." />

      <div className="card filters-card">
        <div className="category-chips" role="group" aria-label="סינון מהיר לפי סוג פעילות">
          <button type="button" className={`chip ${filters.category === '' ? 'active' : ''}`} aria-pressed={filters.category === ''}
            onClick={() => changeFilter('category', '')}>הכל</button>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button key={key} type="button" className={`chip chip-${key} ${filters.category === key ? 'active' : ''}`}
              aria-pressed={filters.category === key} onClick={() => changeFilter('category', key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="filters">
          <label className="field">שכונה
            <span className="input-icon">
              <Icon name="search" size={17} />
              <input className="input" placeholder="חיפוש לפי שכונה..." value={filters.neighborhood}
                onChange={(e) => changeFilter('neighborhood', e.target.value)} />
            </span>
          </label>
          <label className="field">מיון לפי
            <select className="select" value={filters.sortBy} onChange={(e) => changeFilter('sortBy', e.target.value)}>
              <option value="startTime">מועד</option>
              <option value="title">כותרת</option>
              <option value="neighborhood">שכונה</option>
              <option value="availableSpots">מקומות פנויים</option>
            </select>
          </label>
          <label className="field">כיוון
            <select className="select" value={filters.sortDirection} onChange={(e) => changeFilter('sortDirection', e.target.value)}>
              <option value="asc">עולה</option>
              <option value="desc">יורד</option>
            </select>
          </label>
        </div>
        <div className="filters-toggles">
          <label className="switch">
            <input type="checkbox" checked={filters.onlyAvailable} onChange={(e) => changeFilter('onlyAvailable', e.target.checked)} />
            <span className="track" />
            רק פעילויות פנויות
          </label>
          <label className="switch">
            <input type="checkbox" checked={filters.myNeighborhoodFirst} onChange={(e) => changeFilter('myNeighborhoodFirst', e.target.checked)} />
            <span className="track" />
            קודם בשכונה שלי
          </label>
          {hasFilters && (
            <button type="button" className="btn btn-ghost btn-sm" style={{ marginInlineStart: 'auto' }} onClick={clearFilters}>
              <Icon name="x" size={15} /> ניקוי סינון
            </button>
          )}
        </div>
      </div>

      {error && <div style={{ marginTop: 18 }}><Alert type="error">{error}</Alert></div>}

      {!result && loading && (
        <div className="grid-cards" style={{ marginTop: 26 }}>
          {Array.from({ length: 3 }, (_, i) => <div key={i} className="skeleton skeleton-card" />)}
        </div>
      )}

      {result && (
        <>
          <div className="results-meta">
            <span>נמצאו <b>{result.totalCount}</b> פעילויות</span>
            {loading && <span className="row" style={{ gap: 8 }}><span className="spinner" /> מעדכן...</span>}
          </div>

          {result.items.length === 0 ? (
            <div className="card">
              <EmptyState icon="search" title="לא נמצאו פעילויות">נסי לשנות את הסינון או לחפש שכונה אחרת.</EmptyState>
            </div>
          ) : (
            <div className="grid-cards" style={{ opacity: loading ? 0.6 : 1, transition: 'opacity .2s' }}>
              {result.items.map((a, i) => (
                <button key={a.id} type="button" className={`activity-card accent-${a.category} ${a.isActive ? '' : 'cancelled'}`}
                  style={{ animationDelay: `${i * 60}ms` }} onClick={() => onOpen(a.id)}>
                  <div className="activity-card-top">
                    <CategoryBadge category={a.category} />
                    <div className="row" style={{ gap: 6 }}>
                      {myActivityIds.includes(a.id) && <span className="badge badge-registered">את רשומה</span>}
                      <ActivityStatus isActive={a.isActive} />
                    </div>
                  </div>
                  <div className="activity-card-title">
                    <DateBlock value={a.startTime} />
                    <h3>{a.title}</h3>
                  </div>
                  <div className="meta-list">
                    <span className="meta-item"><Icon name="pin" size={16} />{a.neighborhood}</span>
                    <span className="meta-item"><Icon name="calendar" size={16} />{formatShortDate(a.startTime)}</span>
                    <span className="meta-item"><Icon name="clock" size={16} />{formatTime(a.startTime)} – {formatTime(a.endTime)}</span>
                  </div>
                  <div className="activity-card-footer">
                    <CapacityBar available={a.availableSpots} max={a.maxVolunteers} />
                    <span className="card-arrow" aria-hidden="true"><Icon name="arrow-left" /></span>
                  </div>
                  <span className="sr-only">פרטים</span>
                </button>
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <nav className="pagination" aria-label="דפדוף">
              <button className="btn btn-sm" disabled={pageNumber <= 1} onClick={() => setPageNumber(pageNumber - 1)}>
                <Icon name="chevron-right" size={16} /> הקודם
              </button>
              {pageList(result.pageNumber, result.totalPages).map((p) =>
                typeof p === 'string'
                  ? <span key={p} className="page-gap">…</span>
                  : (
                    <button key={p} className={`page-num ${p === result.pageNumber ? 'active' : ''}`}
                      aria-current={p === result.pageNumber ? 'page' : undefined} onClick={() => setPageNumber(p)}>
                      {p}
                    </button>
                  ))}
              <button className="btn btn-sm" disabled={pageNumber >= result.totalPages} onClick={() => setPageNumber(pageNumber + 1)}>
                הבא <Icon name="chevron-left" size={16} />
              </button>
            </nav>
          )}
          <p className="muted" style={{ textAlign: 'center', marginTop: 12, fontSize: '.85rem' }}>
            עמוד {result.pageNumber} מתוך {Math.max(result.totalPages, 1)}
          </p>
        </>
      )}
    </div>
  );
}
