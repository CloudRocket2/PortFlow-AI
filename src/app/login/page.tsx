"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, Fingerprint, Terminal, Key, Database, Anchor, Lock } from "lucide-react";

type Role = {
  id: string;
  email: string;
  title: string;
  clearance: string;
  department: string;
  features: string[];
  icon: any;
};

const ROLES: Role[] = [
  {
    id: "DIR-01",
    email: "director@portflow.com",
    title: "Terminal Director",
    clearance: "LEVEL 5 (OMEGA)",
    department: "Executive Operations",
    features: [
      "Global Telemetry Dashboard",
      "AI Yard Optimizer (Write Access)",
      "Fleet Chartering & Forecasts",
      "System Overrides",
    ],
    icon: Anchor,
  },
  {
    id: "OPS-04",
    email: "yardmaster@portflow.com",
    title: "Yard Master",
    clearance: "LEVEL 4 (DELTA)",
    department: "Yard Logistics",
    features: [
      "3D Digital Twin Analytics",
      "VHF Radio Transcripts",
      "Container Relocation Queue",
      "AI Optimization Approvals",
    ],
    icon: Database,
  },
  {
    id: "SEC-09",
    email: "security@portflow.com",
    title: "Gate Security",
    clearance: "LEVEL 2 (SIGMA)",
    department: "Access Control",
    features: [
      "Truck Gate Queues",
      "Live License Plate Recognition",
      "Vessel Manifest Read-Only",
    ],
    icon: Shield,
  },
  {
    id: "EQP-12",
    email: "crane.op@portflow.com",
    title: "Crane Operator",
    clearance: "LEVEL 2 (SIGMA)",
    department: "Heavy Machinery",
    features: [
      "Assigned Move Instructions",
      "VHF Radio Comms",
      "Equipment Diagnostics",
    ],
    icon: Terminal,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>(ROLES[0]);
  const [authenticating, setAuthenticating] = useState(false);
  const [progress, setProgress] = useState("");

  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  // When a role is clicked on the left, prefill the email
  useEffect(() => {
    setEmail(selectedRole.email);
    setPassword("admin123"); // Pre-filling for hackathon demo convenience
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
        if (typeof window !== "undefined") {
          localStorage.setItem("portflow_role", data.user.name);
          localStorage.setItem("portflow_clearance", data.user.clearance);
        }
        setTimeout(() => {
          router.push("/");
        }, 800);
      } else {
        setAuthenticating(false);
        setError(data.message || "Authentication failed");
        setProgress("");
      }
    } catch (err) {
      setAuthenticating(false);
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 selection:bg-white selection:text-black">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 flex items-center justify-center">
        <Anchor className="w-[800px] h-[800px] text-neutral-900" />
      </div>

      <div className="w-full max-w-5xl z-10 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 border border-white flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-white">
            PortFlow OS
          </h1>
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
            Secure Terminal Authentication
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Role Selector */}
          <div className="lg:col-span-5 minimal-panel flex flex-col h-[460px]">
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/30">
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Select Identity Profile
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto hide-scrollbar p-2 space-y-2">
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => !authenticating && setSelectedRole(role)}
                  disabled={authenticating}
                  className={`w-full text-left p-4 flex items-center gap-4 transition-colors border ${
                    selectedRole.id === role.id
                      ? "bg-white text-black border-white"
                      : "border-transparent hover:border-neutral-800 text-white"
                  }`}
                >
                  <role.icon className={`w-5 h-5 shrink-0 ${selectedRole.id === role.id ? "text-black" : "text-neutral-500"}`} />
                  <div>
                    <div className="font-mono text-sm font-bold uppercase tracking-wider">{role.title}</div>
                    <div className={`text-[10px] font-mono mt-1 ${selectedRole.id === role.id ? "text-neutral-600" : "text-neutral-500"}`}>
                      {role.email}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Details & Auth */}
          <div className="lg:col-span-7 minimal-panel h-[460px] flex flex-col">
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/30 flex justify-between items-center">
              <h2 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                Clearance Matrix
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-widest text-white border border-neutral-800 px-2 py-1">
                {selectedRole.clearance}
              </span>
            </div>
            
            <form onSubmit={handleLogin} className="p-8 flex-1 flex flex-col">
              
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2 block">Operator Email</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-neutral-700 focus:border-white outline-none text-white font-mono text-sm py-2 transition-colors"
                      placeholder="Enter email..."
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2 block">Security Passkey</label>
                    <input 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-transparent border-b border-neutral-700 focus:border-white outline-none text-white font-mono text-sm py-2 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-3">Authorized Modules</div>
                  <ul className="grid grid-cols-2 gap-3">
                    {selectedRole.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 animate-slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="w-1 h-1 bg-white shrink-0" />
                        <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-wider">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Login Button Area */}
              <div className="pt-6 mt-auto border-t border-neutral-800">
                {error && (
                  <div className="text-red-500 text-xs font-mono uppercase tracking-widest mb-4 text-center border border-red-900/50 bg-red-900/20 py-2">
                    {error}
                  </div>
                )}
                
                {authenticating ? (
                  <div className="flex flex-col gap-3">
                    <div className="h-12 border border-neutral-800 bg-neutral-900/50 relative overflow-hidden flex items-center justify-center">
                      <div className="absolute inset-0 bg-white/10 animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-widest text-white relative z-10 flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 animate-bounce" />
                        Authenticating...
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-neutral-500 text-center uppercase tracking-widest">
                      {progress}
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full h-12 bg-white text-black font-mono text-sm font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3"
                  >
                    <Key className="w-4 h-4" />
                    Initialize Session
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
