import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileText, FileImage, Loader2, Target } from 'lucide-react';

export function CreateQuiz() {
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setError("Please select a file to generate a quiz.");
      return;
    }
    setError(null);
    setLoading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        const [meta, data] = result.split(',');
        const mimeType = meta.split(':')[1].split(';')[0];
        
        try {
          const res = await fetch('/api/gemini/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileData: data,
              mimeType,
              numQuestions
            })
          });
          
          if (!res.ok) throw new Error(await res.text());
          const json = await res.json();
          if (json.quiz) {
            setQuiz(json.quiz);
            setUserAnswers({});
            setSubmitted(false);
          }
        } catch (err: any) {
          setError(err.message || "Failed to generate quiz.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to read file.");
      setLoading(false);
    }
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let score = 0;
    quiz.forEach((q, i) => {
      if (userAnswers[i] === q.answer) score++;
    });
    return score;
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>AI Content Synthesis</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
          Create Custom Quiz
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 4 }}>
          Upload study documents to synthesize adaptive MCQs targeting specific learning materials.
        </p>
      </header>

      {!quiz && (
        <div style={{ ...panel, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.60)', display: 'block', marginBottom: 12 }}>
              Upload Material (PDF, Image, or Text)
            </label>
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: 180, border: '1px dashed rgba(255,255,255,.16)',
              background: '#0F0F11', cursor: 'pointer', transition: 'all .2s'
            }}>
              <UploadCloud size={32} style={{ color: 'rgba(255,255,255,.35)', marginBottom: 12 }} />
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,.70)' }}>
                <span style={{ color: '#6366F1' }}>Click to upload</span> or drag and drop
              </p>
              <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.30)', marginTop: 4 }}>
                Supports PDF, TXT, DOC, Images
              </p>
              <input type="file" style={{ display: 'none' }} onChange={handleFileChange} accept="image/*,.pdf,.txt,.md" />
            </label>

            {file && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.25)', marginTop: 12 }}>
                {file.type.startsWith('image') ? <FileImage size={18} style={{ color: '#6366F1' }} /> : <FileText size={18} style={{ color: '#6366F1' }} />}
                <span style={{ fontSize: 13, color: '#fff' }}>{file.name}</span>
              </div>
            )}
          </div>

          <div>
            <label style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.60)', display: 'block', marginBottom: 8 }}>
              Number of Questions
            </label>
            <select
              value={numQuestions}
              onChange={e => setNumQuestions(Number(e.target.value))}
              style={{
                width: '100%', maxWidth: 200, padding: '10px 14px',
                background: '#0F0F11', border: '1px solid rgba(255,255,255,.12)',
                color: '#fff', fontSize: 13, outline: 'none'
              }}
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(244,63,94,.08)', border: '1px solid rgba(244,63,94,.25)', color: '#F43F5E', fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !file}
            style={{
              padding: '13px 28px', background: '#6366F1', border: '1px solid #6366F1',
              color: '#fff', cursor: loading || !file ? 'not-allowed' : 'pointer',
              ...mono, fontSize: 9, opacity: loading || !file ? 0.5 : 1,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: 'fit-content'
            }}
          >
            {loading ? 'Synthesizing Adaptive Quiz...' : 'Generate Quiz with AI'}
          </button>
        </div>
      )}

      {/* Render Generated Quiz */}
      {quiz && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {submitted && (
            <div style={{ ...panel, padding: 24, textAlign: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 300, color: '#fff', marginBottom: 4 }}>Quiz Results</h2>
              <div style={{ fontSize: 32, fontWeight: 300, color: '#6366F1', letterSpacing: '-.03em' }}>
                {calculateScore()} / {quiz.length} Correct
              </div>
            </div>
          )}

          {quiz.map((q, i) => (
            <div key={i} style={{ ...panel2, padding: 24 }}>
              <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 8 }}>Question {i + 1}</div>
              <h3 style={{ fontSize: 15, fontWeight: 400, color: '#fff', marginBottom: 16 }}>{q.question}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {q.options?.map((opt: string, optIdx: number) => {
                  const isChosen = userAnswers[i] === opt;
                  const isCorrect = q.answer === opt;
                  let bg = '#131316';
                  let borderCol = 'rgba(255,255,255,.08)';

                  if (submitted) {
                    if (isCorrect) { bg = 'rgba(52,211,153,.10)'; borderCol = '#34D399'; }
                    else if (isChosen) { bg = 'rgba(244,63,94,.10)'; borderCol = '#F43F5E'; }
                  } else if (isChosen) {
                    bg = 'rgba(99,102,241,.15)'; borderCol = '#6366F1';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => !submitted && setUserAnswers(prev => ({ ...prev, [i]: opt }))}
                      style={{
                        padding: '12px 16px', background: bg, border: `1px solid ${borderCol}`,
                        color: '#fff', textAlign: 'left', fontSize: 13, cursor: submitted ? 'default' : 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12 }}>
            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                style={{ ...mono, fontSize: 9, padding: '12px 28px', background: '#6366F1', border: '1px solid #6366F1', color: '#fff', cursor: 'pointer' }}
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={() => { setQuiz(null); setFile(null); }}
                style={{ ...mono, fontSize: 9, padding: '12px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,.14)', color: '#fff', cursor: 'pointer' }}
              >
                Generate Another Quiz
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
