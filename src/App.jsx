import { useEffect, useState } from 'react';
import { loadAuth, saveAuth } from './api.js';
import { Avatar, Icon } from './ui.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ActivitiesPage from './pages/ActivitiesPage.jsx';
import ActivityDetailsPage from './pages/ActivityDetailsPage.jsx';
import MyRegistrationsPage from './pages/MyRegistrationsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function Brand({ onClick, label }) {
  return (
    <button className="brand" onClick={onClick} aria-label={label}>
      <span className="brand-mark"><Icon name="heart" size={22} strokeWidth={2.2} /></span>
      <span className="brand-name">לב בקהילה<small>מתנדבות וילדים, יחד</small></span>
    </button>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="footer-brand"><Icon name="heart" size={16} /> לב בקהילה</span>
        <span>מחברים בין מתנדבות לילדים עם צרכים מיוחדים · כל השעות מוצגות לפי שעון ישראל</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [auth, setAuth] = useState(loadAuth);
  const [page, setPage] = useState({ name: 'home' });
  // Visitors: null = home page, otherwise { mode: 'login' | 'register', next } for the auth screen
  const [authView, setAuthView] = useState(null);

  // Every screen change starts at the top of the page
  useEffect(() => { window.scrollTo({ top: 0 }); }, [page, authView]);

  const login = (data) => {
    saveAuth(data);
    setAuth(data);
    // Go where the visitor was heading (e.g. a category card), otherwise to the role's main screen
    setPage(authView?.next ?? { name: data.role === 'Admin' ? 'admin' : 'activities' });
    setAuthView(null);
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
    setPage({ name: 'home' });
    setAuthView(null);
  };

  // Home page buttons: target is a page name, or 'login' / 'register' for visitors
  const navigate = (target, category) => {
    const next = target === 'activities' ? { name: 'activities', category } : { name: target };
    if (auth) setPage(next);
    else setAuthView({ mode: target === 'register' ? 'register' : 'login', next: target === 'activities' ? next : null });
  };

  if (!auth) {
    if (authView) {
      return <LoginPage key={authView.mode} initialMode={authView.mode} onLogin={login} onHome={() => setAuthView(null)} />;
    }
    return (
      <div className="app">
        <header className="topbar">
          <div className="container topbar-inner">
            <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} label="לב בקהילה – לראש העמוד" />
            <div className="user-menu">
              <button className="btn btn-ghost" onClick={() => navigate('login')}>התחברות</button>
              <button className="btn btn-primary" onClick={() => navigate('register')}>
                <Icon name="heart" size={16} /> <span className="hide-xs">הצטרפי כמתנדבת</span><span className="show-xs">הצטרפי</span>
              </button>
            </div>
          </div>
        </header>
        <main className="main container">
          <div className="page"><HomePage auth={null} onNavigate={navigate} /></div>
        </main>
        <Footer />
      </div>
    );
  }

  const isAdmin = auth.role === 'Admin';

  const navItems = [
    { name: 'home', label: 'בית', icon: 'home' },
    { name: 'activities', label: 'פעילויות', icon: 'grid' },
    !isAdmin && { name: 'mine', label: 'ההרשמות שלי', icon: 'list' },
    isAdmin && { name: 'admin', label: 'ניהול', icon: 'shield' },
    { name: 'profile', label: 'הפרופיל שלי', icon: 'user' }
  ].filter(Boolean);

  // The details screen belongs to the "activities" tab
  const activeTab = page.name === 'details' ? 'activities' : page.name;

  return (
    <div className="app">
      <a className="skip-link" href="#main">דילוג לתוכן הראשי</a>
      <header className="topbar">
        <div className="container topbar-inner">
          <Brand onClick={() => setPage({ name: 'home' })} label="לב בקהילה – לדף הבית" />

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

      <main className="main container" id="main" tabIndex={-1}>
        <div className="page" key={page.name + (page.id ?? '') + (page.category ?? '')}>
          {page.name === 'home' && <HomePage auth={auth} onNavigate={navigate} />}
          {page.name === 'activities' && (
            <ActivitiesPage isAdmin={isAdmin} initialCategory={page.category} onOpen={(id) => setPage({ name: 'details', id })} />
          )}
          {page.name === 'details' && (
            <ActivityDetailsPage id={page.id} isAdmin={isAdmin} onBack={() => setPage({ name: 'activities' })} />
          )}
          {page.name === 'mine' && <MyRegistrationsPage onBrowse={() => setPage({ name: 'activities' })} />}
          {page.name === 'admin' && isAdmin && <AdminPage />}
          {page.name === 'profile' && <ProfilePage onSaved={updateName} />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
