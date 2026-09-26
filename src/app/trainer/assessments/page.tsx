'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FileQuestion,
  Plus,
  Wand2,
  Clock,
  Users,
  ArrowRight,
  Trash2,
  Eye,
  CheckCircle2,
  X,
  XCircle,
  Award,
  BarChart2,
  Calendar
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function TrainerAssessmentsPage() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectAssessment, setInspectAssessment] = useState<any | null>(null);

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
                    onClick={() => setInspectAssessment(a)}
                    className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg hover:bg-indigo-100 transition"
                  >
                    Inspect Attempts <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INSPECT ATTEMPTS MODAL */}
      <Modal isOpen={!!inspectAssessment} onClose={() => setInspectAssessment(null)} maxWidth="max-w-3xl">
        {inspectAssessment && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                    {inspectAssessment.subject}
                  </span>
                  <span className="text-xs text-slate-400">• Passing Mark: {inspectAssessment.passingMarks} / {inspectAssessment.totalMarks}</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">{inspectAssessment.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">Trainee Attempt Registry & Performance Analytics</p>
              </div>
              <button
                onClick={() => setInspectAssessment(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Analytics Summary */}
            {(() => {
              const attempts = inspectAssessment.attempts || [];
              const total = attempts.length;
              const passed = attempts.filter((att: any) => att.passed).length;
              const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
              const avgScore = total > 0 ? (attempts.reduce((acc: number, cur: any) => acc + (cur.score || 0), 0) / total).toFixed(1) : 0;
              const maxScore = total > 0 ? Math.max(...attempts.map((att: any) => att.score || 0)) : 0;

              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400">Total Submissions</p>
                    <p className="text-xl font-black text-slate-900 mt-1">{total}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50/50 p-3.5 border border-emerald-100">
                    <p className="text-[11px] font-semibold text-emerald-600">Pass Rate</p>
                    <p className="text-xl font-black text-emerald-700 mt-1">{passRate}%</p>
                  </div>
                  <div className="rounded-2xl bg-indigo-50/50 p-3.5 border border-indigo-100">
                    <p className="text-[11px] font-semibold text-indigo-600">Average Score</p>
                    <p className="text-xl font-black text-indigo-700 mt-1">{avgScore} pts</p>
                  </div>
                  <div className="rounded-2xl bg-purple-50/50 p-3.5 border border-purple-100">
                    <p className="text-[11px] font-semibold text-purple-600">Top Score</p>
                    <p className="text-xl font-black text-purple-700 mt-1">{maxScore} / {inspectAssessment.totalMarks}</p>
                  </div>
                </div>
              );
            })()}

            {/* Attempts Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Submission Records
              </h3>

              {(!inspectAssessment.attempts || inspectAssessment.attempts.length === 0) ? (
                <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-2">
                  <FileQuestion className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No attempts submitted yet</p>
                  <p className="text-[11px] text-slate-400">
                    When trainees take this assessment, their responses, scores, and timestamps will record here automatically.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200/80 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-100">
                        <th className="py-3 px-4">Trainee</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Percentage</th>
                        <th className="py-3 px-4">Result</th>
                        <th className="py-3 px-4 text-right">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inspectAssessment.attempts.map((att: any, idx: number) => {
                        const pct = Math.round((att.score / inspectAssessment.totalMarks) * 100);
                        const traineeName = att.trainee?.name || `Trainee #${idx + 1}`;
                        const traineeEmail = att.trainee?.email || 'trainee@campuspilot.ai';
                        const dateStr = att.completedAt ? new Date(att.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently';

                        return (
                          <tr key={att.id || idx} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{traineeName}</p>
                              <p className="text-[10px] text-slate-400">{traineeEmail}</p>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-800">
                              {att.score} / {inspectAssessment.totalMarks}
                            </td>
                            <td className="py-3 px-4 font-semibold text-slate-600">
                              {pct}%
                            </td>
                            <td className="py-3 px-4">
                              {att.passed ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3" /> PASSED
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                                  <XCircle className="w-3 h-3" /> FAILED
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                              {dateStr}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setInspectAssessment(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                Close Registry
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
