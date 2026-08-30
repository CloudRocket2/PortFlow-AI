"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  clearConversation: () => void;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  { role: "model", text: "Hello Manager! I am PortFlow AI. How can I assist with terminal operations today?" }
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>(DEFAULT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("portflow_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }
    
    const savedInput = localStorage.getItem("portflow_chat_input");
    if (savedInput) {
      setInput(savedInput);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("portflow_chat_history", JSON.stringify(messages));
      localStorage.setItem("portflow_chat_input", input);
    }
  }, [messages, input, isMounted]);

  const clearConversation = () => {
    setMessages(DEFAULT_MESSAGES);
    setInput("");
    setError(null);
    localStorage.removeItem("portflow_chat_history");
    localStorage.removeItem("portflow_chat_input");
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        loading,
        setLoading,
        error,
        setError,
        clearConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
