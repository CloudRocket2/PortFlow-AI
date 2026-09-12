const fs = require('fs');
let code = fs.readFileSync('src/components/GlobeWrapper.tsx', 'utf8');

// 1. Add state variable
code = code.replace(
  /const \[searchQuery, setSearchQuery\] = useState\(""\);/,
  'const [searchQuery, setSearchQuery] = useState("");\n  const [isSidebarOpen, setIsSidebarOpen] = useState(false);'
);

// 2. Replace the Search & Filter Bar and Tracked Vessels list
// It currently looks like:
/*
      {/* Search & Filter Bar *\/}
      <div className="absolute top-4 left-4 z-10 w-64 bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-2 shadow-xl flex items-center gap-2">
        <Search className="w-4 h-4 text-neutral-500" />
        <input 
          type="text" 
          placeholder="Search vessels or ports..." 
          className="bg-transparent border-none text-sm text-white w-full focus:outline-none placeholder-neutral-600"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Persistent Legend / Mini Side-List *\/}
      <div className="absolute top-16 left-4 z-10 w-64 max-h-[400px] overflow-y-auto bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-3 shadow-xl flex flex-col gap-2">
*/

const searchBlockRegex = /\{\/\* Search & Filter Bar \*\/\}[\s\S]*?<\/div>[\s\S]*?\{\/\* Persistent Legend \/ Mini Side-List \*\/\}[\s\S]*?\{\/\* Live Entity Badge \(Unobtrusive\) \*\/\}/;

const newBlock = `
      {/* Search Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={\`absolute top-4 left-4 z-20 bg-neutral-900/90 backdrop-blur border \${isSidebarOpen ? 'border-cyan-500/50 text-cyan-400' : 'border-neutral-800 text-neutral-400'} hover:text-cyan-400 hover:border-cyan-500/50 rounded-lg p-2.5 shadow-xl transition-all focus-ring focus:outline-none\`}
        title="Toggle Tracked Vessels"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Slide-out Panel */}
      <div 
        className={\`absolute top-4 left-[3.5rem] z-10 w-64 flex flex-col gap-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-left \${
          isSidebarOpen ? "translate-x-0 opacity-100 scale-100" : "-translate-x-4 opacity-0 scale-95 pointer-events-none"
        }\`}
      >
        {/* Search & Filter Bar */}
        <div className="w-full bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-2.5 shadow-xl flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search vessels or ports..." 
            className="bg-transparent border-none text-sm text-white w-full focus:outline-none placeholder-neutral-600"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Persistent Legend / Mini Side-List */}
        <div className="w-full max-h-[400px] overflow-y-auto bg-neutral-900/90 backdrop-blur border border-neutral-800 rounded-lg p-3 shadow-xl flex flex-col gap-2 minimal-scrollbar">
          <h3 className="text-xs font-mono uppercase text-neutral-500 mb-2">Tracked Vessels</h3>
          {ships.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(ship => (
            <div 
              key={ship.id}
              onClick={() => {
                setSelectedVoyageId(ship.contractId);
                setPosition({ coordinates: ship.coords, zoom: 4 });
              }}
              className={\`p-2 rounded cursor-pointer transition-colors text-sm \${ship.isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-black/50 text-neutral-300 hover:bg-neutral-800'}\`}
            >
              <div className="font-semibold">{ship.name}</div>
              <div className="text-xs text-neutral-500">{ship.routeStr}</div>
            </div>
          ))}
          {ships.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="text-sm text-neutral-500 text-center py-4">No vessels found.</div>
          )}
        </div>
      </div>

      {/* Live Entity Badge (Unobtrusive) */}`;

code = code.replace(searchBlockRegex, newBlock);

fs.writeFileSync('src/components/GlobeWrapper.tsx', code);
console.log("Updated GlobeWrapper to include sliding panel");
