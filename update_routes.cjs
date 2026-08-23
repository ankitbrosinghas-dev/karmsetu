const fs = require('fs');
const path = require('path');

// --- Update App.tsx ---
const appPath = 'src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');

// Add imports
appContent = appContent.replace(
  "import { IgotCatalogue } from './pages/learner/IgotCatalogue';",
  `import { IgotPortal } from './pages/learner/igot/IgotPortal';\nimport { IgotCatalogue } from './pages/learner/igot/IgotCatalogue';\nimport { IgotCourseDetails } from './pages/learner/igot/IgotCourseDetails';\nimport { IgotMyLearning } from './pages/learner/igot/IgotMyLearning';`
);

// Add routes
appContent = appContent.replace(
  '<Route path="/learner/igot-catalogue" element={<IgotCatalogue />} />',
  `<Route path="/learner/igot" element={<IgotPortal />} />
          <Route path="/learner/igot/courses" element={<IgotCatalogue />} />
          <Route path="/learner/igot/course/:courseId" element={<IgotCourseDetails />} />
          <Route path="/learner/igot/my-learning" element={<IgotMyLearning />} />`
);

fs.writeFileSync(appPath, appContent);

// --- Update MainLayout.tsx ---
const mainLayoutPath = 'src/components/layout/MainLayout.tsx';
let mainLayoutContent = fs.readFileSync(mainLayoutPath, 'utf8');

// Update learner navigation
mainLayoutContent = mainLayoutContent.replace(
  /\{ name: 'Training Catalogue', href: '\/learner\/igot-catalogue', icon: BookOpen \},/,
  `{ name: 'Training Catalogue', href: '/learner/igot/courses', icon: BookOpen },
    { name: 'iGOT Karmayogi', href: '/learner/igot', icon: Award },`
);

fs.writeFileSync(mainLayoutPath, mainLayoutContent);

console.log('Routes and Navigation updated');
