'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Star,
  CheckCircle2,
  ArrowRight,
  Target,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { getClientCached, setClientCached } from '@/lib/client-cache';

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<any>(() =>
    getClientCached('trainee_recs_data', null)
  );
  const [loading, setLoading] = useState(() => !recommendations);
  const [refreshing, setRefreshing] = useState(false);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const traineeId = user?.id || '663a753c-0a6c-43c1-a8b1-98dc3b6dacc9';

  const loadRecommendations = async () => {
    try {
      const res = await fetch(`/api/recommendations?traineeId=${traineeId}`);
      if (res.ok) {
        const json = await res.json();
        setRecommendations(json.recommendations);
        setClientCached('trainee_recs_data', json.recommendations);
      }
    } catch (e) {
      console.error('Error fetching recommendations:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecommendations();
  };

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          traineeId,
        }),
      });

      if (res.ok) {
        setToastMessage('Successfully enrolled! Proceed to Course Catalog or Dashboard.');
        setTimeout(() => setToastMessage(null), 4000);
        await loadRecommendations();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-emerald-600/20 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 mb-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            AI Learning & Competency Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Personalized Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Courses and Master Trainers scientifically ranked by AI to eliminate your active competency deficits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
            Recalculate AI Match
          </button>
          <Link
            href="/trainee/competencies"
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition active:scale-95"
          >
            <Target className="w-3.5 h-3.5" /> View Gap Matrix
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl bg-white p-12 text-center border border-slate-200/80 shadow-subtle space-y-3">
          <div className="h-8 w-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Synthesizing personalized learning matches...</p>
          <p className="text-[11px] text-slate-400">Comparing your 5-tier competency proficiencies with master trainer curricula.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* 1. Recommended Courses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-600" /> Recommended Courses
                </h2>
                <p className="text-xs text-slate-500">
                  Curated curricula aligned with your target proficiency tiers and career goals
                </p>
              </div>
              <Link
                href="/trainee/courses"
                className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
              >
                <span>View All Courses</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations?.courses?.map((rec: any, idx: number) => {
                const isEnrolled = rec.isEnrolled;
                const isCompleted = rec.enrollmentStatus === 'COMPLETED';

                return (
                  <div
                    key={idx}
                    className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-brand-50 px-2.5 py-0.5 text-[10px] font-extrabold text-brand-700 border border-brand-200 uppercase">
                          {rec.course?.subject || 'Capacity Building'}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-black text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 shadow-2xs">
                          <Sparkles className="w-3 h-3 text-amber-500" /> {rec.score}% Match
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-600 transition-colors">
                        {rec.course?.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {rec.course?.description}
                      </p>

                      {/* AI Rationale Box */}
                      <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/70 text-xs">
                        <p className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
                          <Target className="w-3.5 h-3.5 text-brand-600" /> AI Recommendation Rationale:
                        </p>
                        <p className="text-[11px] text-slate-600 mt-1 italic leading-relaxed">
                          "{rec.reason}"
                        </p>
                      </div>

                      {/* Progress bar if enrolled */}
                      {isEnrolled && (
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-500">
                              {isCompleted ? 'Course Completed' : 'Enrollment Progress'}
                            </span>
                            <span className="text-brand-600">{rec.enrollmentProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isCompleted ? 'bg-emerald-500' : 'bg-brand-600'
                              }`}
                              style={{ width: `${rec.enrollmentProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            rec.course?.trainer?.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={rec.course?.trainer?.name}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-500/20"
                        />
                        <div className="text-[11px]">
                          <p className="font-bold text-slate-800">{rec.course?.trainer?.name}</p>
                          <p className="text-slate-400">
                            {rec.course?.durationHours} Hours • {rec.course?.difficulty}
                          </p>
                        </div>
                      </div>

                      {isEnrolled ? (
                        <Link
                          href="/trainee/courses"
                          className="rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(rec.courseId)}
                          disabled={enrollingId === rec.courseId}
                          className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition active:scale-95 disabled:opacity-50"
                        >
                          {enrollingId === rec.courseId ? 'Enrolling...' : 'Enroll Now'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Recommended Trainers */}
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600" /> Recommended Subject Master Trainers
              </h2>
              <p className="text-xs text-slate-500">
                Verified mentors holding domain mastery that directly maps to your career development
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations?.trainers?.map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            rec.trainer?.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={rec.trainer?.name}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/25"
                        />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{rec.trainer?.name}</h3>
                          <p className="text-[11px] text-slate-500">
                            {rec.trainer?.trainerProfile?.qualifications || 'Certified Trainer'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rec.trainer?.trainerProfile?.rating || 4.9}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {rec.trainer?.trainerProfile?.totalTrainees || 1200}+ Trainees
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rec.trainer?.trainerProfile?.bio ||
                        rec.trainer?.trainerProfile?.expertise ||
                        'Specialized in industry-aligned hands-on capacity building.'}
                    </p>

                    <div className="rounded-2xl bg-indigo-50/70 p-3.5 border border-indigo-100 text-xs">
                      <p className="font-bold text-indigo-950 flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Trainer Match Reason:
                      </p>
                      <p className="text-[11px] text-indigo-900 mt-1 italic leading-relaxed">
                        "{rec.reason}"
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Experience: <strong className="text-slate-800">{rec.trainer?.trainerProfile?.experience || '6+ Years'}</strong>
                    </span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      {rec.score}% Compatibility
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
