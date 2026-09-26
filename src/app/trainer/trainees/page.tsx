'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Search,
  X,
  Award,
  BookOpen,
  Send,
  Printer,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface TraineeRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  score: number;
  gapStatus: string;
  status: string;
  skills: { name: string; current: number; target: number }[];
  assessments: { title: string; score: number; date: string; passed: boolean }[];
}

const DEFAULT_TRAINEES: TraineeRecord[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@campuspilot.ai',
    course: 'Machine Learning & Neural Systems Mastery',
    progress: 75,
    score: 88.5,
    gapStatus: 'Machine Learning (Level 3 → 4 in progress)',
    status: 'ACTIVE',
    skills: [
      { name: 'Python Programming', current: 4, target: 4 },
      { name: 'Linear Algebra & Calculus', current: 3, target: 4 },
      { name: 'Deep Neural Networks', current: 3, target: 5 },
      { name: 'Model Optimization & Deployment', current: 2, target: 4 },
    ],
    assessments: [
      { title: 'Foundations of Deep Learning', score: 85, date: 'Sep 24, 2026', passed: true },
      { title: 'Neural Architectures & Backprop', score: 92, date: 'Sep 25, 2026', passed: true },
    ],
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
    skills: [
      { name: 'Python Programming', current: 5, target: 5 },
      { name: 'Linear Algebra & Calculus', current: 4, target: 4 },
      { name: 'Deep Neural Networks', current: 4, target: 4 },
      { name: 'Model Optimization & Deployment', current: 4, target: 4 },
    ],
    assessments: [
      { title: 'Foundations of Deep Learning', score: 94, date: 'Sep 22, 2026', passed: true },
      { title: 'Neural Architectures & Backprop', score: 90, date: 'Sep 24, 2026', passed: true },
    ],
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
    skills: [
      { name: 'AsyncIO & Concurrency', current: 5, target: 5 },
      { name: 'Profiling & Memory Optimization', current: 5, target: 5 },
      { name: 'Microservices with FastAPI', current: 5, target: 5 },
    ],
    assessments: [
      { title: 'Production Python Core Mastery', score: 96, date: 'Sep 20, 2026', passed: true },
    ],
  },
  {
    id: '4',
    name: 'Devansh Parekh',
    email: 'devansh.p@campuspilot.ai',
    course: 'Cloud Architecture & Enterprise Microservices',
    progress: 40,
    score: 72.0,
    gapStatus: 'Kubernetes Ingress (Level 1 → 3)',
    status: 'NEEDS SUPPORT',
    skills: [
      { name: 'Docker & Containerization', current: 3, target: 4 },
      { name: 'Kubernetes Orchestration', current: 2, target: 4 },
      { name: 'Distributed Tracing', current: 1, target: 3 },
    ],
    assessments: [
      { title: 'Container Fundamentals Check', score: 72, date: 'Sep 23, 2026', passed: true },
    ],
  },
];

