const fs = require('fs');

let indexHtml = fs.readFileSync('E:/index.html', 'utf8');

// Add to desktop nav
indexHtml = indexHtml.replace(
  /<nav class="nav-links">\s*<a href="#product">Product<\/a>\s*<a href="#capabilities">Capabilities<\/a>\s*<a href="#technology">Technology<\/a>\s*<\/nav>/,
  `<nav class="nav-links">
      <a href="#product">Product</a>
      <a href="#capabilities">Capabilities</a>
      <a href="#technology">Technology</a>
      <a href="changelog.html">Changelog</a>
    </nav>`
);

// Add to mobile nav
indexHtml = indexHtml.replace(
  /<div class="wrap">\s*<a href="#product">Product<\/a>\s*<a href="#capabilities">Capabilities<\/a>\s*<a href="#technology">Technology<\/a>/,
  `<div class="wrap">
      <a href="#product">Product</a>
      <a href="#capabilities">Capabilities</a>
      <a href="#technology">Technology</a>
      <a href="changelog.html">Changelog</a>`
);

// Add to footer nav
indexHtml = indexHtml.replace(
  /<div class="footer-links">\s*<a href="#product">Product<\/a>\s*<a href="#capabilities">Capabilities<\/a>\s*<a href="#technology">Technology<\/a>\s*<\/div>/,
  `<div class="footer-links">
      <a href="#product">Product</a>
      <a href="#capabilities">Capabilities</a>
      <a href="#technology">Technology</a>
      <a href="changelog.html">Changelog</a>
    </div>`
);

fs.writeFileSync('E:/index.html', indexHtml);
console.log("Successfully updated E:/index.html with Changelog links");
