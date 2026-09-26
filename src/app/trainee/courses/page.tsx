'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Search,
  Clock,
  CheckCircle2,
  X,
  PlayCircle,
  FileText,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function CourseCatalogPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('cp_courses_cache');
        return cached ? JSON.parse(cached) : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('cp_courses_cache');
    }
    return false;
  });
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      async function loadCourses() {
        try {
          const query = new URLSearchParams();
          if (search) query.append('search', search);
          if (category !== 'ALL') query.append('category', category);
          query.append('traineeId', user?.id || '');

          const res = await fetch(`/api/courses?${query.toString()}`);
          if (res.ok) {
            const data = await res.json();
            setCourses(data.courses || []);
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('cp_courses_cache', JSON.stringify(data.courses || []));
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }

      loadCourses();
    }, 250);

    return () => clearTimeout(handler);
  }, [search, category, user]);

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrollingId(courseId);
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, traineeId: user?.id }),
      });

      if (res.ok) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Update local courses state immediately
        setCourses(prev => prev.map(c => {
          if (c.id === courseId) {
            return {
              ...c,
              enrollments: [{ id: 'new-enrollment', progress: 0 }]
            };
          }
          return c;
        }));

        if (selectedCourse?.id === courseId) {
          setSelectedCourse((prev: any) => ({
            ...prev,
            enrollments: [{ id: 'new-enrollment', progress: 0 }]
          }));
        }

        setToastMessage('Successfully enrolled! Your learning path has been updated.');
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setEnrollingId(null);
    }
  };

  const categories = ['ALL', 'Artificial Intelligence', 'Cloud & Infrastructure', 'Programming'];

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-600/20"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-brand-600" />
            Accredited Learning Directory
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Course Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">
            Explore structured capacity building curricula taught by industry certified master trainers.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, subject, or skill..."
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`relative px-3.5 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 shrink-0 ${
                  isActive
                    ? 'text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCatalogCategory"
                    className="absolute inset-0 rounded-xl bg-brand-600 -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Grid with layout animations */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
          <span>Loading catalog from PostgreSQL...</span>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {courses.map((course) => {
              const isEnrolled = course.enrollments && course.enrollments.length > 0;
              const isEnrolling = enrollingId === course.id;

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  <div
                    onClick={() => setSelectedCourse(course)}
                    className="cursor-pointer"
                  >
                    <div className="relative overflow-hidden h-44 bg-slate-100">
                      <img
                        src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 rounded-full bg-slate-900/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white">
                        {course.difficulty}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-brand-700 border border-brand-200/50">
                          {course.subject}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3" /> {course.durationHours} Hours
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                        <img
                          src={course.trainer?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={course.trainer?.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <span className="text-xs font-semibold text-slate-700">{course.trainer?.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-2">
                    {isEnrolled ? (
                      <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" /> Enrolled (Progress: {course.enrollments[0]?.progress || 0}%)
                      </div>
                    ) : (
                      <button
                        disabled={isEnrolling}
                        onClick={() => handleEnroll(course.id)}
                        className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-xs font-bold rounded-xl transition-all text-center shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isEnrolling ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Enrolling...</span>
                          </>
                        ) : (
                          <>
                            <span>Enroll in Course</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="w-full py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition text-center"
                    >
                      View Syllabus & Study Materials
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Course Detail Modal Drawer */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} maxWidth="max-w-2xl">
        {selectedCourse && (
          <div className="overflow-hidden rounded-3xl relative">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center transition active:scale-90 z-20 backdrop-blur-sm"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative h-48 sm:h-60 bg-slate-100">
              <img
                src={selectedCourse.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                alt={selectedCourse.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="rounded-md bg-brand-500 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    {selectedCourse.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {selectedCourse.title}
                  </h2>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-600" />
                  <span>Duration: {selectedCourse.durationHours} Hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Difficulty: {selectedCourse.difficulty}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Subject: {selectedCourse.subject}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Curriculum Description</h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedCourse.description}
                </p>
              </div>

              {/* Trainer info */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80 flex items-center gap-3.5">
                <img
                  src={selectedCourse.trainer?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={selectedCourse.trainer?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{selectedCourse.trainer?.name}</div>
                  <div className="text-[11px] text-slate-500">{selectedCourse.trainer?.trainerProfile?.qualifications || 'Master Instructor'}</div>
                  <div className="text-[11px] text-brand-600 font-semibold mt-0.5">{selectedCourse.trainer?.trainerProfile?.expertise}</div>
                </div>
              </div>

              {/* Learning Resources */}
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Course Modules & Materials ({selectedCourse.resources?.length || 0})</h4>
                {selectedCourse.resources && selectedCourse.resources.length > 0 ? (
                  <div className="space-y-2">
                    {selectedCourse.resources.map((res: any) => (
                      <div key={res.id} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-brand-600" />
                          <div>
                            <p className="font-bold text-slate-800">{res.title}</p>
                            <p className="text-[10px] text-slate-400">{res.type} • {res.fileSize || '3.2 MB'}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-brand-600">Included</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Core learning syllabus, laboratory files and video lectures unlocked upon enrollment.</p>
                )}
              </div>

              {/* Footer action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Close
                </button>

                {selectedCourse.enrollments && selectedCourse.enrollments.length > 0 ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4" /> Already Enrolled
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(selectedCourse.id)}
                    disabled={enrollingId === selectedCourse.id}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-xs font-bold text-white shadow-md transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {enrollingId === selectedCourse.id ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Enroll Now Free</span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
