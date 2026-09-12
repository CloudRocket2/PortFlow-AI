const fs = require('fs');

// Modify BottleneckAlerts.tsx
let codeAlerts = fs.readFileSync('src/components/BottleneckAlerts.tsx', 'utf8');
if (!codeAlerts.includes('isExpanded')) {
  codeAlerts = codeAlerts.replace(
    /export default function BottleneckAlerts\(\) \{/,
    'import { ChevronDown, ChevronUp } from "lucide-react";\n\nexport default function BottleneckAlerts() {\n  const [isExpanded, setIsExpanded] = useState(false);'
  );
  
  codeAlerts = codeAlerts.replace(
    /<div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">/,
    `<div 
        className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >`
  );
  
  codeAlerts = codeAlerts.replace(
    /<span className="text-xs text-neutral-500 font-mono flex items-center gap-1 uppercase tracking-widest transition-all duration-200">/,
    `<div className="flex items-center gap-4">
        <span className="text-xs text-neutral-500 font-mono flex items-center gap-1 uppercase tracking-widest transition-all duration-200">`
  );

  codeAlerts = codeAlerts.replace(
    /<div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" \/>\n\s*LIVE SCAN\n\s*<\/span>/,
    `<div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          LIVE SCAN
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500 group-hover:text-white" /> : <ChevronDown className="w-4 h-4 text-neutral-500 group-hover:text-white" />}
        </div>`
  );

  codeAlerts = codeAlerts.replace(
    /<div className="space-y-3">/,
    `{isExpanded && (
      <div className="space-y-3 animate-slide-in">`
  );

  // Close the isExpanded block right before the final closing div of the component
  const lastDivIndex = codeAlerts.lastIndexOf('</div>\n    </div>');
  if (lastDivIndex !== -1) {
    codeAlerts = codeAlerts.substring(0, lastDivIndex + 6) + '\n      )}' + codeAlerts.substring(lastDivIndex + 6);
  }
  
  fs.writeFileSync('src/components/BottleneckAlerts.tsx', codeAlerts);
  console.log("Updated BottleneckAlerts.tsx");
}
