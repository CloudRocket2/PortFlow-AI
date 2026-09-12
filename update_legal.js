const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'src', 'app', 'legal', 'page.tsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Add states for charter analysis
content = content.replace(
  'const [charterResultsReady, setCharterResultsReady] = useState(false);',
  `const [charterResultsReady, setCharterResultsReady] = useState(false);\n  const [charterRisks, setCharterRisks] = useState<any[]>([]);\n  const [clauseInput, setClauseInput] = useState("14. Force Majeure: Neither party shall be liable for failure to perform due to Acts of God, war, strikes, or port congestion exceeding 5 days...");`
);

// Update textarea to be controlled
content = content.replace(
  /<textarea\s*placeholder="Paste charter party clauses here[\s\S]*?\/>/m,
  `<textarea 
                placeholder="Paste charter party clauses here (e.g. Force Majeure, Demurrage, Arbitration)..."
                className="flex-1 bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                value={clauseInput}
                onChange={(e) => setClauseInput(e.target.value)}
              />`
);

// Update handleAnalyzeCharter
content = content.replace(
  /const handleAnalyzeCharter = \(\) => {[\s\S]*?};/,
  `const handleAnalyzeCharter = async () => {
    setIsAnalyzingCharter(true);
    setCharterResultsReady(false);
    
    try {
      const res = await fetch("/api/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clauseText: clauseInput })
      });
      const data = await res.json();
      setCharterRisks(data.risks || []);
    } catch (e) {
      console.error(e);
      setCharterRisks([{ category: "High Risk", title: "API Error", description: "Failed to connect to the legal AI engine.", mitigation: "Check logs." }]);
    }
    
    setIsAnalyzingCharter(false);
    setCharterResultsReady(true);
  };`
);

// Replace the hardcoded risk blocks
content = content.replace(
  /<div className="space-y-4">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\)\}\s*<\/div>\s*\);\s*\}\s*$/m,
  `<div className="space-y-4">
              {charterResultsReady && charterRisks.map((risk, idx) => (
                <div key={idx} className={\`p-4 border rounded-lg flex gap-3 \${risk.category.includes('High') ? 'border-rose-500/20 bg-rose-500/5' : risk.category.includes('Medium') ? 'border-amber-500/20 bg-amber-500/5' : 'border-emerald-500/20 bg-emerald-500/5'}\`}>
                  {risk.category.includes('High') ? (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                  ) : risk.category.includes('Medium') ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-base font-medium text-white uppercase tracking-wide font-mono">{risk.category}: {risk.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">{risk.description}</p>
                    {risk.mitigation && risk.mitigation !== "N/A" && (
                      <p className="text-[11px] text-emerald-400 mt-2">Recommendation: {risk.mitigation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`
);

fs.writeFileSync(pagePath, content);
console.log("Updated legal/page.tsx");
