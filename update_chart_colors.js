const fs = require('fs');

let cssCode = fs.readFileSync('src/app/globals.css', 'utf8');

if (!cssCode.includes('--chart-grid')) {
  cssCode = cssCode.replace(':root {', `:root {
  --chart-grid: #222222;
  --chart-axis: #666666;
  --chart-line: #ffffff;
  --chart-line-alt: #aaaaaa;`);

  cssCode = cssCode.replace('.light-mode {', `.light-mode {
  --chart-grid: #e7e5e4;
  --chart-axis: #a8a29e;
  --chart-line: #292524;
  --chart-line-alt: #a8a29e;`);

  fs.writeFileSync('src/app/globals.css', cssCode);
  console.log("Added chart variables to globals.css");
}

const replaceChartColors = (filePath) => {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  code = code.replace(/stroke="\#222"/g, 'stroke="var(--chart-grid)"');
  code = code.replace(/stroke="\#222222"/g, 'stroke="var(--chart-grid)"');
  code = code.replace(/stroke="\#262626"/g, 'stroke="var(--chart-grid)"');
  
  code = code.replace(/stroke="\#666"/g, 'stroke="var(--chart-axis)"');
  code = code.replace(/stroke="\#666666"/g, 'stroke="var(--chart-axis)"');
  code = code.replace(/fill: '\#666'/g, 'fill: "var(--chart-axis)"');
  
  code = code.replace(/stroke="\#ffffff"/g, 'stroke="var(--chart-line)"');
  
  code = code.replace(/stroke="\#aaaaaa"/g, 'stroke="var(--chart-line-alt)"');
  
  // Update hardcoded green to CSS variable
  code = code.replace(/fill="\#34d399"/g, 'fill="var(--route-active)"');
  code = code.replace(/stroke="\#34d399"/g, 'stroke="var(--route-active)"');
  
  // Custom replacements for tooltip styles to look better
  // E.g., itemStyle={{ color: '#fff' }} => itemStyle={{ color: 'var(--chart-line)' }}
  code = code.replace(/color: '\#fff'/g, 'color: "var(--chart-line)"');

  fs.writeFileSync(filePath, code);
  console.log(`Updated chart colors in ${filePath}`);
};

replaceChartColors('src/components/DwellTimeChart.tsx');
replaceChartColors('src/components/FreightForecastChart.tsx');
replaceChartColors('src/components/MacroVolatilityChart.tsx');
