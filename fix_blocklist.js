const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'risk', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

if (!content.includes('const [isBlocklisted, setIsBlocklisted] = useState(false);')) {
  // Add state
  content = content.replace(
    'const [scanned, setScanned] = useState(false);',
    'const [scanned, setScanned] = useState(false);\n  const [isBlocklisted, setIsBlocklisted] = useState(false);'
  );

  // Update button
  const oldButton = `<button className="mt-4 w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 py-2 rounded-lg text-xs font-mono uppercase tracking-widest font-bold hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" /> Blocklist Vessel
                      </button>`;
                      
  const newButton = `<button 
                        onClick={() => setIsBlocklisted(true)}
                        disabled={isBlocklisted}
                        className={\`mt-4 w-full py-2 rounded-lg text-xs font-mono uppercase tracking-widest font-bold transition-all duration-300 flex items-center justify-center gap-2 \${
                          isBlocklisted 
                            ? "bg-rose-500 text-white border border-rose-500" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20"
                        }\`}
                      >
                        {isBlocklisted ? (
                          <>
                            <ShieldCheck className="w-4 h-4" /> VESSEL BLOCKLISTED
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" /> Blocklist Vessel
                          </>
                        )}
                      </button>`;
                      
  content = content.replace(oldButton, newButton);

  fs.writeFileSync(filePath, content);
  console.log("Updated Risk Page Button");
} else {
  console.log("Button already updated");
}
