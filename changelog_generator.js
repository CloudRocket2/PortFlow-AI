const fs = require('fs');

let indexHtml = fs.readFileSync('E:/index.html', 'utf8');

// Update index links to be absolute so they work from changelog too
// But wait, they are in the same directory so index.html#product works.

// We will just read the head, header, footer from indexHtml
const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/);
const headContent = headMatch ? headMatch[1] : '';

let headerMatch = indexHtml.match(/<header id="nav">([\s\S]*?)<\/header>/);
let headerContent = headerMatch ? headerMatch[0] : '';
headerContent = headerContent.replace(/href="#/g, 'href="index.html#');

let footerMatch = indexHtml.match(/<footer>([\s\S]*?)<\/footer>/);
let footerContent = footerMatch ? footerMatch[0] : '';
footerContent = footerContent.replace(/href="#/g, 'href="index.html#');

const changelogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  ${headContent}
  <style>
    .timeline {
      max-width: 800px;
      margin: 60px auto;
      padding: 0 20px;
    }
    .version-block {
      border-left: 2px solid var(--border);
      padding-left: 30px;
      position: relative;
      margin-bottom: 50px;
    }
    .version-block::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--green);
      box-shadow: 0 0 10px var(--green);
    }
    .version-title {
      font-family: var(--mono);
      font-size: 1.2rem;
      color: var(--green);
      margin-bottom: 8px;
      margin-top: -5px;
    }
    .version-date {
      font-size: 0.85rem;
      color: var(--muted);
      margin-bottom: 16px;
      font-family: var(--mono);
    }
    .version-desc {
      color: var(--text);
      line-height: 1.6;
      font-size: 0.95rem;
      margin-bottom: 16px;
    }
    .version-changes {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 4px;
      padding: 16px 20px;
    }
    .version-changes ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .version-changes li {
      position: relative;
      padding-left: 16px;
      margin-bottom: 8px;
      color: var(--muted);
      font-size: 0.9rem;
    }
    .version-changes li:last-child {
      margin-bottom: 0;
    }
    .version-changes li::before {
      content: '>';
      position: absolute;
      left: 0;
      color: var(--faint);
      font-family: var(--mono);
    }
    .page-title {
      text-align: center;
      margin: 120px 0 40px;
    }
    .page-title h1 {
      font-size: 3rem;
      margin-bottom: 16px;
    }
    .page-title p {
      color: var(--muted);
      font-family: var(--mono);
    }
  </style>
