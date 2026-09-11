const fs = require('fs');

let indexHtml = fs.readFileSync('E:/index.html', 'utf8');

const creditsCss = `
  /* ---------- CREDITS ---------- */
  .credits { padding: 80px 0; border-top: 1px solid var(--border); }
  .credits-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 40px; }
  .credit-card { background: var(--surface); border: 1px solid var(--border); padding: 24px 28px; border-radius: 4px; transition: transform 0.2s, border-color 0.2s; border-left: 3px solid var(--green); }
  .credit-card:hover { transform: translateY(-3px); border-color: var(--border-hi); }
  .credit-name { font-size: 1.1rem; color: var(--text); font-weight: 600; margin-bottom: 8px; font-family: var(--display); letter-spacing: -0.01em; }
  .credit-role { font-size: 0.75rem; color: var(--green); font-family: var(--mono); line-height: 1.5; text-transform: uppercase; letter-spacing: 0.05em; }
`;

const creditsHtml = `
<section class="credits" id="credits">
  <div class="wrap">
    <div class="section-head reveal">
      <div class="sh-tag">THE TEAM</div>
      <h2>Engineered by</h2>
    </div>
    <div class="credits-grid">
      <div class="credit-card reveal">
        <div class="credit-name">Syed Mohammad Sufyan Ali</div>
        <div class="credit-role">Team Leader & Lead Developer</div>
      </div>
      <div class="credit-card reveal">
        <div class="credit-name">Shresth Kaushal</div>
        <div class="credit-role">Compliance & Audit Coordinator</div>
      </div>
      <div class="credit-card reveal">
        <div class="credit-name">Vaishnavi Yadav</div>
        <div class="credit-role">Charterparty & Compliance Legal Advisor</div>
      </div>
      <div class="credit-card reveal">
        <div class="credit-name">Dhruv Koyal</div>
        <div class="credit-role">ROI & Performance Analyst</div>
      </div>
      <div class="credit-card reveal">
        <div class="credit-name">Krishna Gupta</div>
        <div class="credit-role">UI/UX Specialist</div>
      </div>
      <div class="credit-card reveal">
        <div class="credit-name">Saad Qamar</div>
        <div class="credit-role">Assistant Financial Advisor</div>
      </div>
    </div>
  </div>
</section>
`;

// Inject CSS
if (!indexHtml.includes('.credits-grid')) {
  indexHtml = indexHtml.replace(/<\/style>/, `
  ${creditsCss}
</style>
  `);
}

// Inject HTML before footer
if (!indexHtml.includes('id="credits"')) {
  indexHtml = indexHtml.replace('<footer>', `${creditsHtml}\n\n<footer>`);
}

fs.writeFileSync('E:/index.html', indexHtml);
console.log("Successfully appended credits to index.html");
