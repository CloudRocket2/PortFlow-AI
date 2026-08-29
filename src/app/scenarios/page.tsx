"use client";

import React, { useState } from "react";
import { Ship, Droplet, ArrowRight, Route, BarChart3, TrendingDown, Scale, Plus, X, Trash2 } from "lucide-react";

const INITIAL_SCENARIOS = [
  {
    id: "a",
    name: "Scenario A",
    badge: "CURRENT PLAN",
    badgeStyle: "text-[#00ff00] bg-[#00ff00]/10 border border-[#00ff00]/20",
    containerStyle: "bg-neutral-900/30",
    strategy: "Spot Contract Now (Immediate)",
    volume: "1.2M MT",
    timing: "This Week",
    rate: "$16.10 / MT",
    cost: "$19.32M",
    costColor: "red",
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
    badgeStyle: "text-black bg-[#00ff00]",
    containerStyle: "bg-[#00ff00]/5 border-[#00ff00]/20",
    strategy: "Wait 3 Weeks for Predicted Dip",
    volume: "1.2M MT",
    timing: "Delay until Nov 26",
    rate: "$14.80 / MT",
    hasTrendingIcon: true,
    cost: "$17.76M",
    costColor: "amber",
    tradeoffs: [
      { color: "bg-[#00ff00]", text: "Saves $1.56M overall by riding the forecasted rate drop." },
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
    <div className="max-w-6xl mx-auto space-y-6 relative">
      
      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-neutral-800 p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg font-mono tracking-wider">Configure New Scenario</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">Strategy Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black border border-neutral-700 p-2 text-white text-sm font-mono focus:border-[#00ff00] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">Primary Strategy</label>
                <input 
                  type="text" 
                  value={formData.strategy}
                  onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                  placeholder="e.g. Wait 2 weeks, then Spot"
                  className="w-full bg-black border border-neutral-700 p-2 text-white text-sm font-mono focus:border-[#00ff00] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">Total Volume</label>
                <input 
                  type="text" 
                  value={formData.volume}
                  onChange={(e) => setFormData({...formData, volume: e.target.value})}
                  className="w-full bg-black border border-neutral-700 p-2 text-white text-sm font-mono focus:border-[#00ff00] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-500 uppercase mb-1">Execution Timing</label>
                <input 
                  type="text" 
                  value={formData.timing}
                  onChange={(e) => setFormData({...formData, timing: e.target.value})}
                  placeholder="e.g. November 20"
                  className="w-full bg-black border border-neutral-700 p-2 text-white text-sm font-mono focus:border-[#00ff00] focus:outline-none"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-transparent border border-neutral-700 text-neutral-300 py-2 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 py-2 font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#00ff00]/20 transition-colors"
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
          <div className="p-2 bg-neutral-900 border border-neutral-800 rounded">
            <Scale className="w-5 h-5 text-[#00ff00]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Portfolio Scenarios
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Compare multi-voyage allocations, draft penalties, and volume trade-offs.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#00ff00]/10 text-[#00ff00] border border-[#00ff00]/30 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#00ff00]/20 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Scenario
        </button>
      </div>

      {/* Scenarios Grid - Auto-wraps to new rows if there are many */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={`minimal-panel p-6 border ${scenario.containerStyle}`}>
            <div className="flex items-center justify-between border-b border-current pb-4 mb-4" style={{ borderColor: scenario.isDefault && scenario.id === 'b' ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,255,0.1)' }}>
              <h2 className="text-lg font-bold text-white flex items-center gap-2" style={{ color: scenario.id === 'b' ? '#00ff00' : 'white' }}>
                {scenario.name} 
                <span className={`text-[10px] font-mono px-2 py-0.5 ml-2 ${scenario.badgeStyle}`}>
                  {scenario.badge}
                </span>
              </h2>
              {!scenario.isDefault && (
                <button onClick={() => handleDelete(scenario.id)} className="text-neutral-500 hover:text-red-500 transition-colors" title="Delete Scenario">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-black p-3 border border-neutral-800">
                <div className={`text-xs uppercase font-mono ${scenario.id === 'b' ? 'text-[#00ff00]/70' : 'text-neutral-400'}`}>
                  Primary Strategy
                </div>
                <div className="text-sm text-white font-bold">{scenario.strategy}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Total Volume</div>
                  <div className="text-lg text-white font-bold">{scenario.volume}</div>
                </div>
                <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Execution Timing</div>
                  <div className={`text-lg font-bold flex items-center gap-2 ${scenario.id === 'b' ? 'text-[#00ff00]' : 'text-white'}`}>
                    {scenario.timing}
                  </div>
                </div>
                <div className="p-3 bg-neutral-900/50 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase font-mono mb-1">Avg Freight Rate</div>
                  <div className={`text-lg font-bold flex items-center gap-2 ${scenario.id === 'b' ? 'text-[#00ff00]' : 'text-white'}`}>
                    {(scenario as any).hasTrendingIcon && <TrendingDown className="w-4 h-4" />} {scenario.rate}
                  </div>
                </div>
                
                {/* Dynamic Cost Panel based on color */}
                <div className={`p-3 border ${
                  scenario.costColor === 'red' ? 'bg-red-900/10 border-red-500/20' : 
                  scenario.costColor === 'amber' ? 'bg-amber-900/10 border-amber-500/20' : 
                  'bg-blue-900/10 border-blue-500/20'
                }`}>
                  <div className={`text-[10px] uppercase font-mono mb-1 ${
                    scenario.costColor === 'red' ? 'text-red-400' : 
                    scenario.costColor === 'amber' ? 'text-amber-400' : 
                    'text-blue-400'
                  }`}>
                    Total Logistics Cost
                  </div>
                  <div className={`text-lg font-bold ${
                    scenario.costColor === 'red' ? 'text-red-400' : 
                    scenario.costColor === 'amber' ? 'text-amber-400' : 
                    'text-blue-400'
                  }`}>
                    {scenario.cost}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-current" style={{ borderColor: scenario.isDefault && scenario.id === 'b' ? 'rgba(0,255,0,0.2)' : 'rgba(255,255,255,0.1)' }}>
                <div className={`text-xs uppercase font-mono mb-2 ${scenario.id === 'b' ? 'text-[#00ff00]/70' : 'text-neutral-400'}`}>
                  Key Trade-offs
                </div>
                <ul className="space-y-2 text-sm text-neutral-300">
                  {scenario.tradeoffs.map((t, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.color}`} />
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
