const fs = require('fs');

const path = 'src/pages/learner/LearnerDashboard.tsx';
let code = fs.readFileSync(path, 'utf8');

const getGreetingFn = `
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};
`;

if (!code.includes('getGreeting')) {
  // Add getGreeting before the component definition
  code = code.replace(/export function LearnerDashboard\(\) \{/, getGreetingFn + '\nexport function LearnerDashboard() {');
}

code = code.replace(
  /<h1 className="text-3xl font-bold tracking-tight text-slate-900">Good morning, \{currentUser\?\.name\}<\/h1>/,
  '<h1 className="text-3xl font-bold tracking-tight text-slate-900">{getGreeting()}, {currentUser?.name}</h1>'
);

fs.writeFileSync(path, code, 'utf8');
console.log('LearnerDashboard patched');
