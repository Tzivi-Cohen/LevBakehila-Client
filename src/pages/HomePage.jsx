import { CATEGORIES } from '../api.js';
import { CATEGORY_ICONS, Icon } from '../ui.jsx';
import { HeroIllustration } from '../illustrations.jsx';

// The activity types shown here are exactly the categories the server knows (ActivityCategory enum)
const CATEGORY_CARDS = [
  { key: 'SocialActivity', tone: 'pink', text: 'משחק משותף, יצירה, מוזיקה ושירה בקבוצה – רגעים של חברות, צחוק והנאה.' },
  { key: 'HomeworkHelp', tone: 'violet', text: 'ליווי אישי בלימודים ובתרגילים, בקצב ובדרך שמתאימים לכל ילד וילדה.' },
  { key: 'WeekdayAfternoon', tone: 'teal', text: 'מפגשי אחר הצהריים באמצע השבוע: משחק, תרגול מותאם וזמן איכות.' },
  { key: 'SaturdayAfternoon', tone: 'sun', tag: 'סוף שבוע', text: 'שבת אחר הצהריים בפארק ובקהילה – משחקים, טיולים ופעילות בחוץ.' },
  { key: 'FridayNight', tone: 'sky', tag: 'סוף שבוע', text: 'ארוחת ליל שבת משפחתית ופעילות חמה ומחבקת יחד עם הילדים.' }
];

const STEPS = [
  { icon: 'user', title: 'נרשמים למערכת', text: 'פותחות חשבון מתנדבת, מעדכנות שכונת מגורים ומיומנויות.' },
  { icon: 'search', title: 'מוצאים פעילות מתאימה', text: 'מחפשות לפי אזור, סוג פעילות וזמינות – וקודם כל קרוב לבית.' },
  { icon: 'heart', title: 'יוצרים חוויה משמעותית', text: 'נרשמות בלחיצה ומגיעות ליצור רגעים של אושר עם הילדים.' }
];

const PROMISES = [
  { icon: 'shield', title: 'הרשמה בטוחה', text: 'בלי הרשמות כפולות ובלי פעילויות חופפות ביומן.' },
  { icon: 'users', title: 'מקומות בזמן אמת', text: 'רואות כמה מקומות נשארו – ואף פעילות לא חורגת מהמכסה.' },
  { icon: 'home', title: 'קרוב לבית', text: 'פעילויות בשכונה שלך מופיעות ראשונות.' }
];

// Visitors see join/login calls to action; logged-in users jump straight into the app.
// onNavigate(target, category?) - target: 'register' | 'login' | 'activities' | 'mine' | 'admin'
export default function HomePage({ auth, onNavigate }) {
  const isAdmin = auth?.role === 'Admin';
  const scrollToActivities = () => document.getElementById('home-activities')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-text">
          <span className="hero-pill"><Icon name="sparkles" size={15} /> התנדבות עם ילדים עם צרכים מיוחדים</span>
          <h1>
            לב בקהילה –<br />
            <span className="gradient-text">ביחד יוצרים רגעים של אושר</span> <span aria-hidden="true">💜</span>
          </h1>
          <p className="hero-lead">
            מחברים בין מתנדבות לילדים עם צרכים מיוחדים, ויוצרים הזדמנויות לחוויות, לחברות ולנתינה משמעותית.
          </p>

          <div className="hero-actions">
            {!auth && (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('register')}>
                  <Icon name="heart" /> הצטרפי כמתנדבת
                </button>
                <button className="btn btn-sun btn-lg" onClick={scrollToActivities}>
                  <Icon name="grid" /> גלי פעילויות
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => onNavigate('login')}>
                  <Icon name="arrow-left" /> התחברות
                </button>
              </>
            )}
            {auth && !isAdmin && (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('activities')}>
                  <Icon name="grid" /> גלי פעילויות
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => onNavigate('mine')}>
                  <Icon name="list" /> ההרשמות שלי
                </button>
              </>
            )}
            {isAdmin && (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => onNavigate('admin')}>
                  <Icon name="shield" /> לממשק הרכזת
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => onNavigate('activities')}>
                  <Icon name="grid" /> כל הפעילויות
                </button>
              </>
            )}
          </div>

          <ul className="hero-promises">
            {PROMISES.map((p) => (
              <li key={p.title}>
                <span className="promise-icon"><Icon name={p.icon} size={17} /></span>
                <span><b>{p.title}</b>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-art">
          <HeroIllustration />
        </div>
      </section>

      <section className="home-section" id="home-activities">
        <div className="section-head">
          <span className="eyebrow"><Icon name="smile" size={15} /> הפעילויות שלנו</span>
          <h2>חוויות שבונות קשר, ביטחון ושמחה</h2>
          <p>כל פעילות מותאמת לילדים ולצרכים שלהם, ומלווה ברכזת שדואגת לכל הפרטים.</p>
        </div>

        <div className="category-grid">
          {CATEGORY_CARDS.map((c, i) => (
            <button key={c.key} type="button" className={`category-card tone-${c.tone}`} style={{ animationDelay: `${i * 70}ms` }}
              onClick={() => onNavigate('activities', c.key)}>
              <span className="category-icon"><Icon name={CATEGORY_ICONS[c.key]} size={26} /></span>
              {c.tag && <span className="category-tag">{c.tag}</span>}
              <h3>{CATEGORIES[c.key]}</h3>
              <p>{c.text}</p>
              <span className="category-link">
                {auth ? 'לפעילויות מסוג זה' : 'התחברי כדי להירשם'} <Icon name="arrow-left" size={16} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section how">
        <div className="section-head">
          <span className="eyebrow"><Icon name="sparkles" size={15} /> איך זה עובד</span>
          <h2>שלושה צעדים לרגע של אושר</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`step step-${i + 1}`}>
              <span className="step-num" aria-hidden="true">{i + 1}</span>
              <span className="step-icon"><Icon name={s.icon} size={26} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {!auth && (
        <section className="cta-band">
          <div>
            <h2>מוכנה להכיר ילד חדש ולהפוך אחר צהריים רגיל לחוויה?</h2>
            <p>פתיחת חשבון מתנדבת לוקחת פחות מדקה.</p>
          </div>
          <div className="row">
            <button className="btn btn-light btn-lg" onClick={() => onNavigate('register')}>
              <Icon name="heart" /> הצטרפי כמתנדבת
            </button>
            <button className="btn btn-ghost-light btn-lg" onClick={() => onNavigate('login')}>כבר רשומה? התחברי</button>
          </div>
        </section>
      )}
    </div>
  );
}
