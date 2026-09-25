'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Bot,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { FormattedMessage } from './FormattedMessage';

interface ChatMessage {
  id: string;
  sender: 'AI' | 'USER';
  text: string;
  timestamp: string;
}

export const AIAssistantWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'AI',
      text: `Hello ${user?.name || 'Trainee'}! I am your CampusPilot AI Learning Copilot. I analyze your competencies, pinpoint skill gaps, and match you with verified courses and master trainers. How can I assist your capacity building today?`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    'What are my current competency gaps?',
    'Recommend the best courses for me',
    'Which trainer is recommended for Machine Learning?',
    'What assessments are pending?',
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'USER',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeId: user?.id,
          message: textToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'AI',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: 'AI',
            text: 'I apologize, but I encountered an error connecting to the intelligence layer. Please try again.',
            timestamp: 'Just now',
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-3 text-white shadow-xl shadow-brand-500/30 hover:scale-105 active:scale-95 transition-all group"
          aria-label="Open AI Assistant"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
          <span className="text-xs font-bold tracking-wide">Ask CampusPilot AI</span>
        </button>
      )}

      {/* Floating Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[560px] max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-700 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight">CampusPilot AI Copilot</h3>
                  <p className="text-[10px] text-white/80 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    Grounded in your Competency Profile
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition active:scale-90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Prompts Bar */}
            <div className="bg-slate-50 border-b border-slate-100 p-2 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="text-[10px] bg-white border border-slate-200/80 px-2.5 py-1 rounded-full text-slate-700 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 transition shrink-0 font-medium active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'AI' && (
                    <div className="h-7 w-7 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 border border-brand-200">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs max-w-[80%] leading-relaxed ${
                      msg.sender === 'USER'
                        ? 'bg-brand-600 text-white rounded-br-xs shadow-sm'
                        : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-subtle'
                    }`}
                  >
                    <FormattedMessage content={msg.text} isUser={msg.sender === 'USER'} />
                    <span
                      className={`block text-[9px] mt-1 ${
                        msg.sender === 'USER' ? 'text-brand-200 text-right' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2">
                  <Bot className="w-4 h-4 animate-spin text-brand-600" />
                  Synthesizing recommendations...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-100 bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your gaps, courses, trainers..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-400"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="h-8 w-8 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 disabled:opacity-50 active:scale-95 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
