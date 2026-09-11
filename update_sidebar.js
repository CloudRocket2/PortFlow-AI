const fs = require('fs');

let sidebarCode = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

// Remove User & Logout section
const startIdx = sidebarCode.indexOf('{/* User & Logout */}');
const endIdx = sidebarCode.indexOf('{/* Collapse Toggle */}');

if (startIdx !== -1 && endIdx !== -1) {
  sidebarCode = sidebarCode.substring(0, startIdx) + sidebarCode.substring(endIdx);
  fs.writeFileSync('src/components/Sidebar.tsx', sidebarCode);
  console.log("Removed User & Logout from Sidebar.tsx");
} else {
  console.log("Section not found");
}
