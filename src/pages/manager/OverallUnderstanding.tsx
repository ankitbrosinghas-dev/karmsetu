import React, { useState, useRef } from 'react';
import { Users, TrendingUp, TrendingDown, Clock, Activity, Award, Briefcase, ChevronDown, Download, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const mockEmployees = [
  {
    id: 'emp-01',
    name: 'Aarav Sharma',
    department: 'Statistical Operations',
    currentDesignation: 'Statistical Officer',
    strengths: ['Probability Fundamentals', 'Data Cleaning', 'Basic Reporting'],
    weaknesses: ['Advanced Sampling', 'Cloud Architecture'],
    monthlyWork: { hours: 42, modulesCompleted: 5 },
    punctuality: 92,
    recommendedDesignation: 'Senior Statistical Officer'
  },
  {
    id: 'emp-02',
    name: 'Priya Patel',
    department: 'Data Analytics',
    currentDesignation: 'Data Analyst',
    strengths: ['Machine Learning', 'Data Visualization', 'Python'],
    weaknesses: ['Time Series Analysis', 'Public Speaking'],
    monthlyWork: { hours: 55, modulesCompleted: 8 },
    punctuality: 85,
    recommendedDesignation: 'Lead Data Scientist'
  },
  {
    id: 'emp-03',
    name: 'Rahul Desai',
    department: 'IT Administration',
    currentDesignation: 'Systems Administrator',
    strengths: ['Network Security', 'Database Management', 'Linux'],
    weaknesses: ['Project Management', 'Agile Methodologies'],
    monthlyWork: { hours: 25, modulesCompleted: 2 },
    punctuality: 65,
    recommendedDesignation: 'Security Infrastructure Lead'
  }
];

export function OverallUnderstanding() {
  const [selectedEmpId, setSelectedEmpId] = useState(mockEmployees[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const employee = mockEmployees.find(e => e.id === selectedEmpId) || mockEmployees[0];

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      setIsExporting(true);
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#0A0A0A' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${employee.name.replace(/\s+/g, '_')}_Competency_Report.pdf`);
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

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select
            value={selectedEmpId}
            onChange={e => setSelectedEmpId(e.target.value)}
            style={{
              padding: '10px 14px', background: '#0F0F11', border: '1px solid rgba(255,255,255,.12)',
              color: '#fff', fontSize: 13, outline: 'none'
            }}
          >
            {mockEmployees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} - {emp.currentDesignation}</option>
            ))}
          </select>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            style={{
              ...mono, fontSize: 9, padding: '10px 20px', background: '#6366F1',
              border: '1px solid #6366F1', color: '#fff', cursor: isExporting ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, opacity: isExporting ? 0.6 : 1
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
    </div>
  );
}
