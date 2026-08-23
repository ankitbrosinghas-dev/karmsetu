import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { ArrowLeft, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function IgotLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    api.igot.getLogs().then(setLogs).catch(console.error);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="mb-8">
        <Link to="/admin/integrations/igot" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm font-semibold mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Settings
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Integration Sync Logs</h1>
        <p className="text-slate-500 mt-2 font-medium">Audit API requests, errors, and automated retry status.</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-50">
              <tr>
                <th className="px-6 py-4 border-b border-slate-200">Timestamp</th>
                <th className="px-6 py-4 border-b border-slate-200">Operation</th>
                <th className="px-6 py-4 border-b border-slate-200">User</th>
                <th className="px-6 py-4 border-b border-slate-200">Resource / API</th>
                <th className="px-6 py-4 border-b border-slate-200">Status</th>
                <th className="px-6 py-4 border-b border-slate-200">Response / Error</th>
              </tr>
            </thead>
            <tbody className="text-slate-900">
              {logs.map((log, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold whitespace-nowrap text-xs text-slate-700 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{log.operation}</td>
                  <td className="px-6 py-4 text-slate-600">{log.user}</td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{log.resource}</td>
                  <td className="px-6 py-4">
                    {log.status === 'SUCCESS' && <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-bold text-[10px] uppercase tracking-wider">{log.status}</span>}
                    {log.status === 'FAILED' && <span className="px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg font-bold text-[10px] uppercase tracking-wider">{log.status}</span>}
                    {log.status === 'PENDING' && <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg font-bold text-[10px] uppercase tracking-wider">RETRY PENDING</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {log.error ? <span className="text-rose-600 font-semibold">{log.error}</span> : '-'}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">No logs available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
