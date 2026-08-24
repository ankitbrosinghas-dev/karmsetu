import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight, BookOpen, Clock, Target, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { getMasteryColor, getMasteryLabel, formatPercent } from '../../lib/utils';

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

// ── shared dark-theme helpers ─────────────────────────────────
const panel  = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;
const mono   = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
const hairB  = { borderBottom: '1px solid rgba(255,255,255,.08)' };

export function LearnerDashboard() {
  const navigate = useNavigate();
  const { currentUser, competencies } = useAppStore();
  const samplingMethods = competencies['c_sampling_methods'] || {
    id: 'c_sampling_methods',
    name: 'Sampling Methods',
    category: 'Methodology',
    mastery: 44,
    prerequisites: ['c_probability'],
    status: 'Needs Attention' as const
  };
  const overallCompetency = 68;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, animation: 'fadeIn .5s ease' }}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

      {/* Page header */}
      <header style={{ ...hairB, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 300, letterSpacing: '-.04em', lineHeight: 1.1 }}>
              {getGreeting()}, {currentUser?.name}
            </h1>
            <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 8 }}>
              {currentUser?.designation} &middot; {currentUser?.department || 'National Sample Survey Office (NSSO)'}
            </p>
          </div>
          <Link
            to="/learner/passport"
            style={{
              ...mono, fontSize: 9, padding: '8px 16px',
              background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.30)',
              color: '#818CF8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <BookOpen size={12} /> View Competency Passport
          </Link>
        </div>

        {/* Official Profile Intelligence Summary Bar */}
        {(currentUser?.jobRole || currentUser?.currentAssignment || currentUser?.educationalQualifications) && (
          <div style={{
            ...panel2, padding: '14px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px 24px',
            borderLeft: '3px solid #6366F1'
          }}>
            {currentUser?.jobRole && (
              <div>
                <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 2 }}>Job Role</div>
                <div style={{ fontSize: 12, color: '#fff', fontWeight: 400 }}>{currentUser.jobRole}</div>
              </div>
            )}
            {currentUser?.currentAssignment && (
              <div>
                <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 2 }}>Assignment</div>
                <div style={{ fontSize: 12, color: '#6366F1', fontWeight: 400 }}>{currentUser.currentAssignment}</div>
              </div>
            )}
            {currentUser?.educationalQualifications && (
              <div>
                <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 2 }}>Education</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)' }}>{currentUser.educationalQualifications}</div>
              </div>
            )}
            {currentUser?.workExperience && (
              <div>
                <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 2 }}>Experience</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.8)' }}>{currentUser.workExperience}</div>
              </div>
            )}
            {currentUser?.previousTrainings && currentUser.previousTrainings.length > 0 && (
              <div>
                <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 2 }}>Trainings Synced</div>
                <div style={{ fontSize: 12, color: '#34D399' }}>{currentUser.previousTrainings.length} Modules Registered</div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,.06)' }}>
        {[
          { label: 'Overall Competency', value: `${overallCompetency}%`, sub: '+12% this month', subColor: '#34D399' },
          { label: 'Training Progress',  value: '76%',    sub: '4 modules active',      subColor: '' },
          { label: 'Competencies Strong',value: '8',      sub: 'Verified via assessment',subColor: '' },
          { label: 'Needs Attention',    value: '4',      sub: 'Gaps detected',          subColor: '#F43F5E', valColor: '#F43F5E' },
        ].map((s, i) => (
          <div key={i} style={{ ...panel2, padding: '24px 20px' }}>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 10 }}>{s.label}</div>
            <div style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 300, letterSpacing: '-.04em', color: s.valColor || '#fff' }}>{s.value}</div>
            <div style={{ ...hairB, marginTop: 16, marginBottom: 12 }} />
            <div style={{ ...mono, fontSize: 9, color: s.subColor || 'rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
              {i === 0 && <ArrowUpRight size={11} />}{s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Priority action */}
      <section style={{ ...panel, overflow: 'hidden' }}>
        <div style={{ background: 'rgba(244,63,94,.08)', borderBottom: '1px solid rgba(244,63,94,.18)', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={14} style={{ color: '#F43F5E' }} />
          <span style={{ ...mono, fontSize: 9, color: '#F43F5E' }}>Current Priority</span>
        </div>
        <div style={{ padding: '32px 28px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h2 style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 300, letterSpacing: '-.03em' }}>{samplingMethods.name}</h2>
              <span style={{ ...mono, fontSize: 8, padding: '3px 10px', border: '1px solid rgba(244,63,94,.40)', color: '#F43F5E', background: 'rgba(244,63,94,.08)' }}>
                {getMasteryLabel(samplingMethods.mastery)}
              </span>
            </div>
            <div style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 300, letterSpacing: '-.05em', marginBottom: 12 }}>
              {formatPercent(samplingMethods.mastery)}&nbsp;<span style={{ fontSize: 13, color: 'rgba(255,255,255,.40)' }}>Mastery</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,.55)', maxWidth: '52ch' }}>
              You are struggling with advanced sampling techniques. KarmSetu has detected a prerequisite gap that may be the root cause.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 180 }}>
            <button onClick={() => navigate('/learner/why-weak')} style={{
              ...mono, fontSize: 9, padding: '11px 20px',
              background: 'transparent', color: 'rgba(255,255,255,.65)',
              border: '1px solid rgba(255,255,255,.14)', cursor: 'pointer',
              transition: 'border-color .2s, color .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.32)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)'; }}
            >Understand Why</button>
            <button onClick={() => navigate('/learner/practice')} style={{
              ...mono, fontSize: 9, padding: '11px 20px',
              background: '#6366F1', color: '#fff', border: '1px solid #6366F1', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center',
              transition: 'background .2s, border-color .2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4338CA'; e.currentTarget.style.borderColor = '#4338CA'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.borderColor = '#6366F1'; }}
            >Start Training <ChevronRight size={12} /></button>
          </div>
        </div>
      </section>

      {/* Today's actions */}
      <section>
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', ...hairB, paddingBottom: 14, marginBottom: 20 }}>
          Today&rsquo;s Recommended Actions
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.06)' }}>
          {[
            { icon: BookOpen, label: 'Review Probability Fundamentals', mins: 10, accent: false, onClick: () => navigate('/learner/why-weak') },
            { icon: Target,   label: 'Learn Sampling Concepts',         mins: 15, accent: false, onClick: undefined },
            { icon: Target,   label: 'Complete Adaptive Practice',      mins: 20, accent: true,  onClick: () => navigate('/learner/practice') },
          ].map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} onClick={a.onClick} style={{
                ...panel2,
                padding: '22px 20px', display: 'flex', flexDirection: 'column',
                cursor: 'pointer',
                background: a.accent ? '#6366F1' : '#0F0F11',
                border: `1px solid ${a.accent ? '#6366F1' : 'rgba(255,255,255,.08)'}`,
                transition: 'background .2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = a.accent ? '#4338CA' : '#131316'; }}
                onMouseLeave={e => { e.currentTarget.style.background = a.accent ? '#6366F1' : '#0F0F11'; }}
              >
                <div style={{ width: 36, height: 36, background: a.accent ? 'rgba(255,255,255,.18)' : 'rgba(99,102,241,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: a.accent ? '#fff' : '#6366F1' }}>
                  <Icon size={16} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 400, letterSpacing: '-.01em', marginBottom: 'auto' }}>{a.label}</div>
                <div style={{ ...hairB, marginTop: 16, marginBottom: 10, borderBottomColor: a.accent ? 'rgba(255,255,255,.20)' : 'rgba(255,255,255,.07)' }} />
                <div style={{ ...mono, fontSize: 9, color: a.accent ? 'rgba(255,255,255,.70)' : 'rgba(255,255,255,.35)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={10} /> {a.mins} min
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
