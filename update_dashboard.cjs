const fs = require('fs');
const path = require('path');

const dashboardPath = 'src/pages/learner/LearnerDashboard.tsx';
let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// Insert imports if needed
if (!dashboardContent.includes('Link')) {
  dashboardContent = dashboardContent.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';");
}

// Find the last div in the dashboard layout and append the iGOT widget
const widgetHtml = `
      {/* Recommended iGOT Training */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recommended iGOT Training</h2>
            <p className="text-sm text-slate-500">Based on your identified competency gaps</p>
          </div>
          <Link to="/learner/igot/courses" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
          </Link>
        </div>
        <div className="space-y-4">
          <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
            <div>
               <div className="text-xs font-bold text-emerald-600 mb-1">87% Match</div>
               <div className="font-bold text-slate-900">Data Driven Decision Making For Government</div>
               <div className="text-xs text-slate-500 mt-1">Provider: Capacity Building Commission</div>
            </div>
            <a href="https://igotkarmayogi.gov.in/explore/course/do_1" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Open in iGOT</a>
          </div>
          <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
            <div>
               <div className="text-xs font-bold text-emerald-600 mb-1">81% Match</div>
               <div className="font-bold text-slate-900">Microsoft Excel for Beginners</div>
               <div className="text-xs text-slate-500 mt-1">Provider: Microsoft</div>
            </div>
            <a href="https://igotkarmayogi.gov.in/explore/course/do_4" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Open in iGOT</a>
          </div>
        </div>
      </section>
`;

dashboardContent = dashboardContent.replace(
  /<\/div>\s*<\/div>\s*\);/m,
  `${widgetHtml}\n    </div>\n  </div>\n  );`
);

fs.writeFileSync(dashboardPath, dashboardContent);
console.log('Dashboard updated');
