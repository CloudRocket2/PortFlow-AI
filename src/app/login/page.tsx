"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Fingerprint, Key, Anchor, Lock, Briefcase, LineChart, Globe } from "lucide-react";

type Role = {
  id: string;
  email: string;
  title: string;
  clearance: string;
  department: string;
  features: string[];
  icon: any;
  accent: string;
  accentBg: string;
};

const ROLES: Role[] = [
  {
    id: "DIR-12",
    email: "director@portflow.com",
    title: "Fleet Director",
    clearance: "LEVEL 5 — OMEGA",
    department: "Executive Operations",
    features: [
      "Global Bulk Radar",
      "Fleet Chartering",
      "Market Forecast",
      "Multi-Voyage Ledger",
      "Portfolio Scenarios",
      "AI Assistant",
    ],
    icon: Shield,
    accent: "text-cyan-400",
    accentBg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "MGR-01",
    email: "chartering@portflow.com",
    title: "Chartering Manager",
    clearance: "LEVEL 3 — DELTA",
    department: "Commercial Chartering",
    features: [
      "Fleet Chartering",
      "Multi-Voyage Ledger",
      "Portfolio Scenarios",
    ],
    icon: Briefcase,
    accent: "text-emerald-400",
    accentBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "ANL-04",
    email: "analyst@portflow.com",
    title: "Freight Analyst",
    clearance: "LEVEL 3 — DELTA",
    department: "Market Intelligence",
    features: [
      "Market Forecast",
      "Risk Mitigation Alerts",
      "AI Assistant",
    ],
    icon: LineChart,
    accent: "text-amber-400",
    accentBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "OPS-09",
    email: "ops@portflow.com",
    title: "Vessel Operations",
    clearance: "LEVEL 2 — BETA",
    department: "Logistics",
    features: [
      "Global Bulk Radar",
      "AIS Dispatch Log",
      "Anchorage Delays",
    ],
    icon: Globe,
    accent: "text-violet-400",
    accentBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "GOV-AUTH",
    email: "authority@gov.in",
    title: "Port Authority",
    clearance: "LEVEL 6 — SIGMA-PRIME",
    department: "Ministry of Ports",
    features: [
      "Enterprise Provisioning",
      "Personnel Roster",
      "Identity Management",
    ],
    icon: Shield,
    accent: "text-indigo-400",
    accentBg: "bg-indigo-500/10 border-indigo-500/20",
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES[0]);
  const [authenticating, setAuthenticating] = useState(false);
  const [progress, setProgress] = useState("");

  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail(selectedRole.email);
    setPassword("");
    setError("");
  }, [selectedRole]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthenticating(true);
    setProgress("Initiating secure handshake...");
    setError("");

    setTimeout(() => setProgress("Verifying credentials..."), 600);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setProgress("Access Granted.");
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setAuthenticating(false);
        setError(data.message || "Authentication failed");
        setProgress("");
      }
    } catch {
      setAuthenticating(false);
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-black relative">

      {/* Animated Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none animated-grid" />

      {/* Scanline Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none scanlines" />

      <div className="w-full max-w-5xl z-10 flex flex-col gap-6 animate-page-enter">

        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center mb-3">
            <Anchor className="w-5 h-5 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-[0.25em] text-white">
            PortFlow OS
          </h1>
          <p className="text-sm text-neutral-500">
            Secure terminal authentication
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* Left Column: Role Selector */}
          <div className="lg:col-span-5 minimal-panel flex flex-col h-[480px]">
            <div className="px-5 py-3.5 border-b border-neutral-800/60">
              <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                Select Identity Profile
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar p-2 space-y-1">
              {ROLES.map((role) => {
                const isSelected = selectedRole.id === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => {
                      if (!authenticating) {
                        setSelectedRole(role);
                        setEmail(role.email);
                      }
                    }}
                    disabled={authenticating}
                    className={`focus-ring w-full text-left p-4 flex items-center gap-4 transition-all duration-200 rounded-lg border ${
                      isSelected
                        ? `${role.accentBg} border`
                        : "border-transparent hover:bg-white/[0.03] hover:border-neutral-800/60"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg ${isSelected ? role.accentBg : "bg-neutral-900 border border-neutral-800"} flex items-center justify-center shrink-0`}>
                      <role.icon className={`w-4 h-4 ${isSelected ? role.accent : "text-neutral-600"}`} />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-base font-semibold ${isSelected ? "text-white" : "text-neutral-300"}`}>
                        {role.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
                        {role.email}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Details & Auth */}
          <div className="lg:col-span-7 minimal-panel h-[480px] flex flex-col">
            <div className="px-5 py-3.5 border-b border-neutral-800/60 flex justify-between items-center">
              <h2 className="text-sm font-medium uppercase tracking-wide text-neutral-500">
                Clearance Matrix
              </h2>
              <span className={`text-xs font-mono uppercase tracking-widest px-2.5 py-1 rounded-md border ${selectedRole.accentBg} ${selectedRole.accent}`}>
                {selectedRole.clearance}
              </span>
            </div>

            <form onSubmit={handleLogin} className="p-6 flex-1 flex flex-col">

              <div className="flex-1 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-neutral-500 mb-2 block">Operator Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="focus-ring w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-base font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      placeholder="Enter email..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-neutral-500 mb-2 block">Security Passkey</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password..."
                      className="focus-ring w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-base font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm text-neutral-500 mb-3">Authorized Modules</div>
                  <ul className="grid grid-cols-2 gap-2.5">
                    {selectedRole.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2.5 animate-slide-in" style={{ animationDelay: `${i * 0.06}s` }}>
                        <div className={`w-1.5 h-1.5 rounded-full ${selectedRole.accent.replace("text-", "bg-")} shrink-0`} />
                        <span className="text-sm text-neutral-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Login Button Area */}
              <div className="pt-5 mt-auto border-t border-neutral-800/60">
                {error && (
                  <div className="text-rose-400 text-sm mb-4 text-center border border-rose-900/40 bg-rose-900/10 py-2.5 rounded-lg">
                    {error}
                  </div>
                )}

                {authenticating ? (
                  <div className="flex flex-col gap-3">
                    <div className="h-12 border border-neutral-800 bg-neutral-900/50 relative overflow-hidden flex items-center justify-center rounded-lg">
                      <div className="absolute inset-0 bg-white/5 animate-pulse" />
                      <span className="text-sm font-mono text-white relative z-10 flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 animate-bounce" />
                        Authenticating...
                      </span>
                    </div>
                    <p className="text-xs font-mono text-neutral-500 text-center">
                      {progress}
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="focus-ring btn-sweep w-full h-12 bg-white text-black font-medium text-base uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2.5 rounded-lg"
                  >
                    <Key className="w-4 h-4" />
                    Initialize Session
                  </button>
                )}
                
                <div className="mt-4 text-center">
                  <a href="/setup" className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-widest font-mono">
                    New Identity? First-Time Setup
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
