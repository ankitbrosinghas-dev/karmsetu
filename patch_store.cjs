const fs = require('fs');

const path = 'src/store/useStore.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  "initializeFromFirestore: (uid: string, name: string, role: User['role']) => Promise<void>;",
  "initializeFromFirestore: (uid: string, name: string, role: User['role'], designation?: string) => Promise<void>;"
);

code = code.replace(
  "initializeFromFirestore: async (uid: string, name: string, role: User['role']) => {",
  "initializeFromFirestore: async (uid: string, name: string, role: User['role'], designation?: string) => {"
);

code = code.replace(
  "designation: 'Statistical Officer'",
  "designation: designation || 'Statistical Officer'"
);

// If user exists, we might want to still update the designation so the UI reflects what they just typed during demo login
// But this might be too complex. Let's just do it at creation or if we update the doc.
// For now, let's just make it update the current user state as well if provided.

fs.writeFileSync(path, code, 'utf8');
console.log('useStore.ts patched');
