"use client";

import { useState, useEffect, useRef } from "react";
import { Radio, Mic, Volume2 } from "lucide-react";

interface RadioMessage {
  id: string;
  timestamp: string;
  channel: string;
  sender: string;
  englishText: string;
  hindiText: string;
}

const INITIAL_MESSAGES: RadioMessage[] = [
  {
    id: "msg-001",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    channel: "VHF CH-16",
    sender: "Port Control",
    englishText: "Vessel Ocean Giant, you are cleared for berth 4. Proceed at minimum speed.",
    hindiText: "पोत ओशन जायंट, आपको बर्थ 4 के लिए मंजूरी दे दी गई है। न्यूनतम गति से आगे बढ़ें।",
  },
  {
    id: "msg-002",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    channel: "VHF CH-12",
    sender: "Crane Op 3",
    englishText: "Control, Crane 3 spreader is locked. Requesting maintenance team at Bay 8.",
    hindiText: "कंट्रोल, क्रेन 3 का स्प्रेडर लॉक हो गया है। बे 8 पर मेंटेनेंस टीम की आवश्यकता है।",
  },
  {
    id: "msg-003",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    channel: "UHF T-04",
    sender: "Gate Security",
    englishText: "Truck MH-04-AB-1234 cleared at Gate 2. Proceeding to yard section C.",
    hindiText: "ट्रक MH-04-AB-1234 को गेट 2 से मंजूरी मिल गई है। यार्ड सेक्शन सी की ओर जा रहा है।",
  }
];

const INCOMING_MESSAGES = [
  {
    channel: "VHF CH-12",
    sender: "Yard Master",
    englishText: "All units, weather warning. High winds expected in 30 minutes. Secure empty containers.",
    hindiText: "सभी यूनिट, मौसम की चेतावनी। 30 मिनट में तेज हवाएं चलने की उम्मीद है। खाली कंटेनरों को सुरक्षित करें।",
  },
  {
    channel: "UHF T-04",
    sender: "Truck 404",
    englishText: "Yard Master, I am at Bay 2. Awaiting loading instructions.",
    hindiText: "यार्ड मास्टर, मैं बे 2 पर हूँ। लोडिंग निर्देशों की प्रतीक्षा कर रहा हूँ।",
  },
  {
    channel: "VHF CH-16",
    sender: "Pilot Boat",
    englishText: "Port Control, Pilot is aboard Vessel Baltic Sea. ETA to breakwater is 15 minutes.",
    hindiText: "पोर्ट कंट्रोल, पायलट पोत बाल्टिक सी पर सवार है। ब्रेकवाटर तक पहुँचने का अनुमानित समय 15 मिनट है।",
  }
];

export default function RadioLogsPage() {
  const [messages, setMessages] = useState<RadioMessage[]>(INITIAL_MESSAGES);
  const [isRecording, setIsRecording] = useState(true);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isRecording) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < INCOMING_MESSAGES.length) {
        const newMsg: RadioMessage = {
          id: `msg-sim-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...INCOMING_MESSAGES[currentIndex]
        };
        
        setMessages(prev => [...prev, newMsg]);
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 8000); // New message every 8 seconds

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="max-w-[1200px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="minimal-panel p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
            <Radio className="w-6 h-6" />
            VHF Radio Transcripts
          </h1>
          <p className="text-xs font-mono text-neutral-500 mt-2 uppercase tracking-widest">
            Live AI-Powered Speech-to-Text Translation
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 border border-neutral-800 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-mono text-white uppercase tracking-widest">Live Audio Feed</span>
          </div>
          
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`px-4 py-2 border flex items-center gap-2 transition-colors ${
              isRecording 
                ? 'border-red-500/50 text-red-500 bg-red-500/10' 
                : 'border-neutral-800 text-neutral-500 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span className="text-xs font-mono uppercase tracking-widest">
              {isRecording ? "Recording..." : "Paused"}
            </span>
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="minimal-panel flex-1 flex flex-col overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-neutral-800 bg-neutral-900/50">
          <div className="col-span-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Time / Channel</div>
          <div className="col-span-2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Sender</div>
          <div className="col-span-8 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Transcription (ENG / HIN)</div>
        </div>

        {/* Scrollable List */}
        <div ref={feedRef} className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="grid grid-cols-12 gap-4 p-4 border border-neutral-800 animate-slide-in">
              
              {/* Metadata */}
              <div className="col-span-2 flex flex-col gap-1">
                <span className="text-xs font-mono text-white">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                </span>
                <span className="text-[10px] font-mono uppercase text-neutral-500 border border-neutral-800 inline-block px-1.5 py-0.5 w-max mt-1">
                  {msg.channel}
                </span>
              </div>

              {/* Sender */}
              <div className="col-span-2 flex items-start">
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider bg-neutral-900 px-2 py-1">
                  {msg.sender}
                </span>
              </div>

              {/* Translation Payload */}
              <div className="col-span-8 flex flex-col gap-3 border-l border-neutral-800 pl-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1 block">English</span>
                  <p className="text-sm text-white leading-relaxed">{msg.englishText}</p>
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1 block">Hindi (हिंदी)</span>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">{msg.hindiText}</p>
                </div>
              </div>

            </div>
          ))}
          
          {isRecording && (
            <div className="flex items-center gap-3 p-4 text-neutral-600">
              <div className="w-1.5 h-1.5 bg-neutral-600 rounded-full animate-ping" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Listening to port frequencies...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
