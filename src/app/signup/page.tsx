'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, ArrowRight, User, Mail, Lock, Briefcase, GraduationCap } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [role, setRole] = useState<'TRAINEE' | 'TRAINER'>('TRAINEE');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await register({
      name,
      email,
      password,
      role,
      department,
      qualifications,
      careerGoal,
      skills,
    });
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50 bg-grid-pattern">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-500">Join the AI-driven capacity building network</p>
        </div>

        <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-card">
          {/* Role selector tab */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setRole('TRAINEE')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                role === 'TRAINEE' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register as Trainee
            </button>
            <button
              type="button"
              onClick={() => setRole('TRAINER')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                role === 'TRAINER' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register as Trainer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Vikram Batra"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vikram@org.gov.in"
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department / Branch</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Cloud & Systems"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
                <input
                  type="text"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  placeholder="e.g. B.Tech Computer Science"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>

            {role === 'TRAINEE' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Career Goal</label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. AI/ML Platform Engineer"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expertise Domains</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Machine Learning, Deep Learning, Cloud Architecture"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 py-3 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:bg-brand-700 transition flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Creating Profile...' : 'Complete Registration'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-600 hover:underline">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
