'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FileQuestion, Clock, Award, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { getClientCached, setClientCached } from '@/lib/client-cache';

export default function AssessmentsListPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>(() =>
    getClientCached('trainee_assessments', [])
  );
  const [loading, setLoading] = useState(() => assessments.length === 0);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const res = await fetch(`/api/assessments?traineeId=${user?.id || ''}`);
        if (res.ok) {
          const data = await res.json();
          setAssessments(data.assessments || []);
          setClientCached('trainee_assessments', data.assessments || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadAssessments();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200 mb-1">
          <FileQuestion className="w-3 h-3 text-amber-600" />
          Competency Verification Benchmarks
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Subject-Wise MCQ Assessments
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete assessments to measure competency growth, qualify for digital certifications, and resolve skill gaps.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading assessments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((assess) => {
            const latestAttempt = assess.attempts && assess.attempts.length > 0 ? assess.attempts[0] : null;

            return (
              <div
                key={assess.id}
                className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                      {assess.subject}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {assess.durationMinutes} Minutes • {assess.questions.length} MCQs
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{assess.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{assess.description}</p>

                  <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500">Passing Benchmark:</span>
                    <span className="font-bold text-slate-800">
                      {assess.passingMarks} / {assess.totalMarks} Marks (60%)
                    </span>
                  </div>

                  {latestAttempt && (
                    <div
                      className={`rounded-xl p-3 text-xs border flex items-center justify-between ${
                        latestAttempt.passed
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200'
                      }`}
                    >
                      <span className="font-semibold flex items-center gap-1.5">
                        {latestAttempt.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                        )}
                        Last Attempt: {latestAttempt.percentage}%
                      </span>
                      <span className="font-bold">{latestAttempt.passed ? 'PASSED' : 'RETRY NEEDED'}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Course: <strong className="text-slate-800">{assess.course?.title}</strong>
                  </span>
                  <Link
                    href={`/trainee/assessments/${assess.id}`}
                    prefetch={true}
                    className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition flex items-center gap-1"
                  >
                    {latestAttempt ? 'Re-attempt MCQ' : 'Start Assessment'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
