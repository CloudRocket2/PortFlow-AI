const fs = require('fs');

let headerCode = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!headerCode.includes('document.body.classList')) {
  // Add an effect to toggle light-mode class
  headerCode = headerCode.replace(
    'const [theme, setTheme] = useState("dark");',
    `const [theme, setTheme] = useState("dark");
  
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [theme]);`
  );
  
  fs.writeFileSync('src/components/Header.tsx', headerCode);
  console.log("Updated Header.tsx with theme effect");
} else {
  console.log("Header already updated");
}
