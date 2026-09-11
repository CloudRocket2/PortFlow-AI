const fs = require('fs');

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Replace document.body with document.documentElement
headerCode = headerCode.replace(/document\.body\.classList/g, 'document.documentElement.classList');

// Add localStorage logic for theme, density, notificationsEnabled
const hookRegex = /const \[theme, setTheme\] = useState\("dark"\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[theme\]\);\s*const \[density, setDensity\] = useState\("cozy"\);\s*const \[notificationsEnabled, setNotificationsEnabled\] = useState\(true\);/m;

const newHooks = `const [theme, setTheme] = useState("dark");
  const [density, setDensity] = useState("cozy");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("pf_theme");
    if (savedTheme) setTheme(savedTheme);
    
    const savedDensity = localStorage.getItem("pf_density");
    if (savedDensity) setDensity(savedDensity);
    
    const savedNotifs = localStorage.getItem("pf_notifs");
    if (savedNotifs) setNotificationsEnabled(savedNotifs === "true");
  }, []);

  // Theme logic
  useEffect(() => {
    localStorage.setItem("pf_theme", theme);
    const applyTheme = (t: string) => {
      if (t === 'light') {
        document.documentElement.classList.add('light-mode');
      } else if (t === 'dark') {
        document.documentElement.classList.remove('light-mode');
      } else if (t === 'system') {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
          document.documentElement.classList.add('light-mode');
        } else {
          document.documentElement.classList.remove('light-mode');
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
  }, [theme]);

  // Save other settings
  useEffect(() => {
    localStorage.setItem("pf_density", density);
  }, [density]);

  useEffect(() => {
    localStorage.setItem("pf_notifs", String(notificationsEnabled));
  }, [notificationsEnabled]);`;

headerCode = headerCode.replace(hookRegex, newHooks);

// Ensure there is no residual document.body.classList
headerCode = headerCode.replace(/document\.body\.classList/g, 'document.documentElement.classList');

fs.writeFileSync('src/components/Header.tsx', headerCode);
console.log("Updated Header.tsx with documentElement and localStorage");
