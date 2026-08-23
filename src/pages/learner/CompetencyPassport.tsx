import React from 'react';
import { Award, ShieldCheck, Clock, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { getMasteryColor, getMasteryLabel, formatPercent } from '../../lib/utils';

export function CompetencyPassport() {
  const { currentUser, competencies } = useAppStore();
  
  const compList = Object.values(competencies);
  
  const strongCount = compList.filter(c => c.mastery >= 75).length;
  const devCount = compList.filter(c => c.mastery >= 60 && c.mastery < 75).length;
  const weakCount = compList.filter(c => c.mastery < 60).length;
  const overallCompetencyMock = 68;

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Verified Capability Record</div>
          <h1 style={{ fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
            Competency Learning Passport
          </h1>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(52,211,153,.08)', border: '1px solid rgba(52,211,153,.30)',
          padding: '6px 14px', color: '#34D399', ...mono, fontSize: 8
        }}>
          <ShieldCheck size={14} />
          <span>MoSPI Verified</span>
        </div>
      </header>

      {/* Profile Header Banner */}
      <div style={{
        ...panel, padding: '32px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 24, position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 64, height: 64, background: 'rgba(99,102,241,.12)',
            border: '1px solid rgba(99,102,241,.30)', color: '#6366F1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 500,
          }}>
            {currentUser?.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 300, color: '#fff', letterSpacing: '-.02em', marginBottom: 4 }}>
              {currentUser?.name}
            </h2>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.40)', marginBottom: 12 }}>
              {currentUser?.designation} &middot; {currentUser?.department || 'Department of Statistics'}
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ ...mono, fontSize: 8, color: '#34D399', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Award size={12} /> {strongCount} Mastered
              </div>
              <div style={{ ...mono, fontSize: 8, color: '#818CF8', display: 'flex', alignItems: 'center', gap: 4 }}>
                <TrendingUp size={12} /> {devCount} Developing
              </div>
              <div style={{ ...mono, fontSize: 8, color: '#F43F5E', display: 'flex', alignItems: 'center', gap: 4 }}>
                {weakCount} Needs Attention
              </div>
            </div>
          </div>
        </div>

        <div style={{ ...panel2, padding: '20px 28px', textAlign: 'center', minWidth: 160 }}>
          <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 4 }}>Aggregate Competency</div>
          <div style={{ fontSize: 36, fontWeight: 300, color: '#6366F1', letterSpacing: '-.04em' }}>{overallCompetencyMock}%</div>
        </div>
      </div>

      {/* Verified Competencies List */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,.50)' }}>Verified Competency Spectrum</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {compList.map(comp => (
            <div
              key={comp.id}
              style={{
                ...panel2, padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: 16, transition: 'background .2s',
              }}
            >
              <div style={{ flex: 1, minWidth: 260 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 400, color: '#fff' }}>{comp.name}</h4>
                  <span style={{
                    ...mono, fontSize: 8, padding: '2px 8px',
                    border: '1px solid rgba(255,255,255,.10)', color: 'rgba(255,255,255,.45)', background: '#131316'
                  }}>
                    {comp.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.30)' }}>Provenance:</span>
                  <span style={{ ...mono, fontSize: 8, padding: '2px 6px', border: '1px solid rgba(255,255,255,.08)', color: 'rgba(255,255,255,.60)' }}>
                    KarmSetu Verified
                  </span>
                  {comp.mastery > 60 && (
                    <span style={{ ...mono, fontSize: 8, padding: '2px 6px', border: '1px solid rgba(99,102,241,.30)', color: '#818CF8' }}>
                      iGOT Verified
                    </span>
                  )}
                </div>

                <div style={{ width: '100%', maxWidth: 360, height: 3, background: 'rgba(255,255,255,.08)' }}>
                  <div style={{
                    height: '100%',
                    width: `${comp.mastery}%`,
                    background: comp.mastery >= 75 ? '#34D399' : comp.mastery >= 60 ? '#6366F1' : comp.mastery >= 40 ? '#FBBF24' : '#F43F5E',
                    transition: 'width 1s ease'
                  }} />
                </div>
              </div>

              <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,.08)', paddingLeft: 24 }}>
                <div style={{ fontSize: 26, fontWeight: 300, color: '#fff' }}>{formatPercent(comp.mastery)}</div>
                <div style={{
                  ...mono, fontSize: 8, marginTop: 4, padding: '2px 8px', display: 'inline-block',
                  border: `1px solid ${comp.mastery >= 75 ? 'rgba(52,211,153,.35)' : comp.mastery >= 60 ? 'rgba(99,102,241,.35)' : 'rgba(244,63,94,.35)'}`,
                  color: comp.mastery >= 75 ? '#34D399' : comp.mastery >= 60 ? '#818CF8' : '#F43F5E',
                  background: comp.mastery >= 75 ? 'rgba(52,211,153,.06)' : comp.mastery >= 60 ? 'rgba(99,102,241,.06)' : 'rgba(244,63,94,.06)'
                }}>
                  {getMasteryLabel(comp.mastery)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
