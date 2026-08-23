import React from 'react';
import { GitBranch, Target, CheckCircle2, AlertCircle } from 'lucide-react';

export const CompetencyGraph = () => {
  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Prerequisite Topology</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
          Competency Graph
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 4 }}>
          Live dependency hierarchy mapping foundational knowledge to target mastery.
        </p>
      </header>

      <div style={{ ...panel, padding: '48px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, position: 'relative' }}>
          
          {/* Node 1: Prerequisite Mastered */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{
              width: 56, height: 56, background: 'rgba(52,211,153,.10)',
              border: '1px solid rgba(52,211,153,.35)', color: '#34D399',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckCircle2 size={26} />
            </div>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 400, color: '#fff' }}>Probability Fundamentals</div>
              <div style={{ ...mono, fontSize: 8, color: '#34D399', marginTop: 2 }}>Prerequisite Mastered</div>
            </div>
          </div>

          {/* Connection Line */}
          <div style={{ width: 1, height: 40, background: 'rgba(99,102,241,.40)' }} />

          {/* Node 2: Current Focus */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
            <div style={{
              width: 68, height: 68, background: 'rgba(99,102,241,.15)',
              border: '1px solid #6366F1', color: '#6366F1',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 32px rgba(99,102,241,.25)',
            }}>
              <Target size={32} />
            </div>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 400, color: '#fff' }}>Sampling Methods</div>
              <div style={{ ...mono, fontSize: 9, color: '#818CF8', marginTop: 2 }}>In Progress &middot; 45% Verified</div>
            </div>
          </div>

          {/* Connection Line */}
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,.10)' }} />

          {/* Node 3: Next Goal */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10, opacity: 0.5 }}>
            <div style={{
              width: 56, height: 56, background: '#0F0F11',
              border: '1px solid rgba(255,255,255,.10)', color: 'rgba(255,255,255,.40)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <AlertCircle size={26} />
            </div>
            <div style={{ marginTop: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 400, color: '#fff' }}>Advanced Data Analytics</div>
              <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginTop: 2 }}>Locked &middot; Requires Target Mastery</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
