import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, ChevronRight, BrainCircuit, Loader2 } from 'lucide-react';

export function MaterialUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2400);
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ maxWidth: 840, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Curriculum Ingestion</div>
        <h1 style={{ fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
          Upload Learning Material
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 4 }}>
          Upload training documents to extract core competencies and auto-synthesize adaptive assessment items.
        </p>
      </header>

      {!isComplete ? (
        <div style={{ ...panel, padding: 32 }}>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: '1px dashed rgba(255,255,255,.16)',
              background: file ? 'rgba(99,102,241,.06)' : '#0F0F11',
              padding: '48px 32px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            {!file ? (
              <>
                <div style={{
                  width: 56, height: 56, background: '#131316',
                  border: '1px solid rgba(255,255,255,.10)', color: '#6366F1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                }}>
                  <UploadCloud size={28} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 400, color: '#fff', marginBottom: 4 }}>Drag &amp; Drop Document Here</h3>
                <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginBottom: 20 }}>
                  Supports PDF, DOCX, PPTX up to 50MB
                </p>
                <label style={{
                  ...mono, fontSize: 9, padding: '10px 22px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,.16)', color: '#fff', cursor: 'pointer'
                }}>
                  Browse Files
                  <input type="file" style={{ display: 'none' }} onChange={e => e.target.files && setFile(e.target.files[0])} />
                </label>
              </>
            ) : (
              <>
                <div style={{
                  width: 56, height: 56, background: 'rgba(99,102,241,.15)',
                  border: '1px solid rgba(99,102,241,.30)', color: '#6366F1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                }}>
                  <FileText size={28} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 400, color: '#fff', marginBottom: 2 }}>{file.name}</h3>
                <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)', marginBottom: 24 }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  style={{
                    ...mono, fontSize: 9, padding: '12px 28px', background: '#6366F1',
                    border: '1px solid #6366F1', color: '#fff', cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8, opacity: isProcessing ? 0.6 : 1
                  }}
                >
                  {isProcessing ? (
                    <><Loader2 size={14} className="animate-spin" /> Processing Ingestion Pipeline...</>
                  ) : (
                    <><BrainCircuit size={14} /> Analyze &amp; Map Competencies</>
                  )}
                </button>
              </>
            )}
          </div>

          {isProcessing && (
            <div style={{ marginTop: 24, padding: 20, background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#34D399' }}>
                <CheckCircle2 size={14} /> Extracting statistical domain taxonomy
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#34D399' }}>
                <CheckCircle2 size={14} /> Mapping prerequisite graph links
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#818CF8' }}>
                <Loader2 size={14} className="animate-spin" /> Synthesizing adaptive question pool...
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ ...panel, padding: '36px 32px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, background: 'rgba(52,211,153,.12)',
              border: '1px solid rgba(52,211,153,.35)', color: '#34D399',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <CheckCircle2 size={28} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 300, color: '#fff', marginBottom: 4 }}>Ingestion &amp; Analysis Complete</h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginBottom: 28 }}>
              "{file?.name || 'Statistical Sampling Methods.pdf'}" successfully integrated into the loop.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
              {[
                { v: '48', l: 'Pages Parsed' },
                { v: '23', l: 'Concepts Found' },
                { v: '7',  l: 'Competencies Mapped' },
                { v: '40', l: 'Draft MCQs Synthesized', hi: true },
              ].map((s, i) => (
                <div key={i} style={{ ...panel2, padding: '16px 12px' }}>
                  <div style={{ fontSize: 24, fontWeight: 300, color: s.hi ? '#6366F1' : '#fff' }}>{s.v}</div>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.35)', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setIsComplete(false); setFile(null); }}
              style={{ ...mono, fontSize: 9, padding: '11px 24px', background: '#6366F1', border: '1px solid #6366F1', color: '#fff', cursor: 'pointer' }}
            >
              Upload Another Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
