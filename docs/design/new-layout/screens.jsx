// screens.jsx — The four hero screens for Radiant

// ─────────────────────────────────────────────────────────────
// 1. HOME / DASHBOARD (Light)
// ─────────────────────────────────────────────────────────────
function ScreenHome({ dark = false }) {
  const acc = dark ? '#3DCAE8' : '#2155FF';
  const text = dark ? '#fff' : '#14233F';
  const text2 = dark ? 'rgba(255,255,255,0.62)' : '#5B6B85';
  const text3 = dark ? 'rgba(255,255,255,0.40)' : '#93A0B8';
  const cardBg = dark ? 'rgba(255,255,255,0.05)' : '#fff';
  const cardBorder = dark ? 'rgba(255,255,255,0.10)' : '#E3ECF7';

  return (
    <div className={`r-screen ${dark ? 'galaxy' : ''}`} style={{
      width: '100%', height: '100%', position: 'relative',
      background: dark ? '#03030d' : '#F5FAFF',
      paddingTop: 56, overflow: 'hidden',
    }}>
      {dark && <Starfield density={50} />}

      <div style={{ padding: '14px 20px 120px', position: 'relative', zIndex: 2 }}>
        {/* HUD */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: text3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tuesday · Day 24</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: text, letterSpacing: '-0.02em', marginTop: 2 }}>Hi, Dr. Alvarez</div>
          </div>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: dark ? 'rgba(255,255,255,0.06)' : '#fff',
            border: `1px solid ${cardBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, color: acc, fontSize: 14,
          }}>MA</div>
        </div>

        {/* Stat row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <StatPill icon={Icon.flame()} value="12" color="#FF6B2C" dark={dark}/>
          <StatPill icon={Icon.bolt()} value="2,840 XP" color="#F5A623" dark={dark}/>
          <StatPill icon={Icon.heart()} value="5" color="#FF3B30" dark={dark}/>
        </div>

        {/* Hero card with mascot */}
        <div style={{
          position: 'relative',
          background: dark
            ? 'linear-gradient(140deg, rgba(33,85,255,0.25), rgba(61,202,232,0.12))'
            : 'linear-gradient(140deg, #2155FF 0%, #3D6BFF 100%)',
          borderRadius: 24,
          padding: '20px 20px 18px',
          color: '#fff', overflow: 'hidden',
          border: dark ? '1px solid rgba(255,255,255,0.12)' : 'none',
          boxShadow: dark ? '0 0 40px -10px rgba(61,202,232,0.3)' : '0 14px 30px -12px rgba(33,85,255,0.55)',
          marginBottom: 16,
        }}>
          {/* halftone bg */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.18,
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '14px 14px',
            maskImage: 'radial-gradient(ellipse at 80% 60%, black, transparent 70%)',
          }}/>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', opacity: 0.85, marginBottom: 6 }}>TODAY'S MISSION</div>
              <div style={{ fontSize: 22, fontWeight: 800, lineHeight: '26px', letterSpacing: '-0.02em', marginBottom: 10 }}>
                Pulmonary nodules<br/>on chest CT
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 8, background: 'rgba(255,255,255,0.18)' }}>8 cases</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 8, background: 'rgba(255,255,255,0.18)' }}>~12 min</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 9px', borderRadius: 8, background: 'rgba(255,255,255,0.18)' }}>+120 XP</span>
              </div>
            </div>
            <div style={{ marginTop: -8, marginRight: -10 }}>
              <Pixel state="happy" size={92} glow={false}/>
            </div>
          </div>

          <button className="btn-galaxy" style={{
            background: '#fff', color: '#2155FF', height: 50,
            boxShadow: '0 1px 0 rgba(255,255,255,0.5) inset, 0 6px 18px -6px rgba(0,0,0,0.25)',
            border: 0, position: 'relative', zIndex: 1,
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {Icon.play('#2155FF')} Start lesson
            </span>
          </button>
        </div>

        {/* Continue journey */}
        <div style={{
          background: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: 20, padding: 16, marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <ProgressRing size={64} value={0.55} stroke={6} color={acc} track={dark ? 'rgba(255,255,255,0.08)' : '#EAF2FF'}>
            <div style={{ fontSize: 14, fontWeight: 800, color: text }}>55%</div>
          </ProgressRing>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: text3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Continue chapter</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: text, letterSpacing: '-0.01em', marginTop: 2 }}>Thoracic Imaging</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: text2, marginTop: 2 }}>11 of 20 lessons</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: acc, color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7h8m0 0L7 3m4 4l-4 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>

        {/* Quick stats trio */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { l: 'Sessions', v: '47', s: 'this month' },
            { l: 'Accuracy', v: '84%', s: '+3% wk' },
            { l: 'Mastered', v: '23', s: 'topics' },
          ].map(s => (
            <div key={s.l} style={{
              background: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: 16, padding: '12px 12px 10px',
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: text3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: text, letterSpacing: '-0.02em', marginTop: 2 }}>{s.v}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: text2, marginTop: 1 }}>{s.s}</div>
            </div>
          ))}
        </div>
      </div>

      <TabBar active="home" dark={dark}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. GALAXY / JOURNEY MAP
// ─────────────────────────────────────────────────────────────
function ScreenGalaxy() {
  const nodes = [
    { x: 50, y: 88, type: 'done',    label: 'Foundations',    sub: 'Mastered' },
    { x: 28, y: 76, type: 'done',    label: 'Chest Anatomy',  sub: 'Mastered' },
    { x: 65, y: 66, type: 'done',    label: 'Lung Patterns',  sub: 'Mastered' },
    { x: 35, y: 55, type: 'current', label: 'Nodules',        sub: 'In progress · 3/8' },
    { x: 70, y: 44, type: 'locked',  label: 'Pneumothorax',   sub: 'Unlocks at 80%' },
    { x: 30, y: 33, type: 'locked',  label: 'Cardiac CT',     sub: 'Locked' },
    { x: 60, y: 22, type: 'boss',    label: 'Boss · Trauma',  sub: 'Final challenge' },
  ];

  return (
    <div className="r-screen galaxy" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 90%, #0a0e2c 0%, #03030d 70%)',
      paddingTop: 56,
    }}>
      <Starfield density={120}/>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 5, padding: '14px 20px 6px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Sector 03</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Thoracic Imaging</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <StatPill icon={Icon.bolt()} value="2,840" color="#F5A623" dark/>
        </div>
      </div>

      {/* Map area */}
      <div style={{ position: 'absolute', inset: '110px 0 110px 0', zIndex: 3 }}>
        {/* connection path */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="trail" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#3DCAE8" stopOpacity="0.9"/>
              <stop offset="40%" stopColor="#3DCAE8" stopOpacity="0.5"/>
              <stop offset="60%" stopColor="rgba(255,255,255,0.2)"/>
              <stop offset="100%" stopColor="rgba(255,255,255,0.08)"/>
            </linearGradient>
          </defs>
          <path
            d={nodes.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ')}
            fill="none" stroke="url(#trail)" strokeWidth="0.6"
            strokeDasharray="1.6 1.4" strokeLinecap="round"
          />
        </svg>

        {/* nodes */}
        {nodes.map((n, i) => {
          const isCurrent = n.type === 'current';
          const isDone = n.type === 'done';
          const isBoss = n.type === 'boss';
          const isLocked = n.type === 'locked';

          const size = isBoss ? 78 : isCurrent ? 68 : 54;
          let bg, border, glow, content;
          if (isDone) {
            bg = 'linear-gradient(140deg, #1A9C71, #0d7256)';
            border = 'rgba(159,229,245,0.25)';
            glow = '0 0 18px -2px rgba(26,156,113,0.6)';
            content = Icon.check();
          } else if (isCurrent) {
            bg = 'linear-gradient(140deg, #3060FF, #1535E8)';
            border = '#3DCAE8';
            glow = '0 0 30px rgba(61,202,232,0.7)';
            content = Icon.play();
          } else if (isBoss) {
            bg = 'linear-gradient(140deg, #FF6B2C, #D8506F)';
            border = 'rgba(255,200,100,0.4)';
            glow = '0 0 24px rgba(216,80,111,0.55)';
            content = Icon.star('#fff');
          } else {
            bg = 'rgba(255,255,255,0.04)';
            border = 'rgba(255,255,255,0.10)';
            glow = 'none';
            content = Icon.lock('rgba(255,255,255,0.45)');
          }

          return (
            <div key={i} style={{
              position: 'absolute',
              left: `${n.x}%`, top: `${n.y}%`,
              transform: 'translate(-50%, -50%)',
            }}>
              {/* ring/halo for current */}
              {isCurrent && (
                <div style={{
                  position: 'absolute', inset: -14,
                  borderRadius: '50%', border: '1px solid rgba(61,202,232,0.4)',
                  animation: 'pulse-glow 2s ease-out infinite',
                }}/>
              )}
              <div style={{
                width: size, height: size, borderRadius: '50%',
                background: bg, border: `2px solid ${border}`,
                boxShadow: glow,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', position: 'relative',
                transform: isCurrent ? 'scale(1)' : isLocked ? 'scale(0.95)' : 'scale(1)',
              }}>
                <div style={{ transform: 'scale(1.4)' }}>{content}</div>
                {isBoss && (
                  <div style={{
                    position: 'absolute', inset: -3, borderRadius: '50%',
                    border: '1px dashed rgba(255,200,100,0.4)',
                    animation: 'orbit-spin 30s linear infinite',
                  }}/>
                )}
              </div>
              {/* label */}
              <div style={{
                position: 'absolute', top: size + 6, left: '50%',
                transform: 'translateX(-50%)', whiteSpace: 'nowrap', textAlign: 'center',
              }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: isLocked ? 'rgba(255,255,255,0.5)' : '#fff', letterSpacing: '-0.01em' }}>{n.label}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>{n.sub}</div>
              </div>
            </div>
          );
        })}

        {/* Pixel guide near current node */}
        <div style={{ position: 'absolute', left: '54%', top: '52%' }}>
          <Pixel state="guide" size={70} />
          <div style={{
            position: 'absolute', top: 8, left: 70, whiteSpace: 'nowrap',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(12px)',
            borderRadius: 12, padding: '8px 12px',
            fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '-0.005em',
          }}>
            Next stop: Nodules ↓
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ position: 'absolute', bottom: 110, left: 16, right: 16, zIndex: 6 }}>
        <div style={{
          background: 'rgba(7,9,28,0.7)', backdropFilter: 'blur(18px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 22, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(140deg, #3060FF, #1535E8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(61,202,232,0.5)',
          }}>
            <div style={{ transform: 'scale(1.5)' }}>{Icon.play()}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Resume mission</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>Pulmonary Nodules · 3/8</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#3DCAE8' }}>+120 XP</div>
        </div>
      </div>

      <TabBar active="galaxy" dark/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. LESSON / QUESTION
// ─────────────────────────────────────────────────────────────
function ScreenLesson({ initialState = 'idle' }) {
  // initialState: 'idle' | 'correct' | 'wrong'
  const [feedback, setFeedback] = React.useState(initialState);
  const [picked, setPicked] = React.useState(initialState === 'correct' ? 1 : initialState === 'wrong' ? 0 : null);

  const options = [
    { letter: 'A', text: 'Atelectasis', correct: false },
    { letter: 'B', text: 'Solitary pulmonary nodule', correct: true },
    { letter: 'C', text: 'Pleural effusion', correct: false },
    { letter: 'D', text: 'Pneumothorax', correct: false },
  ];

  const handlePick = (i) => {
    if (feedback !== 'idle') return;
    setPicked(i);
    setTimeout(() => setFeedback(options[i].correct ? 'correct' : 'wrong'), 220);
  };

  const reset = () => { setPicked(null); setFeedback('idle'); };

  // colors per option state
  const optStyle = (i, opt) => {
    const isPicked = picked === i;
    if (feedback === 'idle') {
      return {
        bg: isPicked ? '#EAF2FF' : '#fff',
        border: isPicked ? '#2155FF' : '#E3ECF7',
        text: '#14233F',
        chipBg: isPicked ? '#2155FF' : '#F5FAFF',
        chipText: isPicked ? '#fff' : '#5B6B85',
      };
    }
    if (opt.correct) {
      return { bg: '#E5F7EF', border: '#1A9C71', text: '#0d7256', chipBg: '#1A9C71', chipText: '#fff' };
    }
    if (isPicked && !opt.correct) {
      return { bg: '#FCEAEF', border: '#D8506F', text: '#9E2E48', chipBg: '#D8506F', chipText: '#fff' };
    }
    return { bg: '#fff', border: '#E3ECF7', text: '#93A0B8', chipBg: '#F5FAFF', chipText: '#93A0B8', dim: true };
  };

  return (
    <div className="r-screen" style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#F5FAFF', paddingTop: 56,
    }}>
      {/* Top bar: progress + close */}
      <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 12,
          background: '#fff', border: '1px solid #E3ECF7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon.x('#5B6B85')}
        </div>
        <div style={{ flex: 1, height: 10, background: '#E3ECF7', borderRadius: 999, overflow: 'hidden', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 0, width: '38%',
            background: 'linear-gradient(90deg, #2155FF, #3DCAE8)',
            borderRadius: 999,
            boxShadow: '0 0 8px rgba(61,202,232,0.6)',
            transition: 'width 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}/>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 13, fontWeight: 800, color: '#FF3B30',
        }}>{Icon.heart()} 5</div>
      </div>

      {/* Body */}
      <div style={{ padding: '6px 20px 200px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Question 4 of 8 · Chest CT</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em', lineHeight: '28px', marginTop: 4, marginBottom: 14 }}>
          What is the most likely finding in the right upper lobe?
        </div>

        {/* X-ray image */}
        <div style={{
          animation: feedback === 'wrong' ? 'shake 400ms' : 'none',
        }}>
          <XrayPanel height={220} highlight={{ x: 230, y: 110, r: 18 }}/>
        </div>

        {/* options */}
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {options.map((o, i) => {
            const s = optStyle(i, o);
            const isPicked = picked === i;
            return (
              <button key={i} onClick={() => handlePick(i)} style={{
                background: s.bg, border: `2px solid ${s.border}`,
                color: s.text, opacity: s.dim ? 0.6 : 1,
                borderRadius: 16, padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                fontFamily: 'Sora, system-ui', fontWeight: 700, fontSize: 15,
                textAlign: 'left', cursor: feedback === 'idle' ? 'pointer' : 'default',
                transition: 'all 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                transform: feedback !== 'idle' && o.correct ? 'scale(1.01)' : 'scale(1)',
                boxShadow: feedback !== 'idle' && o.correct ? '0 6px 18px -8px rgba(26,156,113,0.5)' : '0 1px 0 rgba(20,35,63,0.04)',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: s.chipBg, color: s.chipText,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 800, flexShrink: 0,
                }}>
                  {feedback !== 'idle' && o.correct ? Icon.check()
                    : (feedback !== 'idle' && isPicked && !o.correct) ? Icon.x()
                    : o.letter}
                </div>
                <span style={{ flex: 1 }}>{o.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback drawer */}
      {feedback !== 'idle' && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: feedback === 'correct' ? '#E5F7EF' : '#FCEAEF',
          borderTop: `1px solid ${feedback === 'correct' ? '#1A9C71' : '#D8506F'}`,
          borderRadius: '24px 24px 0 0',
          padding: '18px 20px 22px',
          animation: 'fadeUp 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          zIndex: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: feedback === 'correct' ? '#1A9C71' : '#D8506F',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              animation: 'pop 600ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}>
              <div style={{ transform: 'scale(1.4)' }}>{feedback === 'correct' ? Icon.check() : Icon.x()}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: feedback === 'correct' ? '#0d7256' : '#9E2E48', letterSpacing: '-0.01em' }}>
                {feedback === 'correct' ? 'Correct! +25 XP' : 'Not quite'}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: feedback === 'correct' ? '#1A9C71' : '#9E2E48', marginTop: 1 }}>
                {feedback === 'correct'
                  ? '8mm well-circumscribed nodule, RUL'
                  : 'The correct answer is solitary pulmonary nodule'}
              </div>
            </div>
          </div>
          <button onClick={reset} className="btn-primary" style={{
            background: feedback === 'correct'
              ? 'linear-gradient(180deg, #20B484 0%, #1A9C71 100%)'
              : 'linear-gradient(180deg, #E66984 0%, #D8506F 100%)',
            boxShadow: feedback === 'correct'
              ? '0 1px 0 rgba(255,255,255,0.35) inset, 0 -2px 0 rgba(0,80,50,0.35) inset, 0 8px 22px -6px rgba(26,156,113,0.55)'
              : '0 1px 0 rgba(255,255,255,0.35) inset, 0 -2px 0 rgba(120,30,50,0.4) inset, 0 8px 22px -6px rgba(216,80,111,0.55)',
          }}>Continue</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. REWARD / CHECKPOINT
// ─────────────────────────────────────────────────────────────
function ScreenReward() {
  const [showXp, setShowXp] = React.useState(0);
  React.useEffect(() => {
    const t = setTimeout(() => {
      let n = 0;
      const id = setInterval(() => {
        n += 6;
        if (n >= 145) { n = 145; clearInterval(id); }
        setShowXp(n);
      }, 18);
    }, 350);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="r-screen galaxy" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 30%, #1a2570 0%, #0a0e2c 50%, #03030d 100%)',
      paddingTop: 56,
    }}>
      <Starfield density={70}/>
      <Confetti count={50} run={true}/>

      {/* radial burst behind mascot */}
      <div style={{
        position: 'absolute', top: 100, left: '50%',
        transform: 'translateX(-50%)',
        width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(61,202,232,0.25) 0%, transparent 60%)',
        animation: 'glow-pulse 2.4s ease-in-out infinite',
      }}/>
      {/* sun rays */}
      <svg style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', width: 360, height: 360, opacity: 0.35 }} viewBox="0 0 360 360">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="180" y1="180" x2="180" y2="20"
            stroke="rgba(61,202,232,0.5)" strokeWidth="2"
            transform={`rotate(${i * 30} 180 180)`}/>
        ))}
      </svg>

      {/* Mascot hero */}
      <div style={{
        position: 'absolute', top: 80, left: '50%',
        transform: 'translateX(-50%)', zIndex: 4,
      }}>
        <Pixel state="celebrate" size={180} />
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 360, left: 24, right: 24,
        textAlign: 'center', zIndex: 4,
        animation: 'fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 200ms backwards',
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#3DCAE8', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 6 }}>Checkpoint cleared</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: '36px' }}>
          Lung Patterns<br/>mastered
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
          You diagnosed 8 of 8 cases with 92% confidence
        </div>
      </div>

      {/* Reward stack */}
      <div style={{
        position: 'absolute', left: 20, right: 20, bottom: 140, zIndex: 4,
        animation: 'fadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) 400ms backwards',
      }}>
        {/* XP card */}
        <div style={{
          background: 'linear-gradient(140deg, rgba(245,166,35,0.25), rgba(245,166,35,0.08))',
          border: '1px solid rgba(245,166,35,0.4)',
          borderRadius: 18, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
          boxShadow: '0 0 24px -8px rgba(245,166,35,0.5)',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: '#F5A623',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(1.4)' }}>{Icon.bolt('#fff')}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>XP earned</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>+{showXp} XP</div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#F5A623', padding: '4px 8px', borderRadius: 8, background: 'rgba(245,166,35,0.2)' }}>2× streak</div>
        </div>

        {/* streak card */}
        <div style={{
          background: 'rgba(255,107,44,0.15)',
          border: '1px solid rgba(255,107,44,0.35)',
          borderRadius: 18, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,107,44,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(1.4)' }}>{Icon.flame('#FF8A4C')}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>12-day streak maintained</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>Best ever — keep it alive tomorrow</div>
          </div>
        </div>

        {/* Level up card */}
        <div style={{
          background: 'rgba(61,202,232,0.12)',
          border: '1px solid rgba(61,202,232,0.35)',
          borderRadius: 18, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 14,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(61,202,232,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ transform: 'scale(1.4)' }}>{Icon.star('#3DCAE8')}</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Level 7 — Resident</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>320 XP to Senior Resident</div>
          </div>
        </div>

        <button className="btn-galaxy">Continue journey →</button>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenHome, ScreenGalaxy, ScreenLesson, ScreenReward });
