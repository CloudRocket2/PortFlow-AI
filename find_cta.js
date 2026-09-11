const fs = require('fs');
const indexHtml = fs.readFileSync('E:/index.html', 'utf8');
const ctaIndex = indexHtml.indexOf('<section class="cta reveal">');
if (ctaIndex !== -1) {
  console.log("Found CTA at index", ctaIndex);
} else {
  console.log("CTA not found");
}
