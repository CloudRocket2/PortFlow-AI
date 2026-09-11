"use client";

import React, { useState } from "react";
import { Ship, Droplet, ArrowRight, Route, BarChart3, TrendingDown, Scale, Plus, X, Trash2 } from "lucide-react";

const INITIAL_SCENARIOS = [
  {
    id: "a",
    name: "Scenario A",
    badge: "CURRENT PLAN",
    badgeStyle: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
    containerStyle: "bg-neutral-900/30",
    strategy: "Spot Contract Now (Immediate)",
    volume: "1.2M MT",
    timing: "This Week",
    rate: "$16.10 / MT",
    cost: "$19.32M",
    costColor: "rose",
    tradeoffs: [
      { color: "bg-blue-500", text: "Locks in vessel availability immediately." },
      { color: "bg-amber-500", text: "Ignores AI forecast indicating an upcoming seasonal dip in rates." }
    ],
    isDefault: true,
  },
  {
    id: "b",
    name: "Scenario B",
    badge: "AI RECOMMENDED",
    badgeStyle: "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
    containerStyle: "bg-emerald-500/5 border-emerald-500/20",
    strategy: "Wait 3 Weeks for Predicted Dip",
    volume: "1.2M MT",
    timing: "Delay until Nov 26",
    rate: "$14.80 / MT",
    hasTrendingIcon: true,
    cost: "$17.76M",
    costColor: "amber",
    tradeoffs: [
      { color: "bg-emerald-400", text: "Saves $1.56M overall by riding the forecasted rate drop." },
      { color: "bg-amber-500", text: "Small risk of supply constraint if the predicted dip does not materialize." }
    ],
    isDefault: true,
  }
];

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState(INITIAL_SCENARIOS);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "Scenario C",
    strategy: "Split Volume 50/50 (Spot + Contract)",
    volume: "1.2M MT",
    timing: "Phased over 4 weeks"
  });

  // Load from localStorage on mount
  React.useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("portflow_scenarios");
    if (saved) {
      try {
        setScenarios(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse scenarios", e);
      }
    }
  }, []);

  // Save to localStorage when scenarios change
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("portflow_scenarios", JSON.stringify(scenarios));
    }
  }, [scenarios, mounted]);

  const handleDelete = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate mock values
    const costVal = (Math.random() * 2 + 17).toFixed(2);
    const parsedVol = parseFloat(formData.volume.replace(/[^\d.]/g, '')) || 1.2;
    const rateVal = (parseFloat(costVal) / parsedVol).toFixed(2);

    const newScenario = {
      id: Date.now().toString(),
      name: formData.name || `Scenario ${String.fromCharCode(65 + scenarios.length)}`,
      badge: "USER CUSTOM",
      badgeStyle: "text-blue-400 bg-blue-500/10 border border-blue-500/20",
      containerStyle: "bg-neutral-900/30 border-blue-500/20",
      strategy: formData.strategy || "Custom Allocation",
      volume: formData.volume || "1.2M MT",
      timing: formData.timing || "TBD",
      rate: `$${rateVal} / MT`,
      cost: `$${costVal}M`,
      costColor: "blue",
      tradeoffs: [
        { color: "bg-blue-500", text: "Blends risk between immediate execution and waiting." },
        { color: "bg-neutral-500", text: "Requires managing multiple staggered shipments." }
      ],
      isDefault: false,
    };

    setScenarios([...scenarios, newScenario]);
    setShowModal(false);
    
    // Reset form for next time
    setFormData({
      name: `Scenario ${String.fromCharCode(66 + scenarios.length)}`,
      strategy: "",
      volume: "1.2M MT",
      timing: ""
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 animate-page-enter relative">
      
      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md rounded-xl shadow-2xl animate-slide-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Configure New Scenario</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white transition-colors focus-ring">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Strategy Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Primary Strategy</label>
                <input 
                  type="text" 
                  value={formData.strategy}
                  onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                  placeholder="e.g. Wait 2 weeks, then Spot"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Total Volume</label>
                <input 
                  type="text" 
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Execution Timing</label>
                <input 
                  type="text" 
                  value={formData.timing}
                  onChange={(e) => setFormData({...formData, timing: e.target.value})}
                  placeholder="e.g. November 20"
                  className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-transparent border border-neutral-700 text-neutral-300 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors focus-ring active:scale-[0.97]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg py-2.5 font-mono text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/20 transition-colors focus-ring btn-sweep active:scale-[0.97]"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              Portfolio Scenarios
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Compare multi-voyage allocations, draft penalties, and volume trade-offs.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-xs font-mono font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-colors flex items-center gap-2 focus-ring btn-sweep active:scale-[0.97]"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      {/* Scenarios Grid - Auto-wraps to new rows if there are many */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={`minimal-panel p-6 border ${scenario.containerStyle} hover:scale-[1.01] hover:border-neutral-700/60 transition-all duration-300`}>
            <div className="flex items-center justify-between border-b border-current pb-4 mb-4" style={{ borderColor: scenario.isDefault && scenario.id === 'b' ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.1)' }}>
              <h2 className="text-sm font-medium text-white flex items-center gap-2 uppercase tracking-wide font-mono" style={{ color: scenario.id === 'b' ? 'var(--accent-emerald)' : 'white' }}>
                {scenario.name} 
                <span className={`text-[10px] font-mono px-2 py-0.5 ml-2 rounded flex items-center gap-1.5 transition-all duration-200 hover:brightness-110 ${scenario.badgeStyle}`}>
                  {scenario.id === 'b' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                  {scenario.badge}
                </span>
              </h2>
              {!scenario.isDefault && (
                <button onClick={() => handleDelete(scenario.id)} className="text-neutral-500 hover:text-rose-400 hover:scale-110 transition-transform focus-ring rounded" title="Delete Scenario">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-neutral-900/50 rounded-lg p-3 border border-neutral-800">
                <div className={`text-[10px] font-mono uppercase tracking-widest ${scenario.id === 'b' ? 'text-emerald-400/70' : 'text-neutral-500'}`}>
                  Primary Strategy
                </div>
                <div className="text-xs text-white">{scenario.strategy}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1">Total Volume</div>
                  <div className="text-2xl font-mono tabular-nums text-white">{scenario.volume}</div>
                </div>
                <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1">Execution Timing</div>
                  <div className={`text-2xl font-mono tabular-nums flex items-center gap-2 ${scenario.id === 'b' ? 'text-emerald-400' : 'text-white'}`}>
                    {scenario.timing}
                  </div>
                </div>
                <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-500 mb-1">Avg Freight Rate</div>
                  <div className={`text-2xl font-mono tabular-nums flex items-center gap-2 ${scenario.id === 'b' ? 'text-emerald-400' : 'text-white'}`}>
                    {(scenario as any).hasTrendingIcon && <TrendingDown className="w-4 h-4" />} {scenario.rate}
                  </div>
                </div>
                
                {/* Dynamic Cost Panel based on color */}
                <div className={`p-3 rounded-lg border ${
                  scenario.costColor === 'rose' ? 'bg-rose-500/10 border-rose-500/20' : 
                  scenario.costColor === 'amber' ? 'bg-amber-500/10 border-amber-500/20' : 
                  'bg-blue-500/10 border-blue-500/20'
                }`}>
                  <div className={`text-xs mb-1 ${
                    scenario.costColor === 'rose' ? 'text-rose-400' : 
                    scenario.costColor === 'amber' ? 'text-amber-400' : 
                    'text-blue-400'
                  }`}>
                    Total Logistics Cost
                  </div>
                  <div className={`text-2xl font-mono tabular-nums ${
                    scenario.costColor === 'rose' ? 'text-rose-400' : 
                    scenario.costColor === 'amber' ? 'text-amber-400' : 
                    'text-blue-400'
                  }`}>
                    {scenario.cost}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-current" style={{ borderColor: scenario.isDefault && scenario.id === 'b' ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.1)' }}>
                <div className={`text-[10px] font-mono uppercase tracking-widest mb-2 ${scenario.id === 'b' ? 'text-emerald-400/70' : 'text-neutral-500'}`}>
                  Key Trade-offs
                </div>
                <ul className="space-y-2 text-xs text-neutral-400">
                  {scenario.tradeoffs.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2 animate-slide-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${t.color}`} />
                      {t.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
