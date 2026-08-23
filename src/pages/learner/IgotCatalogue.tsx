import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Search, ExternalLink, Clock, Building2, PlayCircle, CheckCircle2 } from 'lucide-react';

export function IgotCatalogue() {
  const [catalogue, setCatalogue] = useState<any[]>([]);

  useEffect(() => {
    api.igot.getCatalogue().then(setCatalogue).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">iGOT Training Catalogue</h1>
          <p className="text-slate-500 mt-2 font-medium">Explore and enroll in official government training synchronized with your competency passport.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search iGOT courses..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogue.map((course) => (
          <div key={course.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col hover:shadow-lg hover:border-blue-300 transition-all overflow-hidden group">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                 <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    course.status === 'Completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    course.status === 'In Progress' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-slate-50 border-slate-200 text-slate-600'
                 }`}>
                    {course.status}
                 </span>
                 {course.status === 'Completed' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                 {course.status === 'In Progress' && <PlayCircle className="w-5 h-5 text-amber-500" />}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">{course.title}</h3>
              <p className="text-slate-600 text-sm mb-6 line-clamp-3">{course.description}</p>
              
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Building2 className="w-4 h-4 text-slate-400" /> {course.provider}
                 </div>
                 <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <Clock className="w-4 h-4 text-slate-400" /> {course.duration}
                 </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <div className="mb-6">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Target Competencies</div>
                <div className="flex flex-wrap gap-2">
                  {course.competencies.map((comp: string, i: number) => (
                     <span key={i} className="text-xs font-medium px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">{comp}</span>
                  ))}
                </div>
              </div>
              
              <a 
                href={course.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
              >
                Open in iGOT <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
