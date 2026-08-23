import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Server, Users, BookOpen, Target, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export function IgotDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.igot.getDashboard().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="p-8 text-slate-500 font-medium">Loading dashboard...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/admin/integrations/igot" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-semibold mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Settings
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">iGOT Sync Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl border border-emerald-200 shadow-sm">
          <Server className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider">Connection: {stats.status}</span>
        </div>
      </header>

      
      <div className="flex items-center gap-3 mt-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
           <RefreshCw className="w-4 h-4" /> Sync Course Catalogue
        </button>
        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 flex items-center gap-2">
           <Download className="w-4 h-4" /> Export Catalogue
        </button>
        <Link to="/admin/integrations/igot/logs" className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50">
           View Sync Logs
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm hover:border-blue-300 transition-colors group">
          <div className="flex items-center gap-3 text-slate-500 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Learners</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">{stats.learnersSyncCount.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm hover:border-blue-300 transition-colors group">
          <div className="flex items-center gap-3 text-slate-500 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Courses</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">{stats.coursesSyncCount.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm hover:border-blue-300 transition-colors group">
          <div className="flex items-center gap-3 text-slate-500 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <Target className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Competencies</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">{stats.competenciesSyncCount.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm hover:border-emerald-300 transition-colors group">
          <div className="flex items-center gap-3 text-slate-500 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
               <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Assessments</span>
          </div>
          <div className="text-4xl font-bold text-slate-900">{stats.assessmentsSyncCount.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <section className="bg-white p-8 border border-slate-200 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Last Synchronization</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">Timestamp</span>
                <span className="text-sm font-bold text-slate-500">{new Date(stats.lastSync).toLocaleString()}</span>
             </div>
             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">Status</span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">Successful</span>
             </div>
          </div>
        </section>
        
        <section className="bg-white p-8 border border-slate-200 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
               <AlertTriangle className="w-5 h-5" />
             </div>
             Errors & Retries
          </h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700">Failed Attempts (Last 24h)</span>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200">{stats.failedAttempts}</span>
             </div>
             <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
               <p className="text-sm font-medium text-slate-600 leading-relaxed">
                 <strong className="text-blue-700">Reliability Note:</strong> KarmSetu implements safe retry logic. If iGOT is temporarily unavailable, synchronization is queued and retried automatically. No learner data is lost during network interruptions.
               </p>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
