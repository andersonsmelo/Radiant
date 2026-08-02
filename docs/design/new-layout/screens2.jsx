// screens2.jsx — Onboarding (3), Progress, Missions, Checkpoint

// ─────────────────────────────────────────────────────────────
// ONBOARDING 1 — Welcome with Pixel guide
// ─────────────────────────────────────────────────────────────
function ScreenOnboardWelcome() {
  return (
    <div className="r-screen galaxy" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse at 50% 100%, #0a1240 0%, #03030d 70%)',
      paddingTop: 56,
    }}>
      <Starfield density={80}/>

      {/* Pixel hero */}
      <div style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
        <div style={{
          position: 'absolute', inset: -40,
          background: 'radial-gradient(circle, rgba(61,202,232,0.3) 0%, transparent 60%)',
          animation: 'glow-pulse 3s ease-in-out infinite',
        }}/>
        <Pixel state="guide" size={200}/>
      </div>

      {/* speech bubble */}
      <div style={{
        position: 'absolute', top: 320, left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(14px)',
        borderRadius: 14, padding: '8px 14px',
        fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '-0.005em',
        zIndex: 5, whiteSpace: 'nowrap',
      }}>
        Hi, I'm Pixel — your study companion
      </div>

      {/* Title */}
      <div style={{
        position: 'absolute', top: 420, left: 28, right: 28,
        textAlign: 'center', zIndex: 4,
      }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#3DCAE8', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 8 }}>Welcome to Radiant</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: '38px' }}>
          Read like a<br/>radiologist
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(255,255,255,0.62)', marginTop: 10, lineHeight: '22px' }}>
          Five minutes a day. Real cases. Spaced repetition that sticks.
        </div>
      </div>

      {/* CTA + dots */}
      <div style={{ position: 'absolute', bottom: 56, left: 20, right: 20, zIndex: 4 }}>
        <button className="btn-galaxy" style={{ marginBottom: 14 }}>Get started →</button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: i === 0 ? 22 : 6, height: 6, borderRadius: 3,
              background: i === 0 ? '#3DCAE8' : 'rgba(255,255,255,0.2)',
              transition: 'all 220ms',
            }}/>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 14,
          fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
          Already have an account? <span style={{ color: '#3DCAE8', fontWeight: 700 }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ONBOARDING 2 — Value props (3 benefits)
// ─────────────────────────────────────────────────────────────
function ScreenOnboardValue() {
  const items = [
    { icon: Icon.brain('#3DCAE8'), title: 'Spaced, not crammed',
      sub: 'Adaptive review brings tough cases back at the right moment.' },
    { icon: Icon.target('#F5A623'), title: 'Real radiology cases',
      sub: 'Plain films, CT, and MRI from real teaching libraries.' },
    { icon: Icon.bolt('#1A9C71'), title: 'Five minutes a day',
      sub: 'Bite-sized sessions. Streaks. Visible progress.' },
  ];
  return (
    <div className="r-screen galaxy" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: '#03030d', paddingTop: 56,
    }}>
      <Starfield density={50}/>

      <div style={{ padding: '28px 24px 0', position: 'relative', zIndex: 3 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#3DCAE8', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Why Radiant</div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: '34px', marginTop: 6 }}>
          Built for the way<br/>residents actually learn.
        </div>
      </div>

      <div style={{ position: 'absolute', top: 220, left: 20, right: 20, zIndex: 3, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 18, padding: '16px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 14,
            backdropFilter: 'blur(12px)',
            animation: `fadeUp 600ms cubic-bezier(0.22,1,0.36,1) ${i * 120}ms backwards`,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <div style={{ transform: 'scale(1.6)' }}>{it.icon}</div>
            </div>
            <div style={{ flex: 1, paddingTop: 2 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{it.title}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.62)', marginTop: 3, lineHeight: '18px' }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* mini Pixel */}
      <div style={{ position: 'absolute', right: 16, bottom: 156, zIndex: 4 }}>
        <Pixel state="happy" size={70}/>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 56, left: 20, right: 20, zIndex: 4 }}>
        <button className="btn-galaxy" style={{ marginBottom: 14 }}>Continue →</button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: i === 1 ? 22 : 6, height: 6, borderRadius: 3,
              background: i === 1 ? '#3DCAE8' : 'rgba(255,255,255,0.2)',
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ONBOARDING 3 — Specialty / goal selection
// ─────────────────────────────────────────────────────────────
function ScreenOnboardGoal() {
  const [picked, setPicked] = React.useState(1);
  const specialties = [
    { id: 0, label: 'Chest & thorax',     sub: '120 cases', emoji: '🫁' },
    { id: 1, label: 'Neuroradiology',     sub: '95 cases',  emoji: '🧠' },
    { id: 2, label: 'Musculoskeletal',    sub: '88 cases',  emoji: '🦴' },
    { id: 3, label: 'Abdominal',          sub: '76 cases',  emoji: '🫀' },
    { id: 4, label: 'Cardiac imaging',    sub: '62 cases',  emoji: '❤️' },
  ];
  const goals = [
    { id: 'l', label: '5 min', sub: 'Light' },
    { id: 'm', label: '10 min', sub: 'Steady' },
    { id: 'h', label: '20 min', sub: 'Intense' },
  ];
  const [goal, setGoal] = React.useState('m');

  return (
    <div className="r-screen galaxy" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: '#03030d', paddingTop: 56,
    }}>
      <Starfield density={40}/>

      <div style={{ padding: '20px 20px 0', position: 'relative', zIndex: 3 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#3DCAE8', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Step 3 of 4</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: '30px', marginTop: 4 }}>
          Where do you want<br/>to focus first?
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.55)', marginTop: 6 }}>
          You can switch tracks any time.
        </div>
      </div>

      {/* Specialty list */}
      <div style={{ position: 'absolute', top: 156, left: 20, right: 20, zIndex: 3,
        display: 'flex', flexDirection: 'column', gap: 8 }}>
        {specialties.map(s => {
          const on = picked === s.id;
          return (
            <button key={s.id} onClick={() => setPicked(s.id)} style={{
              background: on ? 'rgba(33,85,255,0.18)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${on ? '#3DCAE8' : 'rgba(255,255,255,0.10)'}`,
              borderRadius: 16, padding: '12px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: 'Sora, system-ui',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 180ms',
              boxShadow: on ? '0 0 22px -6px rgba(61,202,232,0.5)' : 'none',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: on ? 'rgba(61,202,232,0.18)' : 'rgba(255,255,255,0.06)',
                fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{s.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{s.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{s.sub}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                border: `2px solid ${on ? '#3DCAE8' : 'rgba(255,255,255,0.2)'}`,
                background: on ? '#3DCAE8' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {on && <svg width="10" height="10" viewBox="0 0 14 14"><path d="M2 7.5l3 3 7-7" stroke="#03030d" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Daily goal */}
      <div style={{ position: 'absolute', bottom: 156, left: 20, right: 20, zIndex: 3 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Daily goal</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {goals.map(g => {
            const on = goal === g.id;
            return (
              <button key={g.id} onClick={() => setGoal(g.id)} style={{
                flex: 1,
                background: on ? 'rgba(33,85,255,0.18)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${on ? '#3DCAE8' : 'rgba(255,255,255,0.10)'}`,
                borderRadius: 14, padding: '10px 8px',
                fontFamily: 'Sora, system-ui',
                cursor: 'pointer', textAlign: 'center',
                transition: 'all 180ms',
              }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{g.label}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{g.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 56, left: 20, right: 20, zIndex: 4 }}>
        <button className="btn-galaxy" style={{ marginBottom: 14 }}>Build my plan →</button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              width: i === 2 ? 22 : 6, height: 6, borderRadius: 3,
              background: i === 2 ? '#3DCAE8' : 'rgba(255,255,255,0.2)',
            }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROGRESS — weekly streak, accuracy chart, mastered topics
// ─────────────────────────────────────────────────────────────
function ScreenProgress() {
  // accuracy data (last 8 weeks)
  const accuracy = [62, 68, 71, 76, 72, 80, 84, 84];
  const max = 100;
  const days = ['M','T','W','T','F','S','S'];
  const streak = [true, true, true, true, true, true, false]; // today is Sat = active

  return (
    <div className="r-screen" style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#F5FAFF', paddingTop: 56, overflow: 'auto',
    }}>
      <div style={{ padding: '14px 20px 130px' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Your stats</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em', marginTop: 2 }}>Progress</div>

        {/* Streak calendar */}
        <div className="card" style={{ marginTop: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em',
                display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ display: 'inline-flex', transform: 'scale(1.3)' }}>{Icon.flame()}</span>
                12 days
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#5B6B85' }}>Best streak ever</div>
            </div>
            <div style={{
              padding: '6px 10px', borderRadius: 10,
              background: 'rgba(255,107,44,0.1)', border: '1px solid rgba(255,107,44,0.25)',
              fontSize: 11, fontWeight: 800, color: '#FF6B2C', letterSpacing: '0.04em',
            }}>ON FIRE</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
            {days.map((d, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  width: '100%', aspectRatio: '1', borderRadius: 10,
                  background: streak[i] ? 'linear-gradient(140deg, #FF8A4C, #FF6B2C)' : '#EAF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 4,
                  boxShadow: streak[i] ? '0 6px 14px -6px rgba(255,107,44,0.5)' : 'none',
                }}>
                  {streak[i] && Icon.flame('#fff')}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#93A0B8' }}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Accuracy chart */}
        <div className="card" style={{ marginTop: 12, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accuracy</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em' }}>
                84%
                <span style={{ fontSize: 13, fontWeight: 700, color: '#1A9C71', marginLeft: 8 }}>+12% ↑</span>
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#93A0B8' }}>last 8 weeks</div>
          </div>
          <div style={{ position: 'relative', height: 100, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            {accuracy.map((v, i) => (
              <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{
                  width: '100%', height: `${(v/max)*100}%`,
                  background: i === accuracy.length - 1
                    ? 'linear-gradient(180deg, #3DCAE8, #2155FF)'
                    : 'linear-gradient(180deg, rgba(33,85,255,0.4), rgba(33,85,255,0.15))',
                  borderRadius: 6,
                  boxShadow: i === accuracy.length - 1 ? '0 4px 14px -4px rgba(33,85,255,0.6)' : 'none',
                }}/>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 9, fontWeight: 700, color: '#93A0B8', letterSpacing: '0.08em' }}>
            <span>WK 1</span><span>WK 8</span>
          </div>
        </div>

        {/* Stats trio */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total XP</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em', marginTop: 2,
              display: 'flex', alignItems: 'center', gap: 5 }}>
              {Icon.bolt()} 2,840
            </div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#5B6B85', marginTop: 1 }}>Lv 7 · Resident</div>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Sessions</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em', marginTop: 2 }}>47</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#5B6B85', marginTop: 1 }}>this month</div>
          </div>
        </div>

        {/* Mastered topics */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Topics mastered</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#2155FF' }}>23 →</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Chest anatomy', mastery: 1.0, color: '#1A9C71' },
              { name: 'Lung patterns', mastery: 0.96, color: '#1A9C71' },
              { name: 'Pulmonary nodules', mastery: 0.55, color: '#3DCAE8' },
              { name: 'Cardiac silhouette', mastery: 0.32, color: '#F5A623' },
            ].map((t, i) => (
              <div key={i} className="card" style={{ padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#14233F' }}>{t.name}</div>
                  <div style={{ height: 6, borderRadius: 3, background: '#EAF2FF', marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${t.mastery*100}%`, height: '100%', background: t.color, borderRadius: 3 }}/>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#14233F', minWidth: 36, textAlign: 'right' }}>
                  {Math.round(t.mastery*100)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TabBar active="progress"/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MISSIONS — daily / weekly with progress
// ─────────────────────────────────────────────────────────────
function ScreenMissions() {
  const daily = [
    { title: 'Earn 100 XP today', cur: 65, goal: 100, xp: 30, icon: Icon.bolt() },
    { title: 'Answer 3 in a row',  cur: 3, goal: 3, xp: 15, icon: Icon.target(), done: true },
    { title: 'Complete 1 lesson',  cur: 0, goal: 1, xp: 25, icon: Icon.brain() },
  ];
  const weekly = [
    { title: 'Maintain a 7-day streak', cur: 6, goal: 7, xp: 100, icon: Icon.flame() },
    { title: 'Master 3 new topics',     cur: 1, goal: 3, xp: 150, icon: Icon.star() },
  ];

  const renderMission = (m, i, dark = false) => {
    const pct = Math.min(1, m.cur / m.goal);
    const done = m.done || pct >= 1;
    return (
      <div key={i} className="card" style={{ padding: 14,
        display: 'flex', alignItems: 'center', gap: 12,
        opacity: done ? 0.7 : 1,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: done ? '#1A9C71' : 'rgba(33,85,255,0.10)',
          border: `1px solid ${done ? '#1A9C71' : 'rgba(33,85,255,0.18)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <div style={{ transform: 'scale(1.4)', color: done ? '#fff' : undefined }}>
            {done ? Icon.check() : m.icon}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#14233F', letterSpacing: '-0.01em',
              textDecoration: done ? 'line-through' : 'none', textDecorationColor: '#93A0B8' }}>
              {m.title}
            </div>
            <div style={{
              fontSize: 11, fontWeight: 800, color: '#F5A623',
              padding: '2px 8px', borderRadius: 8,
              background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)',
              flexShrink: 0,
              display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>+{m.xp}</div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: '#EAF2FF', overflow: 'hidden' }}>
            <div style={{
              width: `${pct*100}%`, height: '100%',
              background: done
                ? 'linear-gradient(90deg, #1A9C71, #20B484)'
                : 'linear-gradient(90deg, #2155FF, #3DCAE8)',
              borderRadius: 4,
              transition: 'width 600ms cubic-bezier(0.34,1.56,0.64,1)',
            }}/>
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5B6B85', marginTop: 4 }}>
            {m.cur} / {m.goal}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="r-screen" style={{
      width: '100%', height: '100%', position: 'relative',
      background: '#F5FAFF', paddingTop: 56, overflow: 'auto',
    }}>
      <div style={{ padding: '14px 20px 130px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Missions</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em', marginTop: 2 }}>Today's challenges</div>
          </div>
          <div style={{
            padding: '6px 10px', borderRadius: 10,
            background: '#fff', border: '1px solid #E3ECF7',
            fontSize: 12, fontWeight: 700, color: '#5B6B85',
            display: 'inline-flex', alignItems: 'center', gap: 5,
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11"><circle cx="5.5" cy="5.5" r="4.5" stroke="#2155FF" strokeWidth="1.4" fill="none"/><path d="M5.5 3v3l2 1" stroke="#2155FF" strokeWidth="1.4" strokeLinecap="round"/></svg>
            14h 22m
          </div>
        </div>

        {/* Streak banner */}
        <div style={{
          marginTop: 14, borderRadius: 18,
          background: 'linear-gradient(140deg, #FF8A4C, #FF6B2C)',
          padding: '14px 16px', color: '#fff',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 14px 30px -12px rgba(255,107,44,0.55)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.22,
            backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)',
            backgroundSize: '12px 12px',
          }}/>
          <div style={{ width: 48, height: 48, borderRadius: 14,
            background: 'rgba(255,255,255,0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', zIndex: 1 }}>
            <div style={{ transform: 'scale(1.7)' }}>{Icon.flame('#fff')}</div>
          </div>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em' }}>Complete all 3 to keep your streak</div>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, marginTop: 1 }}>Streak shield expires at midnight</div>
          </div>
        </div>

        {/* Daily */}
        <div style={{ marginTop: 18, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Daily · 1/3 done</div>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#F5A623',
            padding: '2px 8px', borderRadius: 8,
            background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.25)' }}>+70 XP TOTAL</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {daily.map((m, i) => renderMission(m, i))}
        </div>

        {/* Weekly */}
        <div style={{ marginTop: 18, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#93A0B8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>This week</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#5B6B85' }}>3d left</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {weekly.map((m, i) => renderMission(m, i))}
        </div>
      </div>

      <TabBar active="missions"/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHECKPOINT — milestone before reward (Pixel celebrate, big)
// (distinct from Reward: this is the mid-flow "checkpoint cleared" moment)
// ─────────────────────────────────────────────────────────────
function ScreenCheckpoint() {
  return (
    <div className="r-screen" style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(180deg, #EAF2FF 0%, #F5FAFF 100%)',
      paddingTop: 56,
    }}>
      {/* radial backdrop */}
      <div style={{
        position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(33,85,255,0.18) 0%, transparent 60%)',
      }}/>
      {/* Confetti subtle */}
      <Confetti count={30} run={true}/>

      {/* Pixel hero */}
      <div style={{ position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 4 }}>
        <Pixel state="celebrate" size={170}/>
      </div>

      {/* Achievement card */}
      <div style={{ position: 'absolute', top: 360, left: 24, right: 24, zIndex: 5,
        animation: 'fadeUp 600ms cubic-bezier(0.22,1,0.36,1) 200ms backwards' }}>
        <div className="card" style={{
          padding: '20px 20px 18px', textAlign: 'center', position: 'relative', overflow: 'hidden',
          border: '1px solid #B8D2FF',
          boxShadow: '0 16px 40px -10px rgba(33,85,255,0.25)',
        }}>
          {/* badge */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(140deg, #F5A623, #FF8A4C)',
            margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px -4px rgba(245,166,35,0.55), 0 1px 0 rgba(255,255,255,0.5) inset',
            position: 'relative',
          }}>
            <div style={{ transform: 'scale(2.2)' }}>{Icon.star('#fff')}</div>
            <div style={{
              position: 'absolute', inset: -8, borderRadius: '50%',
              border: '1px dashed rgba(245,166,35,0.5)',
              animation: 'orbit-spin 24s linear infinite',
            }}/>
          </div>

          <div style={{ fontSize: 11, fontWeight: 800, color: '#F5A623', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Achievement unlocked</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#14233F', letterSpacing: '-0.02em', lineHeight: '28px', marginTop: 6 }}>
            Sharp Eye
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: '#5B6B85', marginTop: 6, lineHeight: '18px' }}>
            Identified 25 nodules without missing a finding.
          </div>

          {/* XP gain */}
          <div style={{
            marginTop: 14, padding: '10px 14px', borderRadius: 14,
            background: '#FFF6E3', border: '1px solid rgba(245,166,35,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            fontSize: 14, fontWeight: 800, color: '#B57218',
          }}>
            <div style={{ transform: 'scale(1.2)' }}>{Icon.bolt()}</div>
            +75 XP earned
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', bottom: 56, left: 20, right: 20, zIndex: 5 }}>
        <button className="btn-primary">Continue</button>
        <div style={{ textAlign: 'center', marginTop: 10,
          fontSize: 13, fontWeight: 700, color: '#5B6B85' }}>
          Share with cohort
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenOnboardWelcome, ScreenOnboardValue, ScreenOnboardGoal,
  ScreenProgress, ScreenMissions, ScreenCheckpoint,
});
