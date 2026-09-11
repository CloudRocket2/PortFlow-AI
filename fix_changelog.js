const fs = require('fs');
let html = fs.readFileSync('E:/changelog.html', 'utf8');

// Remove reveal reveal-stagger from timeline
html = html.replace(/class="timeline reveal reveal-stagger"/, 'class="timeline"');

// Add reveal to each version-block
html = html.replace(/class="version-block"/g, 'class="version-block reveal"');

fs.writeFileSync('E:/changelog.html', html);
console.log("Fixed changelog.html");
