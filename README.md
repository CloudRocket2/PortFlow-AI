# ⚓ PortFlow 

**Next-Generation Terminal Operating System (TOS) & Digital Twin**  
*Built for Smart India Hackathon (SIH)*

PortFlow is an advanced, AI-powered maritime logistics platform designed to optimize port operations on India's East Coast (Paradip, Vizag, Gangavaram, etc.). It addresses critical bottlenecks in bulk cargo management, yard density, and multi-modal logistics using real-time physics simulation and autonomous AI.

---

## ✨ Key Features

- **🌐 Interactive 3D Digital Twin**: A fully interactive, real-time 3D visualization of the container yard built with React Three Fiber. Allows operators to view heatmap distributions of container weight and dwell times.
- **🧠 Autonomous AI Optimizer**: Background worker powered by **Google Gemini 3.6 Flash**. It continuously monitors yard telemetry, detects physics/stacking violations (e.g., heavy containers stacked on light ones), and automatically reallocates positions to eliminate re-handling.
- **📻 VHF Radio Transcription Logging**: Live, simulated IoT speech-to-text pipeline that captures port radio frequencies (Crane Ops, Port Control, Truck Gates) and logs them simultaneously in **English and Hindi** to overcome loud-environment communication barriers.
- **⚡ Live Bottleneck Detection**: Real-time anomaly scanning for high yard density, stuck trucks, and crane failures.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion
- **3D Engine**: Three.js, React Three Fiber (R3F)
- **Database**: Neon (Serverless Postgres), Prisma ORM
- **AI Engine**: Google GenAI SDK (Gemini)

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd port-optimizer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="your-neon-postgres-connection-string"
GEMINI_API_KEY="your-google-gemini-api-key"
```

### 4. Database Setup
Push the schema to your Neon database and seed the initial terminal data:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment (Vercel)

This project is perfectly configured for **Vercel**. 
1. Import the repository into Vercel.
2. Add `DATABASE_URL` and `GEMINI_API_KEY` to the Vercel Environment Variables.
3. Deploy! The `package.json` includes a Prisma `postinstall` script to ensure database client generation in the cloud.
