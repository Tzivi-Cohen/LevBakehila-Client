// Shared presentational building blocks: icons, alerts, badges, capacity bar, loaders and date helpers.
// No API calls live here - pages keep all data logic.
import { CATEGORIES, ISRAEL_TZ } from './api.js';

// ---------- Icons (stroke icons, 24x24 grid) ----------
const ICONS = {
  heart: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
  filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />,
  sort: <path d="m3 16 4 4 4-4M7 20V4M21 8l-4-4-4 4M17 4v16" />,
  'chevron-left': <path d="m15 18-6-6 6-6" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'arrow-right': <path d="M5 12h14M12 5l7 7-7 7" />,
  'arrow-left': <path d="M19 12H5M12 19l-7-7 7-7" />,
  check: <path d="M20 6 9 17l-5-5" />,
  'check-circle': <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m22 4-10 10.01-3-3" /></>,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  alert: <><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  plus: <path d="M12 5v14M5 12h14" />,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></>,
  trash: <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />,
  ban: <><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
  sparkles: <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
  home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /><path d="M9 22V12h6v10" /></>,
  moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
  book: <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15ZM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />,
  smile: <><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></>,
  award: <><circle cx="12" cy="8" r="6" /><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11" /></>,
  inbox: <><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z" /></>,
  save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" /><path d="M17 21v-8H7v8M7 3v5h8" /></>
};

export function Icon({ name, size = 18, strokeWidth = 2, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {ICONS[name]}
    </svg>
  );
}

// ---------- Feedback ----------
export function Alert({ type = 'success', children, onClose }) {
  if (!children) return null;
  const icon = { success: 'check-circle', error: 'alert', info: 'info', warning: 'alert' }[type];
  return (
    <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}>
      <Icon name={icon} />
      <div className="alert-body">{children}</div>
      {onClose && (
        <button type="button" className="icon-btn" aria-label="סגירת הודעה" onClick={onClose}>
          <Icon name="x" size={15} />
        </button>
      )}
    </div>
  );
}

export function Loader({ text = 'טוען...' }) {
  return (
    <div className="loader" role="status">
      <span className="spinner" />
      <p>{text}</p>
    </div>
  );
}

export function EmptyState({ icon = 'inbox', title, children }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon name={icon} size={30} strokeWidth={1.7} /></div>
      <h3>{title}</h3>
      {children && <p>{children}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, icon, title, subtitle, children }) {
  return (
    <div className="page-head">
      <div>
        {eyebrow && <div className="eyebrow">{icon && <Icon name={icon} size={15} />}{eyebrow}</div>}
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ---------- Badges ----------
const CATEGORY_ICONS = {
  FridayNight: 'moon', SaturdayAfternoon: 'sun', WeekdayAfternoon: 'clock', HomeworkHelp: 'book', SocialActivity: 'smile'
};

export function CategoryBadge({ category }) {
  return (
    <span className={`cat cat-${category}`}>
      <Icon name={CATEGORY_ICONS[category] ?? 'sparkles'} size={14} />
      {CATEGORIES[category] ?? category}
    </span>
  );
}

export function ActivityStatus({ isActive }) {
  return isActive
    ? <span className="badge badge-success">פעילה</span>
    : <span className="badge badge-danger">בוטלה</span>;
}

export function RegistrationStatus({ status }) {
  return status === 'Active'
    ? <span className="badge badge-success">רשומה</span>
    : <span className="badge badge-muted">בוטלה</span>;
}

// ---------- Capacity ----------
export function CapacityBar({ available, max }) {
  const taken = Math.max(max - available, 0);
  const pct = max > 0 ? Math.min(100, Math.round((taken / max) * 100)) : 100;
  const state = available <= 0 ? 'full' : available <= Math.max(1, Math.ceil(max * 0.25)) ? 'low' : 'ok';
  return (
    <div className={`capacity ${state}`}>
      <div className="capacity-label">
        <b>{available <= 0 ? 'מלאה' : available === 1 ? 'מקום אחרון!' : `${available} מקומות פנויים`}</b>
        <span>{taken}/{max} רשומות</span>
      </div>
      <div className="capacity-track" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={taken}
        aria-label="תפוסת הפעילות">
        <div className="capacity-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function Avatar({ name = '', className = '' }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
  return <span className={`avatar ${className}`} aria-hidden="true">{initials || '?'}</span>;
}

// ---------- Dates (always Israel time, like formatDate in api.js) ----------
const israelFormat = (options) => (value) =>
  new Intl.DateTimeFormat('he-IL', { timeZone: ISRAEL_TZ, ...options }).format(new Date(value));

export const formatDay = israelFormat({ day: 'numeric' });
export const formatMonth = israelFormat({ month: 'short' });
export const formatTime = israelFormat({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
export const formatLongDate = israelFormat({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const formatShortDate = israelFormat({ weekday: 'short', day: 'numeric', month: 'short' });

export function DateBlock({ value }) {
  return (
    <div className="date-block" aria-hidden="true">
      <span className="m">{formatMonth(value)}</span>
      <span className="d">{formatDay(value)}</span>
    </div>
  );
}
