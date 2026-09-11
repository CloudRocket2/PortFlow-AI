const fs = require('fs');
let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Add state for settings modal
if (!headerCode.includes('showSettingsModal')) {
  headerCode = headerCode.replace(
    'const [showProfile, setShowProfile] = useState(false);',
    'const [showProfile, setShowProfile] = useState(false);\n  const [showSettingsModal, setShowSettingsModal] = useState(false);\n  const [theme, setTheme] = useState("dark");\n  const [density, setDensity] = useState("cozy");\n  const [notificationsEnabled, setNotificationsEnabled] = useState(true);'
  );
}

// Replace Workspace Settings Link with Button
const oldLink = `<Link href="/admin" className="block w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded transition-colors">
                    Workspace Settings
                  </Link>`;
const newButton = `<button 
                    onClick={() => { setShowSettingsModal(true); setShowProfile(false); }}
                    className="block w-full text-left px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded transition-colors"
                  >
                    Workspace Settings
                  </button>`;

headerCode = headerCode.replace(oldLink, newButton);

// We need an X icon for the modal, let's make sure 'X' is imported from lucide-react
if (!headerCode.includes(' X,')) {
  headerCode = headerCode.replace('User } from "lucide-react";', 'User, X } from "lucide-react";');
}

// Check if X is imported properly
if (headerCode.includes('import { Bell, User } from')) {
    headerCode = headerCode.replace('import { Bell, User }', 'import { Bell, User, X }');
}

// Inject SettingsModal JSX before the closing </header> tag
const settingsModalJSX = `
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
          <div className="relative w-full max-w-md minimal-panel shadow-2xl animate-slide-in rounded-xl overflow-hidden border border-neutral-800">
            <div className="px-6 py-4 border-b border-neutral-800/60 flex items-center justify-between bg-neutral-900/50">
              <h2 className="text-lg font-semibold text-white">Workspace Settings</h2>
              <button onClick={() => setShowSettingsModal(false)} className="text-neutral-500 hover:text-white transition-colors focus-ring p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Theme */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-widest">Theme Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {['dark', 'light', 'system'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={\`px-3 py-2 text-sm font-medium rounded-lg border \${theme === t ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'} transition-colors capitalize\`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* UI Density */}
              <div className="space-y-3">
                <label className="text-xs font-mono text-neutral-500 uppercase tracking-widest">UI Density</label>
                <div className="grid grid-cols-2 gap-2">
                  {['compact', 'cozy'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDensity(d)}
                      className={\`px-3 py-2 text-sm font-medium rounded-lg border \${density === d ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'} transition-colors capitalize\`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications Toggle */}
              <div className="flex items-center justify-between py-2 border-b border-neutral-800/50">
                <div>
                  <p className="text-sm font-medium text-white">Push Notifications</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Receive alerts for delayed vessels</p>
                </div>
                <button 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={\`w-10 h-5 rounded-full relative transition-colors focus-ring \${notificationsEnabled ? 'bg-cyan-500' : 'bg-neutral-700'}\`}
                >
                  <div className={\`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform \${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}\`} />
                </button>
              </div>

              {/* Data Sync */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-white">Live AIS Sync</p>
                  <p className="text-xs text-neutral-500 mt-0.5">Update vessel positions in real-time</p>
                </div>
                <button className="w-10 h-5 rounded-full relative transition-colors focus-ring bg-cyan-500">
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform translate-x-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
`;

if (!headerCode.includes('Settings Modal')) {
  headerCode = headerCode.replace('</header>', settingsModalJSX + '\n    </header>');
}

fs.writeFileSync('src/components/Header.tsx', headerCode);
console.log("Updated Header.tsx with settings modal");
