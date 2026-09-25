'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Award,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function AssessmentExamPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [submittedResult, setSubmittedResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const res = await fetch(`/api/assessments`);
        if (res.ok) {
          const data = await res.json();
          const target = data.assessments.find((a: any) => a.id === assessmentId);
          if (target) {
            setAssessment(target);
            setTimeLeft(target.durationMinutes * 60);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadAssessment();
  }, [assessmentId]);

  // Countdown timer
  useEffect(() => {
    if (submittedResult || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [submittedResult, timeLeft]);

  const handleSelectOption = (questionId: string, optionKey: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async () => {
    if (!confirm('Are you ready to submit your assessment for automated AI grading?')) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traineeId: user?.id,
          answers,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setSubmittedResult(result);

        if (result.passed) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
          });
        }
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting assessment');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return <div className="p-12 text-center text-xs text-slate-400">Loading exam environment...</div>;
  }

  if (!assessment) {
    return <div className="p-12 text-center text-xs text-slate-400">Assessment not found.</div>;
  }

  // RESULTS SCREEN AFTER SUBMISSION
  if (submittedResult) {
    const passed = submittedResult.passed;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-3xl bg-white p-8 border border-slate-200/80 shadow-card text-center space-y-4">
          <div
            className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl mx-auto ${
              passed ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            {passed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900">
            {passed ? 'Assessment Successfully Completed!' : 'Assessment Completed — Review Recommended'}
          </h1>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            {passed
              ? 'Congratulations! You met the organizational competency benchmark. Your proficiency profile has been automatically upgraded in the database, and your verified certificate has been issued.'
              : 'You scored below the passing threshold. Review the questions and correct explanations below, revisit recommended course modules, and re-attempt to qualify.'}
          </p>

          <div className="flex justify-center gap-6 py-4 border-y border-slate-100">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Score</p>
              <p className="text-2xl font-black text-slate-900">
                {submittedResult.totalScore} / {submittedResult.maxScore}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Percentage</p>
              <p className={`text-2xl font-black ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {submittedResult.percentage}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Status</p>
              <p className={`text-2xl font-black ${passed ? 'text-emerald-600' : 'text-amber-600'}`}>
                {passed ? 'PASSED' : 'RETRY'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/trainee/competencies"
              className="rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition"
            >
              View Updated Competency Matrix
            </Link>
            {passed && (
              <Link
                href="/trainee/certificates"
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
              >
                View Certificate
              </Link>
            )}
            <Link
              href="/trainee/assessments"
              className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
            >
              Back to Assessments
            </Link>
          </div>
        </div>

        {/* Question by question explanation review */}
        <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Review Answers & Detailed Explanations
          </h2>

          <div className="space-y-4">
            {assessment.questions.map((q: any, idx: number) => {
              const selected = answers[q.id];
              const isCorrect = selected === q.correctOption;

              return (
                <div
                  key={q.id}
                  className={`rounded-2xl p-4 border text-xs space-y-2.5 ${
                    isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-bold text-slate-800">
                      Q{idx + 1}. {q.questionText}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold shrink-0 ${
                        isCorrect ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                      }`}
                    >
                      {isCorrect ? 'Correct (+10)' : 'Incorrect (0)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div className={q.correctOption === 'A' ? 'font-bold text-emerald-800' : 'text-slate-600'}>
                      A) {q.optionA} {q.correctOption === 'A' && '✓'}
                    </div>
                    <div className={q.correctOption === 'B' ? 'font-bold text-emerald-800' : 'text-slate-600'}>
                      B) {q.optionB} {q.correctOption === 'B' && '✓'}
                    </div>
                    <div className={q.correctOption === 'C' ? 'font-bold text-emerald-800' : 'text-slate-600'}>
                      C) {q.optionC} {q.correctOption === 'C' && '✓'}
                    </div>
                    <div className={q.correctOption === 'D' ? 'font-bold text-emerald-800' : 'text-slate-600'}>
                      D) {q.optionD} {q.correctOption === 'D' && '✓'}
                    </div>
                  </div>

                  {q.explanation && (
                    <div className="rounded-lg bg-white/80 p-2.5 border border-slate-200 text-[11px] text-slate-700">
                      <strong className="text-brand-700">Explanation: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // LIVE EXAM VIEW
  const currentQ = assessment.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = assessment.questions.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Exam Bar */}
      <div className="rounded-2xl bg-white p-4 border border-slate-200/80 shadow-subtle flex items-center justify-between">
        <div>
          <h1 className="text-sm font-bold text-slate-900">{assessment.title}</h1>
          <p className="text-[11px] text-slate-500">
            Subject: {assessment.subject} • Question {currentQuestionIndex + 1} of {totalQuestions}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-mono font-bold text-xs">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">{currentQ.marks} Marks</span>
          </div>

          {/* Interactive Question Jump Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {assessment.questions.map((q: any, i: number) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = i === currentQuestionIndex;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(i)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-xs'
                      : isAnswered
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {currentQ.questionText}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {[
            { key: 'A', text: currentQ.optionA },
            { key: 'B', text: currentQ.optionB },
            { key: 'C', text: currentQ.optionC },
            { key: 'D', text: currentQ.optionD },
          ].map((opt) => {
            const isSelected = answers[currentQ.id] === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectOption(currentQ.id, opt.key)}
                className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50/50 text-brand-900 ring-1 ring-brand-500 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {opt.key}
                </div>
                <span className="flex-1 leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation & Submission Controls */}
        <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
          <button
            type="button"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous
          </button>

          <span className="text-xs text-slate-400 font-medium">
            {answeredCount} of {totalQuestions} Answered
          </span>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-brand-600 bg-brand-50 hover:bg-brand-100 transition"
            >
              Next <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
