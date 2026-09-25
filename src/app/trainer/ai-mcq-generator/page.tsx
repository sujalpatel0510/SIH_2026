'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Wand2,
  Sparkles,
  FileText,
  CheckCircle2,
  Edit3,
  Send,
  HelpCircle,
  Layers,
  ArrowRight,
  BookOpen,
  Eye,
  Check
} from 'lucide-react';

export default function AIMCQGeneratorPage() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState(
    `Gradient descent is an iterative optimization algorithm used to minimize a loss function by updating model weights in the direction of the steepest negative gradient. When training deep networks, learning rate scheduling prevents oscillation around sharp ravines in the loss landscape. Regularization techniques like L1 Lasso induce sparsity, whereas L2 Ridge enforces small weight magnitudes. In cases of extreme class imbalance (such as anomaly detection where anomalies represent under 0.5% of samples), standard accuracy metric fails, necessitating Precision-Recall curves and F1 metrics.`
  );
  const [subject, setSubject] = useState('Machine Learning & Neural Optimization');
  const [assessmentTitle, setAssessmentTitle] = useState('Machine Learning & Neural Optimization — AI Verified Assessment');
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [publishedAssessment, setPublishedAssessment] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch trainer's courses to attach assessment to
  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          const list = data.courses || [];
          setCourses(list);
          if (list.length > 0) {
            setSelectedCourseId(list[0].id);
          }
        }
      } catch (e) {
        console.error('Error fetching courses:', e);
      }
    }
    loadCourses();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setPublishedAssessment(null);
    try {
      const res = await fetch('/api/ai-mcq-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          subject,
          count: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedQuestions(data.questions || []);
        setConcepts(data.extractedConcepts || []);
        setToastMessage(`Generated ${data.questions?.length || 0} rigorous MCQs successfully!`);
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (e) {
      console.error(e);
      setToastMessage('Error generating questions. Please try again.');
      setTimeout(() => setToastMessage(null), 3500);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (generatedQuestions.length === 0) return;
    setPublishing(true);
    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourseId || courses[0]?.id,
          trainerId: user?.id,
          title: assessmentTitle || `${subject} — AI Verified Assessment`,
          subject,
          description: `AI-synthesized assessment evaluating key concepts in ${subject}.`,
          durationMinutes: 20,
          difficulty: 'INTERMEDIATE',
          questions: generatedQuestions,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPublishedAssessment(data.assessment);
        confetti({
          particleCount: 85,
          spread: 70,
          origin: { y: 0.6 }
        });
        setToastMessage('Assessment successfully saved to PostgreSQL! Live for all trainees & in questionnaires.');
        setTimeout(() => setToastMessage(null), 5000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to publish assessment');
      }
    } catch (e) {
      console.error('Publish assessment error:', e);
      setToastMessage('Error publishing assessment. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative">
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
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200 mb-1">
          <Wand2 className="w-3 h-3 text-indigo-600" />
          Automated Assessment Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          AI-Powered MCQ Assessment Generator
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload learning material, research excerpts, or lecture notes to extract key concepts and synthesize verified multiple-choice assessments.
        </p>
      </div>

      {/* Published Success Banner */}
      {publishedAssessment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white shadow-xl shadow-emerald-500/20 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black">Assessment Published to PostgreSQL!</h2>
              <p className="text-xs text-emerald-100">
                "{publishedAssessment.title}" is now active and accessible to all trainees and in your questionnaire dashboard.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href="/trainer/assessments"
              className="px-4 py-2 bg-white text-emerald-800 text-xs font-bold rounded-xl shadow-sm hover:bg-emerald-50 transition active:scale-95 flex items-center gap-1.5"
            >
              <span>View in Questionnaires (Trainer)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/trainee/assessments"
              className="px-4 py-2 bg-emerald-700/60 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition active:scale-95 flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview on Trainee Assessment Page</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Input Stage Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-600" /> 1. Provide Learning Material & Curriculum Context
          </h2>
          <span className="text-[11px] font-semibold text-slate-400">Natural Language Extraction</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setAssessmentTitle(`${e.target.value} — AI Verified Assessment`);
              }}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Attach to Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-medium"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Title</label>
            <input
              type="text"
              value={assessmentTitle}
              onChange={(e) => setAssessmentTitle(e.target.value)}
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Lecture Text / Research Paper Excerpt</label>
          <textarea
            rows={5}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full text-xs p-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed font-mono"
            placeholder="Paste syllabus notes or text from your lecture deck..."
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Extracts Bloom's Taxonomy questions across cognitive levels</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-brand-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Analyzing & Synthesizing MCQs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize MCQs with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Questions Review Stage */}
      <AnimatePresence>
        {generatedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 uppercase tracking-wider">
                  AI Synthesis Complete ({generatedQuestions.length} Questions)
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1">
                  2. Review & Verify AI Generated Assessment
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {publishing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving to PostgreSQL...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify & Publish Assessment</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extracted Concepts */}
            {concepts.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-[11px] font-bold text-slate-400">Extracted Concepts:</span>
                {concepts.map((c, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-indigo-50 text-indigo-700 px-2.5 py-1 text-[11px] font-semibold border border-indigo-100"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Question List with answers */}
            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-2xl border border-slate-200/80 p-4 text-xs space-y-3 bg-slate-50/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}. {q.questionText}
                    </span>
                    <span className="rounded-md bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[10px] font-bold shrink-0">
                      {q.marks} Marks • {q.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        q.correctOption === 'A'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      A) {q.optionA} {q.correctOption === 'A' && '✓ (Correct Answer)'}
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        q.correctOption === 'B'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      B) {q.optionB} {q.correctOption === 'B' && '✓ (Correct Answer)'}
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        q.correctOption === 'C'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      C) {q.optionC} {q.correctOption === 'C' && '✓ (Correct Answer)'}
                    </div>
                    <div
                      className={`p-2.5 rounded-xl border ${
                        q.correctOption === 'D'
                          ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      D) {q.optionD} {q.correctOption === 'D' && '✓ (Correct Answer)'}
                    </div>
                  </div>

                  <div className="rounded-xl bg-white p-3 border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
                    <strong className="text-indigo-900">Pedagogical Explanation:</strong> {q.explanation}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
