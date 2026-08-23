import React from 'react';
import { ExternalLink, BookOpen, Clock, Activity, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { igotConfig } from '../../../services/igot/igotConfig';

export const IgotPortal = () => {
  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease', maxWidth: 1000, margin: '0 auto' }}>
      {igotConfig.isDemoMode && (
        <div style={{
          background: 'rgba(251,191,36,.06)', border: '1px solid rgba(251,191,36,.25)',
          padding: '8px 16px', color: '#FBBF24', ...mono, fontSize: 8
        }}>
          iGOT Catalogue &middot; Simulated Integration Environment
        </div>
      )}

      <header style={{ ...panel, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Government Training Ecosystem</div>
            <h1 style={{ fontSize: 'clamp(1.6rem,3.2vw,2.2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
              iGOT Karmayogi Learning Hub
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 4, maxWidth: 560 }}>
              Curated government learning modules synchronized with your detected competency gaps.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link
              to="/learner/igot/courses"
              style={{
                ...mono, fontSize: 9, padding: '11px 22px', background: '#6366F1',
                border: '1px solid #6366F1', color: '#fff', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <BookOpen size={14} /> Browse Courses
            </Link>
            <a
              href="https://igotkarmayogi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...mono, fontSize: 9, padding: '11px 22px', background: 'transparent',
                border: '1px solid rgba(255,255,255,.14)', color: 'rgba(255,255,255,.70)', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: 8
              }}
            >
              <ExternalLink size={14} /> Official Portal
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 28, borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20 }}>
          <div style={{ ...panel2, padding: 16 }}>
            <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 4 }}>Catalogue Breadth</div>
            <div style={{ fontSize: 24, fontWeight: 300, color: '#fff' }}>5,700+</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.30)', marginTop: 2 }}>National iGOT Database</div>
          </div>
          <div style={{ ...panel2, padding: 16 }}>
            <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 4 }}>Last Sync</div>
            <div style={{ fontSize: 24, fontWeight: 300, color: '#fff' }}>Live</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.30)', marginTop: 2 }}>API Endpoint Connected</div>
          </div>
          <Link to="/learner/igot/my-learning" style={{ ...panel2, padding: 16, textDecoration: 'none', border: '1px solid rgba(99,102,241,.30)', background: 'rgba(99,102,241,.06)' }}>
            <div style={{ ...mono, fontSize: 8, color: '#818CF8', marginBottom: 4 }}>My Active Tracks</div>
            <div style={{ fontSize: 24, fontWeight: 300, color: '#6366F1' }}>3 Enrolled</div>
            <div style={{ fontSize: 11, color: '#818CF8', marginTop: 2 }}>View progress &rarr;</div>
          </Link>
        </div>
      </header>

      <section style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ ...mono, fontSize: 10, color: 'rgba(255,255,255,.50)' }}>Gap-Targeted Recommendations</h2>
          <Link to="/learner/igot/courses" style={{ ...mono, fontSize: 9, color: '#6366F1', textDecoration: 'none' }}>View All &rarr;</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          <div style={{ ...panel2, padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ ...mono, fontSize: 8, padding: '2px 8px', border: '1px solid rgba(52,211,153,.35)', color: '#34D399', background: 'rgba(52,211,153,.08)' }}>
                87% Gap Match
              </span>
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)' }}>Data Science</span>
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 400, color: '#fff', marginBottom: 6, lineHeight: 1.4 }}>
              Data Driven Decision Making For Government
            </h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.45)', lineHeight: 1.6, marginBottom: 20 }}>
              Learn empirical methods to support statistical governance and decision protocols.
            </p>

            <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 14 }}>
              <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 8 }}>Capacity Building Commission</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  to="/learner/igot/course/course-1"
                  style={{
                    flex: 1, textAlign: 'center', padding: '8px 12px', background: '#131316',
                    border: '1px solid rgba(255,255,255,.10)', color: '#fff', textDecoration: 'none',
                    ...mono, fontSize: 8,
                  }}
                >
                  Details
                </Link>
                <a
                  href="https://igotkarmayogi.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, textAlign: 'center', padding: '8px 12px', background: '#6366F1',
                    color: '#fff', textDecoration: 'none', ...mono, fontSize: 8,
                  }}
                >
                  Open in iGOT
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
