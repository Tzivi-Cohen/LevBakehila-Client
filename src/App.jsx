import { useState } from 'react';
import { loadAuth, saveAuth } from './api.js';
import LoginPage from './pages/LoginPage.jsx';
import ActivitiesPage from './pages/ActivitiesPage.jsx';
import ActivityDetailsPage from './pages/ActivityDetailsPage.jsx';
import MyRegistrationsPage from './pages/MyRegistrationsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

export default function App() {
  const [auth, setAuth] = useState(loadAuth);
  const [page, setPage] = useState({ name: 'activities' });

  const login = (data) => {
    saveAuth(data);
    setAuth(data);
    setPage({ name: data.role === 'Admin' ? 'admin' : 'activities' });
  };

  const logout = () => {
    saveAuth(null);
    setAuth(null);
  };

  if (!auth) return <LoginPage onLogin={login} />;

  const isAdmin = auth.role === 'Admin';

  return (
    <div className="container">
      <header className="header">
        <h1>לב בקהילה</h1>
        <nav>
          <button onClick={() => setPage({ name: 'activities' })}>פעילויות</button>
          {!isAdmin && <button onClick={() => setPage({ name: 'mine' })}>ההרשמות שלי</button>}
          {isAdmin && <button onClick={() => setPage({ name: 'admin' })}>ניהול</button>}
          <span className="user">שלום, {auth.fullName}</span>
          <button onClick={logout}>התנתקות</button>
        </nav>
      </header>

      {page.name === 'activities' && <ActivitiesPage onOpen={(id) => setPage({ name: 'details', id })} />}
      {page.name === 'details' && (
        <ActivityDetailsPage id={page.id} isAdmin={isAdmin} onBack={() => setPage({ name: 'activities' })} />
      )}
      {page.name === 'mine' && <MyRegistrationsPage />}
      {page.name === 'admin' && isAdmin && <AdminPage />}
    </div>
  );
}