</head>
<body>
  ${headerContent}

  <main>
    <div class="page-title reveal">
      <h1>System Logs</h1>
      <p>SYS.VER.HISTORY // V1.0.0 TO V2.3.0</p>
    </div>

    <div class="timeline reveal reveal-stagger">
      
      <div class="version-block">
        <div class="version-title">v2.3.0 - Map Engine Revert & Overlays</div>
        <div class="version-date">2026-09-12</div>
        <div class="version-desc">Reverted the heavy Mapbox GL JS engine back to the lightweight SVG-based react-simple-maps implementation to resolve rendering glitches, while preserving the new UI overlays. Fixed coordinate bounding and resolved label overlap clutter.</div>
        <div class="version-changes">
          <ul>
            <li>Stripped deck.gl and maplibre-gl dependencies</li>
            <li>Restored GlobeWrapper.tsx with custom SVG rendering</li>
            <li>Added dynamic yOffset for Gangavaram/Vizag labels to fix overlapping</li>
            <li>Added docked Port Details panel that slides in on port click</li>
            <li>Restricted map panning beyond global coordinates</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v2.2.0 - DeckGL Map Overhaul (Abandoned)</div>
        <div class="version-date">2026-09-11</div>
        <div class="version-desc">Attempted to migrate the global radar map to a full 3D Mapbox/DeckGL stack for high-performance vector rendering. Ultimately abandoned due to user visual preferences, but UI components were salvaged.</div>
        <div class="version-changes">
          <ul>
            <li>Integrated deck.gl ScatterplotLayer and GeoJsonLayer</li>
            <li>Implemented custom base64 SVG ship icons inside the map</li>
            <li>Built floating DOM UI panels over the canvas</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v2.1.0 - Enterprise Provisioning & Setup Flows</div>
        <div class="version-date">2026-09-11</div>
        <div class="version-desc">Added enterprise-grade authentication and workspace provisioning flows, allowing government or port authorities to create dedicated setups.</div>
        <div class="version-changes">
          <ul>
            <li>Added /admin and /setup routing for workspace creation</li>
            <li>Implemented invite logic to provision users with @portflow.com addresses</li>
            <li>Added custom workspace parameter configurations</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v2.0.0 - Design System 2.0 & Dark Theme</div>
        <div class="version-date">2026-09-10</div>
        <div class="version-desc">Massive overhaul of the application's visual identity. Moved away from the default slate colors to a premium, deep dark aesthetic with cyan and emerald accents.</div>
        <div class="version-changes">
          <ul>
            <li>Rewrote globals.css and tailwind.config.ts to establish a strict dark mode palette</li>
            <li>Migrated all major dashboard pages (Fleet Command, Chartering, Forecast)</li>
            <li>Updated AI logs and Scenario planning to use cohesive glassmorphism and subtle borders</li>
            <li>Added CSS sweep animations and sweep-btn classes</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.9.0 - AI Logs Re-Theme</div>
        <div class="version-date">2026-09-10</div>
        <div class="version-desc">Brought the AI reasoning console into the global design system.</div>
        <div class="version-changes">
          <ul>
            <li>Converted slate/blue backgrounds to neutral-900</li>
            <li>Updated chat bubbles and loading indicators</li>
            <li>Aligned typography with strict monospaced uppercase standards</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.8.0 - Risk & Legal Compliance Centers</div>
        <div class="version-date">2026-09-09</div>
        <div class="version-desc">Expanded the application capabilities to include automated legal compliance checking for maritime contracts and macro risk monitoring.</div>
        <div class="version-changes">
          <ul>
            <li>Added Risk Center page with geopolitical heatmaps</li>
            <li>Added Legal Compliance page with automated contract clause analysis</li>
            <li>Integrated warning states directly into the map markers for non-compliant ports</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.7.0 - Scenarios UI Overhaul</div>
        <div class="version-date">2026-09-09</div>
        <div class="version-desc">Fixed critical UI bugs in the Scenarios layout where text was overflowing containers during deep scenario generation.</div>
        <div class="version-changes">
          <ul>
            <li>Fixed flexbox and grid overflow boundaries</li>
            <li>Expanded max-width wrapper from 6xl to 1600px</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.6.0 - Dwell Time Analytics Fixes</div>
        <div class="version-date">2026-09-08</div>
        <div class="version-desc">Repaired broken data pipelines that caused the lightering delays graph to permanently hang on "loading trends".</div>
        <div class="version-changes">
          <ul>
            <li>Fixed data fetching dependencies in DwellTimeChart.tsx</li>
            <li>Restored lightering delay visualization and animations</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.5.0 - Landing Page Polish</div>
        <div class="version-date">2026-09-07</div>
        <div class="version-desc">Upgraded the public-facing index.html landing page with premium aesthetic treatments.</div>
        <div class="version-changes">
          <ul>
            <li>Added scroll-triggered reveal animations via IntersectionObserver</li>
            <li>Added 3D perspective parallax tilts to window mockups</li>
            <li>Integrated a subtle particle canvas background</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.4.0 - Fleet Command Navigation Fixes</div>
        <div class="version-date">2026-09-05</div>
        <div class="version-desc">Fixed top-bar statistics rendering in the main Fleet Command dashboard that disappeared after a state shape refactor.</div>
        <div class="version-changes">
          <ul>
            <li>Restored "Active CTs", "Predictive Accuracy", and "Vessels in Transit" KPI blocks</li>
            <li>Linked KPI blocks to real-time context metrics</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.3.0 - AI Optimization Engine</div>
        <div class="version-date">2026-09-03</div>
        <div class="version-desc">Wired up the core "Run AI Optimization" button to trigger the heuristic routing engine.</div>
        <div class="version-changes">
          <ul>
            <li>Connected OptimizerPanel to PortFlowContext</li>
            <li>Implemented simulate logic to auto-reroute pending spot charters</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.2.0 - Multi-Voyage Ledger UI</div>
        <div class="version-date">2026-09-01</div>
        <div class="version-desc">Implemented the data grid for tracking active voyages and spot charters.</div>
        <div class="version-changes">
          <ul>
            <li>Built sliding drawer component for detailed contract inspection</li>
            <li>Added status indicators and volume tracking</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.1.0 - PortFlow Context & Global State</div>
        <div class="version-date">2026-08-30</div>
        <div class="version-desc">Migrated from static JSON mock data to a centralized React Context provider to power the entire dashboard.</div>
        <div class="version-changes">
          <ul>
            <li>Created PortFlowContext.tsx with initial fleet seed data</li>
            <li>Built typed interfaces for Vessels, Ports, and Routes</li>
          </ul>
        </div>
      </div>

      <div class="version-block">
        <div class="version-title">v1.0.0 - Initial Project Architecture</div>
        <div class="version-date">2026-08-25</div>
        <div class="version-desc">Bootstrapped the Next.js application architecture and established the core routing topology.</div>
        <div class="version-changes">
          <ul>
            <li>Configured Next.js with App Router</li>
            <li>Set up Tailwind CSS</li>
            <li>Created foundational layout shells and Sidebar navigation</li>
          </ul>
        </div>
      </div>

    </div>
  </main>

  ${footerContent}

  <script>
    // Reveal Animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Burger menu
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');
    if(burger && mobileMenu){
      burger.addEventListener('click', () => {
        const isExpanded = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('open');
      });
    }
  </script>
</body>
</html>`;

fs.writeFileSync('E:/changelog.html', changelogHtml);
console.log("Successfully created E:/changelog.html with absolute links");
