const fs = require('fs');

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Find the start and end of the useEffect
const startStr = "useEffect(() => {\n    if (theme === 'light') {";
const endStr = "}, [theme]);";

const startIdx = headerCode.indexOf("useEffect(() => {\n    if (theme === 'light') {");

if (startIdx !== -1) {
  const nextEnd = headerCode.indexOf("}, [theme]);", startIdx);
  if (nextEnd !== -1) {
    const toReplace = headerCode.substring(startIdx, nextEnd + endStr.length);
    const newEffect = `useEffect(() => {
    const applyTheme = (t: string) => {
      if (t === 'light') {
        document.body.classList.add('light-mode');
      } else if (t === 'dark') {
        document.body.classList.remove('light-mode');
      } else if (t === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.body.classList.add('light-mode');
        } else {
          document.body.classList.remove('light-mode');
        }
      }
    };
    applyTheme(theme);
    
    if (theme === 'system') {
      const listener = () => applyTheme('system');
      const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [theme]);`;
    headerCode = headerCode.replace(toReplace, newEffect);
    fs.writeFileSync('src/components/Header.tsx', headerCode);
    console.log("Updated correctly");
  }
} else {
  console.log("Could not find start");
}
