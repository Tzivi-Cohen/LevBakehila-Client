const API_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:7257';
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

export const formatDate = (value) =>
  new Date(value).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
