// Vite inlines VITE_API_URL at build time; the localhost default is for `npm run dev` only
const API_URL = (import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'https://localhost:7257' : '')).replace(/\/+$/, '');
const AUTH_KEY = 'levbakehila.auth';

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

export function saveAuth(auth) {
  if (auth) localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
  else localStorage.removeItem(AUTH_KEY);
}

// Every server error has the same shape: { statusCode, message, correlationId, errors? }
function errorMessage(status, data) {
  if (data?.errors) return Object.values(data.errors).flat().join(' '); // validation (400): field messages
  if (data?.message) return data.message;
  if (status === 401) return 'יש להתחבר מחדש.';
  if (status === 403) return 'אין לך הרשאה לפעולה זו.';
  return 'אירעה שגיאה בתקשורת עם השרת.';
}

// Every protected request sends the JWT in the Authorization header
export async function apiRequest(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = loadAuth()?.token;
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError(0, 'השרת אינו זמין. ודאי שה־API רץ.');
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, errorMessage(response.status, data));
  return data;
}

export const CATEGORIES = {
  FridayNight: 'ליל שבת',
  SaturdayAfternoon: 'שבת אחר הצהריים',
  WeekdayAfternoon: 'יום חול אחר הצהריים',
  HomeworkHelp: 'עזרה בשיעורי בית',
  SocialActivity: 'פעילות חברתית'
};

// ---------- Time: the API speaks UTC ("...Z"); users always see Israel time ----------
export const ISRAEL_TZ = 'Asia/Jerusalem';

export const formatDate = (value) =>
  new Date(value).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short', timeZone: ISRAEL_TZ });

// The Israel wall-clock parts of a moment, whatever the browser's own time zone is
function israelParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: ISRAEL_TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, Number(p.value)]));
}

// Israel's offset from UTC (ms) at a given moment: +3h in summer, +2h in winter
function israelOffset(utcMs) {
  const p = israelParts(new Date(utcMs));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(utcMs / 1000) * 1000;
}

const pad = (n) => String(n).padStart(2, '0');

// API value (UTC) -> "2026-10-21T16:00" in Israel time, for <input type="datetime-local">
export function toIsraelInput(value) {
  const p = israelParts(new Date(value));
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

// "2026-10-21T16:00" typed in Israel time -> "2026-10-21T13:00:00.000Z" for the API
export function fromIsraelInput(value) {
  const [date, time] = value.split('T');
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const wallClock = Date.UTC(y, m - 1, d, hh, mm);
  // First guess with the offset at that wall-clock time, then correct once around the summer/winter switch
  let utc = wallClock - israelOffset(wallClock);
  utc = wallClock - israelOffset(utc);
  return new Date(utc).toISOString();
}
