import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle, ArrowDown, ChevronRight, Activity, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { getMasteryColor, getMasteryLabel, formatPercent } from '../../lib/utils';

export function WhyWeak() {
  const navigate = useNavigate();
  const { competencies } = useAppStore();

  const target = competencies['c_sampling_methods'] || { name: 'Sampling Methods', mastery: 0.35 };
  const rootCause = competencies['c_probability'] || { name: 'Probability Fundamentals', mastery: 0.22 };
  const secondaryGap = competencies['c_sampling_fundamentals'] || { name: 'Sampling Fundamentals', mastery: 0.48 };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Diagnostic Analysis</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
          Why are you struggling with {target.name}?
        </h1>
      </header>

      {/* Target Competency */}
      <div style={{ ...panel2, padding: '24px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.40)', marginBottom: 6 }}>Current Competency</div>
          <div style={{ fontSize: 20, fontWeight: 400, color: '#fff' }}>{target.name}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-.04em', color: '#fff' }}>{formatPercent(target.mastery)}</div>
          <div style={{
            ...mono, fontSize: 8, marginTop: 4, padding: '2px 8px', display: 'inline-block',
            border: '1px solid rgba(244,63,94,.40)', color: '#F43F5E', background: 'rgba(244,63,94,.08)'
          }}>
            {getMasteryLabel(target.mastery)}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', color: 'rgba(255,255,255,.20)', margin: '-10px 0' }}>
        <ArrowDown size={24} />
      </div>

      {/* KarmSetu Analysis Box */}
      <div style={{ ...panel, padding: 32, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6366F1', marginBottom: 16 }}>
          <Zap size={16} />
          <span style={{ ...mono, fontSize: 9, color: '#6366F1' }}>KarmSetu Adaptive Diagnosis</span>
        </div>
        <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,.80)', maxWidth: 640 }}>
          You are attempting <span style={{ color: '#fff', borderBottom: '1px solid #6366F1' }}>Sampling Methods</span> questions correctly at the surface level, but repeated errors indicate difficulty with the underlying <span style={{ color: '#fff', borderBottom: '1px solid #6366F1' }}>probability assumptions</span> required for these calculations.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28, borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20 }}>
          <div style={{ background: '#0F0F11', border: '1px solid rgba(244,63,94,.25)', padding: 16 }}>
            <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 6 }}>Detected Root Cause</div>
            <div style={{ fontSize: 14, fontWeight: 400, color: '#F43F5E', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={14} /> {rootCause.name}
            </div>
          </div>
          <div style={{ background: '#0F0F11', border: '1px solid rgba(251,191,36,.25)', padding: 16 }}>
            <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 6 }}>Secondary Gap</div>
            <div style={{ fontSize: 14, fontWeight: 400, color: '#FBBF24', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={14} /> {secondaryGap.name}
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisite Detail */}
      <div style={{ ...panel2, padding: '24px 28px' }}>
        <h3 style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.40)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Activity size={14} style={{ color: '#6366F1' }} /> Prerequisite Gap Details
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 18, background: '#131316', border: '1px solid rgba(255,255,255,.08)' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 400, color: '#fff' }}>{rootCause.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>This must be mastered before advancing.</div>
          </div>
          <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,.08)', paddingLeft: 20 }}>
            <div style={{ fontSize: 24, fontWeight: 300, color: '#F43F5E' }}>{formatPercent(rootCause.mastery)}</div>
            <div style={{ ...mono, fontSize: 8, color: '#F43F5E', marginTop: 2 }}>Critical Gap</div>
          </div>
        </div>
      </div>

      {/* Recommended Learning Path */}
      <div style={{ ...panel2, padding: '24px 28px' }}>
        <h3 style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.40)', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 12 }}>
          Recommended Learning Path
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.30)' }}>
            <div style={{ width: 28, height: 28, background: '#6366F1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 500 }}>1</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 400, color: '#fff' }}>{rootCause.name}</div>
              <div style={{ ...mono, fontSize: 8, color: '#6366F1', marginTop: 2 }}>Step 1: Focus On Root Cause</div>
            </div>
            <button onClick={() => navigate('/learner/practice')} style={{
              ...mono, fontSize: 8, padding: '8px 16px', background: '#6366F1', color: '#fff', border: 'none', cursor: 'pointer'
            }}>Practice Now</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#131316', border: '1px solid rgba(255,255,255,.06)', opacity: 0.65 }}>
            <div style={{ width: 28, height: 28, background: '#1A1A1F', border: '1px solid rgba(255,255,255,.10)', color: 'rgba(255,255,255,.60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>2</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 400, color: '#fff' }}>{secondaryGap.name}</div>
              <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Step 2: Bridge Fundamentals</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: '#131316', border: '1px solid rgba(255,255,255,.06)', opacity: 0.45 }}>
            <div style={{ width: 28, height: 28, background: '#1A1A1F', border: '1px solid rgba(255,255,255,.10)', color: 'rgba(255,255,255,.60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>3</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 400, color: '#fff' }}>{target.name}</div>
              <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>Step 3: Re-Assess Target Competency</div>
            </div>
          </div>
        </div>

        {/* iGOT Recommendation Box */}
        <div style={{ marginTop: 28, padding: 24, background: '#131316', border: '1px solid rgba(255,255,255,.08)', textAlign: 'center' }}>
          <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Recommended iGOT Karmayogi Course</div>
          <h4 style={{ fontSize: 17, fontWeight: 400, color: '#fff', marginBottom: 4 }}>Probability Fundamentals for Data Science</h4>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginBottom: 20 }}>Provider: Capacity Building Commission &middot; Official iGOT Integration</div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <a
              href="https://igotkarmayogi.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...mono, fontSize: 9, padding: '10px 22px', background: '#6366F1',
                color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6
              }}
            >
              Open in iGOT <ChevronRight size={12} />
            </a>
            <button
              onClick={() => navigate('/learner/practice')}
              style={{
                ...mono, fontSize: 9, padding: '10px 22px', background: 'transparent',
                border: '1px solid rgba(255,255,255,.14)', color: 'rgba(255,255,255,.65)', cursor: 'pointer'
              }}
            >
              Practice with AI MCQs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
