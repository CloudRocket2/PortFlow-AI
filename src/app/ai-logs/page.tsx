"use client";

import { useRef, useEffect } from "react";
import { BrainCircuit, Send, Bot, User, AlertCircle, Trash2 } from "lucide-react";
import { useChat, ChatMessage } from "@/context/ChatContext";

export default function AILogsPage() {
  const { 
    messages, setMessages, 
    input, setInput, 
    loading, setLoading, 
    error, setError, 
    clearConversation 
  } = useChat();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      // Format history for the Gemini API
      const history = messages.filter(m => m.role !== "user" || m.text !== userMessage).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI response.");
      }

      setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
    } catch (err: unknown) {
      setError((err as Error).message);
      setMessages((prev) => prev.slice(0, -1)); // Revert the user message on error
      setInput(userMessage); // Put text back in input
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
            PortFlow AI Logs
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time operations intelligence powered by Gemini 3.6 Flash.
          </p>
        </div>
        <button 
          onClick={clearConversation}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white rounded text-xs font-mono transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
          CLEAR
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 bg-[#1e293b] rounded-t-xl border border-[#334155] border-b-0 overflow-hidden flex flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-emerald-500/20 text-emerald-400" : "bg-blue-500/20 text-blue-400"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-sm" 
                  : "bg-[#0f172a] text-slate-300 border border-[#334155] rounded-tl-sm"
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 flex-row">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#0f172a] text-slate-300 border border-[#334155] rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black border-t border-neutral-800 flex flex-col gap-3">
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2">
            {[
              "What are the max LOA & draft limits for Haldia?",
              "Simulate lightering delays at Sagar-Sandheads for Capesize.",
              "What are the handling rates for Coal vs Iron Ore?"
            ].map((q, idx) => (
              <button 
                key={idx}
                onClick={() => setInput(q)}
                className="text-[10px] uppercase font-mono tracking-wider border border-[#00ff00]/30 text-[#00ff00]/80 bg-[#00ff00]/5 px-3 py-1.5 rounded-full hover:bg-[#00ff00]/10 hover:text-[#00ff00] transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ASK ABOUT LIGHTERING DELAYS, DRAFT LIMITS, OR GENERAL BULK LOGISTICS..."
              className="flex-1 bg-neutral-900 border border-neutral-700 text-white font-mono text-xs px-4 py-3 focus:outline-none focus:border-[#00ff00] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#00ff00]/10 border border-[#00ff00]/30 hover:bg-[#00ff00]/20 disabled:opacity-30 text-[#00ff00] px-5 flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
