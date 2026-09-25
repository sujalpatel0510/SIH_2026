'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Bot,
  Send,
  Sparkles,
  Lightbulb,
  Zap,
  CheckCircle2,
  X,
  KeyRound,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { FormattedMessage } from '@/components/ai/FormattedMessage';

export default function AIAssistantPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([
    {
      id: '1',
      sender: 'AI',
      text: `Hello ${user?.name || 'Trainee'}! I am your dedicated CampusPilot AI Learning Copilot. I have full context of your competency profile, identified skill gaps, and enrolled courses.\n\nAsk me anything about your learning path, pending tests, or technical topics!`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // NVIDIA API Key state
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [nvidiaKeyInput, setNvidiaKeyInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('meta/llama-3.1-70b-instruct');
  const [engineStatus, setEngineStatus] = useState<any>(null);
  const [savingKey, setSavingKey] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    fetch('/api/ai-assistant/config')
      .then((r) => r.json())
      .then((data) => {
        setEngineStatus(data);
        if (data.model) setSelectedModel(data.model);
      })
      .catch(console.error);
  }, []);

  const quickOptions = [
    { label: 'Check My Competency Gaps', query: 'What are my current competency gaps?' },
    { label: 'Recommend Best Course', query: 'Which course should I take to improve my ML skills?' },
    { label: 'Find Master Trainer', query: 'Which trainer is suitable for Machine Learning?' },
    { label: 'Explain PostgreSQL Indexing', query: 'Explain how PostgreSQL handles B-Tree vs GIN indexing' },
    { label: 'Pending Deadlines', query: 'What assessments are pending?' },
  ];

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: 'USER',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeId: user?.id,
          message: text,
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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNvidiaKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nvidiaKeyInput.trim()) return;

    setSavingKey(true);
    try {
      const res = await fetch('/api/ai-assistant/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: nvidiaKeyInput.trim(),
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMessage(data.message || 'NVIDIA AI activated successfully!');
        setEngineStatus({
          isConfigured: true,
          hasNvidia: true,
          activeEngine: `NVIDIA NIM (${selectedModel})`,
          model: selectedModel,
          maskedKey: `${nvidiaKeyInput.slice(0, 8)}...${nvidiaKeyInput.slice(-4)}`,
        });
        setNvidiaKeyInput('');
        setShowKeyModal(false);
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        alert(data.error || 'Failed to save NVIDIA API Key');
      }
    } catch (err) {
      console.error('Save key error:', err);
      alert('Error connecting to server. Please try again.');
    } finally {
      setSavingKey(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Engine Indicator & Key Setup */}
      <div className="border-b border-slate-200/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 mb-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            Active Intelligence Session
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">AI Learning Copilot</h1>
        </div>

        {/* NVIDIA Engine Status / Connect Button */}
        <div className="flex items-center gap-2">
          {engineStatus?.hasNvidia ? (
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition text-xs font-bold shadow-xs"
              title="Click to view or change NVIDIA API configuration"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
              </span>
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>NVIDIA AI Connected ({engineStatus.model.split('/')[1] || 'Llama 3.1'})</span>
            </button>
          ) : (
            <button
              onClick={() => setShowKeyModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Connect NVIDIA API Key</span>
            </button>
          )}
        </div>
      </div>

      {/* Suggested prompts row */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quickOptions.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(opt.query)}
            className="rounded-xl bg-white border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand-300 hover:bg-brand-50 transition shrink-0 flex items-center gap-1.5"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> {opt.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-1 rounded-3xl bg-white border border-slate-200/80 shadow-subtle p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'AI' && (
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div
              className={`rounded-2xl px-5 py-3.5 text-xs max-w-2xl leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-50/90 text-slate-800 border border-slate-200/80'
              }`}
            >
              <FormattedMessage content={msg.text} isUser={msg.sender === 'USER'} />
              <span
                className={`block text-[9px] mt-2 ${
                  msg.sender === 'USER' ? 'text-brand-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic p-3">
            <Bot className="w-4 h-4 animate-spin text-brand-600" />
            Analyzing your question with capacity intelligence...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask anything about your courses, skill gaps, concepts, or technical questions..."
          className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-transparent focus:outline-none focus:ring-0"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50 transition flex items-center gap-1.5 shrink-0"
        >
          <span>Ask Copilot</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* NVIDIA API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Configure NVIDIA AI</h3>
                  <p className="text-[11px] text-slate-500">NVIDIA NIM & API Catalog Integration</p>
                </div>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNvidiaKey} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NVIDIA API Key
                </label>
                <input
                  type="password"
                  value={nvidiaKeyInput}
                  onChange={(e) => setNvidiaKeyInput(e.target.value)}
                  placeholder={engineStatus?.hasNvidia ? `Current: ${engineStatus.maskedKey} (Paste new to update)` : 'nvapi-...'}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  required={!engineStatus?.hasNvidia}
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Get your free API key at <a href="https://build.nvidia.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline font-semibold">build.nvidia.com</a>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  NVIDIA NIM Model
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="meta/llama-3.1-70b-instruct">meta/llama-3.1-70b-instruct (Recommended - Fast & Powerful)</option>
                  <option value="meta/llama-3.3-70b-instruct">meta/llama-3.3-70b-instruct (Latest Llama 3.3)</option>
                  <option value="nvidia/llama-3.1-nemotron-70b-instruct">nvidia/llama-3.1-nemotron-70b-instruct (NVIDIA Optimized)</option>
                  <option value="mistralai/mixtral-8x22b-instruct-v0.1">mistralai/mixtral-8x22b-instruct-v0.1</option>
                </select>
              </div>

              <div className="rounded-xl bg-emerald-50/70 p-3 border border-emerald-100 flex items-start gap-2 text-[11px] text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Your key is securely stored in your local project environment and used exclusively to generate live assessment questions and answers.
                </p>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingKey || (!nvidiaKeyInput.trim() && !engineStatus?.hasNvidia)}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>{savingKey ? 'Activating...' : 'Activate NVIDIA AI'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
