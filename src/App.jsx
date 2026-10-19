import { useEffect, useState } from 'react';
import { loadAuth, saveAuth } from './api.js';
import { Avatar, Icon } from './ui.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ActivitiesPage from './pages/ActivitiesPage.jsx';
import ActivityDetailsPage from './pages/ActivityDetailsPage.jsx';
import MyRegistrationsPage from './pages/MyRegistrationsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

export default function App() {
  const [auth, setAuth] = useState(loadAuth);
  const [page, setPage] = useState({ name: 'activities' });

  // Every screen change starts at the top of the page
  useEffect(() => { window.scrollTo({ top: 0 }); }, [page]);

  const login = (data) => {
    saveAuth(data);
    setAuth(data);
    setPage({ name: data.role === 'Admin' ? 'admin' : 'activities' });
  };

  // The header greets the user by name - keep it in sync after a profile update
  const updateName = (fullName) => {
    const next = { ...auth, fullName };
    saveAuth(next);
    setAuth(next);
  };

  const logout = () => {
    saveAuth(null);
    setAuth(null);
  };

  if (!auth) return <LoginPage onLogin={login} />;

  const isAdmin = auth.role === 'Admin';

  const navItems = [
    { name: 'activities', label: 'פעילויות', icon: 'grid' },
    !isAdmin && { name: 'mine', label: 'ההרשמות שלי', icon: 'list' },
    isAdmin && { name: 'admin', label: 'ניהול', icon: 'shield' },
    { name: 'profile', label: 'הפרופיל שלי', icon: 'user' }
  ].filter(Boolean);

  // The details screen belongs to the "activities" tab
  const activeTab = page.name === 'details' ? 'activities' : page.name;

  return (
    <div className="app">
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="brand" onClick={() => setPage({ name: 'activities' })} aria-label="לב בקהילה – לדף הפעילויות">
            <span className="brand-mark"><Icon name="heart" size={22} strokeWidth={2.2} /></span>
            <span className="brand-name">לב בקהילה<small>התנדבות שמחברת שכונה</small></span>
          </button>

          <nav className="nav" aria-label="ניווט ראשי">
            {navItems.map((item) => (
              <button key={item.name} className={`nav-link ${activeTab === item.name ? 'active' : ''}`}
                aria-current={activeTab === item.name ? 'page' : undefined} aria-label={item.label}
                onClick={() => setPage({ name: item.name })}>
                <Icon name={item.icon} size={16} />
                <span className="label">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="user-menu">
            <div className="user-chip">
              <div className="user-chip-text">
                <b>שלום, {auth.fullName}</b>
                <span>{isAdmin ? 'רכזת' : 'מתנדבת'}</span>
              </div>
              <Avatar name={auth.fullName} />
            </div>
            <button className="icon-btn" onClick={logout} title="התנתקות" aria-label="התנתקות">
              <Icon name="logout" />
            </button>
          </div>
        </div>
      </header>

      <main className="main container">
        <div className="page" key={page.name + (page.id ?? '')}>
          {page.name === 'activities' && <ActivitiesPage onOpen={(id) => setPage({ name: 'details', id })} />}
          {page.name === 'details' && (
            <ActivityDetailsPage id={page.id} isAdmin={isAdmin} onBack={() => setPage({ name: 'activities' })} />
          )}
          {page.name === 'mine' && <MyRegistrationsPage />}
          {page.name === 'admin' && isAdmin && <AdminPage />}
          {page.name === 'profile' && <ProfilePage onSaved={updateName} />}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          נבנה באהבה <Icon name="heart" size={14} /> לב בקהילה · כל השעות מוצגות לפי שעון ישראל
        </div>
      </footer>
    </div>
  );
}
