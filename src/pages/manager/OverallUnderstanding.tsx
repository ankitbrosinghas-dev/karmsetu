import React, { useState, useRef } from 'react';
import { 
  Users, TrendingUp, TrendingDown, Clock, Activity, 
  Award, Briefcase, ChevronDown, Download, Loader2, 
  Eye, X, FileText, Printer, CheckCircle2, ShieldCheck,
  Calendar, Building, UserCheck, AlertTriangle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const mockEmployees = [
  {
    id: 'emp-01',
    name: 'Aarav Sharma',
    department: 'Statistical Operations & Field Survey',
    currentDesignation: 'Statistical Officer',
    officialId: 'MOSPI-2024-ISS-0482',
    currentAssignment: 'Periodic Labour Force Survey (PLFS) 2026',
    strengths: ['Probability Fundamentals', 'Data Cleaning & Hygiene', 'Basic Reporting', 'Field Survey Operations'],
    weaknesses: ['Advanced Sampling Methods', 'Cloud Architecture & Data Pipelines'],
    monthlyWork: { hours: 42, modulesCompleted: 5 },
    punctuality: 92,
    overallReadiness: 78,
    recommendedDesignation: 'Senior Statistical Officer',
    promotionReadiness: 'High — Recommended for Q3 Assessment',
    assessmentNotes: 'Consistently demonstrates strong operational rigour in field surveys. Once advanced sampling certification is completed on iGOT, profile is fully aligned for Senior Statistical Officer induction.',
    evaluator: 'Dr. Sunita Verma, Director of Capacity Building'
  },
  {
    id: 'emp-02',
    name: 'Priya Patel',
    department: 'Data Analytics & Methodology Division',
    currentDesignation: 'Data Analyst',
    officialId: 'MOSPI-2024-ISS-0914',
    currentAssignment: 'Annual Survey of Industries (ASI) Analytics',
    strengths: ['Machine Learning', 'Data Visualization', 'Python & R Analytics', 'Microdata Scrubbing'],
    weaknesses: ['Time Series Econometric Analysis', 'Technical Presentation & Public Briefing'],
    monthlyWork: { hours: 55, modulesCompleted: 8 },
    punctuality: 85,
    overallReadiness: 86,
    recommendedDesignation: 'Lead Data Scientist',
    promotionReadiness: 'Immediate — Ready for Elevation',
    assessmentNotes: 'Exemplary performance in statistical script automation and microdata verification. Recommended for leadership in central analytics cell.',
    evaluator: 'Dr. Sunita Verma, Director of Capacity Building'
  },
  {
    id: 'emp-03',
    name: 'Rahul Desai',
    department: 'IT & Infrastructure Administration',
    currentDesignation: 'Systems Administrator',
    officialId: 'MOSPI-2024-ISS-0321',
    currentAssignment: 'Secure Cloud Enclave & iGOT API Integration',
    strengths: ['Network Security', 'Database Management', 'Linux Hardening', 'API Gateway Setup'],
    weaknesses: ['Agile Project Management', 'Statistical Workflow Optimization'],
    monthlyWork: { hours: 25, modulesCompleted: 2 },
    punctuality: 65,
    overallReadiness: 58,
    recommendedDesignation: 'Security Infrastructure Lead',
    promotionReadiness: 'Developing — Requires 2 Mandatory Modules',
    assessmentNotes: 'Solid systems knowledge. Needs focused alignment on statistical metadata protocols and higher module completion velocity.',
    evaluator: 'Dr. Sunita Verma, Director of Capacity Building'
  }
];

export function OverallUnderstanding() {
  const [selectedEmpId, setSelectedEmpId] = useState(mockEmployees[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const modalReportRef = useRef<HTMLDivElement>(null);
  
  const employee = mockEmployees.find(e => e.id === selectedEmpId) || mockEmployees[0];

  const handleExportPDF = async () => {
    const targetElement = isReportModalOpen && modalReportRef.current ? modalReportRef.current : reportRef.current;
    if (!targetElement) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(targetElement, { scale: 2, useCORS: true, backgroundColor: '#0A0A0A' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${employee.name.replace(/\s+/g, '_')}_Official_Competency_Report.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsExporting(false);
    }
  };

  const mono = { fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, letterSpacing: '.10em', textTransform: 'uppercase' as const };
  const panel = { background: '#131316', border: '1px solid rgba(255,255,255,.08)' } as const;
  const panel2 = { background: '#0F0F11', border: '1px solid rgba(255,255,255,.08)' } as const;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, animation: 'fadeIn .4s ease', maxWidth: 1000, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid rgba(255,255,255,.08)', paddingBottom: 20 }}>
        <div>
          <div style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,.35)', marginBottom: 6 }}>Career Readiness &amp; Performance</div>
          <h1 style={{ fontSize: 'clamp(1.5rem,3.2vw,2.2rem)', fontWeight: 300, letterSpacing: '-.03em', color: '#fff' }}>
            Overall Understanding
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.50)', marginTop: 4 }}>
            Employee skill diagnostics, work cycle pace, and promotion alignment.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedEmpId}
            onChange={e => setSelectedEmpId(e.target.value)}
            style={{
              padding: '9px 14px', background: '#0F0F11', border: '1px solid rgba(255,255,255,.12)',
              color: '#fff', fontSize: 13, outline: 'none', borderRadius: 3
            }}
          >
            {mockEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} - {emp.currentDesignation}</option>
            ))}
          </select>

          {/* ── VIEW REPORT BUTTON (Placed just left side of Export PDF) ── */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            style={{
              ...mono, fontSize: 9, padding: '10px 18px', background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(255,255,255,.14)', color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'all .2s', borderRadius: 3
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(99,102,241,.6)';
              e.currentTarget.style.background = 'rgba(99,102,241,.12)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)';
              e.currentTarget.style.background = 'rgba(255,255,255,.05)';
            }}
            title="Open comprehensive official report dossier"
          >
            <Eye size={13} style={{ color: '#818CF8' }} />
            <span>View Report</span>
          </button>

          {/* ── EXPORT PDF BUTTON ── */}
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            style={{
              ...mono, fontSize: 9, padding: '10px 20px', background: '#6366F1',
              border: '1px solid #6366F1', color: '#fff', cursor: isExporting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, opacity: isExporting ? 0.6 : 1, borderRadius: 3
            }}
          >
            {isExporting ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            {isExporting ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </header>

      {/* Exportable Report Surface */}
      <div ref={reportRef} style={{ display: 'flex', flexDirection: 'column', gap: 24, background: '#0A0A0A' }}>
        
        {/* Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <div style={{ ...panel2, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Activity size={14} style={{ color: '#6366F1' }} />
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>Monthly Work Cycle</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 300, color: '#fff' }}>{employee.monthlyWork.hours}h</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>
              {employee.monthlyWork.modulesCompleted} modules completed
            </div>
          </div>

          <div style={{ ...panel2, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Clock size={14} style={{ color: '#34D399' }} />
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,.40)' }}>Task Punctuality</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 300, color: '#fff' }}>{employee.punctuality}%</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>Work delivered on time</div>
          </div>

          <div style={{ ...panel, padding: 20, gridColumn: 'span 2', background: 'linear-gradient(135deg, rgba(99,102,241,.18) 0%, #131316 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Award size={14} style={{ color: '#6366F1' }} />
              <span style={{ ...mono, fontSize: 8, color: '#818CF8' }}>AI Recommended Designation</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 400, color: '#fff' }}>{employee.recommendedDesignation}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.50)', marginTop: 4 }}>
              Based on skill trajectory in {employee.department}.
            </div>
          </div>
        </div>

        {/* Skills Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ ...panel2, padding: 24 }}>
            <h3 style={{ ...mono, fontSize: 9, color: '#34D399', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingUp size={14} /> Verified Strengths
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {employee.strengths.map((skill, i) => (
                <div key={i} style={{ padding: '10px 14px', background: '#131316', border: '1px solid rgba(52,211,153,.20)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, background: '#34D399' }} />
                  <span style={{ fontSize: 13, color: '#fff' }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...panel2, padding: 24 }}>
            <h3 style={{ ...mono, fontSize: 9, color: '#F43F5E', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <TrendingDown size={14} /> Diagnosed Gaps
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {employee.weaknesses.map((skill, i) => (
                <div key={i} style={{ padding: '10px 14px', background: '#131316', border: '1px solid rgba(244,63,94,.20)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, background: '#F43F5E' }} />
                  <span style={{ fontSize: 13, color: '#fff' }}>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ── VIEW REPORT MODAL DOSSIER ─────────────────────────────── */}
      {isReportModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px',
          animation: 'fadeIn .25s ease'
        }}>
          <div style={{
            width: '100%', maxWidth: 840, maxHeight: '92vh',
            background: '#0D0D11', border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.2)',
            borderRadius: 6, display: 'flex', flexDirection: 'column', overflow: 'hidden'
          }}>
            {/* Modal Top Bar */}
            <div style={{
              padding: '16px 24px', background: '#131316', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={18} style={{ color: '#6366F1' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 400, color: '#fff' }}>
                    Official Competency & Performance Intelligence Report
                  </div>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                    Ministry of Statistics & Programme Implementation (MoSPI) &middot; SIH26101
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  style={{
                    ...mono, fontSize: 8, padding: '7px 14px', background: '#6366F1',
                    border: '1px solid #6366F1', color: '#fff', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, borderRadius: 3
                  }}
                >
                  <Download size={11} /> {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
                <button
                  onClick={() => setIsReportModalOpen(false)}
                  style={{
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                    cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body / Report Document */}
            <div style={{ overflowY: 'auto', padding: '32px 36px', display: 'flex', flexDirection: 'column', gap: 24 }} ref={modalReportRef}>
              
              {/* Document Header */}
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <ShieldCheck size={16} style={{ color: '#34D399' }} />
                    <span style={{ ...mono, fontSize: 9, color: '#34D399' }}>Verified MoSPI Official Intelligence Record</span>
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 300, color: '#fff' }}>{employee.name}</h2>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
                    {employee.currentDesignation} &middot; {employee.department}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>Official Ref Number</div>
                  <div style={{ ...mono, fontSize: 11, color: '#818CF8', marginTop: 2 }}>{employee.officialId}</div>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Current Cycle: August 2026</div>
                </div>
              </div>

              {/* Assignment & Readiness Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                <div style={{ ...panel2, padding: 16 }}>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Active Survey Assignment</div>
                  <div style={{ fontSize: 13, fontWeight: 400, color: '#fff' }}>{employee.currentAssignment}</div>
                </div>
                <div style={{ ...panel2, padding: 16 }}>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Aggregate Readiness Score</div>
                  <div style={{ fontSize: 20, fontWeight: 300, color: '#34D399' }}>{employee.overallReadiness}%</div>
                </div>
                <div style={{ ...panel2, padding: 16 }}>
                  <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Punctuality & Reliability</div>
                  <div style={{ fontSize: 20, fontWeight: 300, color: '#818CF8' }}>{employee.punctuality}%</div>
                </div>
              </div>

              {/* Verified Strengths vs Diagnosed Gaps */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ ...panel2, padding: 20 }}>
                  <div style={{ ...mono, fontSize: 9, color: '#34D399', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <TrendingUp size={13} /> Verified Competency Strengths
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {employee.strengths.map((s, idx) => (
                      <div key={idx} style={{ fontSize: 12, padding: '7px 10px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 5, height: 5, background: '#34D399', borderRadius: '50%' }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...panel2, padding: 20 }}>
                  <div style={{ ...mono, fontSize: 9, color: '#F43F5E', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <TrendingDown size={13} /> Target Improvement Gaps
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {employee.weaknesses.map((w, idx) => (
                      <div key={idx} style={{ fontSize: 12, padding: '7px 10px', background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.15)', color: '#fff', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 5, height: 5, background: '#F43F5E', borderRadius: '50%' }} />
                        {w}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Promotion & Next Step Recommendation */}
              <div style={{ ...panel, padding: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, #131316 100%)', border: '1px solid rgba(99,102,241,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={16} style={{ color: '#6366F1' }} />
                    <span style={{ ...mono, fontSize: 9, color: '#818CF8' }}>Promotion & Career Pathway Progression</span>
                  </div>
                  <span style={{ ...mono, fontSize: 8, padding: '3px 8px', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34D399' }}>
                    {employee.promotionReadiness}
                  </span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 400, color: '#fff', marginBottom: 6 }}>
                  Target Next Role: {employee.recommendedDesignation}
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                  {employee.assessmentNotes}
                </p>
                <div style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.35)', marginTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                  Evaluated By: {employee.evaluator}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 24px', background: '#131316', borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.35)' }}>
                CONFIDENTIAL &middot; INTERNAL USE ONLY FOR ISS / MoSPI CAPACITY MANAGEMENT
              </span>
              <button
                onClick={() => setIsReportModalOpen(false)}
                style={{
                  ...mono, fontSize: 9, padding: '7px 18px', background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer', borderRadius: 3
                }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

