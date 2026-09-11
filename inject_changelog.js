const fs = require('fs');

const indexHtml = fs.readFileSync('E:/index.html', 'utf8');
const changelogHtml = fs.readFileSync('E:/changelog.html', 'utf8');

// Extract the CSS for the timeline
const timelineCssMatch = changelogHtml.match(/\.timeline {[\s\S]*?\.page-title p {[^}]*}/);
let timelineCss = timelineCssMatch ? timelineCssMatch[0] : '';

// Extract the changelog content including the page-title
const timelineMatch = changelogHtml.match(/(<div class="page-title reveal">[\s\S]*?)<\/main>/);
let timelineContent = timelineMatch ? timelineMatch[1] : '';

// Clean up timelineContent slightly to fit as a section
timelineContent = `
<div class="glow-divider"></div>
<section id="changelog" style="padding-bottom: 60px;">
  <div class="wrap">
    ${timelineContent}
  </div>
</section>
`;

// Inject CSS
let newIndex = indexHtml.replace(/<\/style>/, `
  ${timelineCss}
</style>
`);

// Inject Content before CTA
newIndex = newIndex.replace('<section class="cta reveal">', timelineContent + '\n<section class="cta reveal">');

// Update links from "changelog.html" to "#changelog"
newIndex = newIndex.replace(/href="changelog\.html"/g, 'href="#changelog"');

fs.writeFileSync('E:/index.html', newIndex);
console.log("Successfully appended changelog to index.html");
