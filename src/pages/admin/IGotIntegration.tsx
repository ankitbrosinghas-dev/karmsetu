import React from 'react';
import { Settings, RefreshCw, DownloadCloud, UploadCloud, Database, Server } from 'lucide-react';

export function IGotIntegration() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">iGOT Karmayogi Integration</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage API synchronization between KarmSetu and the iGOT ecosystem.</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl border border-blue-200 shadow-sm">
          <Server className="w-5 h-5 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider">Prototype Integration Mode</span>
        </div>
      </header>

      {/* Architecture Diagram */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8 md:p-12">
        <h2 className="text-xl font-bold text-slate-900 mb-8 text-center">System Architecture</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          
          <div className="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-2xl p-8 relative overflow-hidden group">
            <Database className="w-10 h-10 text-slate-400 mx-auto mb-4 group-hover:text-blue-500 transition-colors" />
            <h3 className="text-lg font-bold text-slate-900">iGOT Karmayogi</h3>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-2">Source of Truth (Learners, Roles)</p>
          </div>
          
          <div className="hidden md:flex flex-col items-center justify-center w-24 text-blue-600">
            <RefreshCw className="w-6 h-6 mb-2 animate-[spin_4s_linear_infinite]" />
            <div className="text-[10px] font-bold uppercase tracking-wider">Sync API</div>
          </div>
          
          <div className="w-full md:w-64 bg-blue-600 border border-blue-700 rounded-2xl p-8 shadow-md shadow-blue-600/20 group">
            <Server className="w-10 h-10 text-white mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">KarmSetu Engine</h3>
            <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider mt-2">Competency Intelligence & AI</p>
          </div>

        </div>
      </section>

      {/* Sync Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center shadow-sm">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Import from iGOT</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Pull data from ecosystem</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
              <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Sync Learner Profiles</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded">Simulated API</span>
            </button>
            <button className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
              <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Sync Training Catalogue</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded">Simulated API</span>
            </button>
            <button className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
              <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Sync Competency Framework</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded">Simulated API</span>
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Export to iGOT</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Push results to ecosystem</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
              <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Export Assessment Results</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded">Simulated API</span>
            </button>
            <button className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group">
              <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Export Competency Passport</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-1 rounded">Simulated API</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Configuration Settings */}
      <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Settings className="w-6 h-6 text-slate-400" /> API Configuration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">API Endpoint URL</label>
            <input type="text" disabled value="https://api.igot.gov.in/v1/sandbox" className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium text-sm rounded-xl px-4 py-3 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Client ID</label>
            <input type="password" disabled value="********-****-****" className="w-full bg-slate-50 border border-slate-200 text-slate-500 font-medium text-sm rounded-xl px-4 py-3 cursor-not-allowed" />
          </div>
        </div>
        <p className="text-slate-500 mt-6 font-medium text-sm bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <strong className="text-blue-700">Note:</strong> Real credentials are required for production deployment. Current environment is running in SIH 2026 Prototype Mode.
        </p>
      </section>
    </div>
  );
}
