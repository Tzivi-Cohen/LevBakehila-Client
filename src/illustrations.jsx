// Hand-drawn SVG illustrations (no external images).
// The hero scene shows volunteers and children with diverse needs sharing a creative moment:
// a girl in a wheelchair painting with a volunteer, and a boy wearing sensory headphones building blocks with another.

const INK = '#3b2a6b';

function Face({ cx, cy, flip = 1 }) {
  return (
    <g fill={INK}>
      <circle cx={cx - 7 * flip} cy={cy - 2} r="2.3" />
      <circle cx={cx + 5 * flip} cy={cy - 2} r="2.3" />
      <path d={`M${cx - 6} ${cy + 6} q${6} ${6} ${12} 0`} fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={cx - 11 * flip} cy={cy + 4} r="3" fill="#ff8fb4" opacity=".55" />
      <circle cx={cx + 10 * flip} cy={cy + 4} r="3" fill="#ff8fb4" opacity=".55" />
    </g>
  );
}

function Heart({ x, y, s = 1, fill = '#ff6fa5', className }) {
  return (
    <path className={className} transform={`translate(${x} ${y}) scale(${s})`} fill={fill}
      d="M0 6C-3-1-14-1-14 7c0 7 9 12 14 17C5 19 14 14 14 7 14-1 3-1 0 6Z" />
  );
}

function Star({ x, y, s = 1, fill = '#ffc83d', className }) {
  return (
    <path className={className} transform={`translate(${x} ${y}) scale(${s})`} fill={fill}
      d="M0-10 2.6-3.2 10-3 4.2 1.6 6.2 9 0 4.8-6.2 9-4.2 1.6-10-3-2.6-3.2Z" />
  );
}

