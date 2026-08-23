import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { User, Award, BookOpen, RefreshCw, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function IgotProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    // Hardcode user-1 for demo
    api.igot.getLearnerProfile('user-1').then(setProfile).catch(console.error);
    api.igot.getConfig().then(setConfig).catch(console.error);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync delay
    await new Promise(r => setTimeout(r, 2000));
    setSyncComplete(true);
    setIsSyncing(false);
    setTimeout(() => setSyncComplete(false), 5000);
  };

  if (!profile) return <div className="p-8 text-slate-500 font-medium">Loading iGOT Profile...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">iGOT Karmayogi Profile</h1>
          <p className="text-slate-500 mt-2 font-medium">Your official learning records synchronized from iGOT.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 min-w-[200px]"
        >
          {isSyncing ? <RefreshCw className="w-4 h-4 animate-spin" /> : syncComplete ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <RefreshCw className="w-4 h-4" />}
          {isSyncing ? 'Syncing...' : syncComplete ? 'Sync Successful' : 'Sync with iGOT'}
        </button>
      </header>

      {config?.isDemoMode && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center gap-3 text-amber-900 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">iGOT Integration: DEMO MODE</div>
            <div className="text-sm font-medium mt-1">Showing simulated data. Official sync requires API credentials configuration.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 text-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="text-4xl font-bold">{profile.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{profile.name}</h2>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-6">{profile.officialId}</div>
            
            <div className="text-left space-y-4 border-t border-slate-100 pt-6">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Department / MDO</div>
                <div className="font-semibold text-slate-900">{profile.department}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Role</div>
                <div className="font-semibold text-slate-900">{profile.role}</div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Designation</div>
                <div className="font-semibold text-slate-900">{profile.designation}</div>
              </div>
            </div>
          </div>
          
          <Link to="/learner/passport" className="block bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
            <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-blue-600 transition-colors">Update Competency Passport</h3>
            <p className="text-xs font-medium text-slate-500">Map iGOT progress to KarmSetu competencies</p>
          </Link>
        </div>

        <div className="md:col-span-2 space-y-8">
          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-50 rounded-xl">
                  <Award className="w-6 h-6 text-blue-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Official Competencies</h3>
             </div>
             
             <div className="space-y-4">
                {profile.competencies.map((comp: any) => (
                  <div key={comp.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                     <div>
                        <div className="font-semibold text-slate-900 text-base">{comp.name}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Level: {comp.level}</div>
                     </div>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        comp.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                     }`}>
                        {comp.status}
                     </span>
                  </div>
                ))}
             </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-50 rounded-xl">
                  <BookOpen className="w-6 h-6 text-blue-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900">Completed Courses</h3>
             </div>
             
             <div className="space-y-4">
                {profile.completedCourses.map((course: any) => (
                  <div key={course.id} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group">
                     <div>
                        <div className="font-semibold text-slate-900 text-base">{course.title}</div>
                        <div className="text-xs font-medium text-slate-500 mt-1">{course.provider}</div>
                     </div>
                     <a href={course.url} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:shadow-sm transition-all">
                        <ExternalLink className="w-4 h-4" />
                     </a>
                  </div>
                ))}
                {profile.completedCourses.length === 0 && (
                   <div className="text-center p-8 border border-slate-200 border-dashed rounded-2xl text-slate-500 font-medium">
                      No completed courses synchronized yet.
                   </div>
                )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
