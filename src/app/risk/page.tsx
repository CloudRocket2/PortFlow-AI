"use client";

import React, { useState, useEffect } from "react";
import { Search, Radio, Target, AlertTriangle, ShieldCheck, Activity, Map, Globe2, AlertOctagon, Lock, Loader2 } from "lucide-react";

export default function RiskCentrePage() {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [threatFeed, setThreatFeed] = useState([
    { id: 1, type: "WARNING", region: "Red Sea", desc: "Elevated Houthi threat level. War-risk premiums up 45%.", time: "10m ago" },
    { id: 2, type: "CRITICAL", region: "Strait of Malacca", desc: "Piracy boarding reported at 0200Z.", time: "1h ago" },
    { id: 3, type: "INFO", region: "OFAC Sanctions", desc: "US Treasury added 4 entities to SDN list.", time: "3h ago" }
  ]);

  const runGlobalScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
      // Inject a new critical threat dynamically
      setThreatFeed(prev => [
        { id: 4, type: "CRITICAL", region: "Global AIS", desc: "Dark Fleet Pattern Detected: 3 Vessels matching spoofing profiles.", time: "Just now" },
        ...prev
      ]);
    }, 2500);
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-page-enter pb-10">
      {/* Header Info */}
      <div className="minimal-panel px-4 py-3 flex flex-col md:flex-row md:items-center justify-between border-l-2 border-l-rose-500">
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-rose-500" />
          <h1 className="text-lg font-semibold text-white">
            Global Risk & Sanctions Radar
          </h1>
        </div>
        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-2 md:mt-0">
          Dark Fleet Detection | AIS Spoofing | Compliance Watch
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left: Dark Fleet & AIS Spoofing Radar (Larger panel) */}
        <div className="xl:col-span-8 minimal-panel flex flex-col h-[750px] relative overflow-hidden">
          
          <div className="p-6 border-b border-neutral-800 flex justify-between items-center bg-black/40 z-10">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wide font-mono text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                AI Dark Fleet & AIS Spoofing Detector
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                Cross-referencing satellite telemetry gaps with OFAC/UN Sanctions lists
              </p>
            </div>
            
            <button 
              onClick={runGlobalScan}
              disabled={scanning || scanned}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg focus-ring active:scale-[0.97] \${
                scanned ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 btn-sweep"
              }`}
            >
              {scanning ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  CALIBRATING SATELLITES...
                </>
              ) : scanned ? (
                <>
                  <AlertOctagon className="w-3 h-3" />
                  THREATS DETECTED
                </>
              ) : (
                <>
                  <Radio className="w-3 h-3" />
                  RUN DEEP RADAR SCAN
                </>
              )}
            </button>
          </div>

          <div className="flex-1 relative flex flex-col">
            {/* Visual Radar Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none overflow-hidden">
              <div className="w-[800px] h-[800px] rounded-full border border-cyan-900/50 relative">
                <div className="absolute inset-0 rounded-full border border-cyan-900/40 scale-75"></div>
                <div className="absolute inset-0 rounded-full border border-cyan-900/30 scale-50"></div>
                <div className="absolute inset-0 rounded-full border border-cyan-900/20 scale-25"></div>
                {/* Radar sweep line */}
                {scanning && (
                  <div className="absolute top-1/2 left-1/2 w-1/2 h-1 bg-gradient-to-r from-cyan-400/80 to-transparent origin-left animate-spin" style={{ animationDuration: '2s' }}></div>
                )}
              </div>
            </div>

            {!scanned && !scanning && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 z-10">
                <Globe2 className="w-16 h-16 text-neutral-600 mb-6 opacity-50" />
                <h3 className="text-white font-mono uppercase tracking-widest text-sm mb-2">Systems Standby</h3>
                <p className="text-xs text-neutral-500 max-w-md">
                  Initiate a Deep Radar Scan to analyze 45,000+ active bulk carriers for AIS signal manipulation, 
                  identity laundering, and dark port calls over the last 90 days.
                </p>
              </div>
            )}

            {scanning && (
              <div className="flex-1 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-2 border-cyan-500/30 rounded-full"></div>
                  <div className="w-24 h-24 border-t-2 border-cyan-400 rounded-full absolute inset-0 animate-spin" style={{ animationDuration: '1s' }}></div>
                  <Activity className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <div className="font-mono text-cyan-400 text-sm uppercase tracking-widest flex flex-col items-center gap-2">
                  <span>Ping: INMARSAT Data Link</span>
                  <span className="text-neutral-500 text-xs">Analyzing historical vessel tracks...</span>
                  <span className="text-neutral-500 text-xs">Detecting GPS spoofing anomalies...</span>
                </div>
              </div>
            )}

            {scanned && (
              <div className="flex-1 overflow-y-auto p-6 z-10 space-y-4">
                {/* Danger Card */}
                <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-5 hover:bg-rose-950/40 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/50 text-rose-500">
                        <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg font-mono tracking-wide">MV SHADOW TRADER <span className="text-rose-500 text-xs ml-2">[CRITICAL RISK]</span></h3>
                        <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mt-1">IMO: 9345112 | Flag: Comoros</p>
                      </div>
                    </div>
                    <div className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-widest border border-rose-500/30">
                      Dark Fleet Flag
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 rounded-lg p-4 border border-rose-900/50">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 border-b border-rose-900/50 pb-2">AI Detection Logic</h4>
                      <ul className="text-[11px] text-neutral-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 shrink-0"></div>
                          <span><strong>AIS Signal Lost:</strong> Transponder went dark for 72h on Feb 12th in the Arabian Sea.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 shrink-0"></div>
                          <span><strong>GPS Spoofing Detected:</strong> Secondary satellite imagery contradicts AIS broadcast coordinates by 400nm.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1 shrink-0"></div>
                          <span><strong>STS Transfer:</strong> Highly probable Ship-to-Ship transfer of sanctioned cargo.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 border-b border-rose-900/50 pb-2">Compliance Action</h4>
                        <p className="text-[11px] text-neutral-400">
                          Chartering this vessel violates OFAC compliance guidelines and exposes the charterer to secondary sanctions and asset freezes.
                        </p>
                      </div>
                      <button className="mt-4 w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 py-2 rounded-lg text-xs font-mono uppercase tracking-widest font-bold hover:bg-rose-500/20 transition-colors flex items-center justify-center gap-2">
                        <Lock className="w-3 h-3" /> Blocklist Vessel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warning Card */}
                <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-5 hover:bg-amber-950/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 text-amber-500">
                        <AlertTriangle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg font-mono tracking-wide">MV BALTIC SPIRIT <span className="text-amber-500 text-xs ml-2">[ELEVATED RISK]</span></h3>
                        <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mt-1">IMO: 9811200 | Flag: Panama</p>
                      </div>
                    </div>
                    <div className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-widest border border-amber-500/20">
                      Identity Scrubbing
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/40 rounded-lg p-4 border border-amber-900/30">
                    <div className="col-span-2">
                      <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 border-b border-amber-900/30 pb-2">AI Detection Logic</h4>
                      <p className="text-[11px] text-neutral-300">
                        Vessel recently changed ownership 3 times in 6 months. Currently owned by a shell corporation registered in a non-cooperative jurisdiction. AIS data is consistent, but beneficial ownership is obscured. Requires manual Enhanced Due Diligence (EDD) before chartering.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Safe Card */}
                <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-5 opacity-70">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 text-emerald-500">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg font-mono tracking-wide">41,208 OTHER VESSELS</h3>
                        <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest mt-1">Global Fleet Verification</p>
                      </div>
                    </div>
                    <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded text-xs font-mono font-bold uppercase tracking-widest border border-emerald-500/20">
                      CLEARED
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Threat Intel Feed */}
        <div className="xl:col-span-4 minimal-panel flex flex-col h-[750px]">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-sm font-medium uppercase tracking-wide font-mono text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-rose-500" />
              Live Threat Intelligence
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Geopolitical, Weather, & Sanctions Alerts
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {threatFeed.map((threat) => (
              <div 
                key={threat.id} 
                className={`p-4 rounded-lg border flex flex-col gap-2 animate-slide-in \${
                  threat.type === 'CRITICAL' ? 'bg-rose-500/10 border-rose-500/20' :
                  threat.type === 'WARNING' ? 'bg-amber-500/10 border-amber-500/20' :
                  'bg-cyan-500/5 border-cyan-500/20'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded \${
                    threat.type === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400' :
                    threat.type === 'WARNING' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-cyan-500/20 text-cyan-400'
                  }`}>
                    {threat.type}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{threat.time}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-mono tracking-wide">{threat.region}</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">{threat.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
