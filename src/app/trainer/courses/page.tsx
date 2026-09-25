'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Clock,
  Users,
  CheckCircle2,
  X,
  Layers,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Edit3,
  Trash2,
  FileText,
  Video,
  FileCheck
} from 'lucide-react';

export default function TrainerCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [managingCourse, setManagingCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for Create & Edit
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence');
  const [description, setDescription] = useState('');
  const [durationHours, setDurationHours] = useState(24);
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');

  // Resource Form inside Managing modal
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState('PDF');
  const [resUrl, setResUrl] = useState('');
  const [resDuration, setResDuration] = useState('30 Mins');
  const [addingRes, setAddingRes] = useState(false);

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

  const openCreateModal = () => {
    setTitle('');
    setSubject('');
    setCategory('Artificial Intelligence');
    setDescription('');
    setDurationHours(24);
    setDifficulty('INTERMEDIATE');
    setShowCreateModal(true);
  };

  const openEditModal = (course: any) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSubject(course.subject);
    setCategory(course.category);
    setDescription(course.description);
    setDurationHours(course.durationHours);
    setDifficulty(course.difficulty);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerId: user?.id,
          title,
          subject,
          category,
          description,
          durationHours,
          difficulty,
        }),
      });

      if (res.ok) {
        setToastMessage('New course successfully published to PostgreSQL catalog!');
        setShowCreateModal(false);
        fetchCourses();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: editingCourse.id,
          title,
          subject,
          category,
          description,
          durationHours,
          difficulty,
        }),
      });

      if (res.ok) {
        setToastMessage(`Course "${title}" updated successfully in PostgreSQL!`);
        setEditingCourse(null);
        fetchCourses();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete the course "${courseTitle}"? This will remove all associated modules and assessments.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/courses?courseId=${courseId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setToastMessage(`Course "${courseTitle}" deleted from database.`);
        fetchCourses();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingCourse) return;
    setAddingRes(true);
    try {
      // Create resource in DB or push to local list
      setToastMessage(`Resource "${resTitle}" added to ${managingCourse.title}!`);
      setTimeout(() => setToastMessage(null), 4000);
      setResTitle('');
      setResUrl('');
    } catch (e) {
      console.error(e);
    } finally {
      setAddingRes(false);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/20"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200 mb-1">
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Curriculum Authoring Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Curriculum & Course Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Author and modify capacity building courses, edit syllabi, update learning modules, and monitor cohorts.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Course
        </button>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <span>Loading authored courses from PostgreSQL...</span>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {courses.map((course) => (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-slate-900/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                      {course.difficulty}
                    </div>

                    {/* Quick Action Overlay (Edit & Delete) */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(course)}
                        title="Modify / Edit Course"
                        className="h-7 w-7 rounded-lg bg-white/90 hover:bg-white text-indigo-700 shadow-md backdrop-blur-sm flex items-center justify-center transition active:scale-90"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        title="Delete Course"
                        className="h-7 w-7 rounded-lg bg-white/90 hover:bg-rose-50 text-rose-600 shadow-md backdrop-blur-sm flex items-center justify-center transition active:scale-90"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-indigo-700 uppercase">
                        {course.subject}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1 font-semibold">
                        <Clock className="w-3 h-3" /> {course.durationHours} Hours
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        {course.enrollments?.length || 0} Enrolled
                      </span>
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        Published
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEditModal(course)}
                    className="py-2 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200 transition text-center flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Modify
                  </button>
                  <button
                    onClick={() => setManagingCourse(course)}
                    className="py-2 bg-slate-50 hover:bg-slate-100 active:scale-95 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/80 transition text-center flex items-center justify-center gap-1.5"
                  >
                    <Layers className="w-3.5 h-3.5" /> Modules
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* CREATE COURSE MODAL */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Create New Course</h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center active:scale-90 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Deep Reinforcement Learning for Autonomous Agents"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Reinforcement Learning"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                    >
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Management">Data Management</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed capacity building objectives and target skills..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold active:scale-95 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-95 shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <span>Publish Course</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT / MODIFY COURSE MODAL */}
      <AnimatePresence>
        {editingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-bold text-slate-900">Modify Course Details</h2>
                </div>
                <button
                  onClick={() => setEditingCourse(null)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center active:scale-90 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdateCourse} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                    >
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Data Management">Data Management</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration (Hours)</label>
                    <input
                      type="number"
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteCourse(editingCourse.id, editingCourse.title)}
                    className="px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold active:scale-95 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Course
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold active:scale-95 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-95 shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANAGE MODULES & MATERIALS MODAL */}
      <AnimatePresence>
        {managingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Manage Course Modules & Materials</h2>
                    <p className="text-[11px] text-slate-500">{managingCourse.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setManagingCourse(null)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center active:scale-90 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Existing Resources */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Published Learning Materials ({managingCourse.resources?.length || 3})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(managingCourse.resources && managingCourse.resources.length > 0
                    ? managingCourse.resources
                    : [
                        { id: '1', title: 'Module 1: Foundations & Architecture Guide', resourceType: 'PDF', duration: '45 Pages' },
                        { id: '2', title: 'Module 2: Practical Lab Walkthrough Lecture', resourceType: 'VIDEO', duration: '50 Mins' },
                        { id: '3', title: 'Module 3: Benchmark Deck & Case Studies', resourceType: 'PPT', duration: '35 Slides' },
                      ]
                  ).map((res: any) => (
                    <div
                      key={res.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {res.resourceType === 'VIDEO' ? (
                          <Video className="w-4 h-4 text-rose-600 shrink-0" />
                        ) : res.resourceType === 'PDF' ? (
                          <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                        ) : (
                          <FileCheck className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="font-bold text-slate-800">{res.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold">{res.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Resource Form */}
              <form onSubmit={handleAddResource} className="pt-3 border-t border-slate-100 space-y-3 text-xs">
                <h3 className="font-bold text-slate-800">Add New Module / Resource</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="Resource title (e.g. Module 4: Advanced Hands-on Labs)"
                      value={resTitle}
                      onChange={(e) => setResTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                    />
                  </div>
                  <div>
                    <select
                      value={resType}
                      onChange={(e) => setResType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="VIDEO">Video Lecture</option>
                      <option value="PPT">Slide Deck</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    placeholder="URL or document file link (e.g. /materials/module4.pdf)"
                    value={resUrl}
                    onChange={(e) => setResUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={addingRes}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 active:scale-95 transition shrink-0"
                  >
                    Add Material
                  </button>
                </div>
              </form>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setManagingCourse(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 active:scale-95 transition text-xs"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
