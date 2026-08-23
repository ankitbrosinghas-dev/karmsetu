const fs = require('fs');

const path = 'src/pages/public/LandingPages.tsx';
let code = fs.readFileSync(path, 'utf8');

const newLoginLogic = `  const [selectedRole, setSelectedRole] = React.useState<'LEARNER' | 'MANAGER' | 'ADMIN' | null>(null);
  const [designation, setDesignation] = React.useState<string>('');

  const handleRoleSelect = (role: 'LEARNER' | 'MANAGER' | 'ADMIN') => {
    setSelectedRole(role);
    // Set some defaults based on role
    if (role === 'LEARNER') setDesignation('Statistical Officer');
    if (role === 'MANAGER') setDesignation('Training Manager');
    if (role === 'ADMIN') setDesignation('System Administrator');
  };

  const handleDemoLogin = async () => {
    if (!selectedRole || isLoading) return;
    try {
      setIsLoading(true);
      setError(null);
      
      const openUid = \`open-demo-user-\${selectedRole.toLowerCase()}\`;
      
      await useAppStore.getState().initializeFromFirestore(
        openUid, 
        'Demo User', 
        selectedRole,
        designation
      );

      navigate(\`/\${selectedRole.toLowerCase()}/dashboard\`);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };`;

// Replace handleDemoLogin
code = code.replace(/  const handleDemoLogin = async \(role: 'LEARNER' \| 'MANAGER' \| 'ADMIN'\) => \{[\s\S]*?  \};\n/, newLoginLogic + '\n');

const roleSelectionHtml = `          {!selectedRole ? (
            <div className="space-y-4">
              <button 
                onClick={() => handleRoleSelect('LEARNER')}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Demo Learner</div>
                  <div className="text-xs text-slate-500 mt-1">Aarav Sharma • Statistical Officer</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </button>
              
              <button 
                onClick={() => handleRoleSelect('MANAGER')}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Demo Training Manager</div>
                  <div className="text-xs text-slate-500 mt-1">Department of Statistics</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </button>

              <button 
                onClick={() => handleRoleSelect('ADMIN')}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left group"
              >
                <div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">Demo Admin</div>
                  <div className="text-xs text-slate-500 mt-1">System & iGOT Integration</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500" />
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Job Designation</label>
                <input 
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Statistical Officer"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedRole(null)}
                  className="flex-1 py-3 px-4 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleDemoLogin}
                  disabled={isLoading || !designation.trim()}
                  className="flex-[2] py-3 px-4 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Continue'}
                </button>
              </div>
            </div>
          )}`;

// Replace old return logic
code = code.replace(/          <div className="space-y-4">[\s\S]*?<\/button>\n          <\/div>/, roleSelectionHtml);

fs.writeFileSync(path, code, 'utf8');
console.log('LandingPages.tsx patched');
