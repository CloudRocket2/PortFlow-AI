const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'ai-logs', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
if (!content.includes('react-markdown')) {
  content = content.replace(
    'import { useState, useRef, useEffect } from "react";',
    'import { useState, useRef, useEffect } from "react";\nimport ReactMarkdown from "react-markdown";\nimport remarkGfm from "remark-gfm";'
  );
}

// Replace plain paragraph rendering with ReactMarkdown for model messages
const oldBubble = `<p className="whitespace-pre-wrap text-[13px] leading-relaxed">{msg.text}</p>`;
const newBubble = `{msg.role === "user" ? (
                    <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-neutral-900 prose-td:border-neutral-700 prose-th:border-neutral-700 prose-table:w-full prose-table:border-collapse prose-th:bg-neutral-800/50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-th:text-left">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  )}`;

content = content.replace(oldBubble, newBubble);

fs.writeFileSync(filePath, content);
console.log("Updated ai-logs/page.tsx");