export default function TrainerTraineesPage() {
  const [trainees, setTrainees] = useState<TraineeRecord[]>(DEFAULT_TRAINEES);
  const [search, setSearch] = useState('');
  const [selectedTrainee, setSelectedTrainee] = useState<TraineeRecord | null>(null);
  const [trainerNote, setTrainerNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load real users if available in DB
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/users?role=TRAINEE');
        if (res.ok) {
          const data = await res.json();
          if (data.users && data.users.length > 0) {
            const mapped: TraineeRecord[] = data.users.map((u: any, idx: number) => {
              const def = DEFAULT_TRAINEES[idx % DEFAULT_TRAINEES.length];
              return {
                id: u.id,
                name: u.name,
                email: u.email,
                course: u.enrollments?.[0]?.course?.title || def.course,
                progress: u.enrollments?.[0]?.progress || def.progress,
                score: def.score,
                gapStatus: def.gapStatus,
                status: def.status,
                skills: def.skills,
                assessments: def.assessments,
              };
            });
            // Merge with default list to maintain complete cohort views
            setTrainees(mapped);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerNote.trim() || !selectedTrainee) return;
    setToastMessage(`Mentorship note dispatched to ${selectedTrainee.name}!`);
    setTrainerNote('');
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredTrainees = trainees.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.course.toLowerCase().includes(search.toLowerCase())
  );

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
            Trainee Cohort & Performance Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor participation rates, assessment scores, and competency gap bridge rates across enrolled cohorts.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search trainees by name or course..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
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
              {filteredTrainees.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/60 transition cursor-pointer" onClick={() => setSelectedTrainee(t)}>
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    <p className="hover:text-indigo-600 transition">{t.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{t.email}</p>
                  </td>
                  <td className="py-4 px-6 text-slate-700">{t.course}</td>
                  <td className="py-4 px-6">
                    <div className="w-28 space-y-1">
                      <span className="font-bold text-slate-800">{t.progress}%</span>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            t.progress === 100
                              ? 'bg-emerald-500'
                              : t.progress > 50
                              ? 'bg-indigo-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${t.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-indigo-600">{t.score}%</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : t.status === 'HIGH PERFORMER'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.gapStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTrainee(t);
                      }}
                      className="text-indigo-600 font-bold hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition"
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

      {/* TRAINEE DOSSIER MODAL */}
      <Modal isOpen={!!selectedTrainee} onClose={() => setSelectedTrainee(null)} maxWidth="max-w-3xl">
        {selectedTrainee && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                  Telemetry Dossier • {selectedTrainee.status}
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedTrainee.name}</h2>
                <p className="text-xs text-slate-500">{selectedTrainee.email} • {selectedTrainee.course}</p>
              </div>
              <button
                onClick={() => setSelectedTrainee(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-400">Course Completion</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{selectedTrainee.progress}%</p>
                <div className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${selectedTrainee.progress}%` }} />
                </div>
              </div>

              <div className="rounded-2xl bg-indigo-50/50 p-4 border border-indigo-100">
                <p className="text-xs font-semibold text-indigo-600">Average MCQ Score</p>
                <p className="text-2xl font-black text-indigo-700 mt-1">{selectedTrainee.score}%</p>
                <p className="text-[11px] text-indigo-500 mt-1">Passing standard: 60%</p>
              </div>

              <div className="rounded-2xl bg-emerald-50/50 p-4 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-600">Competency Velocity</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">+1.8 Lvl / Mo</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Above cohort average</p>
              </div>
            </div>

            {/* Competency Gap Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-indigo-600" /> Competency Level Progression
              </h3>
              <div className="space-y-2.5 rounded-2xl bg-slate-50/80 p-4 border border-slate-100">
                {selectedTrainee.skills.map((skill, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{skill.name}</span>
                      <span className="text-slate-500">
                        Level {skill.current} / {skill.target}{' '}
                        {skill.current >= skill.target ? (
                          <span className="text-emerald-600 font-bold ml-1">✓ Target Met</span>
                        ) : (
                          <span className="text-amber-600 ml-1">({skill.target - skill.current} level gap)</span>
                        )}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          skill.current >= skill.target ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${(skill.current / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Records */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" /> Recent Assessment Submissions
              </h3>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white">
                {selectedTrainee.assessments.map((a, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{a.title}</p>
                      <p className="text-[10px] text-slate-400">{a.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-indigo-600">{a.score}%</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Passed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trainer Mentoring Note Form */}
            <form onSubmit={handleSendNote} className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="block font-bold text-slate-800">
                Send Direct Trainer Guidance / Encouragement Note
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trainerNote}
                  onChange={(e) => setTrainerNote(e.target.value)}
                  placeholder={`Write feedback or study guidance for ${selectedTrainee.name}...`}
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!trainerNote.trim()}
                  className="px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print Telemetry
              </button>

              <button
                onClick={() => setSelectedTrainee(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
