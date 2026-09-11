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
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col animate-page-enter">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-white flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-emerald-400" />
            PortFlow AI Logs
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Real-time operations intelligence powered by Gemini 3.6 Flash.
          </p>
        </div>
        <button 
          onClick={clearConversation}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono transition-colors focus-ring active:scale-[0.97]"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
          CLEAR
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 bg-neutral-900/50 rounded-xl border border-neutral-800 overflow-hidden flex flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 animate-slide-in ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`} style={{ animationDelay: `${i * 0.05}s` }}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "user" ? "bg-cyan-500/20 text-cyan-400" : "bg-emerald-500/20 text-emerald-400"
              }`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              
              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.role === "user" 
                  ? "bg-cyan-600/90 text-white rounded-tr-sm" 
                  : "bg-neutral-800/60 border border-neutral-700/50 text-neutral-300 rounded-tl-sm"
              }`}>
                <p className="whitespace-pre-wrap text-[13px] leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-4 flex-row animate-slide-in">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-neutral-800/60 border border-neutral-700/50 text-neutral-300 rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-neutral-900/80 border-t border-neutral-800 flex flex-col gap-3">
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
                className="text-[10px] uppercase font-mono tracking-widest border border-cyan-500/20 text-cyan-400 bg-cyan-500/5 px-3 py-1.5 rounded-full hover:bg-cyan-500/10 transition-all duration-200 whitespace-nowrap focus-ring hover:scale-[1.03] active:scale-[0.97]"
              >
                {q}
              </button>
            ))}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-3 focus-within:ring-1 focus-within:ring-cyan-500/30 rounded-lg"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ASK ABOUT LIGHTERING DELAYS, DRAFT LIMITS, OR GENERAL BULK LOGISTICS..."
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono text-xs px-4 py-3 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20 disabled:opacity-30 text-cyan-400 px-5 flex items-center justify-center transition-colors focus-ring active:scale-[0.97]"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
