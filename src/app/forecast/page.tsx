"use client";

import React, { useState, useEffect } from "react";
import { Activity, AlertTriangle, Globe, MapPin, Route, ShieldAlert, ArrowRight, Ship, Bell, BellRing, Mail, X } from "lucide-react";
import FreightForecastChart from "@/components/FreightForecastChart";
import MacroVolatilityChart from "@/components/MacroVolatilityChart";

export default function ForecastPage() {
  const [isAlertsMenuOpen, setIsAlertsMenuOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [alertHistory, setAlertHistory] = useState<any[]>([
    {
      id: "a1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleString(),
      title: "Weather Alert: Paradip",
      message: "Cyclone forming in Bay of Bengal. Spot rates up 5%.",
      type: "warning"
    }
  ]);
  const [activeToast, setActiveToast] = useState<any | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Simulation logic: when subscribed, trigger an alert after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubscribed) {
      timer = setTimeout(() => {
        const newAlert = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          title: "Market Window Open",
          message: "Newcastle → Haldia, Panamax — recommended entry now.",
          type: "success"
        };
        setAlertHistory(prev => [newAlert, ...prev]);
        setActiveToast(newAlert);
        
        // Auto-hide toast after 8 seconds
        setTimeout(() => {
          setActiveToast(null);
        }, 8000);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isSubscribed]);

  return (
    <div className="flex flex-col gap-6 h-full p-2 relative">
      
      {/* Active Toast Notification */}
      {activeToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-black border border-[#00ff00] p-4 shadow-[0_0_20px_rgba(0,255,0,0.2)] animate-in slide-in-from-top-4 flex flex-col gap-3 min-w-[400px]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 text-[#00ff00] font-mono font-bold text-sm uppercase tracking-wider">
              <BellRing className="w-4 h-4 animate-pulse" />
              {activeToast.title}
            </div>
            <button onClick={() => setActiveToast(null)} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
          </div>
          <div className="text-xs font-mono text-white">
            {activeToast.message}
          </div>
          <button 
            onClick={() => {
              setActiveToast(null);
              setShowEmailPreview(true);
            }}
            className="mt-2 bg-[#00ff00]/10 border border-[#00ff00]/30 text-[#00ff00] text-[10px] font-mono font-bold uppercase tracking-widest py-1.5 px-3 hover:bg-[#00ff00]/20 flex items-center justify-center gap-2"
          >
            <Mail className="w-3 h-3" /> View Simulated Email
          </button>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-neutral-700 w-full max-w-xl shadow-2xl">
            <div className="bg-neutral-900 border-b border-neutral-800 p-3 flex justify-between items-center">
              <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Preview
              </div>
              <button onClick={() => setShowEmailPreview(false)} className="text-neutral-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-2 bg-amber-500/10 border-b border-amber-500/20 text-amber-500 text-[10px] font-mono uppercase tracking-widest text-center">
              Simulated email alert — no real email is sent in this prototype.
            </div>
            <div className="p-6 flex flex-col gap-4 font-sans bg-white text-black rounded-b">
              <div>
                <div className="text-sm text-neutral-500">From: PortFlow AI Alerts &lt;no-reply@portflow.ai&gt;</div>
                <div className="text-sm text-neutral-500">To: Chartering Team</div>
                <div className="text-lg font-bold mt-2">AI Market Alert: Optimal Entry Window Open</div>
              </div>
              <div className="h-px bg-neutral-200 w-full" />
              <div className="text-sm leading-relaxed space-y-3">
                <p>Hello Team,</p>
                <p>The PortFlow predictive model has detected an optimal market entry window for the following route based on a sudden dip in the Baltic Dry Index and favorable port congestion metrics:</p>
                <ul className="list-disc pl-5 font-bold">
                  <li>Route: Newcastle (AUS) → Haldia (IND)</li>
                  <li>Vessel Class: Panamax</li>
                  <li>Recommended Action: Execute Spot Contract Now</li>
                </ul>
                <p><strong>Projected Savings:</strong> $420,000 compared to the trailing 30-day average if locked in within the next 48 hours.</p>
                <div className="pt-4">
                  <button onClick={() => setShowEmailPreview(false)} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold shadow hover:bg-blue-700 transition-colors">
                    Review Recommendation in PortFlow
                  </button>
                </div>
                <p className="text-xs text-neutral-500 pt-4 border-t border-neutral-200 mt-4">
                  You received this because you are subscribed to market alerts for Australia → India routes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 relative">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
            <Globe className="w-5 h-5" />
            Global Risk & AI Market Forecasting
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-1 uppercase tracking-widest">
            Early Warnings, Deadheading Prevention, and Spot Rate Predictions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[10px] font-mono border border-neutral-800 px-3 py-1 text-neutral-400 uppercase tracking-widest bg-neutral-900/50">
            Module: SIGMA-9
          </div>
          <button 
            onClick={() => setIsAlertsMenuOpen(!isAlertsMenuOpen)}
            className={`p-2 rounded border transition-colors relative ${isAlertsMenuOpen ? 'bg-neutral-800 border-neutral-600 text-white' : 'border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
          >
            {isSubscribed ? <BellRing className="w-5 h-5 text-[#00ff00]" /> : <Bell className="w-5 h-5" />}
            {isSubscribed && <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00ff00] rounded-full animate-ping" />}
          </button>
        </div>

        {/* Alerts Dropdown / Sidebar */}
        {isAlertsMenuOpen && (
          <div className="absolute top-16 right-0 w-96 bg-[#0a0a0a] border border-neutral-800 shadow-2xl z-40 flex flex-col">
            <div className="p-4 border-b border-neutral-800 bg-black flex justify-between items-center">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Alert Preferences</h3>
              <button onClick={() => setIsAlertsMenuOpen(false)} className="text-neutral-500 hover:text-white"><X className="w-4 h-4"/></button>
            </div>
            
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/30">
              <div className="flex items-start gap-3">
                <div className="pt-1">
                  <div 
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${isSubscribed ? 'bg-[#00ff00]' : 'bg-neutral-700'}`}
                  >
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform ${isSubscribed ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white mb-1">Subscribe: Newcastle → Haldia (Panamax)</div>
                  <div className="text-[10px] font-mono text-neutral-400">Receive push alerts and email notifications when AI detects optimal market entry conditions.</div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-96">
              <div className="p-3 text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest bg-black sticky top-0 border-b border-neutral-800">
                Alert History
              </div>
              <div className="flex flex-col">
                {alertHistory.map((alert) => (
                  <div key={alert.id} className="p-4 border-b border-neutral-800/50 hover:bg-neutral-900/30">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`text-[10px] font-mono font-bold uppercase tracking-widest ${alert.type === 'success' ? 'text-[#00ff00]' : 'text-amber-500'}`}>
                        {alert.title}
                      </div>
                      <div className="text-[9px] font-mono text-neutral-600">{alert.timestamp}</div>
                    </div>
                    <div className="text-xs font-mono text-neutral-300">
                      {alert.message}
                    </div>
                    {alert.type === 'success' && (
                      <button 
                        onClick={() => {
                          setIsAlertsMenuOpen(false);
                          setShowEmailPreview(true);
                        }}
                        className="mt-2 text-[10px] font-mono text-[#00ff00] hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> View simulated email
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-6 pb-6">
        {/* Top Full-Width Section: AI Market Forecast */}
        <FreightForecastChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: Risk Mitigation */}
          <div className="flex flex-col gap-6">
          <div className="minimal-panel p-5 flex flex-col gap-4 bg-neutral-900/10">
            <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
              <ShieldAlert className="w-4 h-4 text-white" />
              Risk Mitigation Alerts
            </h2>
            
            <div className="flex flex-col gap-3">
              {/* Alert 1 */}
              <div className="border-l-2 border-white pl-4 py-2 bg-neutral-900/30">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] font-mono text-white uppercase tracking-widest font-bold">Severe Weather Warning</div>
                  <div className="text-[10px] font-mono text-neutral-500">2 HRS AGO</div>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Typhoon expected near Indonesia (Kalimantan) loading ports in 72 hours. 
                  Expect 3-4 days of berthing delays. 
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Impact: Spot rates for coal expected to jump 8%.
                </div>
              </div>

              {/* Alert 2 */}
              <div className="border-l-2 border-neutral-700 pl-4 py-2">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest font-bold">Port Congestion</div>
                  <div className="text-[10px] font-mono text-neutral-500">14 HRS AGO</div>
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Australia (Newcastle) reporting massive queues for Panamax vessels due to crane maintenance.
                </div>
                <div className="mt-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
                  <ArrowRight className="w-3 h-3" /> Impact: 48 hour turnaround delay.
                </div>
              </div>
            </div>
          </div>

          <div className="minimal-panel p-5 flex flex-col gap-4 bg-neutral-900/10 flex-1 min-h-[350px]">
             <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3 shrink-0">
              <Activity className="w-4 h-4 text-white" />
              Macro Volatility Index
            </h2>
            <div className="flex-1 flex flex-col min-h-0">
              <MacroVolatilityChart />
            </div>
          </div>
        </div>

        {/* Right Column: Idle Scenario Management (Deadheading) */}
        <div className="minimal-panel p-5 flex flex-col gap-4 bg-neutral-900/10">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Route className="w-4 h-4 text-white" />
            Idle Scenario Management (Deadhead Prevention)
          </h2>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2">
            AI-suggested alternative employment routes to minimize empty vessel transit.
          </p>

          <div className="flex flex-col gap-4">
            
            {/* Scenario 1 */}
            <div className="border border-neutral-800 p-4 bg-black">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <div className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Ship className="w-4 h-4" />
                  MV Pacific Horizon (Supramax)
                </div>
                <div className="text-[10px] font-mono text-neutral-500">Status: Discharging</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Current Location</div>
                  <div className="text-xs font-mono text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" /> Vizag Port, India
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Predicted Idle Time</div>
                  <div className="text-xs font-mono text-white">Starts in 48 Hours</div>
                </div>
              </div>

              <div className="border border-neutral-800 p-3 bg-neutral-900/50">
                <div className="text-[10px] font-mono text-white uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  AI Alternative Employment Route
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  Instead of deadheading back to Australia empty, secure a short-term Iron Ore cargo from Vizag to China (Guangzhou). Market demand for Supramax on this route is currently elevated.
                </p>
                <div className="mt-3 text-[10px] font-mono text-white font-bold uppercase tracking-widest border border-white px-2 py-1 inline-block">
                  Estimated Savings: $145,000
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="border border-neutral-800 p-4 bg-black">
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <div className="text-xs font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                  <Ship className="w-4 h-4" />
                  Maersk Sentinel (Panamax)
                </div>
                <div className="text-[10px] font-mono text-neutral-500">Status: En Route</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Current Location</div>
                  <div className="text-xs font-mono text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" /> Approaching Haldia
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Predicted Idle Time</div>
                  <div className="text-xs font-mono text-white">Starts in 6 Days</div>
                </div>
              </div>

              <div className="border border-neutral-800 p-3 bg-neutral-900/50">
                <div className="text-[10px] font-mono text-white uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  AI Alternative Employment Route
                </div>
                <p className="text-xs font-mono text-neutral-400">
                  Sub-optimal positioning. Suggest routing vessel to Dhamra post-discharge for a backhaul fertilizer cargo to Southeast Asia, perfectly matching the Panamax LOA profile.
                </p>
                <div className="mt-3 text-[10px] font-mono text-white font-bold uppercase tracking-widest border border-white px-2 py-1 inline-block">
                  Estimated Savings: $92,000
                </div>
              </div>
            </div>

          </div>
        </div>
        
        </div>
      </div>
    </div>
  );
}
