const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TableRow, TableCell, Table, WidthType, BorderStyle, ShadingType, PageBreak, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom } = require("docx");
const fs = require("fs");

// ─── Helper functions ──────────────────────────────────────────────────────────

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 36, color: "1a1a2e" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 28, color: "16213e" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, color: "0f3460" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    children: [new TextRun({ text, size: 22, ...(opts.bold ? { bold: true } : {}), ...(opts.italic ? { italics: true } : {}), ...(opts.color ? { color: opts.color } : {}) })]
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22 })]
  });
}

function bulletBold(label, rest) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: label, bold: true, size: 22 }),
      new TextRun({ text: rest, size: 22 })
    ]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function divider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { color: "cccccc", size: 6, space: 1, style: BorderStyle.SINGLE } },
    children: []
  });
}

function callout(label, text) {
  return new Paragraph({
    spacing: { before: 120, after: 120 },
    indent: { left: 360 },
    border: { left: { color: "0f3460", size: 15, space: 10, style: BorderStyle.SINGLE } },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, color: "0f3460" }),
      new TextRun({ text, size: 22 })
    ]
  });
}

// ─── Document Sections ─────────────────────────────────────────────────────────

const doc = new Document({
  creator: "PortFlow OS",
  title: "PortFlow OS – Comprehensive Technical & Product Documentation",
  description: "Full technical and product documentation for the PortFlow OS maritime intelligence platform prototype",
  styles: {
    default: {
      document: {
        run: { font: "Calibri", size: 22 }
      }
    }
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 }
      }
    },
    children: [

      // ── TITLE PAGE ──────────────────────────────────────────────────────────────
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 400 },
        children: [new TextRun({ text: "PORTFLOW OS", bold: true, size: 72, color: "0f3460" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "Maritime Intelligence & Fleet Optimization Platform", size: 32, color: "444444", italics: true })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "Comprehensive Technical & Product Documentation", size: 26, color: "666666" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 800, after: 100 },
        children: [new TextRun({ text: "PROTOTYPE v0.1.0", size: 22, color: "888888" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: `Generated: September 2026`, size: 20, color: "aaaaaa" })]
      }),
      pageBreak(),

      // ── TABLE OF CONTENTS ────────────────────────────────────────────────────────
      h1("Table of Contents"),
      p("Chapter 1 – Executive Overview"),
      p("Chapter 2 – Technology Stack"),
      p("Chapter 3 – Application Architecture"),
      p("Chapter 4 – Authentication, Security & Encryption"),
      p("Chapter 5 – Database Design & Data Storage"),
      p("Chapter 6 – The AI Engine"),
      p("Chapter 7 – Application Pages & Features"),
      p("     7.1 – Login & Setup"),
      p("     7.2 – Fleet Command (Main Dashboard)"),
      p("     7.3 – Freight Forecast"),
      p("     7.4 – Chartering Intelligence"),
      p("     7.5 – Scenarios"),
      p("     7.6 – Legal Compliance"),
      p("     7.7 – Risk Centre"),
      p("     7.8 – AI Insights"),
      p("     7.9 – Admin Panel"),
      p("Chapter 8 – Charts & Data Visualisations"),
      p("Chapter 9 – UI/UX Design System"),
      p("Chapter 10 – User Navigation Walkthrough"),
      p("Chapter 11 – API Endpoints Reference"),
      p("Chapter 12 – Role-Based Access Control"),
      p("Chapter 13 – Maritime Data & Domain Knowledge"),
      p("Chapter 14 – Production Readiness & Roadmap"),
      pageBreak(),

      // ── CH 1: EXECUTIVE OVERVIEW ─────────────────────────────────────────────────
      h1("Chapter 1 – Executive Overview"),
      h2("1.1 What is PortFlow OS?"),
      p("PortFlow OS is an enterprise-grade, web-based maritime intelligence and fleet optimisation platform designed for bulk freight operators, chartering managers, and port logistics directors. It consolidates the entire voyage lifecycle — from vessel tracking and freight forecasting, to legal compliance checking and scenario planning — into a single, real-time operational interface."),
      p("The platform is purpose-built to address the chaotic, spreadsheet-driven nature of modern bulk shipping operations by replacing fragmented workflows with a unified, AI-augmented system."),

      h2("1.2 The Problem it Solves"),
      bullet("Bulk freight operators manage 5–30 vessels simultaneously, with pricing data, legal documents, and route information siloed across different teams and tools."),
      bullet("Demurrage penalties (charges incurred when a ship is delayed beyond agreed loading/discharging time) can cost $15,000–$80,000 per day. Real-time bottleneck detection prevents this."),
      bullet("Freight rate forecasting is currently done manually, with traders relying on intuition. PortFlow OS introduces machine-learning-informed forecasts to identify optimal chartering windows."),
      bullet("Legal compliance screening — checking for vessel sanctions, admiralty claims, and charter party clause risks — is currently handled by lawyers, taking days. The AI Legal module reduces this to seconds."),

      h2("1.3 Core Value Proposition"),
      bulletBold("AI-Augmented Decision Making: ", "Gemini-powered AI chat assists procurement managers with port selection, vessel sizing, and freight market timing."),
      bulletBold("Real-Time Fleet Awareness: ", "Live AIS (Automatic Identification System) feed simulation shows every vessel's position, status, and risk profile on an interactive global map."),
      bulletBold("Integrated Compliance: ", "In-app legal compliance scanner for Indian maritime regulations, including the Merchant Shipping Act and cabotage laws."),
      bulletBold("Financial Optimisation: ", "The AI Multi-Voyage Contract Ledger converts spot shipments into long-term contracts to generate measurable savings (demonstrated savings of $1.31M–$0.96M per contract)."),
      divider(),
      pageBreak(),

      // ── CH 2: TECH STACK ─────────────────────────────────────────────────────────
      h1("Chapter 2 – Technology Stack"),
      p("Every technology in PortFlow OS was chosen for a specific reason. Below is the full stack with rationale."),

      h2("2.1 Frontend Framework – Next.js 16 with React 19"),
      p("Next.js is the industry-standard full-stack React framework. It was chosen for three key reasons:"),
      bullet("Server-Side Rendering (SSR): The initial page load is pre-rendered on the server, ensuring the interface is visible instantly rather than waiting for JavaScript to download and execute. This is critical for a dashboard that displays time-sensitive maritime data."),
      bullet("API Routes: Next.js allows backend API endpoints to be built inside the same codebase (inside src/app/api/), eliminating the need for a separate backend service during prototyping."),
      bullet("React Server Components: The newest Next.js App Router architecture allows mixing server-rendered and client-interactive components, which means non-interactive sections (like text and layout) load faster."),
      callout("Version", "Next.js 16.3.3 with React 19.2.8 — the cutting-edge release, chosen to demonstrate forward-thinking architecture."),

      h2("2.2 Language – TypeScript 5"),
      p("All code in the project is written in TypeScript, a superset of JavaScript that adds static type checking. In a complex application with many interconnected data types (Vessel, Contract, Route, Alert, Port), TypeScript prevents entire categories of bugs at compile time. For example, the contract data model is strongly typed — passing a string where a number is expected will fail the build, not crash the production server."),

      h2("2.3 Styling – Tailwind CSS v4"),
      p("Tailwind CSS is a utility-first CSS framework. Instead of writing traditional CSS files, styles are applied as class names directly in the HTML/JSX. This speeds up UI development significantly. Tailwind v4 was used, which is the latest major version with a significant performance improvement in build times and a new CSS-native engine."),
      p("The project also uses a custom globals.css file to define a design system with CSS variables (--accent-emerald, --bg-primary, etc.) and a light/dark mode switching mechanism."),

      h2("2.4 Database ORM – Prisma 5 with PostgreSQL"),
      p("Prisma is a next-generation ORM (Object-Relational Mapper) for Node.js and TypeScript. It generates a fully type-safe database client from a schema definition file (prisma/schema.prisma). This means every database query is checked by TypeScript — if you try to query a field that doesn't exist, the code won't compile."),
      p("The database itself is PostgreSQL. The schema is defined to run on a cloud-hosted PostgreSQL instance (e.g., Railway, Supabase, Neon) via the DATABASE_URL environment variable."),
      callout("Why not SQLite?", "The schema comment notes SQLite was used for local hackathon development. PostgreSQL is used in the final version for production-readiness — it handles concurrent connections, large datasets, and has full ACID compliance."),

      h2("2.5 Authentication – bcryptjs + jose (JWT)"),
      bulletBold("bcryptjs: ", "Industry-standard password hashing library. Passwords are never stored in plain text. They are hashed with a 10-round salt before database storage."),
      bulletBold("jose: ", "A fast, modern JavaScript implementation of JSON Web Standards (JWT, JWE, JWK). Used to create and verify cryptographically signed session tokens."),

      h2("2.6 AI – Google Gemini API (@google/genai)"),
      p("The AI Insights chat engine is powered by Google's Gemini large language model via the official @google/genai SDK. The model used is gemini-3.6-flash, chosen for its speed and cost efficiency while still providing high-quality reasoning for domain-specific maritime questions."),
      p("The integration uses Gemini's Function Calling feature, which allows the AI to invoke specific application functions (like get_freight_forecast or optimize_vessel) when relevant, rather than just generating text."),

      h2("2.7 Data Visualisation – Recharts"),
      p("Recharts is a React-based charting library built on D3.js. It was chosen because it is deeply integrated with React's rendering lifecycle, supports animation, and is fully customisable via standard CSS and SVG properties. All charts in the application (the freight rate forecast, the dwell time chart, the macro volatility index, the model performance bar chart) are built with Recharts."),

      h2("2.8 Map Rendering – React Simple Maps + GeoJSON"),
      p("The Fleet Command map is built using react-simple-maps, which renders SVG-based world maps from TopoJSON/GeoJSON geographic data. Vessel routes are drawn as SVG Lines, and vessel positions are drawn as SVG Markers. This approach was chosen over tile-based maps (like Google Maps or Mapbox) because it gives total visual control over the aesthetic, allowing the dark oceanic colour palette to be applied to the map itself."),

      h2("2.9 Other Key Dependencies"),
      bulletBold("Lucide React: ", "A comprehensive, consistent icon library with 1,300+ SVG icons. Used throughout the entire interface for navigation, status indicators, and action buttons."),
      bulletBold("Zod: ", "A TypeScript-first schema validation library. Used in API routes to validate incoming request bodies before processing them, preventing malformed data from reaching the database."),
      bulletBold("jsPDF + jspdf-autotable: ", "Used to generate downloadable PDF exports of contract ledger data directly in the browser without any server-side processing."),
      bulletBold("Framer Motion: ", "Animation library for React. Used for the boot sequence on the login screen and smooth panel transitions."),
      divider(),
      pageBreak(),

      // ── CH 3: ARCHITECTURE ───────────────────────────────────────────────────────
      h1("Chapter 3 – Application Architecture"),

      h2("3.1 Directory Structure"),
      p("The application follows the Next.js App Router convention:"),
      callout("src/app/", "All application pages. Each subdirectory is a URL route (e.g. src/app/forecast/ maps to /forecast in the browser)."),
      callout("src/app/api/", "All backend API endpoints. These run on the server and are never exposed to the client bundle."),
      callout("src/components/", "Reusable React components shared across multiple pages (Header, Sidebar, Charts, Table)."),
      callout("src/context/", "React Context providers for global application state (PortFlowContext for data, ChatContext for AI chat)."),
      callout("src/lib/", "Utility modules: auth.ts (JWT), prisma.ts (DB client), maritime-data.ts (domain data), optimizer.ts (routing logic), simulator.ts (IoT mock events)."),
      callout("src/data/", "Static data files — specifically the countries.json GeoJSON file for the world map."),
      callout("src/hooks/", "Custom React hooks — useTelemetry.tsx simulates a live AIS telemetry feed."),
      callout("prisma/", "Database schema (schema.prisma) and seed script (seed.ts) for initial data population."),

      h2("3.2 State Management Architecture"),
      p("The application uses React's built-in Context API for global state management, avoiding the complexity of external state libraries (like Redux) for the prototype stage."),
      p("There are two primary context providers:"),
      bulletBold("PortFlowContext: ", "The main data store. It holds the SSOT (Single Source of Truth) for all maritime entities — Ports, Vessels, Routes, Contracts, Alerts, and Forecast data. All pages that display this data consume it from this context. Mutations (like marking a contract as 'AI Executed') are performed through typed functions exposed by the context."),
      bulletBold("ChatContext: ", "Manages the state for the AI Insights chat — message history, loading states, and error states. It is persisted across page navigations because it lives in the root layout."),

      h2("3.3 The AppShell Layout Pattern"),
      p("Every authenticated page is wrapped in a component called AppShell (src/components/AppShell.tsx). This component renders the Sidebar, the Header bar, and the scrollable main content area. This pattern means the navigation never re-mounts between page transitions, giving the application the feel of a native desktop app. The page content is rendered inside the shell as {children}."),

      h2("3.4 Data Flow"),
      p("The current data flow for the prototype is:"),
      bullet("Seed data defined in src/context/PortFlowContext.tsx is loaded into memory when the app starts."),
      bullet("API routes (e.g. /api/dashboard/bottlenecks) serve additional data to specific components."),
      bullet("The AI chat API route (/api/chat) is the one truly live integration — it calls the Google Gemini API server-side and streams the response back to the client."),
      bullet("The IoT telemetry feed (the Global AIS & AI Dispatch Log) is simulated by a custom hook (useTelemetry) that generates realistic maritime events on a timer."),
      divider(),
      pageBreak(),

      // ── CH 4: AUTH & SECURITY ─────────────────────────────────────────────────────
      h1("Chapter 4 – Authentication, Security & Encryption"),

      h2("4.1 The Login Flow (End-to-End)"),
      p("When a user enters their email and password on the /login page, the following process occurs:"),
      bullet("Step 1: The browser sends a POST request to /api/auth/login with the email and password in the request body over HTTPS."),
      bullet("Step 2: The server looks up the user record in the PostgreSQL database by email."),
      bullet("Step 3: If the user exists, bcrypt.compare() is called to compare the submitted plaintext password against the stored hash. If they don't match, the server returns a generic 'Invalid email or password' error (it never specifies which field was wrong, to prevent user enumeration attacks)."),
      bullet("Step 4: If the credentials are valid, a JWT (JSON Web Token) is generated and signed with a secret key stored in the PORTFLOW_JWT_SECRET environment variable. The token payload contains the user's ID, email, role, name, and clearance level."),
      bullet("Step 5: The JWT is sent to the browser inside an HttpOnly, Secure, SameSite=lax cookie named portflow_session. It is set to expire in 7 days."),
      bullet("Step 6: The browser is redirected to the main dashboard (/)."),

      h2("4.2 Why HttpOnly Cookies?"),
      p("The HttpOnly cookie flag means the session token CANNOT be read by any JavaScript running in the browser — including any malicious code injected via an XSS (Cross-Site Scripting) attack. This is the single most important security property for session management in modern web applications. Alternatives like localStorage or sessionStorage are vulnerable to XSS by design."),

      h2("4.3 Password Hashing (bcrypt)"),
      p("bcrypt is an adaptive hashing algorithm specifically designed for passwords. It has two key properties:"),
      bullet("It is one-way: A hash cannot be reversed to recover the original password. If the database is stolen, the attacker only gets hashes, not passwords."),
      bullet("It is computationally expensive: The '10 salt rounds' means the server performs 2^10 = 1,024 iterations of hashing. This makes brute-force attacks extremely slow. Even with modern GPUs, an attacker can only attempt ~100 bcrypt hashes per second, versus billions of MD5 hashes per second."),

      h2("4.4 Timing Attack Prevention"),
      p("The login route has a subtle but important security feature: if an email is not found in the database, the server still calls bcrypt.hash(password, 10) before returning the error. This wastes the same amount of time as a successful lookup would. Without this, an attacker could determine which email addresses are registered simply by measuring the response time — a registered account takes longer to respond (because bcrypt.compare is called) while an unregistered one responds instantly."),

      h2("4.5 Rate Limiting"),
      p("An in-memory rate limiter blocks login attempts after 5 failures from the same IP address within a 15-minute window. It also delays the error response by 2 seconds to slow down automated brute-force tools. In production, this should be replaced with a Redis-backed rate limiter that persists across server restarts and across multiple server instances."),

      h2("4.6 Route Protection via Next.js Middleware"),
      p("The src/middleware.ts file runs on every incoming request before any page is rendered. It:"),
      bullet("Extracts the portflow_session cookie from the request."),
      bullet("Verifies the JWT signature using the same secret key it was created with. An expired, tampered, or incorrectly signed token will fail verification."),
      bullet("Checks the user's role against the Role-Based Access Control (RBAC) map to ensure they are allowed on the requested page."),
      bullet("Redirects to /login if any check fails."),
      callout("Effect", "It is architecturally impossible for a user to access any protected page without a valid session token. The check happens at the server's network edge, before React even renders."),

      h2("4.7 Where Logs are Stored"),
      p("Currently, all server-side logs (authentication events, API errors, AI chat errors) are printed to the terminal stdout using console.error(). In the development environment, this is the terminal where `npm run dev` is running. In production on a platform like Vercel, these logs are available in the Vercel dashboard under the 'Logs' tab for your deployment."),
      p("A production-grade version of this application would integrate a structured logging service like Datadog, Sentry, or Logtail to capture, query, and alert on log events."),
      divider(),
      pageBreak(),

      // ── CH 5: DATABASE ────────────────────────────────────────────────────────────
      h1("Chapter 5 – Database Design & Data Storage"),

      h2("5.1 Database System"),
      p("The application uses PostgreSQL, a powerful, open-source relational database. It is configured via the DATABASE_URL environment variable. In the prototype, this is pointed at a cloud-hosted PostgreSQL instance. The database schema is managed by Prisma, which handles migrations and generates the type-safe client library."),

      h2("5.2 Schema Models"),

      h3("User"),
      p("Stores all registered system users."),
      bulletBold("id: ", "Unique identifier (CUID — a collision-resistant unique string)."),
      bulletBold("email: ", "Unique. The primary login identifier."),
      bulletBold("password_hash: ", "The bcrypt hash of the user's password. The plaintext password is NEVER stored."),
      bulletBold("role: ", "The user's role code (e.g., 'DIR-12', 'MGR-01') used for RBAC."),
      bulletBold("name: ", "Display name shown in the UI header."),
      bulletBold("department: ", "The user's operational department."),
      bulletBold("clearance: ", "Security clearance level (e.g., 'TOP SECRET - ALPHA', 'RESTRICTED')."),
      bulletBold("setupCode: ", "A one-time 6-digit code used during the first-time account setup flow."),

      h3("Vessel"),
      p("Represents a ship docked at or approaching the port."),
      bulletBold("callSign: ", "Unique ICAO-style identifier for the vessel."),
      bulletBold("eta: ", "Estimated Time of Arrival (DateTime)."),
      bulletBold("berthNumber: ", "The assigned berth."),
      bulletBold("berthStatus: ", "APPROACHING | DOCKED | DEPARTING."),

      h3("Container"),
      p("The core entity for container yard management."),
      bulletBold("id: ", "Industry-standard format (e.g. 'MSCU-928374')."),
      bulletBold("type: ", "DRY | REEFER | HAZMAT."),
      bulletBold("priorityLevel: ", "HIGH | MEDIUM | LOW — used by the AI optimizer to determine movement priority."),
      bulletBold("dwellTimeHours: ", "How long the container has been in the yard. High dwell times trigger demurrage alerts."),
      bulletBold("carbonSavedKg: ", "Tracks CO2 reduction achieved by AI route optimization decisions."),

      h3("ContainerEvent (Immutable Audit Ledger)"),
      p("This is the most architecturally interesting table. It is an append-only event log — rows are NEVER updated or deleted. Every single movement, inspection, or status change of a container creates a new row. This is sometimes called 'event sourcing'. It provides:"),
      bullet("A complete, tamper-proof audit trail of every container movement."),
      bullet("The ability to 'time travel' — reconstruct the exact state of the yard at any point in history by replaying events up to that timestamp."),
      bullet("Accountability — every event records the crane operator's badge ID."),

      h3("YardSlot"),
      p("Models the physical container yard as a 3D grid. Each slot has Bay (X), Row (Y), and Tier (Z) coordinates with a unique constraint to prevent double-booking."),

      h2("5.3 The Prototype Data Layer"),
      p("While the database schema is fully designed, the current prototype primarily uses in-memory seed data defined in src/context/PortFlowContext.tsx. This was done to allow rapid UI prototyping without requiring a database connection for every developer running the project. The seed data includes 6 vessels, 9 ports (5 global origin ports, 7 Indian east coast destinations), 6 routes, 5 contracts, and 5 alert scenarios."),
      divider(),
      pageBreak(),

      // ── CH 6: AI ENGINE ───────────────────────────────────────────────────────────
      h1("Chapter 6 – The AI Engine"),

      h2("6.1 What Is Actually AI vs. Simulated"),
      p("This is a critical distinction. PortFlow OS has one genuinely functional AI integration and several simulated AI features:"),

      h3("REAL: AI Insights Chat (/ai-logs)"),
      p("The AI chat engine is a live integration with Google's Gemini API (gemini-3.6-flash model). When a user types a question and presses Send, the following happens:"),
      bullet("The message and conversation history are sent server-side to /api/chat."),
      bullet("The server constructs a request to the Gemini API with a custom system prompt that restricts the AI to maritime logistics topics only."),
      bullet("The Gemini model processes the message and either generates a text response or triggers a tool call (function calling)."),
      bullet("If the AI determines the user is asking about freight rates, it calls the get_freight_forecast tool, which injects the actual mock forecast data from maritime-data.ts into the response."),
      bullet("If the AI determines the user is asking about vessel sizing for a specific port, it calls the optimize_vessel tool, which checks the port's draft limits from the Indian East Coast port database and recommends the appropriate vessel class."),
      bullet("The AI's response is streamed back to the client and rendered in the chat interface."),

      h3("SIMULATED: AI Dispatch Log (Live Terminal Feed)"),
      p("The Global AIS & AI Dispatch Log on the Fleet Command dashboard appears to show live IoT data from vessels. In reality, it is generated by the useTelemetry custom hook, which runs a JavaScript interval timer and generates synthetic maritime events (crane lifts, truck arrivals, cargo discharges) using random selection from predefined templates."),

      h3("SIMULATED: AI Bottleneck Alerts"),
      p("The Active Bottlenecks panel fetches data from /api/dashboard/bottlenecks, which returns hardcoded JSON alert objects. The 'DEPLOY AI FIX' button triggers a visual resolution animation but does not send any actual commands to any system."),

      h3("SIMULATED: AI Remediation in Legal & Scenarios"),
      p("The AI Remediation Advice block in the Legal Compliance page and the AI RECOMMENDED tag on Scenario B are hardcoded demonstration content. They represent what a connected AI would generate, but are static strings in the current prototype."),

      h2("6.2 The AI Function Calling Architecture"),
      p("The /api/chat route uses Gemini's function calling feature. Two tools are declared to the model:"),
      bulletBold("get_freight_forecast: ", "Retrieves the 11-week predictive freight rate series from the mock data and formats a recommendation about optimal market entry timing."),
      bulletBold("optimize_vessel: ", "Takes cargo volume (in Metric Tonnes) and destination port name. It cross-references the port's maximum draft against each vessel class's average draft, then recommends the most economical vessel class that can physically enter the port."),

      h2("6.3 Security Guardrails on the AI"),
      p("The system prompt for the AI includes several important restrictions:"),
      bullet("Strict topic enforcement: The AI will only answer maritime logistics questions. Off-topic queries return a fixed refusal message."),
      bullet("System prompt confidentiality: The AI is instructed to refuse any attempts to extract its system prompt or internal configuration."),
      bullet("Prompt injection resistance: The instruction 'ignore previous instructions' or similar jailbreak attempts trigger a hard-coded 'Access Denied' response."),
      divider(),
      pageBreak(),

      // ── CH 7: PAGES & FEATURES ────────────────────────────────────────────────────
      h1("Chapter 7 – Application Pages & Features"),

      h2("7.1 Login Page (/login)"),
      p("The first thing any user sees. The page features:"),
      bullet("A boot sequence animation — text lines render sequentially as the 'system initialises', using a setTimeout chain and state updates. This creates a dramatic, terminal-style entrance."),
      bullet("A progress bar that fills as the boot sequence completes."),
      bullet("The PortFlow OS logo with a glowing anchor icon."),
      bullet("A standard email/password login form connected to /api/auth/login."),
      bullet("Error display for invalid credentials or server errors."),
      bullet("A 'First-time setup?' link that navigates to /setup for new account provisioning."),

      h2("7.2 Setup Page (/setup)"),
      p("A one-time onboarding page for new accounts provisioned by an administrator. The user enters their 6-digit access code (set during admin user creation), then creates their permanent password. This flow calls /api/auth/setup."),

      h2("7.3 Fleet Command Dashboard (/, Main Dashboard)"),
      p("The central operational hub. This page is information-dense, showing real-time operational data across multiple panels:"),

      h3("Header Bar"),
      p("The persistent top bar across all pages shows:"),
      bullet("Active Contracts count (14 multi-voyage, 3 spot)"),
      bullet("Forecast Accuracy percentage (96.8%)"),
      bullet("In-Transit vessel count (2 vessels)"),
      bullet("Delayed alerts (1, >24h)"),
      bullet("CO2 Saved counter (16.6k KG)"),
      bullet("User profile dropdown (top-right) with name, role, clearance, and workspace settings"),
      bullet("A settings modal (triggered from the profile button) offering light/dark mode toggle and other preferences, with state persistence via localStorage"),

      h3("The Global Map (GlobeWrapper)"),
      p("A full-screen-width interactive SVG world map showing:"),
      bullet("Vessel positions as coloured dot markers (Capesize = large, Supramax = small; colour reflects legal compliance score)"),
      bullet("Animated route lines connecting origin ports to destination ports on the Indian East Coast"),
      bullet("Port markers showing name, legal status (Compliant/Review), and handling rate on hover"),
      bullet("A sliding panel (activated by the search button in the top-left corner) that reveals a search bar and the full 'Tracked Vessels' list. Click any vessel to pan and zoom the map to its location."),
      bullet("Zoom in/out and reset controls in the bottom-right corner"),
      bullet("A live LIVE TRACKING: 5 VESSELS indicator"),

      h3("Dwell Time Chart"),
      p("A line chart showing average vessel dwell time (how long ships wait in port before berthing) over the last 7 days. A target line at 24 hours is drawn for reference. An '8% vs. early week' badge shows the trend direction. See Chapter 8 for full chart details."),

      h3("Active Bottlenecks Panel"),
      p("An expandable accordion panel (click the header to open/collapse). When expanded, it shows 5 real-time operational alerts fetched from /api/dashboard/bottlenecks:"),
      bullet("Each alert has a severity level: CRITICAL (red), WARNING (amber), or INFO (blue)."),
      bullet("CRITICAL and WARNING alerts have a 'DEPLOY AI FIX' button that triggers a simulated AI resolution animation."),
      bullet("Each alert card shows the alert title, full description, and how long ago it was raised."),

      h3("Global AIS & AI Dispatch Log"),
      p("An expandable accordion panel (collapsed by default). When expanded, shows a scrolling terminal-style feed of live vessel telemetry events:"),
      bullet("AIS Position Updates (blue Radio icon)"),
      bullet("Draft Measurements (amber Anchor icon)"),
      bullet("Berth Approaches (green Ship icon)"),
      bullet("Cargo Discharge events (purple Terminal icon)"),
      p("Each event shows a timestamp, vessel ID in bold, and a one-line status description. New events are injected every few seconds via the useTelemetry hook."),

      h3("AI Optimizer Panel"),
      p("A full-width panel below the map row offering fleet-level analysis and one-click AI optimisation. Contains two tabs:"),
      bullet("Fleet Overview Tab: Shows all 6 vessels in a table with status, current draft, cargo type, and a per-vessel AI action button."),
      bullet("AI Insights Tab: Shows the Port Infrastructure Compatibility Table — a grid showing which vessel classes (Handysize through Capesize) are compatible with which East Coast ports based on draft limits and LOA. A 'Run Full Fleet Optimisation' button processes all pending contracts and marks them as 'AI Executed'."),

      h3("AI Multi-Voyage Contract Ledger"),
      p("A sortable, searchable table at the bottom of the Fleet Command page listing all active voyage contracts. Features:"),
      bullet("Contract ID, Vessel/Class, Cargo Volume, Global Route (Origin → Destination), Contract Transition type, and Savings breakdown (Predicted vs. Realized)."),
      bullet("Colour-coded status badges: AI Executed (green), Commercial Approval (green), Legal Review Required (amber), Management Approval Pending (blue)."),
      bullet("Click any row to open a slide-over detail drawer on the right side of the screen, showing the full voyage breakdown, draft analysis, commercial/operational scores, and a 3-stage approval workflow."),
      bullet("CSV and PDF export buttons in the top right for data export."),
      bullet("A Search Voyage ID input for quick filtering."),

      h2("7.4 Freight Forecast (/forecast)"),
      p("A three-tab intelligence dashboard for freight market analysis:"),

      h3("Rate Forecast Tab"),
      p("The primary chart shows an 11-week time series of bulk freight rates (USD per Metric Tonne) from October through December. The chart clearly distinguishes between:"),
      bullet("Actual Rates (teal solid line with dots)"),
      bullet("Predicted Backtest (yellow/amber dashed line — what the AI model predicted for past dates, showing accuracy)"),
      bullet("Future Predictions (dotted teal line)"),
      bullet("Confidence Band (grey shaded area between upper and lower bound)"),
      p("Below the chart, key statistics are shown: current spot rate ($15.90/MT), predicted low ($14.90/MT), predicted peak ($17.20/MT), and forecast accuracy score."),
      p("A Market Alert subscription system allows users to subscribe to automatic notifications (email or in-app toast) when the freight rate drops to their target level."),

      h3("Seasonality Tab"),
      p("A grouped bar chart showing freight rates by month across 2024 (actual), 2025 (actual), and 2026 (predicted). This reveals the seasonal pattern — rates spike in June–August due to Indian monsoon-related port congestion and pre-monsoon demand rush."),

      h3("Macro Volatility Tab"),
      p("A single line chart showing the Macro Volatility Index (0–100 scale) over 5 months. A spike to 92 near the current date (November 5) reflects geopolitical and weather-related disruptions. The chart includes a risk band background (green/amber/red zones)."),

      h2("7.5 Chartering Intelligence (/chartering)"),
      p("A dual-panel page for vessel chartering decisions:"),
      bullet("Left Panel: The 'Vessel Size Calculator' — an interactive form where a user enters a Cargo Volume (MT), selects a Destination Port from a dropdown, and clicks 'CALCULATE OPTIMAL CHARTER'. The optimizer (src/lib/optimizer.ts) evaluates all vessel classes against the port's infrastructure constraints and returns a recommendation with cost breakdown, carbon footprint, and a Confidence Score."),
      bullet("Right Panel: The 'Model Performance & Backtesting' chart — a bar chart showing how accurately the AI model's predicted freight savings matched the realized savings across historical contracts."),
      bullet("The chartering page also includes a Market Alert system and an Alert History panel below the main content."),

      h2("7.6 Scenarios (/scenarios)"),
      p("A side-by-side scenario comparison tool for strategic decision-making:"),
      bullet("Scenario A (CURRENT PLAN): Immediate spot contract at the current market rate of $16.10/MT — total cost of $19.32M."),
      bullet("Scenario B (AI RECOMMENDED): Wait 3 weeks for the AI-predicted freight rate dip to $14.80/MT — saving $1.56M."),
      bullet("Scenario C: User-created custom scenario (via the 'Add New Scenario' button and modal form). Custom scenarios are persisted to localStorage so they survive page refreshes."),
      bullet("Each scenario card shows: Strategy, Volume, Timing, Rate, Total Cost, Trade-offs (colour-coded pros/cons), and a large Execute button to commit to the scenario."),
      bullet("The 'AI RECOMMENDED' badge on Scenario B has a pulsing green dot indicator."),

      h2("7.7 Legal Compliance (/legal)"),
      p("A two-tab compliance tool for voyage legal screening:"),

      h3("Vessel Compliance Check Tab"),
      p("Left panel: A form to input Voyage Particulars — Vessel name, Destination Port, Cargo Type, and Charter Party type. The 'GENERATE COMPLIANCE REPORT' button triggers a 2-second simulated AI scanning animation. Right panel: The Compliance Scorecard table, which shows 9 legal parameters (Vessel regulatory status, Port eligibility, Charter licence requirement, Maritime claims, Cargo documentation, Environmental compliance, Sanctions screening, Contractual risk, Insurance/P&I) with individual COMPLIANT or REVIEW status badges. An AI Remediation Advice panel appears at the bottom explaining the legal risks in plain English. An overall score of 86/100 is shown."),

      h3("Charter Party Clause Analysis Tab"),
      p("Left panel: A large text input where a user pastes charter party clauses (the legal contract governing a voyage). Right panel: The AI Risk Assessment panel showing categorised risks identified in the clauses — e.g., 'High Risk: Force Majeure Ambiguity' (including port congestion in force majeure nullifies demurrage claims under GENCON 94)."),

      h2("7.8 Risk Centre (/risk)"),
      p("A two-panel maritime legal research tool:"),

      h3("Vessel Admiralty Search"),
      p("A search form for looking up a vessel by name to check its legal standing. Returns IMO number, flag state, arrest status, a claim history table (date, claim type, status, amount), and admiralty notes referencing applicable Indian maritime law. Quick-filter buttons below the search bar let users jump to common queries: 'High-Risk Flags', 'Sanctions Check', 'Recent Arrests', 'Open Claims'."),

      h3("Maritime Case Law AI"),
      p("A search form that accepts natural language legal queries (e.g., 'force majeure port congestion'). Returns relevant case law citations with case name, topic, legal summary, and relevance rating. Quick-filter buttons let users jump to: 'Force Majeure', 'Demurrage Exceptions', 'Safe Port Warranty', 'LOI Claims'."),

      h2("7.9 AI Insights (/ai-logs)"),
      p("The main AI chat interface. Features:"),
      bullet("A terminal-style chat window with alternating user (cyan bubbles) and AI model (dark panel) messages."),
      bullet("Full conversation history persisted in ChatContext (survives navigation between pages in the same session)."),
      bullet("A 'Clear Conversation' button."),
      bullet("Quick question chips for common queries: 'What vessel should I charter for 180,000 MT to Paradip?', 'What is the current freight outlook for November?', 'Is Haldia suitable for a Capesize?', 'Explain the IMO 2020 sulphur cap impact on freight rates.'"),
      bullet("Input field with Enter key support."),
      bullet("Real-time loading indicator (three bouncing dots) while the AI is processing."),
      bullet("Error display if the Gemini API call fails."),

      h2("7.10 Admin Panel (/admin)"),
      p("Accessible only to users with role GOV-AUTH. Features:"),
      bullet("A table of all registered users in the system fetched from /api/admin/users."),
      bullet("A 'Provision New User' form that creates a new user account with a one-time setup code. The new user then uses the /setup page to set their permanent password."),
      bullet("Role, clearance level, and department selection during provisioning."),
      divider(),
      pageBreak(),

      // ── CH 8: CHARTS ─────────────────────────────────────────────────────────────
      h1("Chapter 8 – Charts & Data Visualisations"),

      h2("8.1 Dwell Time Chart (DwellTimeChart.tsx)"),
      p("Type: Line Chart (Recharts LineChart). Location: Fleet Command dashboard, top-right panel."),
      p("Data: 7-day time series of average vessel dwell time in hours. Generated as mock data. The chart renders a single line for Average Dwell Time (hrs) and a horizontal reference line at 24 hours (the operational target). A custom tooltip shows the exact value on hover. The line itself is teal (cyan-400), and the reference line is amber."),
      p("Purpose: Helps operations managers identify trends in port turnaround efficiency. Rising dwell times indicate congestion or berthing conflicts."),

      h2("8.2 Freight Rate Forecast Chart (FreightForecastChart.tsx)"),
      p("Type: Composite Line + Area Chart (Recharts ComposedChart). Location: Freight Forecast page, Rate Forecast tab."),
      p("The chart plots 5 data series simultaneously:"),
      bullet("Actual Rate — solid teal line with dot markers (historical only)"),
      bullet("Predicted Backtest — dashed amber line (overlaps with historical; shows AI accuracy)"),
      bullet("Future Forecast — dotted teal line (future dates only)"),
      bullet("Upper Bound Confidence — transparent fill line"),
      bullet("Lower Bound Confidence — transparent fill line with a shaded area between upper and lower"),
      p("A vertical dashed line at 'Nov 05' marks the present day, separating history from forecast. A custom tooltip renders all active values in a styled dark panel."),

      h2("8.3 Seasonality Chart (within FreightForecastChart)"),
      p("Type: Grouped Bar Chart (Recharts BarChart). Location: Freight Forecast page, Seasonality tab."),
      p("Shows 3 grouped bars for each month (2024, 2025, 2026 predicted). Uses colour coding: blue for 2024, amber for 2025, teal for 2026. Reveals the June–August monsoon spike pattern in Indian east coast freight rates."),

      h2("8.4 Macro Volatility Index Chart (MacroVolatilityChart.tsx)"),
      p("Type: Area Chart (Recharts AreaChart). Location: Freight Forecast page, Macro Volatility tab."),
      p("Plots a 0–100 volatility index over 5 months with a gradient fill. Background reference bands divide the chart into green (0–40, stable), amber (40–70, elevated), and red (70–100, high volatility) risk zones. The chart spikes to 92 around November 2026, reflecting the simulated geopolitical disruption scenario."),

      h2("8.5 Model Performance Panel (ModelPerformancePanel.tsx)"),
      p("Type: Bar Chart (Recharts BarChart). Location: Chartering Intelligence page."),
      p("Two bars per contract: Predicted Savings (grey) vs. Realized Savings (teal/green). Demonstrates the accuracy of the AI's savings predictions against what was actually achieved in historical contracts."),

      h2("8.6 Port Infrastructure Compatibility Table (PortInfraTable.tsx)"),
      p("Type: Static HTML table. Location: AI Optimizer Panel on the Fleet Command page."),
      p("This is not a chart but a data table cross-referencing vessel classes (rows) with ports (columns). Each cell shows a green tick (vessel can enter), amber warning (marginal — lightering required), or red cross (vessel cannot enter). The data is derived from the hard-coded Indian East Coast port constraint data in maritime-data.ts."),
      divider(),
      pageBreak(),

      // ── CH 9: UI/UX DESIGN ────────────────────────────────────────────────────────
      h1("Chapter 9 – UI/UX Design System"),

      h2("9.1 Design Philosophy"),
      p("PortFlow OS uses an 'Operational Terminal' aesthetic — dark, high-information-density, monospace typography for data, and clean sans-serif for prose. The visual language is deliberately inspired by real maritime operations control rooms: high contrast, minimal decoration, maximum data visibility."),

      h2("9.2 Colour Palette (Dark Mode — Default)"),
      bulletBold("Background: ", "#0a0a0a (near-black) with neutral-900/50 panel overlays."),
      bulletBold("Panels (minimal-panel): ", "Subtle neutral-800/40 border with a backdrop-blur frosted glass effect."),
      bulletBold("Primary Accent (Operational): ", "Cyan-400 (#22d3ee) — used for selected states, active indicators, and links."),
      bulletBold("Success / AI Executed: ", "Emerald-400 (#34d399) — used for positive states and AI actions."),
      bulletBold("Warning: ", "Amber-400 (#fbbf24) — for caution indicators."),
      bulletBold("Critical / Error: ", "Rose-400 (#fb7185) — for critical alerts."),
      bulletBold("Data Text: ", "Neutral-300 (#d4d4d4) for primary data, Neutral-500 (#737373) for labels."),

      h2("9.3 Colour Palette (Light Mode)"),
      p("Light mode is implemented entirely via a .light-mode class applied to the <html> tag, with CSS overrides in globals.css. Key mappings:"),
      bulletBold("Backgrounds: ", "Warm off-white (#faf9f7, #f5f5f4, #f0ede8) — cream and stone tones, not pure white."),
      bulletBold("Panel backgrounds: ", "Stone-50/50 (#fdfcfb with 50% opacity) with frosted glass."),
      bulletBold("Text overrides: ", "text-white → stone-800, text-neutral-300 → stone-700, text-neutral-500 → stone-500."),
      bulletBold("Emerald backgrounds: ", "Mapped to #ecfdf5 (emerald-50 pastel) — prevents the neon green 'AI RECOMMENDED' badge from looking harsh."),

      h2("9.4 Typography"),
      bulletBold("Geist Sans: ", "The primary UI font. Used for all prose, labels, and descriptions."),
      bulletBold("Geist Mono: ", "The monospace data font. Used for contract IDs, timestamps, values, status badges, and all 'terminal' elements. Tracking (letter-spacing) is applied: tracking-widest on all uppercase labels."),
      bulletBold("Hierarchy: ", "text-lg font-semibold for page titles; text-sm font-medium uppercase tracking-wide for section headers; text-xs uppercase tracking-widest for badges and micro-labels."),

      h2("9.5 Component Design"),
      bulletBold("minimal-panel: ", "The CSS class applied to every card/panel. It applies a subtle border, a dark translucent background, a hover scale transform (scale-[1.005]), and a hover border colour shift — giving the interface a tactile, interactive feel without being distracting."),
      bulletBold("focus-ring: ", "A custom focus class that replaces the browser's default outline with a styled ring using outline-offset. Applied to all interactive elements for keyboard accessibility."),
      bulletBold("btn-sweep: ", "A CSS animation class on primary action buttons that creates a light-shimmer sweep effect on hover — a premium micro-interaction that reinforces that an action is about to be taken."),
      bulletBold("animate-slide-in: ", "Applied to list items and cards as they render. Animates from below with a cubic-bezier spring ease, creating a staggered, living entrance effect."),
      bulletBold("animate-page-enter: ", "Applied to the outermost wrapper of each page. Creates a fade-in + translateY(12px) entrance animation on every page navigation."),

      h2("9.6 Responsive Design"),
      p("The layout is fully responsive:"),
      bullet("On mobile (<1280px width), the Fleet Command dashboard stacks vertically — the map takes full width, and the side panels stack below it."),
      bullet("On desktop (xl: breakpoint, ≥1280px), the classic two-column layout is applied: map on the left (w-2/3) and side panels on the right (w-1/3)."),
      bullet("The Sidebar is always visible. On mobile, it may need to be converted to a slide-out drawer (a production improvement)."),
      divider(),
      pageBreak(),

      // ── CH 10: USER NAVIGATION WALKTHROUGH ────────────────────────────────────────
      h1("Chapter 10 – User Navigation Walkthrough"),
      p("This chapter describes the full journey a typical Freight Manager (role: MGR-01) would take through the application:"),

      h2("Step 1: Login"),
      p("The user navigates to the application URL. They are immediately redirected to /login by the middleware (since they have no session cookie). They watch the boot sequence animation, then enter their email and password. Upon successful login, they are redirected to the Fleet Command dashboard (/)."),

      h2("Step 2: Fleet Command — Morning Operations Check"),
      p("The header bar gives an instant situational overview: 14 active multi-voyage contracts, 96.8% forecast accuracy, 2 vessels in transit, 1 vessel delayed >24h. The manager scrolls down to check the map: the 5 tracked vessels are visible as moving dots. They click the Search button to open the slide-out panel and click 'Oceanic Pioneer' to pan the map to its current position. They note it is anchored off Sagar-Sandheads, waiting for a tidal window."),
      p("They expand the 'Active Bottlenecks' accordion and see the CRITICAL 'Draft & Berth Conflict' alert. They click 'DEPLOY AI FIX' to acknowledge and log the issue, then collapse the panel."),

      h2("Step 3: Freight Forecast — Checking the Market"),
      p("The manager clicks 'Freight Forecast' in the sidebar under INTELLIGENCE. The forecast chart loads, showing rates are currently at $15.90/MT and predicted to dip to $14.90/MT in 5 weeks. They click the Seasonality tab to confirm this is not just noise — the pattern shows rates typically drop in December. They subscribe to a Market Alert at $15.50/MT so they are notified when rates fall to their target."),

      h2("Step 4: Scenarios — Making a Decision"),
      p("They navigate to /scenarios. The AI-recommended Scenario B (Wait 3 Weeks) is highlighted with a pulsing dot. The cost comparison clearly shows it saves $1.56M versus executing immediately. The manager decides to wait. They click 'EXECUTE THIS SCENARIO' on Scenario B, which logs the decision."),

      h2("Step 5: Legal — Checking the Vessel"),
      p("Before the next voyage, they need to confirm the vessel is legally compliant. They navigate to /legal, select 'MV Pacific Horizon' from the vessel dropdown, set destination to 'Sagar-Sandheads' and cargo to 'Iron Ore', and click 'GENERATE COMPLIANCE REPORT'. The scanner runs for 2 seconds. The Compliance Scorecard shows 86/100, with 'Charter Licence Requirement' and 'Cargo Documentation' flagged for REVIEW. The AI Remediation Advice explains what steps are needed."),

      h2("Step 6: AI Chat — Quick Question"),
      p("The manager has a quick question. They click 'AI Insights' in the sidebar. They type 'Is Paradip suitable for a Capesize vessel loading 150,000 MT?' The AI processes the question, calls the optimize_vessel function internally, and responds: 'Paradip's maximum draft is 14.5m, while a Capesize has an average draft of 18.0m. I recommend 2x Panamax vessels instead, or route through Dhamra (18.0m max draft) for a direct Capesize call.'"),

      h2("Step 7: Admin — Provisioning a New User (GOV-AUTH only)"),
      p("The system administrator (role: GOV-AUTH) navigates to /admin. They click 'Provision New User', fill in the new analyst's name, email, role (ANL-04), department, and clearance level, and submit. The system creates the account and displays the one-time 6-digit setup code, which the admin shares with the new user out-of-band (e.g., via email). The new user then visits /setup, enters the code, and sets their password."),
      divider(),
      pageBreak(),

      // ── CH 11: API REFERENCE ──────────────────────────────────────────────────────
      h1("Chapter 11 – API Endpoints Reference"),

      h2("Authentication Routes"),
      bulletBold("POST /api/auth/login: ", "Accepts { email, password }. Returns user object + sets HttpOnly session cookie. Rate-limited to 5 attempts per IP per 15 minutes."),
      bulletBold("POST /api/auth/logout: ", "Clears the session cookie. Accessible to all authenticated users."),
      bulletBold("GET /api/auth/me: ", "Returns the currently authenticated user's profile (id, email, name, role, clearance). Used by the Header and Sidebar to display user info."),
      bulletBold("POST /api/auth/setup: ", "Accepts { setupCode, newPassword }. Validates the one-time code and creates the user's permanent password hash."),

      h2("Dashboard Routes"),
      bulletBold("GET /api/dashboard/metrics: ", "Returns aggregate KPIs for the header bar (contract counts, forecast accuracy, alert count, carbon saved)."),
      bulletBold("GET /api/dashboard/bottlenecks: ", "Returns the list of 5 operational alert objects for the BottleneckAlerts component."),
      bulletBold("GET /api/dashboard/dwell-trends: ", "Returns 7-day dwell time data for the DwellTimeChart component."),

      h2("AI Route"),
      bulletBold("POST /api/chat: ", "Accepts { message: string, history: ChatMessage[] }. Proxies to the Gemini API with the maritime system prompt and function declarations. Returns { reply: string }."),

      h2("Admin Routes"),
      bulletBold("GET /api/admin/users: ", "Returns the list of all provisioned user accounts. Requires GOV-AUTH role."),
      bulletBold("POST /api/admin/users: ", "Creates a new user account with a generated setup code. Requires GOV-AUTH role."),
      divider(),
      pageBreak(),

      // ── CH 12: RBAC ───────────────────────────────────────────────────────────────
      h1("Chapter 12 – Role-Based Access Control"),
      p("Access to application pages is controlled by the Role-Based Access Control (RBAC) system in src/middleware.ts. Five roles are defined, each with a different set of accessible pages:"),

      bulletBold("DIR-12 (Director): ", "Full access — /, /forecast, /legal, /risk, /chartering, /scenarios, /ai-logs. The most senior operational role."),
      bulletBold("MGR-01 (Freight Manager): ", "Access to /, /forecast, /legal, /chartering, /scenarios. No access to the Risk Centre or AI Logs."),
      bulletBold("ANL-04 (Analyst): ", "Access to /forecast, /risk, /ai-logs. No access to the main dashboard, legal, chartering, or scenarios."),
      bulletBold("OPS-09 (Operations): ", "Access to / (Fleet Command) only. View-only operational awareness."),
      bulletBold("GOV-AUTH (Government Authority): ", "Access to /admin only. This role is for port authority or regulatory inspectors who need to audit user accounts."),
      p("If a user attempts to navigate to a page not in their allowed list, the middleware intercepts the request and redirects them to their highest-priority allowed page instead of showing a 403 error."),
      divider(),
      pageBreak(),

      // ── CH 13: MARITIME DOMAIN ────────────────────────────────────────────────────
      h1("Chapter 13 – Maritime Data & Domain Knowledge"),

      h2("13.1 Indian East Coast Ports"),
      p("The application contains a detailed database of 7 major Indian East Coast ports used for bulk cargo (coal, iron ore, fertilizers). Each port record includes:"),
      bulletBold("Haldia: ", "Max draft 8.5m, 12,000 MT/day handling. Restricted to smaller vessels (Handysize/Supramax). West Bengal."),
      bulletBold("Sagar-Sandheads: ", "Max draft 20.0m, 25,000 MT/day handling. Deepwater anchorage suitable for Capesize. Tidal bar constraint."),
      bulletBold("Paradip: ", "Max draft 14.5m, 40,000 MT/day. Can accommodate Panamax. Cyclone warning zone. Odisha."),
      bulletBold("Dhamra: ", "Max draft 18.0m, 50,000 MT/day. Deepwater, can accommodate Capesize. Cyclone warning zone."),
      bulletBold("Vizag (Visakhapatnam): ", "Max draft 14.5m, 35,000 MT/day. Andhra Pradesh."),
      bulletBold("Gangavaram: ", "Max draft 18.5m, 50,000 MT/day. Deepest port on the east coast. Andhra Pradesh."),
      bulletBold("Gopalpur: ", "Max draft 12.5m, 20,000 MT/day. Smaller facility. Odisha."),

      h2("13.2 Vessel Classes"),
      bulletBold("Handysize (35,000 MT): ", "Smallest bulk carrier. Avg draft 9.5m. Most flexible — can access all ports."),
      bulletBold("Supramax (55,000 MT): ", "Mid-size. Avg draft 12.0m. $18/MT base rate. Good versatility."),
      bulletBold("Panamax (80,000 MT): ", "Largest vessel that can transit the original Panama Canal. Avg draft 13.5m. $15/MT base rate."),
      bulletBold("Capesize (180,000 MT+): ", "Largest bulk carrier. Avg draft 18.0m. Can only access Sagar-Sandheads, Dhamra, and Gangavaram. $12/MT base rate (cheapest per tonne at scale). Named for routing around the Cape of Good Hope."),

      h2("13.3 Key Maritime Concepts in the App"),
      bulletBold("Demurrage: ", "A charge payable to the ship owner when the charterer fails to complete cargo loading/discharging within the agreed laytime (time allowance). The bottleneck alerts prominently warn about demurrage risk. Current rate: ~$15,000–$80,000/day."),
      bulletBold("Laytime: ", "The agreed time window (in the charter party contract) for cargo operations. Once exceeded, demurrage starts accruing."),
      bulletBold("Lightering: ", "When a fully loaded vessel is too deep to enter a shallow port, it must transfer part of its cargo to smaller vessels offshore before proceeding. A $4.50/MT penalty is built into the optimizer."),
      bulletBold("Charter Party: ", "The legal contract between a shipowner and a cargo owner (charterer) governing the hire of a vessel. GENCON 94 is the standard charter party form referenced in the app."),
      bulletBold("AIS (Automatic Identification System): ", "Transponders on all commercial vessels broadcasting position, speed, and heading. The Global AIS & AI Dispatch Log simulates this data feed."),
      bulletBold("P&I (Protection & Indemnity): ", "Marine liability insurance. The vessel manifest shows each vessel's P&I club (e.g., UK P&I, Gard, Skuld)."),
      bulletBold("LOA (Length Overall): ", "The total length of a vessel from bow to stern. Ports have maximum LOA limits for their berths."),
      divider(),
      pageBreak(),

      // ── CH 14: PRODUCTION ROADMAP ─────────────────────────────────────────────────
      h1("Chapter 14 – Production Readiness & Roadmap"),

      h2("14.1 What is Production-Ready Today"),
      bullet("Authentication system (JWT, bcrypt, HttpOnly cookies, rate limiting, RBAC)"),
      bullet("Database schema design (Prisma + PostgreSQL)"),
      bullet("API route structure (Next.js App Router)"),
      bullet("Live AI chat engine (Gemini function calling)"),
      bullet("Full UI/UX design system (dark/light modes, responsive layout, animations)"),
      bullet("All page layouts and user flows"),
      bullet("Role-based access control middleware"),

      h2("14.2 What Needs to Be Built for Full Production"),

      h3("Real-Time Data Integration"),
      bullet("Replace mock data in PortFlowContext with live API calls to maritime data providers (Spire Maritime, MarineTraffic, LMIS, Baltic Exchange freight indices)."),
      bullet("Replace useTelemetry mock with a real WebSocket or Server-Sent Events connection to an AIS data stream."),
      bullet("Connect dashboard metrics endpoint to real database queries."),

      h3("AI Enhancement"),
      bullet("Replace mock bottleneck detection with a real-time rules engine that evaluates live vessel and port data against configurable thresholds."),
      bullet("Implement actual AI scenario generation using Gemini with access to live freight data."),
      bullet("Add AI memory and context retention across sessions using a vector database (e.g., Pinecone or pgvector)."),

      h3("Infrastructure & DevOps"),
      bullet("Deploy on Vercel (frontend/API) with a Neon or Supabase (PostgreSQL) backend."),
      bullet("Set up environment variable management for GEMINI_API_KEY, DATABASE_URL, PORTFLOW_JWT_SECRET."),
      bullet("Replace in-memory rate limiter with Redis (Upstash) for distributed rate limiting."),
      bullet("Add structured logging (Sentry or Datadog) for production error tracking."),
      bullet("Add end-to-end tests (Playwright) for the authentication flow and critical user journeys."),

      h3("Legal & Compliance"),
      bullet("Integrate with actual sanctions databases (UN, OFAC, EU)."),
      bullet("Connect to Lloyd's Intelligence vessel history API for real admiralty records."),
      bullet("Add proper data residency controls for sensitive commercial data."),

      h2("14.3 Scaling Considerations"),
      bullet("The PortFlowContext in-memory state would need to be replaced with a proper server-side cache (Redis) once multiple concurrent users need to see consistent data."),
      bullet("PDF generation with jsPDF currently happens in the browser. For large documents, this should move server-side."),
      bullet("The AI chat rate limits should be implemented per user (not just per IP) to prevent individual users from exceeding API quotas."),

      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 600, after: 200 },
        children: [new TextRun({ text: "— End of Document —", italics: true, size: 22, color: "888888" })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "PortFlow OS • Prototype v0.1.0 • September 2026", size: 18, color: "aaaaaa" })]
      }),
    ]
  }]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("PortFlow_OS_Documentation.docx", buffer);
  console.log("Document created: PortFlow_OS_Documentation.docx");
});
