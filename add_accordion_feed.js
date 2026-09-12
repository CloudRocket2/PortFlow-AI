const fs = require('fs');

// Modify LiveTerminalFeed.tsx
let code = fs.readFileSync('src/components/LiveTerminalFeed.tsx', 'utf8');

if (!code.includes('isExpanded')) {
  // 1. Add imports and state
  code = code.replace(
    /import { useTelemetry } from "@\/hooks\/useTelemetry";\nimport { Terminal, Radio, Ship, AlertCircle, Anchor } from "lucide-react";/,
    'import { useState } from "react";\nimport { useTelemetry } from "@/hooks/useTelemetry";\nimport { Terminal, Radio, Ship, AlertCircle, Anchor, ChevronDown, ChevronUp } from "lucide-react";'
  );
  
  code = code.replace(
    /export default function LiveTerminalFeed\(\) \{/,
    'export default function LiveTerminalFeed() {\n  const [isExpanded, setIsExpanded] = useState(false);'
  );

  // 2. Modify container classes (remove fixed height when collapsed)
  code = code.replace(
    /<div className="minimal-panel hover:scale-\[1.005\] hover:border-neutral-700\/60 transition-all duration-300 overflow-hidden flex flex-col h-\[300px\]">/,
    '<div className={`minimal-panel hover:scale-[1.005] hover:border-neutral-700/60 transition-all duration-300 overflow-hidden flex flex-col ${isExpanded ? "h-[300px]" : "h-auto"}`}>'
  );

  // 3. Make header clickable
  code = code.replace(
    /<div className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between">/,
    '<div \n        className="px-4 py-3 border-b border-neutral-800 flex items-center justify-between cursor-pointer group"\n        onClick={() => setIsExpanded(!isExpanded)}\n      >'
  );

  // 4. Add chevron to the connected state container
  code = code.replace(
    /<span className="text-xs font-mono text-neutral-500 uppercase tracking-widest transition-all duration-200">\n\s*\{isConnected \? "Connected" : "Disconnected"\}\n\s*<\/span>\n\s*<\/div>/,
    `<span className="text-xs font-mono text-neutral-500 uppercase tracking-widest transition-all duration-200">
            {isConnected ? "Connected" : "Disconnected"}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500 ml-2 group-hover:text-white" /> : <ChevronDown className="w-4 h-4 text-neutral-500 ml-2 group-hover:text-white" />}
        </div>`
  );

  // 5. Wrap the feed in the isExpanded condition
  code = code.replace(
    /\{\/\* Feed \*\/\}\n\s*<div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar relative">/,
    `{/* Feed */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar relative animate-slide-in">`
  );

  // Close the condition at the end
  const lastDivIndex = code.lastIndexOf('</div>\n    </div>');
  if (lastDivIndex !== -1) {
    code = code.substring(0, lastDivIndex + 6) + '\n      )}' + code.substring(lastDivIndex + 6);
  }

  fs.writeFileSync('src/components/LiveTerminalFeed.tsx', code);
  console.log("Updated LiveTerminalFeed.tsx");
}
