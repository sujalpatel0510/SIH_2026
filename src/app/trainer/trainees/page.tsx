'use client';

import React from 'react';
import { Users, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

export default function TrainerTraineesPage() {
  const trainees = [
    {
      id: '1',
      name: 'Priya Sharma',
      email: 'priya.sharma@campuspilot.ai',
      course: 'Machine Learning & Neural Systems Mastery',
      progress: 45,
      score: 88.5,
      gapStatus: 'Machine Learning (Level 2 → 4 in progress)',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Rohan Kulkarni',
      email: 'rohan.k@campuspilot.ai',
      course: 'Machine Learning & Neural Systems Mastery',
      progress: 80,
      score: 92.0,
      gapStatus: 'Resolved (Level 4/5 Verified)',
      status: 'HIGH PERFORMER',
    },
    {
      id: '3',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@campuspilot.ai',
      course: 'Advanced Python for Production Engineering',
      progress: 100,
      score: 96.0,
      gapStatus: 'Certified with Distinction',
      status: 'COMPLETED',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Trainee Cohort & Performance Monitoring
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor participation rates, assessment scores, and competency gap bridge rates across enrolled cohorts.
        </p>
      </div>

      {/* Cohort Table */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" /> Enrolled Trainees (Current Cohort)
          </h2>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            92% Active Participation Rate
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-100 font-bold uppercase text-[10px]">
                <th className="py-3.5 px-6">Trainee</th>
                <th className="py-3.5 px-6">Enrolled Program</th>
                <th className="py-3.5 px-6">Course Progress</th>
                <th className="py-3.5 px-6">Avg Score</th>
                <th className="py-3.5 px-6">Competency Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainees.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    <p>{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{t.email}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{t.course}</td>
                  <td className="py-4 px-6">
                    <div className="w-28 space-y-1">
                      <span className="font-bold text-slate-800">{t.progress}%</span>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${t.progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-indigo-600">{t.score}%</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-700">
                      {t.gapStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => alert(`Opening learning telemetry for ${t.name}`)}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
