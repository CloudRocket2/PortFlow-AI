const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log("Navigating to http://localhost:3000/...");
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  
  await page.evaluate(() => {
    localStorage.setItem('portflow_role', 'DIR-01');
  });
  
  console.log("Navigating to http://localhost:3000/scenarios...");
  await page.goto('http://localhost:3000/scenarios', { waitUntil: 'networkidle0' });
  console.log("Scenarios loaded.");
  
  console.log("Navigating to http://localhost:3000/ (Dashboard where map is)...");
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  console.log("Dashboard loaded.");

  console.log("Navigating to http://localhost:3000/forecast...");
  await page.goto('http://localhost:3000/forecast', { waitUntil: 'networkidle0' });
  console.log("Forecast loaded.");

  await browser.close();
})();
