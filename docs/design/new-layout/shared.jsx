// shared.jsx — Reusable Radiant primitives
// Pixel mascot, stat pills, starfield, X-ray panel, progress ring

const PIXEL_SRC = 'assets/pixel.png';

// ─────────────────────────────────────────────────────────────
// Pixel mascot — bitmap with state-driven scale/animation
// ─────────────────────────────────────────────────────────────
function Pixel({ state = 'idle', size = 140, glow = true, style = {} }) {
  // Each state controls subtle transform/animation; the bitmap is the same.
  const stateMap = {
    idle:      { anim: 'float-y 4.5s ease-in-out infinite', tilt: 0,   scale: 1 },
    happy:     { anim: 'float-y 3s ease-in-out infinite',   tilt: 0,   scale: 1.03 },
    guide:     { anim: 'float-y 5s ease-in-out infinite',   tilt: -3,  scale: 1 },
    thinking:  { anim: 'float-y 6s ease-in-out infinite',   tilt: 4,   scale: 0.97 },
    celebrate: { anim: 'pop 1.2s ease-in-out infinite',      tilt: 0,   scale: 1.08 },
    oops:      { anim: 'shake 1.4s ease-in-out infinite',    tilt: -2,  scale: 0.96 },
  };
  const s = stateMap[state] || stateMap.idle;
  return (
    <div style={{
      position: 'relative', width: size, height: size * 1.5,
      display: 'inline-block', ...style,
    }}>
      {glow && (
        <div style={{
          position: 'absolute', inset: '15% 5% 5% 5%',
          background: 'radial-gradient(ellipse at center, rgba(61,202,232,0.45), transparent 60%)',
          filter: 'blur(14px)', zIndex: 0,
          animation: state === 'celebrate' ? 'glow-pulse 1.2s ease-in-out infinite' : 'none',
        }} />
      )}
      <img
        src={PIXEL_SRC}
        alt="Pixel"
        style={{
          position: 'relative', zIndex: 1,
          width: '100%', height: '100%', objectFit: 'contain',
          transform: `rotate(${s.tilt}deg) scale(${s.scale})`,
          animation: s.anim,
          transformOrigin: '50% 50%',
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stat pill — streak, XP, hearts
// ─────────────────────────────────────────────────────────────
function StatPill({ icon, value, color, dark = false }) {
  const bg = dark ? 'rgba(255,255,255,0.06)' : '#fff';
  const border = dark ? 'rgba(255,255,255,0.12)' : 'rgba(20,35,63,0.08)';
  const txt = dark ? '#fff' : '#14233F';
  return (
    <div className="stat-pill" style={{
      background: bg,
      border: `1px solid ${border}`,
      color: txt,
      boxShadow: dark ? 'none' : '0 1px 0 rgba(20,35,63,0.04)',
    }}>
      <span style={{ display: 'inline-flex', color, fontSize: 14 }}>{icon}</span>
      <span style={{ fontWeight: 800, letterSpacing: '-0.01em' }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Icons (minimal geometric set)
// ─────────────────────────────────────────────────────────────
const Icon = {
  flame: (c='#FF6B2C') => <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M7 1c1 2.5 3 3.5 4 5.5 1.5 3-.5 8-4 8s-5.5-3-5-6c.5-2.5 2-3 2-1 0-2 1-4.5 3-6.5z" fill={c}/></svg>,
  bolt: (c='#F5A623') => <svg width="12" height="16" viewBox="0 0 12 16" fill="none"><path d="M7 0L0 9h4l-1 7 7-9H6l1-7z" fill={c}/></svg>,
  heart: (c='#FF3B30') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12.5C2.5 9 0 6.5 0 4.2 0 2 1.7.5 3.7.5c1.4 0 2.5.7 3.3 1.8C7.8 1.2 8.9.5 10.3.5c2 0 3.7 1.5 3.7 3.7 0 2.3-2.5 4.8-7 8.3z" fill={c}/></svg>,
  check: (c='#fff') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7.5l3 3 7-7" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x: (c='#fff') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke={c} strokeWidth="2.4" strokeLinecap="round"/></svg>,
  lock: (c='#fff') => <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><rect x="1.5" y="6" width="9" height="7" rx="1.5" stroke={c} strokeWidth="1.6"/><path d="M3.5 6V4a2.5 2.5 0 015 0v2" stroke={c} strokeWidth="1.6"/></svg>,
  play: (c='#fff') => <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M2 1.5L11 7 2 12.5V1.5z" fill={c}/></svg>,
  star: (c='#F5A623') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 .8l1.9 4 4.3.5-3.2 3 .9 4.3L7 10.5l-3.9 2.1.9-4.3-3.2-3 4.3-.5L7 .8z" fill={c}/></svg>,
  target: (c='#3DCAE8') => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke={c} strokeWidth="1.4"/><circle cx="7" cy="7" r="3" stroke={c} strokeWidth="1.4"/><circle cx="7" cy="7" r="1" fill={c}/></svg>,
  brain: (c='#2155FF') => <svg width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M5 1.5C3 1.5 1.5 3 1.5 5c-1 .8-1 2.5 0 3.3 0 2 1.5 3.7 3.5 3.7M11 1.5c2 0 3.5 1.5 3.5 3.5 1 .8 1 2.5 0 3.3 0 2-1.5 3.7-3.5 3.7M8 1.5v11" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
};

// ─────────────────────────────────────────────────────────────
// Tab bar (light or galaxy)
// ─────────────────────────────────────────────────────────────
function TabBar({ active = 'home', dark = false }) {
  const tabs = [
    { id: 'home',     label: 'Home',     icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 10l8-7 8 7v9a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1v-9z" fill="currentColor"/></svg> },
    { id: 'galaxy',   label: 'Galaxy',   icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="3" fill="currentColor"/><ellipse cx="11" cy="11" rx="9" ry="3.4" stroke="currentColor" strokeWidth="1.6" transform="rotate(-30 11 11)"/></svg> },
    { id: 'progress', label: 'Progress', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 17l5-5 4 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="19" cy="7" r="1.6" fill="currentColor"/></svg> },
    { id: 'missions', label: 'Missions', icon: <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="4" width="14" height="15" rx="2" stroke="currentColor" strokeWidth="1.7"/><path d="M7 9h8M7 12h8M7 15h5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg> },
  ];
  const bg = dark ? 'rgba(7,9,28,0.85)' : 'rgba(255,255,255,0.92)';
  const border = dark ? 'rgba(255,255,255,0.10)' : 'rgba(20,35,63,0.06)';
  const dim = dark ? 'rgba(255,255,255,0.45)' : '#93A0B8';
  const acc = dark ? '#3DCAE8' : '#2155FF';

  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 28,
      height: 68, borderRadius: 26,
      background: bg, backdropFilter: 'blur(24px)',
      border: `1px solid ${border}`,
      boxShadow: dark
        ? '0 12px 40px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset'
        : '0 12px 30px -10px rgba(20,35,63,0.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 10px', zIndex: 30,
    }}>
      {tabs.map(t => {
        const on = t.id === active;
        return (
          <div key={t.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: on ? acc : dim,
            transition: 'color 180ms',
            position: 'relative', padding: '6px 10px',
          }}>
            {on && (
              <div style={{
                position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                width: 22, height: 3, borderRadius: 2, background: acc,
                boxShadow: dark ? `0 0 10px ${acc}` : 'none',
              }}/>
            )}
            <div style={{ transform: on ? 'scale(1.08)' : 'scale(1)', transition: 'transform 180ms' }}>{t.icon}</div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.04em' }}>{t.label.toUpperCase()}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Starfield — for Galaxy mode
// ─────────────────────────────────────────────────────────────
function Starfield({ density = 80, twinkle = true }) {
  const stars = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < density; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: Math.random() * 1.4 + 0.3,
        d: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        bright: Math.random() > 0.85,
      });
    }
    return arr;
  }, [density]);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* nebula */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(ellipse 70% 40% at 20% 15%, rgba(61,202,232,0.12), transparent 60%),'+
          'radial-gradient(ellipse 60% 35% at 85% 80%, rgba(33,85,255,0.18), transparent 60%),'+
          'radial-gradient(ellipse 55% 30% at 50% 50%, rgba(120,80,255,0.06), transparent 65%)',
      }}/>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.r * 2, height: s.r * 2,
          borderRadius: '50%',
          background: s.bright ? '#9FE5F5' : '#fff',
          boxShadow: s.bright ? '0 0 6px rgba(159,229,245,0.9)' : 'none',
          opacity: 0.7,
          animation: twinkle ? `star-twinkle ${s.d}s ease-in-out infinite` : 'none',
          animationDelay: `${s.delay}s`,
        }}/>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// X-ray panel — stylized chest x-ray (rib cage geometry)
// ─────────────────────────────────────────────────────────────
function XrayPanel({ height = 280, highlight = null }) {
  // Stylized chest x-ray: spine + ribs + lung fields + heart shadow
  return (
    <div style={{
      width: '100%', height, borderRadius: 14, position: 'relative',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 55%, #2a3340 0%, #11161d 70%, #05070a 100%)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      {/* film grain */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.18,
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 3px)',
      }}/>
      {/* X-ray geometry */}
      <svg viewBox="0 0 320 280" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="lung" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#3a4555" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#1a2230" stopOpacity="0.3"/>
          </radialGradient>
          <linearGradient id="rib" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(220,230,245,0.05)"/>
            <stop offset="50%" stopColor="rgba(220,230,245,0.45)"/>
            <stop offset="100%" stopColor="rgba(220,230,245,0.05)"/>
          </linearGradient>
        </defs>
        {/* lung fields */}
        <ellipse cx="100" cy="135" rx="60" ry="85" fill="url(#lung)"/>
        <ellipse cx="220" cy="135" rx="60" ry="85" fill="url(#lung)"/>
        {/* heart shadow */}
        <ellipse cx="155" cy="160" rx="42" ry="55" fill="rgba(60,70,90,0.55)"/>
        {/* spine */}
        <rect x="156" y="50" width="8" height="200" fill="rgba(220,230,245,0.55)" rx="3"/>
        {[60, 82, 104, 126, 148, 170, 192, 214, 236].map(y => (
          <rect key={y} x="152" y={y} width="16" height="3" fill="rgba(255,255,255,0.4)" rx="1"/>
        ))}
        {/* ribs left */}
        {[70, 95, 120, 145, 170, 195].map((y,i) => (
          <path key={`l${y}`} d={`M152 ${y} Q 90 ${y+18}, 50 ${y+5}`} stroke="url(#rib)" strokeWidth="2.2" fill="none"/>
        ))}
        {[70, 95, 120, 145, 170, 195].map(y => (
          <path key={`r${y}`} d={`M168 ${y} Q 230 ${y+18}, 270 ${y+5}`} stroke="url(#rib)" strokeWidth="2.2" fill="none"/>
        ))}
        {/* clavicles */}
        <path d="M60 60 Q 100 50, 152 65" stroke="rgba(220,230,245,0.6)" strokeWidth="3" fill="none"/>
        <path d="M168 65 Q 220 50, 260 60" stroke="rgba(220,230,245,0.6)" strokeWidth="3" fill="none"/>
        {/* highlight finding */}
        {highlight && (
          <g>
            <circle cx={highlight.x} cy={highlight.y} r={highlight.r}
              fill="none" stroke="#FFB84D" strokeWidth="2"
              strokeDasharray="4 4"
              style={{ animation: 'orbit-spin 20s linear infinite', transformOrigin: `${highlight.x}px ${highlight.y}px` }}/>
            <circle cx={highlight.x} cy={highlight.y} r={highlight.r + 8}
              fill="none" stroke="rgba(255,184,77,0.3)" strokeWidth="1"/>
          </g>
        )}
      </svg>
      {/* HUD overlay */}
      <div style={{
        position: 'absolute', top: 10, left: 12, right: 12,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 9, color: 'rgba(159,229,245,0.7)', letterSpacing: '0.1em',
      }}>
        <span>CT · CHEST</span>
        <span>AP · 1024×1024</span>
      </div>
      <div style={{
        position: 'absolute', bottom: 10, left: 12, right: 12,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'JetBrains Mono, ui-monospace, monospace',
        fontSize: 9, color: 'rgba(159,229,245,0.55)', letterSpacing: '0.1em',
      }}>
        <span>CASE #4271</span>
        <span>· REC ·</span>
      </div>
      {/* corner brackets */}
      {['tl','tr','bl','br'].map(p => {
        const pos = {
          tl: {top: 4, left: 4, borderTop: '1px solid #9FE5F5', borderLeft: '1px solid #9FE5F5'},
          tr: {top: 4, right: 4, borderTop: '1px solid #9FE5F5', borderRight: '1px solid #9FE5F5'},
          bl: {bottom: 4, left: 4, borderBottom: '1px solid #9FE5F5', borderLeft: '1px solid #9FE5F5'},
          br: {bottom: 4, right: 4, borderBottom: '1px solid #9FE5F5', borderRight: '1px solid #9FE5F5'},
        }[p];
        return <div key={p} style={{ position: 'absolute', width: 12, height: 12, ...pos }}/>;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Progress ring
// ─────────────────────────────────────────────────────────────
function ProgressRing({ size = 96, value = 0.6, stroke = 8, color = '#2155FF', track = 'rgba(20,35,63,0.08)', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}/>
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Confetti — for reward screen
// ─────────────────────────────────────────────────────────────
function Confetti({ count = 60, run = true }) {
  const pieces = React.useMemo(() => {
    const colors = ['#2155FF','#3DCAE8','#F5A623','#1A9C71','#FFFFFF','#6FE0F2'];
    return Array.from({ length: count }).map((_, i) => ({
      x: Math.random() * 100,
      cx: (Math.random() - 0.5) * 200,
      rot: Math.random() * 720 - 360,
      d: Math.random() * 1.5 + 2,
      delay: Math.random() * 0.6,
      size: Math.random() * 6 + 5,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
      color: colors[i % colors.length],
    }));
  }, [count]);
  if (!run) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {pieces.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: 0,
          width: p.size, height: p.size * (p.shape === 'rect' ? 0.5 : 1),
          background: p.color,
          borderRadius: p.shape === 'circle' ? '50%' : 1,
          ['--cx']: `${p.cx}px`, ['--rot']: `${p.rot}deg`,
          animation: `confetti-fall ${p.d}s ease-in ${p.delay}s forwards`,
        }}/>
      ))}
    </div>
  );
}

Object.assign(window, { Pixel, StatPill, Icon, TabBar, Starfield, XrayPanel, ProgressRing, Confetti });
