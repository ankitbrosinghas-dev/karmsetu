const fs = require('fs');
const path = require('path');

const appPath = 'src/App.tsx';
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(
  "import { MaterialUpload } from './pages/manager/MaterialUpload';",
  `import { MaterialUpload } from './pages/manager/MaterialUpload';\nimport { IgotManagerSearch } from './pages/manager/igot/IgotManagerSearch';`
);
appContent = appContent.replace(
  '<Route path="/manager/materials" element={<MaterialUpload />} />',
  `<Route path="/manager/materials" element={<MaterialUpload />} />\n          <Route path="/manager/igot" element={<IgotManagerSearch />} />`
);
fs.writeFileSync(appPath, appContent);

const mainLayoutPath = 'src/components/layout/MainLayout.tsx';
let mainLayoutContent = fs.readFileSync(mainLayoutPath, 'utf8');
mainLayoutContent = mainLayoutContent.replace(
  /\{ name: 'Upload Materials', href: '\/manager\/materials', icon: FileText \},/,
  `{ name: 'Upload Materials', href: '/manager/materials', icon: FileText },
    { name: 'iGOT Course Discovery', href: '/manager/igot', icon: Search },`
);
fs.writeFileSync(mainLayoutPath, mainLayoutContent);

console.log('Manager Routes and Navigation updated');
