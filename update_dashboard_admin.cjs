const fs = require('fs');
const path = require('path');

const file = 'src/pages/admin/igot/IgotDashboard.tsx';
let content = fs.readFileSync(file, 'utf8');

const importReplacement = `import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Server, Users, BookOpen, Target, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, Download } from 'lucide-react';
import { Link } from 'react-router-dom';`;

content = content.replace(/import React, \{ useEffect, useState \} from 'react';[\s\S]*?import \{ Link \} from 'react-router-dom';/, importReplacement);

const buttonsHtml = `
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
`;

content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-4 gap-6">/, buttonsHtml);

fs.writeFileSync(file, content);
console.log('Admin Dashboard updated');
