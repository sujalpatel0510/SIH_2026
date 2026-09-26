'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  BookOpen,
  FileQuestion,
  Star,
  PlusCircle,
  Wand2,
  TrendingUp,
  Award,
  ArrowRight,
  FolderArchive,
} from 'lucide-react';

export default function TrainerDashboard() {
  const { user } = useAuth();
  const profile = user?.trainerProfile || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200 mb-1">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            Master Trainer Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome, {user?.name || 'Trainer'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specialization: <span className="font-semibold text-slate-800">{user?.trainerProfile?.expertise || 'Machine Learning & Deep Neural Systems'}</span> • Rating: {user?.trainerProfile?.rating || '5.0'} / 5.0
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/trainer/ai-mcq-generator"
            prefetch={true}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Wand2 className="w-4 h-4" />
            AI MCQ Generator
          </Link>
          <Link
            href="/trainer/courses"
            prefetch={true}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
          >
            <PlusCircle className="w-4 h-4 text-brand-600" />
            Create Course
          </Link>
        </div>
      </div>

      {/* Trainer Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Trainees Trained</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1,420+</span>
            <span className="text-[11px] font-semibold text-emerald-600">+14% YoY</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active across 3 programs</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Authored Courses</span>
            <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">2</span>
            <span className="text-[11px] font-semibold text-brand-600">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Machine Learning, Python Systems</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Questionnaires</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">4</span>
            <span className="text-[11px] font-semibold text-amber-600">Published</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Avg Trainee Score: 88.5%</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Trainer Rating</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">4.95</span>
            <span className="text-[11px] font-semibold text-emerald-600">Top 1%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on 280+ feedback reviews</p>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Active Courses Supervised */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                My Active Training Programs
              </h2>
              <Link href="/trainer/courses" className="text-xs font-bold text-indigo-600 hover:underline">
                Manage Courses
              </Link>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                    Machine Learning
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Machine Learning & Neural Systems Mastery
                  </h3>
                  <p className="text-xs text-slate-500">
                    32 Hours • Intermediate • Enrolled: <strong className="text-slate-800">142 Trainees</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/trainer/trainees"
                    prefetch={true}
                    className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 transition"
                  >
                    View Analytics
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                    Software Engineering
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Advanced Python for Production Engineering
                  </h3>
                  <p className="text-xs text-slate-500">
                    20 Hours • Advanced • Enrolled: <strong className="text-slate-800">88 Trainees</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/trainer/trainees"
                    prefetch={true}
                    className="rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    View Analytics
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* AI MCQ Generator Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-indigo-900 to-purple-900 p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-200 border border-white/20">
                AI Powered Assessment Studio
              </span>
              <h3 className="text-lg font-bold">Auto-Generate MCQs from Study Notes</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Paste syllabus text or curriculum research papers to instantly extract concepts and generate multiple-choice assessments with answer keys.
              </p>
            </div>
            <Link
              href="/trainer/ai-mcq-generator"
              prefetch={true}
              className="rounded-xl bg-white px-5 py-3 text-xs font-bold text-indigo-950 hover:bg-slate-100 transition shrink-0 flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4 text-indigo-600" />
              Launch MCQ AI
            </Link>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Management
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/trainer/resources"
                prefetch={true}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <FolderArchive className="w-4 h-4 text-indigo-600" /> Upload Course Material
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/trainer/assessments"
                prefetch={true}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <FileQuestion className="w-4 h-4 text-amber-600" /> Create Questionnaire
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/trainer/profile"
                prefetch={true}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" /> Update Master Credentials
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
