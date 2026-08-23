import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Server, Settings, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function IgotSettings() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    api.igot.getConfig().then(setConfig).catch(console.error);
  }, []);

  if (!config) return <div className="p-8 text-slate-500 font-medium">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">iGOT Karmayogi Integration</h1>
          <p className="text-slate-500 mt-2 font-medium">
            KarmSetu is designed to integrate with authorized iGOT Karmayogi services for competency, learning and training synchronization.
          </p>
        </div>
        <a 
          href="https://igotkarmayogi.gov.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm"
        >
          Open iGOT Karmayogi <ExternalLink className="w-4 h-4" />
        </a>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <Settings className="w-6 h-6 text-slate-400" /> Integration Settings
              </h2>
              {config.isDemoMode ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider rounded-full">Prototype Mode (Requires Live API)</span>
              ) : config.isConfigured ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider rounded-full">Live Connected</span>
              ) : (
                <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider rounded-full">Missing Configuration</span>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">iGOT Base URL</label>
                <input type="text" disabled value={config.baseUrl} className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium text-sm rounded-xl px-4 py-3 cursor-not-allowed" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">API Base URL</label>
                  <input type="text" disabled value={config.isDemoMode ? "Simulated API (Demo Mode)" : "********"} className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium text-sm rounded-xl px-4 py-3 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Client ID</label>
                  <input type="password" disabled value="********-****-****" className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium text-sm rounded-xl px-4 py-3 cursor-not-allowed" />
                </div>
              </div>
            </div>
            
            <p className="text-slate-500 mt-6 font-medium text-sm bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <strong className="text-blue-700">Note:</strong> Never expose CLIENT_SECRET or API keys in frontend code. Configurations are loaded securely from backend environment variables.
            </p>
          </section>

          <div className="grid grid-cols-2 gap-6">
             <Link to="/admin/integrations/igot/dashboard" className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all group block">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Sync Dashboard</h3>
                <p className="text-xs font-medium text-slate-500">View data synchronization metrics</p>
             </Link>
             <Link to="/admin/integrations/igot/logs" className="bg-white p-6 border border-slate-200 rounded-2xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all group block">
                <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">Sync Logs</h3>
                <p className="text-xs font-medium text-slate-500">Audit API requests and errors</p>
             </Link>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-blue-600 p-8 border border-blue-700 text-white rounded-3xl shadow-sm shadow-blue-600/20">
              <Server className="w-8 h-8 mb-4 text-blue-200" />
              <h3 className="text-xl font-bold mb-2">Architecture</h3>
              <p className="text-sm text-blue-100 font-medium mb-6">KarmSetu uses an abstraction layer so that the frontend never directly communicates with iGOT.</p>
              
              <div className="space-y-3 font-mono text-xs">
                 <div className="p-3 border border-white/20 bg-white/10 rounded-xl">KarmSetu Frontend</div>
                 <div className="text-center text-blue-200">↓</div>
                 <div className="p-3 border border-white/20 bg-white/10 rounded-xl">KarmSetu Backend</div>
                 <div className="text-center text-blue-200">↓</div>
                 <div className="p-3 border border-white/20 bg-white/10 rounded-xl">iGOT Integration Service</div>
                 <div className="text-center text-blue-200">↓</div>
                 <div className="p-3 border border-white/20 bg-white/10 rounded-xl">Authorized iGOT API</div>
                 <div className="text-center text-blue-200">↓</div>
                 <div className="p-3 border border-white/20 bg-white/20 font-bold rounded-xl text-white">iGOT Karmayogi</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
