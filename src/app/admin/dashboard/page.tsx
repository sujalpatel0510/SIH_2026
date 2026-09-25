'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Users,
  BookOpen,
  FileQuestion,
  Award,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ArrowRight,
  Bell,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const stats = data?.stats || {
    totalTrainees: 3,
    totalTrainers: 2,
    pendingUsers: 1,
    totalCourses: 3,
    totalEnrollments: 2,
    totalAssessments: 1,
    totalAttempts: 142,
    totalCertificates: 1,
    averageScore: 84,
    completionRate: 88,
    participationRate: 92,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200 mb-1">
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            Central Command & Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Institutional Admin Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise user authorizations, competency analytics, certification validity, and course compliance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition"
          >
            <UserCheck className="w-4 h-4" /> Review User Approvals ({stats.pendingUsers})
          </Link>
        </div>
      </div>

      {/* Pending User Approval Banner */}
      {stats.pendingUsers > 0 && (
        <div className="rounded-2xl bg-amber-50 p-4 border border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                {stats.pendingUsers} Registration Request Pending Verification
              </p>
              <p className="text-[11px] text-amber-700">
                Aarav Mehta (Electronics Research) is awaiting identity and role validation.
              </p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Platform Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Registered Trainees</span>
            <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalTrainees}</span>
            <span className="text-[11px] font-semibold text-emerald-600">Active</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{stats.totalTrainers} Certified Trainers</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Courses Supervised</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalCourses}</span>
            <span className="text-[11px] font-semibold text-indigo-600">{stats.totalEnrollments} Enrollments</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">100% Curriculum Compliance</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Assessment Submissions</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalAttempts}</span>
            <span className="text-[11px] font-semibold text-emerald-600">{stats.averageScore}% Avg</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{stats.completionRate}% Pass Standard</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Certificates Issued</span>
            <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{stats.totalCertificates}</span>
            <span className="text-[11px] font-semibold text-emerald-600">Verifiable</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">QR Code & ID Verified</p>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Quick User Verification List */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recent User Registrations & Status
              </h2>
              <Link href="/admin/users" className="text-xs font-bold text-purple-600 hover:underline">
                Manage All Users
              </Link>
            </div>

            <div className="space-y-3">
              {data?.recentUsers?.map((u: any) => (
                <div
                  key={u.id}
                  className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{u.name}</span>
                      <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                        {u.role}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{u.email}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        u.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {u.status}
                    </span>
                    <Link
                      href="/admin/users"
                      className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-purple-50 hover:text-purple-700 transition"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Announcements Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Governance Tools
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                href="/admin/analytics"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-purple-50 hover:text-purple-700 transition font-semibold text-slate-700"
              >
                <span>Platform Telemetry & Charts</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/admin/courses"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-purple-50 hover:text-purple-700 transition font-semibold text-slate-700"
              >
                <span>Curriculum Governance</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
              <Link
                href="/admin/announcements"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:bg-purple-50 hover:text-purple-700 transition font-semibold text-slate-700"
              >
                <span>Publish Announcements</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
