'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { FileQuestion, Plus, Wand2, Clock, Users, ArrowRight, Trash2, Eye, CheckCircle2 } from 'lucide-react';

export default function TrainerAssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadAssessments = async () => {
    try {
      const res = await fetch('/api/assessments');
      if (res.ok) {
        const data = await res.json();
        setAssessments(data.assessments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/assessments?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage(`Assessment "${title}" deleted.`);
        loadAssessments();
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/20 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Questionnaires & Assessments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author subject questionnaires, monitor passing benchmarks, and review trainee attempt scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/trainer/ai-mcq-generator"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            <Wand2 className="w-4 h-4" /> AI Auto-Generate
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading published assessments...</div>
      ) : assessments.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-subtle space-y-3">
          <FileQuestion className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No assessments created yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Use the AI Auto-Generator to synthesize and publish your first multiple-choice assessment.
          </p>
          <Link
            href="/trainer/ai-mcq-generator"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700 transition"
          >
            <Wand2 className="w-3.5 h-3.5" /> Launch AI Studio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                    {a.subject}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" /> {a.durationMinutes} Mins • {a.questions?.length || 5} Questions
                    </span>
                    <button
                      onClick={() => handleDelete(a.id, a.title)}
                      title="Delete Assessment"
                      className="p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h2 className="text-base font-bold text-slate-900 leading-snug">{a.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{a.description}</p>

                <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Benchmark: {a.passingMarks} / {a.totalMarks} Marks</span>
                  <span className="font-bold text-emerald-600">Active Benchmark</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" /> {a.attempts?.length || 0} Attempts
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/trainee/assessments/${a.id}`}
                    className="font-bold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </Link>
                  <button
                    onClick={() => {
                      setToastMessage(`Viewing ${a.attempts?.length || 0} attempt records for ${a.title}`);
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    Inspect Attempts <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
