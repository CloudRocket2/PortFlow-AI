"use client";
import { useState, useEffect } from "react";
import { Plus, Users, Search, RefreshCw, X, Shield, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "", name: "", role: "DIR-12", department: "Executive Operations", clearance: "LEVEL 5"
  });
  const [provisioning, setProvisioning] = useState(false);
  
  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/admin/users").then(r => r.json()).then(data => {
      if(data.success) setUsers(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  
  useEffect(() => { fetchUsers(); }, []);
  
  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setProvisioning(true);
    const res = await fetch("/api/admin/users", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setProvisioning(false);
    if(data.success) {
      setShowModal(false);
      fetchUsers();
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-page-enter">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Authority Provisioning</h1>
            <p className="text-sm text-neutral-500 mt-1">Manage personnel clearance and active setups.</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-4 py-2 rounded-lg text-sm font-mono font-bold uppercase tracking-wider hover:bg-indigo-500/20 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Provision Identity
        </button>
      </div>

      <div className="minimal-panel overflow-hidden border border-neutral-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-900/50">
              <th className="p-4 text-xs font-mono uppercase text-neutral-500 font-medium">Personnel</th>
              <th className="p-4 text-xs font-mono uppercase text-neutral-500 font-medium">Clearance</th>
              <th className="p-4 text-xs font-mono uppercase text-neutral-500 font-medium">Status</th>
              <th className="p-4 text-xs font-mono uppercase text-neutral-500 font-medium text-right">Access Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {loading ? <tr><td colSpan={4} className="p-8 text-center text-neutral-500">Loading...</td></tr> : 
             users.map(u => (
              <tr key={u.id} className="hover:bg-white/[0.02]">
                <td className="p-4">
                  <div className="text-sm font-semibold text-white">{u.name}</div>
                  <div className="text-xs text-neutral-500">{u.email}</div>
                </td>
                <td className="p-4">
                  <div className="text-sm text-neutral-300 font-mono">{u.role}</div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-wider">{u.clearance}</div>
                </td>
                <td className="p-4">
                  {u.isSetupComplete ? (
                    <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                  ) : (
                    <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">Setup Pending</span>
                  )}
                </td>
                <td className="p-4 text-right font-mono text-sm text-neutral-400">
                  {!u.isSetupComplete && u.setupCode ? (
                    <span className="bg-neutral-900 px-2 py-1 rounded text-white tracking-widest">{u.setupCode}</span>
                  ) : "-"}
                </td>
              </tr>
            ))}
            {users.length === 0 && !loading && <tr><td colSpan={4} className="p-8 text-center text-neutral-500">No personnel found.</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 p-6 w-full max-w-md rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Provision Identity</h3>
              <button onClick={() => setShowModal(false)} className="text-neutral-500 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleProvision} className="space-y-4">
              <div><label className="block text-xs text-neutral-500 mb-1">Email</label><input type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full bg-black/50 border border-neutral-800 rounded px-3 py-2 text-sm text-white" /></div>
              <div><label className="block text-xs text-neutral-500 mb-1">Name</label><input type="text" required value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full bg-black/50 border border-neutral-800 rounded px-3 py-2 text-sm text-white" /></div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1">Clearance Role</label>
                <select value={formData.role} onChange={e=>setFormData({...formData, role: e.target.value})} className="w-full bg-black/50 border border-neutral-800 rounded px-3 py-2 text-sm text-white">
                  <option value="DIR-12">Director (DIR-12)</option>
                  <option value="MGR-01">Manager (MGR-01)</option>
                  <option value="ANL-04">Analyst (ANL-04)</option>
                  <option value="OPS-09">Operations (OPS-09)</option>
                </select>
              </div>
              <button type="submit" disabled={provisioning} className="w-full mt-4 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors font-mono uppercase tracking-widest text-sm font-bold py-2.5 rounded-lg">
                {provisioning ? "Generating..." : "Generate Secure Code"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
