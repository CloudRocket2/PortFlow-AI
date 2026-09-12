const fs = require('fs');
let code = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

code = code.replace(
  /text-white\/90/g,
  'text-white opacity-90'
);

fs.writeFileSync('src/components/Sidebar.tsx', code);
console.log("Fixed PortFlow logo text color");
