import React from 'react';
import { Users, AlertTriangle, TrendingUp, CheckCircle2, ChevronRight } from 'lucide-react';

export function ManagerDashboard() {
  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Departmental Oversight</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
          Training Intelligence Dashboard
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 4 }}>
          Department-wide competency health, gap concentrations, and adaptive intervention tracking.
        </p>
      </header>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,.06)' }}>
        {[
          { label: 'Total Learners',      value: '1,248', icon: Users,         color: '#fff',    iconColor: '#6366F1' },
          { label: 'Avg. Competency',     value: '68%',   icon: CheckCircle2,  color: '#fff',    iconColor: '#34D399' },
          { label: 'Critical Gaps',       value: '7',     icon: AlertTriangle, color: '#F43F5E', iconColor: '#F43F5E' },
          { label: 'Avg. Improvement',    value: '+18%',  icon: TrendingUp,    color: '#34D399', iconColor: '#34D399' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} style={{ ...panel2, padding: '24px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Icon size={16} style={{ color: s.iconColor }} />
                <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 'clamp(1.6rem,3.5vw,2.2rem)', fontWeight: 300, color: s.color, letterSpacing: '-.04em' }}>
                {s.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Competency Heatmap */}
      <section style={{ ...panel, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 400, color: '#fff' }}>Department Competency Heatmap</h2>
          <span style={{ ...mono, fontSize: 8, color: '#6366F1', cursor: 'pointer' }}>View Full Breakdown &rarr;</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0F0F11', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <th style={{ padding: '12px 24px', ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>Department</th>
                <th style={{ padding: '12px 24px', textAlign: 'center', ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>Data Collection</th>
                <th style={{ padding: '12px 24px', textAlign: 'center', ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>Probability</th>
                <th style={{ padding: '12px 24px', textAlign: 'center', ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>Sampling Methods</th>
                <th style={{ padding: '12px 24px', textAlign: 'center', ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>Analysis</th>
              </tr>
            </thead>
            <tbody>
              {[
                { dept: 'Operations', c1: { v: '82%', ok: true }, c2: { v: '58%', warn: true }, c3: { v: '41%', bad: true }, c4: { v: '67%', ok: true } },
                { dept: 'Surveys',    c1: { v: '74%', ok: true }, c2: { v: '66%', ok: true },   c3: { v: '53%', warn: true }, c4: { v: '71%', ok: true } },
                { dept: 'Research',   c1: { v: '89%', ok: true }, c2: { v: '81%', ok: true },   c3: { v: '76%', ok: true },   c4: { v: '84%', ok: true } },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: 400, color: '#fff' }}>{row.dept}</td>
                  {[row.c1, row.c2, row.c3, row.c4].map((cell, cIdx) => (
                    <td key={cIdx} style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <span style={{
                        ...mono, fontSize: 8, padding: '3px 10px',
                        border: `1px solid ${cell.bad ? 'rgba(244,63,94,.40)' : cell.warn ? 'rgba(251,191,36,.40)' : 'rgba(52,211,153,.35)'}`,
                        color: cell.bad ? '#F43F5E' : cell.warn ? '#FBBF24' : '#34D399',
                        background: cell.bad ? 'rgba(244,63,94,.08)' : cell.warn ? 'rgba(251,191,36,.08)' : 'rgba(52,211,153,.08)'
                      }}>
                        {cell.v}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Interventions Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <section style={{ ...panel2, padding: 24 }}>
          <h3 style={{ ...mono, fontSize: 9, color: '#F43F5E', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={14} /> Top Competency Gaps
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: '1. Sampling Methods', sub: '428 learners below threshold' },
              { name: '2. Data Quality Assurance', sub: '312 learners below threshold' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: 14, background: '#131316', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: '#fff' }}>{item.name}</div>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginTop: 2 }}>{item.sub}</div>
                </div>
                <button style={{ ...mono, fontSize: 8, padding: '6px 12px', background: '#6366F1', color: '#fff', border: 'none', cursor: 'pointer' }}>
                  Assign Target
                </button>
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...panel2, padding: 24 }}>
          <h3 style={{ ...mono, fontSize: 9, color: '#34D399', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={14} /> Recent Training Effectiveness
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Probability Fundamentals', sub: '240 completions this month', change: '+27%' },
              { name: 'Data Visualization Basics', sub: '185 completions this month', change: '+15%' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: 14, background: '#131316', border: '1px solid rgba(255,255,255,.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: '#fff' }}>{item.name}</div>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginTop: 2 }}>{item.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 300, color: '#34D399' }}>{item.change}</div>
                  <div style={{ ...mono, fontSize: 7, color: 'rgba(255,255,255,.30)' }}>Improvement</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
