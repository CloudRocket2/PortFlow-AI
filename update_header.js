const fs = require('fs');

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!headerCode.includes('showProfile')) {
  // Add state
  headerCode = headerCode.replace(
    'const [userInitials, setUserInitials] = useState("PF");',
    'const [userInitials, setUserInitials] = useState("PF");\n  const [userName, setUserName] = useState("PortFlow User");\n  const [showProfile, setShowProfile] = useState(false);'
  );

  // Update fetch to also set userName
  headerCode = headerCode.replace(
    'if (data.authenticated && data.user?.name) {',
    'if (data.authenticated && data.user?.name) {\n          setUserName(data.user.name);'
  );

  // Update avatar to button
  headerCode = headerCode.replace(
    /\{\/\* User Avatar \*\/\}\s*<div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500\/20 to-violet-500\/20 border border-neutral-700\/60 flex items-center justify-center">\s*<span className="text-xs font-semibold text-neutral-300">\{userInitials\}<\/span>\s*<\/div>/g,
    `{/* User Avatar */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-neutral-700/60 flex items-center justify-center hover:border-cyan-500/50 transition-colors focus-ring"
          >
            <span className="text-xs font-semibold text-neutral-300">{userInitials}</span>
          </button>
          
          {showProfile && (
            <>
              {/* Invisible backdrop to capture click-away reliably */}
              <div 
                className="fixed inset-0 z-[40]" 
                onClick={() => setShowProfile(false)}
              />
              <div className="absolute top-full right-0 mt-2 w-56 minimal-panel shadow-2xl overflow-hidden animate-slide-in z-[50]">
                <div className="p-4 border-b border-neutral-800/60">
                  <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest mb-1">Signed In</p>
                  <p className="text-sm font-medium text-white truncate">{userName}</p>
                </div>
                <div className="p-1.5">
                  <Link href="/admin" className="block w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded transition-colors">
                    Workspace Settings
                  </Link>
                  <button 
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' });
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors mt-1"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>`
  );
  
  fs.writeFileSync('src/components/Header.tsx', headerCode);
  console.log("Updated Header.tsx");
} else {
  console.log("Already updated");
}
