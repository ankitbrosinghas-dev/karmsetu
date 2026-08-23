import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, CheckCircle2, XCircle, AlertCircle, ChevronRight, BarChart } from 'lucide-react';
import { useAppStore } from '../../store/useStore';
import { DEMO_QUESTIONS } from '../../store/mockData';

export function AdaptivePractice() {
  const navigate = useNavigate();
  const { updateCompetencyMastery } = useAppStore();
  
  const practiceQuestions = DEMO_QUESTIONS;
  const totalQuestions = practiceQuestions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQ = practiceQuestions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    const isCorrect = selectedOption === currentQ.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsComplete(true);
    updateCompetencyMastery('c_sampling_methods', 68);
    updateCompetencyMastery('c_probability', 75);
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  if (isComplete) {
    const accuracy = Math.round((score / totalQuestions) * 100);
    return (
      <div style={{ maxWidth: 640, margin: '40px auto', textAlign: 'center', animation: 'fadeIn .4s ease' }}>
        <div style={{ ...panel, padding: '44px 36px' }}>
          <div style={{
            width: 64, height: 64, background: 'rgba(52,211,153,.12)',
            border: '1px solid rgba(52,211,153,.35)', color: '#34D399',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <CheckCircle2 size={32} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 300, letterSpacing: '-.03em', color: '#fff', marginBottom: 6 }}>
            Adaptive Practice Complete
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginBottom: 32 }}>
            Session evaluated against competency graph prerequisites.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
            <div style={{ ...panel2, padding: '20px 16px' }}>
              <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Score</div>
              <div style={{ fontSize: 28, fontWeight: 300, color: '#fff' }}>
                {score} <span style={{ fontSize: 16, color: 'rgba(255,255,255,.35)' }}>/ {totalQuestions}</span>
              </div>
            </div>
            <div style={{ ...panel2, padding: '20px 16px' }}>
              <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Accuracy</div>
              <div style={{ fontSize: 28, fontWeight: 300, color: '#6366F1' }}>{accuracy}%</div>
            </div>
          </div>

          <div style={{ background: '#0A0A0A', border: '1px solid rgba(99,102,241,.25)', padding: 20, textAlign: 'left', marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <BarChart size={14} style={{ color: '#6366F1' }} />
              <span style={{ ...mono, fontSize: 9, color: '#6366F1' }}>AI Practice Diagnosis</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,.70)' }}>
              Strong convergence on basic probability concepts. Prerequisite gap reduced. Competency Passport has been automatically updated.
            </p>
          </div>

          <button
            onClick={() => navigate('/learner/passport')}
            style={{
              width: '100%', padding: '14px', background: '#6366F1',
              color: '#fff', border: '1px solid #6366F1', cursor: 'pointer',
              ...mono, fontSize: 10,
            }}
          >
            View Updated Competency Passport
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeIn .4s ease' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Target size={20} style={{ color: '#6366F1' }} />
            <h1 style={{ fontSize: 22, fontWeight: 300, letterSpacing: '-.02em', color: '#fff' }}>Adaptive Practice</h1>
          </div>
          <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.40)', marginTop: 6 }}>
            Difficulty calibrates live based on answer history
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 8 }}>
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {practiceQuestions.map((_, i) => (
              <div
                key={i}
                style={{
                  height: 3, width: 28,
                  background: i < currentIndex ? '#6366F1' : i === currentIndex ? '#818CF8' : 'rgba(255,255,255,.10)'
                }}
              />
            ))}
          </div>
        </div>
      </header>

      <div style={{ ...panel, overflow: 'hidden' }}>
        <div style={{ padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{
              ...mono, fontSize: 8, padding: '3px 8px',
              border: '1px solid rgba(255,255,255,.12)', color: 'rgba(255,255,255,.60)',
              background: '#0F0F11'
            }}>
              {currentQ.difficulty}
            </span>
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 400, color: '#fff', lineHeight: 1.6, marginBottom: 28 }}>
            {currentQ.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = currentQ.correctAnswer === idx;

              let bg = '#0F0F11';
              let borderCol = 'rgba(255,255,255,.08)';
              let textCol = 'rgba(255,255,255,.85)';

              if (isAnswered) {
                if (isCorrectOpt) {
                  bg = 'rgba(52,211,153,.08)';
                  borderCol = '#34D399';
                  textCol = '#34D399';
                } else if (isSelected) {
                  bg = 'rgba(244,63,94,.08)';
                  borderCol = '#F43F5E';
                  textCol = '#F43F5E';
                } else {
                  bg = '#0A0A0A';
                  borderCol = 'rgba(255,255,255,.04)';
                  textCol = 'rgba(255,255,255,.30)';
                }
              } else if (isSelected) {
                bg = 'rgba(99,102,241,.12)';
                borderCol = '#6366F1';
                textCol = '#fff';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  style={{
                    width: '100%', padding: '16px 20px', background: bg,
                    border: `1px solid ${borderCol}`, color: textCol,
                    textAlign: 'left', fontSize: 14, cursor: isAnswered ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all .15s',
                  }}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrectOpt && <CheckCircle2 size={18} style={{ color: '#34D399', flexShrink: 0 }} />}
                  {isAnswered && isSelected && !isCorrectOpt && <XCircle size={18} style={{ color: '#F43F5E', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Post-answer diagnosis */}
        {isAnswered && (
          <div style={{
            padding: '24px 32px',
            borderTop: '1px solid rgba(255,255,255,.08)',
            background: selectedOption === currentQ.correctAnswer ? 'rgba(52,211,153,.04)' : 'rgba(244,63,94,.04)',
          }}>
            <div style={{
              ...mono, fontSize: 9, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
              color: selectedOption === currentQ.correctAnswer ? '#34D399' : '#F43F5E'
            }}>
              {selectedOption === currentQ.correctAnswer ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
              {selectedOption === currentQ.correctAnswer ? 'Correct Analysis' : 'Diagnostic Feedback'}
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,.75)' }}>
              {currentQ.explanation}
            </p>
          </div>
        )}

        <div style={{ padding: '18px 32px', background: '#0F0F11', borderTop: '1px solid rgba(255,255,255,.08)', display: 'flex', justifyContent: 'flex-end' }}>
          {!isAnswered ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              style={{
                ...mono, fontSize: 9, padding: '10px 24px',
                background: selectedOption !== null ? '#6366F1' : '#1A1A1F',
                border: selectedOption !== null ? '1px solid #6366F1' : '1px solid rgba(255,255,255,.08)',
                color: selectedOption !== null ? '#fff' : 'rgba(255,255,255,.30)',
                cursor: selectedOption !== null ? 'pointer' : 'not-allowed',
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                ...mono, fontSize: 9, padding: '10px 24px',
                background: '#6366F1', border: '1px solid #6366F1', color: '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {currentIndex < totalQuestions - 1 ? 'Next Question' : 'Complete Practice'} <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