export function HeroIllustration({ className = '' }) {
  return (
    <svg className={`illustration ${className}`} viewBox="0 0 560 480" role="img"
      aria-label="איור: מתנדבות וילדים עם צרכים מיוחדים מציירים ובונים קוביות יחד">
      <defs>
        <linearGradient id="hero-blob" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#efe6ff" />
          <stop offset=".55" stopColor="#ffe6f1" />
          <stop offset="1" stopColor="#dff6fb" />
        </linearGradient>
        <linearGradient id="hero-shirt-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="hero-shirt-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7eb3" />
          <stop offset="1" stopColor="#e64d8c" />
        </linearGradient>
      </defs>

      {/* Background */}
      <path fill="url(#hero-blob)"
        d="M64 170C58 92 140 34 240 40c78 5 120 34 190 30 70-4 118 46 112 128-5 70 22 118-6 178-30 64-108 86-232 84-120-2-208-14-246-80-34-58--2-118-4-210Z" />
      <circle cx="112" cy="98" r="30" fill="#ffd45c" />
      <circle cx="112" cy="98" r="44" fill="#ffd45c" opacity=".25" />
      <g className="float-slow">
        <Heart x={360} y={98} s={1.1} />
        <Heart x={410} y={140} s={.7} fill="#a78bfa" />
      </g>
      <g className="float-fast">
        <Star x={300} y={70} s={1.1} />
        <Star x={520} y={210} s={.8} fill="#2ec4b6" />
        <Star x={52} y={260} s={.7} fill="#ff7eb3" />
      </g>

      {/* Balloons held by the boy */}
      <g className="float-slow">
        <path d="M478 150c4 40-2 80 8 132" stroke={INK} strokeWidth="1.6" fill="none" />
        <path d="M512 128c-6 50-10 100-26 154" stroke={INK} strokeWidth="1.6" fill="none" />
        <ellipse cx="476" cy="128" rx="22" ry="27" fill="#2ec4b6" />
        <path d="M471 154l5 7 5-7Z" fill="#2ec4b6" />
        <ellipse cx="514" cy="104" rx="20" ry="25" fill="#ffc83d" />
        <path d="M509 128l5 7 5-7Z" fill="#ffc83d" />
        <ellipse cx="469" cy="118" rx="5" ry="8" fill="#fff" opacity=".5" />
        <ellipse cx="507" cy="95" rx="5" ry="7" fill="#fff" opacity=".5" />
      </g>

      {/* Ground */}
      <ellipse cx="290" cy="430" rx="240" ry="22" fill="#d9ccff" opacity=".7" />

      {/* Easel and painting */}
      <g strokeLinecap="round">
        <path d="M107 200 70 428M107 200l38 228M107 200v228" stroke="#b07a4f" strokeWidth="7" />
        <rect x="56" y="206" width="104" height="88" rx="8" fill="#fff" stroke="#e9dcff" strokeWidth="3" />
        <path d="M74 280a34 34 0 0 1 68 0" fill="none" stroke="#ff6fa5" strokeWidth="6" />
        <path d="M84 280a24 24 0 0 1 48 0" fill="none" stroke="#ffc83d" strokeWidth="6" />
        <path d="M94 280a14 14 0 0 1 28 0" fill="none" stroke="#2ec4b6" strokeWidth="6" />
        <circle cx="140" cy="226" r="8" fill="#ffd45c" />
        <Heart x={78} y={222} s={.45} fill="#8b5cf6" />
      </g>

      {/* Girl in a wheelchair, painting */}
      <g>
        <circle cx="205" cy="385" r="40" fill="none" stroke={INK} strokeWidth="7" />
        <circle cx="205" cy="385" r="31" fill="none" stroke="#a78bfa" strokeWidth="2" />
        <path d="M205 354v62M174 385h62M183 363l44 44M227 363l-44 44" stroke="#a78bfa" strokeWidth="1.6" />
        <circle cx="205" cy="385" r="5" fill={INK} />
        <circle cx="152" cy="419" r="10" fill="none" stroke={INK} strokeWidth="5" />
        <path d="M168 372h80M244 372l6-74 14-4M160 372l-8 46M150 408h22" fill="none" stroke={INK} strokeWidth="7"
          strokeLinecap="round" strokeLinejoin="round" />
        {/* legs */}
        <path d="M212 366h-40l-6 36" fill="none" stroke="#4f6bd8" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M158 404h14" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        {/* body */}
        <path d="M196 312c0-12 10-18 22-18s22 6 22 18l2 58h-48Z" fill="#ffc83d" />
        {/* painting arm */}
        <path d="M206 318 178 304 152 288" fill="none" stroke="#c98e66" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M152 288 136 274" stroke="#b07a4f" strokeWidth="4" strokeLinecap="round" />
        <circle cx="134" cy="272" r="4" fill="#ff6fa5" />
        {/* head */}
        <circle cx="218" cy="272" r="23" fill="#c98e66" />
        <path d="M195 270c-2-20 12-30 26-29 14 1 24 12 21 28-6-9-16-14-28-13-8 1-14 6-19 14Z" fill="#3a2418" />
        <circle cx="246" cy="262" r="10" fill="#3a2418" />
        <circle cx="244" cy="252" r="5" fill="#ff6fa5" />
        <Face cx={213} cy={278} flip={-1} />
      </g>

      {/* Volunteer standing behind the wheelchair, holding a palette */}
      <g>
        <path d="M282 334 276 424M302 334l6 90" stroke="#2f2a55" strokeWidth="16" strokeLinecap="round" />
        <path d="M268 424h18M300 424h18" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M262 240c0-16 12-24 28-24s28 8 28 24l6 100h-68Z" fill="url(#hero-shirt-a)" />
        <path d="M268 244 252 290 264 296" fill="none" stroke="#f2c7a5" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M314 248 334 286" fill="none" stroke="#f2c7a5" strokeWidth="11" strokeLinecap="round" />
        <ellipse cx="344" cy="292" rx="22" ry="14" fill="#fff4dc" stroke="#e5c98f" strokeWidth="2" />
        <circle cx="336" cy="288" r="4" fill="#ff6fa5" />
        <circle cx="348" cy="285" r="4" fill="#2ec4b6" />
        <circle cx="356" cy="294" r="4" fill="#8b5cf6" />
        <path d="M290 216v8" stroke="#f2c7a5" strokeWidth="10" />
        <path d="M262 196c-4-30 12-46 30-46s34 14 30 44c2 26 6 40 0 52-10-8-12-22-12-34h-38c0 14-4 28-14 36-6-14 2-30 4-52Z" fill="#7a4a2a" />
        <circle cx="292" cy="190" r="24" fill="#f2c7a5" />
        <path d="M268 186c2-20 14-28 26-28 13 0 24 9 22 26-10-2-22-8-28-16-4 8-10 14-20 18Z" fill="#7a4a2a" />
        <Face cx={292} cy={196} />
        <Heart x={290} y={266} s={.5} fill="#fff" />
      </g>

      {/* Volunteer kneeling, building blocks */}
      <g>
        <path d="M398 366 376 420h44" fill="none" stroke="#1f6f78" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M410 366l30 18v40" fill="none" stroke="#1f6f78" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M434 424h16" stroke={INK} strokeWidth="9" strokeLinecap="round" />
        <path d="M382 318c0-14 10-22 24-22s24 8 24 22l2 52h-52Z" fill="url(#hero-shirt-b)" />
        <path d="M420 322 444 352 456 360" fill="none" stroke="#8d5a3b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M392 326 408 360 440 372" fill="none" stroke="#8d5a3b" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="406" cy="272" r="22" fill="#8d5a3b" />
        <path d="M384 270c-2-18 10-28 23-28 14 0 25 10 22 26-10-8-30-10-45 2Z" fill="#1d1d2b" />
        <circle cx="404" cy="240" r="11" fill="#1d1d2b" />
        <Face cx={409} cy={278} />
      </g>

      {/* Blocks */}
      <g>
        <rect x="446" y="394" width="32" height="30" rx="5" fill="#2ec4b6" />
        <rect x="450" y="364" width="28" height="30" rx="5" fill="#ff7eb3" />
        <rect x="452" y="338" width="24" height="26" rx="5" fill="#ffc83d" />
        <path d="M455 409h22M462 400v18" stroke="#fff" strokeWidth="2.5" opacity=".7" />
        <Star x={464} y={379} s={.6} fill="#fff" />
      </g>

      {/* Boy with sensory headphones */}
      <g>
        <path d="M500 380v44M518 380v44" stroke="#4f6bd8" strokeWidth="13" strokeLinecap="round" />
        <path d="M494 424h12M514 424h12" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <path d="M490 334c0-12 8-18 19-18s19 6 19 18l2 50h-42Z" fill="#2ec4b6" />
        <path d="M494 340 480 352 478 344" fill="none" stroke="#e8b48f" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M524 338 484 286" fill="none" stroke="#e8b48f" strokeWidth="9" strokeLinecap="round" />
        <circle cx="509" cy="296" r="20" fill="#e8b48f" />
        <path d="M490 292c0-16 9-22 20-22s19 8 18 20c-8-6-24-8-38 2Z" fill="#c0702e" />
        <path d="M488 294a21 21 0 0 1 42 0" fill="none" stroke="#8b5cf6" strokeWidth="5" />
        <rect x="482" y="290" width="10" height="16" rx="5" fill="#8b5cf6" />
        <rect x="526" y="290" width="10" height="16" rx="5" fill="#8b5cf6" />
        <Face cx={507} cy={302} flip={-1} />
      </g>
    </svg>
  );
}
