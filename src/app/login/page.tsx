'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Lock,
  Mail,
  ShieldCheck,
  GraduationCap,
  UserCheck
} from 'lucide-react';

export default function LoginPage() {
  const { login, switchRoleDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  const handleDemoClick = (role: 'TRAINEE' | 'TRAINER' | 'ADMIN', demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    switchRoleDemo(role, true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 bg-grid-pattern">
      <div className="w-full max-w-md space-y-5">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25 mb-1 group hover:scale-105 transition-transform">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to CampusPilot</h1>
          <p className="text-xs text-slate-500">Access your capacity building & learning workspace</p>
        </div>

        {/* 1-Click Demo Accounts (1 per role) */}
        <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-subtle space-y-2.5">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            Demo Accounts (1-Click Access)
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Trainee: Sujal Patel */}
            <button
              type="button"
              onClick={() => handleDemoClick('TRAINEE', 'sujal@example.com', 'password123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-brand-200 bg-brand-50/50 hover:bg-brand-50 hover:border-brand-400 transition text-center group active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Trainee</span>
              <span className="text-[9px] text-slate-500 truncate max-w-full">Sujal Patel</span>
            </button>

            {/* Trainer: Prof. Sunit Nair */}
            <button
              type="button"
              onClick={() => handleDemoClick('TRAINER', 'sunita.nair@campuspilot.ai', 'password123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-400 transition text-center group active:scale-95"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Trainer</span>
              <span className="text-[9px] text-slate-500 truncate max-w-full">Prof. Sunit Nair</span>
            </button>

            {/* Admin: Dr. Alok Nath */}
            <button
              type="button"
              onClick={() => handleDemoClick('ADMIN', 'admin@campuspilot.ai', 'admin123')}
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-50 hover:border-purple-400 transition text-center group active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Admin</span>
              <span className="text-[9px] text-slate-500 truncate max-w-full">Dr. Alok Nath</span>
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <div className="rounded-3xl bg-white p-7 sm:p-8 border border-slate-200/80 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campuspilot.ai"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/40"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-indigo-700 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-brand-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
