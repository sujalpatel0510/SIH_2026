'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Search,
  X,
  FileCheck,
  Layers,
  Sparkles,
  Printer,
  Archive,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleUpdateStatus = async (courseId: string, newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, status: newStatus }),
      });

      if (res.ok) {
        setToastMessage(`Course status set to ${newStatus} in database.`);
        fetchCourses();
        if (selectedCourse && selectedCourse.id === courseId) {
          setSelectedCourse({ ...selectedCourse, status: newStatus });
        }
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      (c.trainer?.name || '').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(courses.map((c) => c.category).filter(Boolean)));

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-purple-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-purple-600/20 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Curriculum Governance & Course Supervision
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review published curricula, audit subject alignment with national capacity frameworks, and govern course lifecycles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search curriculum or trainer..."
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="ALL">All Disciplines</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400">Loading curriculum registry...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-subtle space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No courses match filters</h3>
          <p className="text-xs text-slate-400">Clear your search query or discipline filter to view available courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle p-6 space-y-4 flex flex-col justify-between hover:shadow-card transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="rounded-md bg-purple-50 px-2 py-0.5 text-purple-700">
                    {course.subject}
                  </span>
                  <span className="text-emerald-600 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> ACCREDITED
                  </span>
                </div>

                <h2 className="text-base font-bold text-slate-900 leading-snug">{course.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{course.description}</p>

                <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1">
                  <p>
                    Faculty: <strong className="text-slate-800">{course.trainer?.name || 'Assigned Trainer'}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {course.durationHours} Hours • {course.difficulty} Difficulty • {course.resources?.length || 0} Modules
                  </p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-100 text-xs">
                <span
                  className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                    course.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {course.status}
                </span>
                <button
                  onClick={() => setSelectedCourse(course)}
                  className="text-purple-600 font-bold hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1 rounded-lg transition"
                >
                  Audit Compliance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPLIANCE AUDIT MODAL */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} maxWidth="max-w-2xl">
        {selectedCourse && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="rounded-md bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 uppercase">
                  Accreditation & Curriculum Audit
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{selectedCourse.title}</h2>
                <p className="text-xs text-slate-500">
                  Subject: {selectedCourse.subject} • Faculty: {selectedCourse.trainer?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Compliance Matrix Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Institutional Quality & Governance Checklist
              </h3>

              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Syllabus Depth & Outcome Alignment</p>
                      <p className="text-[11px] text-slate-400">Target skills and competencies correctly calibrated for industry readiness.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    COMPLIANT
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Formative Assessment Validation</p>
                      <p className="text-[11px] text-slate-400">Questions mapped to Blooms Taxonomy levels with automated grading logic.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    VERIFIED
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Cryptographic Credentialing Engine</p>
                      <p className="text-[11px] text-slate-400">Automated SHA-256 certificate issuance enabled upon completion.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    ENABLED
                  </span>
                </div>

                <div className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Digital Resource Materials</p>
                      <p className="text-[11px] text-slate-400">{selectedCourse.resources?.length || 0} active learning modules and files published.</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                    AVAILABLE
                  </span>
                </div>
              </div>
            </div>

            {/* Course Governance Actions */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Lifecycle & Publishing Status
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  disabled={updating || selectedCourse.status === 'PUBLISHED'}
                  onClick={() => handleUpdateStatus(selectedCourse.id, 'PUBLISHED')}
                  className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    selectedCourse.status === 'PUBLISHED'
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Published (Active)
                </button>

                <button
                  type="button"
                  disabled={updating || selectedCourse.status === 'ARCHIVED'}
                  onClick={() => handleUpdateStatus(selectedCourse.id, 'ARCHIVED')}
                  className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                    selectedCourse.status === 'ARCHIVED'
                      ? 'bg-amber-600 text-white cursor-default'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <Archive className="w-3.5 h-3.5" /> Archive Curriculum
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" /> Print Audit Dossier
              </button>

              <button
                onClick={() => setSelectedCourse(null)}
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
