'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  GraduationCap,
  Users,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileQuestion,
  BookOpen,
  Award,
  Layers,
  BarChart3,
  Bot,
  ChevronRight,
  Play,
  Zap,
  Lock,
  Cpu,
  Database,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const { switchRoleDemo } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'TRAINEE' | 'TRAINER' | 'ADMIN'>('TRAINEE');

  const howItWorksSteps = [
    { title: '1. Professional Profile', desc: 'Create your comprehensive talent profile with skills, academic records, and career targets.' },
    { title: '2. Competency Mapping', desc: 'The engine continuously maps your capabilities across a standardized 5-tier maturity framework.' },
    { title: '3. AI Gap Detection', desc: 'Identifies exact competency gaps (e.g. Level 2 vs Level 4 requirement) in real time.' },
    { title: '4. Smart Recommendations', desc: 'Matched with accredited curricula and certified master trainers holding proven track records.' },
    { title: '5. Structured Learning', desc: 'Access recorded lectures, interactive slide decks, PDF guides, and hands-on lab code.' },
    { title: '6. MCQ Assessments', desc: 'Validate domain mastery through timed, AI-synthesized or trainer-curated assessments.' },
    { title: '7. Performance Analysis', desc: 'Receive instant grading, deep pedagogical explanations, and automated certifications.' },
    { title: '8. Adaptive Next Steps', desc: 'Competency profile dynamically upgrades in PostgreSQL, unlocking advanced career milestones.' },
  ];

  const enterpriseStats = [
    { label: 'Competency Framework', value: '5-Tier Depth' },
    { label: 'Relational Database', value: 'PostgreSQL 17' },
    { label: 'MCQ Generation Speed', value: '< 2.5s' },
    { label: 'Certification Security', value: 'Verifiable Hash' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32 bg-grid-pattern">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-brand-300/35 via-indigo-300/30 to-purple-300/25 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-50 to-indigo-50 px-4 py-1.5 text-xs font-bold text-brand-700 border border-brand-200 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-brand-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Next-Gen Capacity Building & Skill Excellence Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
                CampusPilot <span className="text-gradient">AI</span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-700 mt-2 font-sans">
                  Smart Learning, Smarter Growth
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                A centralized, AI-driven capacity building and learning management platform. 
                Intelligently maps competencies, pinpoints skill deficits, and orchestrates personalized learning journeys with verified courses and expert master trainers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 hover:from-brand-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => switchRoleDemo('TRAINEE', true)}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-800 border border-slate-200/90 shadow-subtle hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
                >
                  <Play className="h-4 w-4 text-brand-600 fill-brand-600" />
                  Live Platform Preview
                </button>
              </div>

              {/* Quick Workspace Switcher */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-brand-600" /> Instant Role Access:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => switchRoleDemo('TRAINEE', true)}
                    className="px-3 py-1 bg-white hover:bg-brand-50 text-brand-700 font-bold rounded-lg border border-brand-200 shadow-2xs active:scale-95 transition"
                  >
                    Trainee
                  </button>
                  <button
                    onClick={() => switchRoleDemo('TRAINER', true)}
                    className="px-3 py-1 bg-white hover:bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200 shadow-2xs active:scale-95 transition"
                  >
                    Trainer
                  </button>
                  <button
                    onClick={() => switchRoleDemo('ADMIN', true)}
                    className="px-3 py-1 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-lg border border-purple-200 shadow-2xs active:scale-95 transition"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Main Interactive Preview Card */}
                <div className="rounded-3xl bg-white p-6 shadow-2xl border border-slate-200/80 backdrop-blur-xl relative z-10 space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
                      AI Competency Telemetry
                    </span>
                  </div>

                  {/* Competency Gap Detected Preview */}
                  <div className="rounded-2xl bg-amber-50/70 p-4 border border-amber-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-amber-600" /> Competency Gap Detected
                      </span>
                      <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">
                        Level 2/5 (Target 4)
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/80 mt-2 font-medium">
                      Machine Learning & Neural Architectures requires training intervention.
                    </p>
                  </div>

                  {/* Matched Recommendation */}
                  <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-brand-600" /> AI Matched Course & Trainer
                      </span>
                      <span className="text-xs font-extrabold text-brand-600">96.5% Match</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Machine Learning & Neural Systems Mastery
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Trainer: <span className="font-semibold text-slate-800">Dr. Rajesh Verma</span> (Ph.D. IIT Bombay, 8+ yrs exp)
                    </p>
                  </div>

                  {/* Verified Assessment Score Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500 font-semibold">Readiness Score</span>
                      <span className="font-extrabold text-brand-600">84% Optimal</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-600 to-indigo-600 rounded-full w-[84%]" />
                    </div>
                  </div>
                </div>

                {/* Floating pill 1 */}
                <div className="absolute -top-5 -left-6 rounded-2xl bg-white p-3.5 shadow-xl border border-slate-200 flex items-center gap-3 animate-float-slow z-20">
                  <div className="h-9 w-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">AI Competency Mapping</p>
                    <p className="text-[10px] text-slate-500">Live 5-Tier Skill Tracking</p>
                  </div>
                </div>

                {/* Floating pill 2 */}
                <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-3.5 shadow-xl border border-slate-200 flex items-center gap-3 animate-float-delayed z-20">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Verified Certifications</p>
                    <p className="text-[10px] text-slate-500">Cryptographically Audited</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM CAPABILITIES BAR */}
      <section className="border-y border-slate-200/80 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-6">
            Enterprise Architecture & Institutional Capacity Building
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {enterpriseStats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500 font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-3.5 py-1 rounded-full border border-brand-200">
              Core Capabilities
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Engineered for Comprehensive Organizational Learning
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transforming capacity building from static repositories into an active, intelligent feedback loop that pinpoints deficits and certifies mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Competency Mapping</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Maps each trainee's current proficiency across 5 competency tiers and flags exact gaps against organizational requirements.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Smart Course & Trainer Matching</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Connects identified competency gaps to curated courses and master trainers holding verified expertise and proven track records.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <FileQuestion className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI MCQ Assessment Generation</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Trainers upload syllabus notes and research papers; our AI extracts key concepts and generates subject-wise MCQs with explanations.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Digital Verified Certifications</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Passing assessments automatically updates competency benchmarks and issues tamper-proof certificates with unique verification codes.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Institutional Analytics & RBAC</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Administrators supervise user approvals, course governance, participation metrics, and platform completion rates from one command center.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-3xl bg-white p-6 sm:p-7 border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform shadow-xs">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">AI Learning Copilot</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                An embedded assistant capable of analyzing pending deadlines, explaining tricky training concepts, and guiding personalized study schedules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (THE CORE PRODUCT LOOP) */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
              The Intelligent Learning Loop
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              From Skill Gap to Verified Mastery
            </h2>
            <p className="text-sm text-slate-600">
              A closed-loop capacity building process that ensures continuous upskilling and verifiable organizational readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItWorksSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl bg-slate-50 p-5 border border-slate-200/70 shadow-xs hover:border-brand-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-brand-600">{step.title}</span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold">Step 0{idx + 1}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ROLE-SPECIFIC WORKSPACES SHOWCASE */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 bg-purple-50 px-3.5 py-1 rounded-full border border-purple-200">
              Role-Based Workspaces
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
              Tailored for Every Stakeholder
            </h2>
            <p className="text-sm text-slate-600">
              Dedicated interfaces designed specifically for Trainees, Trainers, and System Administrators.
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-2xl bg-white p-1.5 border border-slate-200/80 shadow-subtle text-xs font-bold relative">
              {(
                [
                  { id: 'TRAINEE', label: 'Trainee Workspace', activeBg: 'from-brand-600 to-indigo-600' },
                  { id: 'TRAINER', label: 'Trainer Studio', activeBg: 'from-indigo-600 to-purple-600' },
                  { id: 'ADMIN', label: 'Admin Command Center', activeBg: 'from-purple-600 to-slate-900' },
                ] as const
              ).map((tab) => {
                const isActive = selectedRole === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedRole(tab.id)}
                    className={`relative z-10 px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                      isActive ? 'text-white font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeRoleTabPill"
                        className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.activeBg} -z-10`}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Content Card */}
          <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-card max-w-4xl mx-auto overflow-hidden">
            <AnimatePresence>
              <motion.div
                key={selectedRole}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              >
            {selectedRole === 'TRAINEE' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 border border-brand-200">
                    Trainee Capabilities
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Personalized Skill Growth & Verified Competencies
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      Visual Competency Mapping with live gap detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      Course discovery, enrollment & lecture materials
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      Timed MCQ assessments with immediate feedback
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0" />
                      Verifiable digital certificates with cryptographic validation
                    </li>
                  </ul>
                  <button
                    onClick={() => switchRoleDemo('TRAINEE', true)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 active:scale-95 transition-all pt-2"
                  >
                    Open Trainee Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50 p-6 border border-brand-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Target: AI Platform Engineer</span>
                    <span className="text-brand-600">84% Met</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full w-[84%]" />
                  </div>
                  <div className="rounded-xl bg-white p-3 text-xs border border-slate-200/80 shadow-xs">
                    <p className="font-bold text-slate-800">Pending Assessment:</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Machine Learning Competency 1</p>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'TRAINER' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 border border-indigo-200">
                    Trainer Capabilities
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Curriculum Management & AI Assessment Studio
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      Publish courses, syllabus modules, and video links
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      Upload PDFs, PPT decks, and study notes to library
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      AI MCQ Generator: convert learning documents to tests
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      Monitor enrolled trainee pass rates and score averages
                    </li>
                  </ul>
                  <button
                    onClick={() => switchRoleDemo('TRAINER', true)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 active:scale-95 transition-all pt-2"
                  >
                    Open Trainer Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>AI MCQ Generator Active</span>
                    <span className="text-emerald-600 font-bold">Ready</span>
                  </div>
                  <div className="rounded-xl bg-white p-3 text-xs border border-slate-200/80 shadow-xs">
                    <p className="font-bold text-slate-800">5 Questions Extracted</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Subject: Machine Learning & Gradient Descent</p>
                  </div>
                </div>
              </div>
            )}

            {selectedRole === 'ADMIN' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="rounded-md bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700 border border-purple-200">
                    Admin Capabilities
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Governance, User Approval & Analytics Command Center
                  </h3>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      Review and approve pending trainees and trainers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      Govern courses, certifications, and compliance standards
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      Publish organization-wide announcements & achievements
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                      Platform telemetry: enrollments, attempts, pass rates
                    </li>
                  </ul>
                  <button
                    onClick={() => switchRoleDemo('ADMIN', true)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 active:scale-95 transition-all pt-2"
                  >
                    Open Admin Dashboard <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-slate-100 p-6 border border-purple-100 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Platform Telemetry</span>
                    <span className="text-purple-600 font-bold">Live</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <p className="text-lg font-bold text-slate-900">142+</p>
                      <p className="text-[10px] text-slate-500 font-medium">Attempts</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                      <p className="text-lg font-bold text-slate-900">92%</p>
                      <p className="text-[10px] text-slate-500 font-medium">Participation</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="rounded-full bg-brand-500/20 px-4 py-1.5 text-xs font-bold text-brand-200 border border-brand-400/30">
            Enterprise Capacity Building Solution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Accelerate Capacity Building with CampusPilot AI
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Centralize your organizational learning, automatically identify skill deficits, and match trainees with targeted courses and expert trainers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="rounded-xl bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-900 shadow-xl hover:bg-slate-100 transition"
            >
              Register New Account
            </Link>
            <button
              onClick={() => switchRoleDemo('TRAINEE')}
              className="rounded-xl bg-brand-600 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-xl hover:bg-brand-700 transition"
            >
              Launch Live Workspace
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12 text-slate-600 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">CampusPilot AI</span>
            <span className="text-[10px] text-slate-400 font-medium">© 2026 Enterprise Edition</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500 font-medium">
            <span className="font-bold text-brand-600">Enterprise Capacity Connect</span>
            <span>PostgreSQL 17 Database</span>
            <span>Role-Based Access Control</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
