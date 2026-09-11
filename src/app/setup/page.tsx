"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Terminal, ShieldCheck } from "lucide-react";

export default function SetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", setupCode: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push(data.redirect || "/");
      } else {
        setError(data.error || "Setup failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full max-w-md space-y-6 animate-page-enter">
        <div className="flex flex-col items-center justify-center space-y-2 mb-8">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 mb-2">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">First-Time Setup</h1>
          <p className="text-neutral-400 text-sm">Secure your provisioned identity.</p>
        </div>

        <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 p-8 rounded-2xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1 uppercase">Assigned Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder-neutral-600"
                placeholder="director@gov.in"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1 uppercase">6-Digit Setup Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={formData.setupCode}
                onChange={(e) => setFormData({ ...formData, setupCode: e.target.value })}
                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder-neutral-600 tracking-widest font-mono"
                placeholder="123456"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-500 mb-1 uppercase">Create Custom Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-black/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-white placeholder-neutral-600"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors py-3 rounded-lg text-sm font-bold tracking-wider uppercase disabled:opacity-50"
            >
              {loading ? "Securing Identity..." : "Complete Setup"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
