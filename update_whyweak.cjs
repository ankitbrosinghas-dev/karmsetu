const fs = require('fs');
const path = require('path');

const file = 'src/pages/learner/WhyWeak.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add the iGOT recommendation widget at the bottom of the content
const widgetHtml = `
      {/* Recommended iGOT Training */}
      <section className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recommended iGOT Training</h2>
            <p className="text-sm text-slate-500">Your gap: <span className="font-bold text-slate-700">Data Analysis</span></p>
          </div>
        </div>
        <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1">
             <div className="text-xs font-bold text-emerald-600 mb-1">Recommended because this course addresses the competency associated with your detected gap.</div>
             <div className="font-bold text-slate-900 text-lg">Data Driven Decision Making For Government</div>
             <div className="text-sm text-slate-500 mt-1">Provider: Capacity Building Commission</div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <Link to="/learner/igot/course/course-1" className="flex-1 md:flex-none text-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50">Details</Link>
             <a href="https://igotkarmayogi.gov.in/explore/course/do_1" target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none text-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Open in iGOT</a>
          </div>
        </div>
      </section>
`;

content = content.replace(
  /<\/div>\s*<\/div>\s*\);/m,
  `${widgetHtml}\n    </div>\n  </div>\n  );`
);

fs.writeFileSync(file, content);
console.log('WhyWeak updated');
