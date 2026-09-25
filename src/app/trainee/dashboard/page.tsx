'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Target,
  Sparkles,
  BookOpen,
  FileQuestion,
  Award,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';

export default function TraineeDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('cp_trainee_analysis');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return {
      overallReadiness: 78,
      gapsIdentified: 1,
      criticalGaps: 0,
      totalCompetencies: 5,
    };
  });
  const [recommendations, setRecommendations] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('cp_trainee_recs');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return null;
  });
  const [courses, setCourses] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('cp_courses_cache');
        if (cached) return JSON.parse(cached);
      } catch {}
    }
    return [];
  });
  const [assessments, setAssessments] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [compRes, recRes, courseRes, assessRes] = await Promise.all([
          fetch(`/api/competency?traineeId=${user?.id || ''}`),
          fetch(`/api/recommendations?traineeId=${user?.id || ''}`),
          fetch(`/api/courses?traineeId=${user?.id || ''}`),
          fetch(`/api/assessments?traineeId=${user?.id || ''}`),
        ]);

        if (compRes.ok) {
          const compData = await compRes.json();
          setAnalysis(compData.analysis);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('cp_trainee_analysis', JSON.stringify(compData.analysis));
          }
        }
        if (recRes.ok) {
          const recData = await recRes.json();
          setRecommendations(recData.recommendations);
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('cp_trainee_recs', JSON.stringify(recData.recommendations));
          }
        }
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourses(courseData.courses);
        }
        if (assessRes.ok) {
          const assessData = await assessRes.json();
          setAssessments(assessData.assessments);
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadDashboardData();
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 mb-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            Trainee Capacity Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Trainee'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Target Goal: <span className="font-semibold text-slate-800">{user?.traineeProfile?.careerGoal || 'Senior AI/ML Platform Engineer'}</span> • Department: {user?.traineeProfile?.department || 'Information Technology'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/trainee/competencies"
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition"
          >
            <Target className="w-4 h-4" />
            View Competency Matrix
          </Link>
        </div>
      </div>

      {/* AI Competency Gap Alert Banner */}
      {analysis && analysis.gapsIdentified > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-brand-500/10 p-5 border border-amber-300/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                  AI Competency Gap Identified
                </h3>
                <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-extrabold text-amber-900">
                  {analysis.gapsIdentified} Gaps Active
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-1">
                Your Machine Learning & Deep Learning proficiencies are below target (Level 2/5 vs Required Level 4/5). Recommended learning interventions have been automatically generated.
              </p>
            </div>
          </div>
          <Link
            href="/trainee/recommendations"
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition shrink-0 flex items-center gap-1"
          >
            View Recommendations <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Overall Readiness</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{analysis?.overallReadiness || 78}%</span>
            <span className="text-[11px] font-semibold text-emerald-600">+8% this month</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Benchmark: 80% target</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Courses</span>
            <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{courses.length || 2}</span>
            <span className="text-[11px] font-semibold text-slate-500">1 In-Progress</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">1 completed with honours</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tests</span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileQuestion className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1</span>
            <span className="text-[11px] font-semibold text-amber-600">Due in 14 days</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">ML Competency Assessment</p>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Certificates</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">1</span>
            <span className="text-[11px] font-semibold text-emerald-600">Verified</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Cloud Architecture Specialist</p>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Enrolled Courses & Pending Assessments */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Courses */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" /> My Learning Programs
              </h2>
              <Link href="/trainee/courses" className="text-xs font-bold text-brand-600 hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl border border-slate-200/80 p-4 hover:border-brand-200 transition-all bg-slate-50/50"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                          {course.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {course.durationHours} Hours • {course.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{course.title}</h3>
                      <p className="text-xs text-slate-500">
                        Trainer: <span className="font-semibold text-slate-700">{course.trainer?.name}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="w-28 space-y-1 text-right">
                        <span className="text-xs font-bold text-slate-700">
                          {course.enrollments?.[0]?.progress || 45}%
                        </span>
                        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-brand-600 rounded-full"
                            style={{ width: `${course.enrollments?.[0]?.progress || 45}%` }}
                          />
                        </div>
                      </div>
                      <Link
                        href={`/trainee/resources`}
                        className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-700 border border-slate-200 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 transition"
                      >
                        Open Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Assessments */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileQuestion className="w-4 h-4 text-amber-600" /> Pending MCQ Assessments
              </h2>
              <Link href="/trainee/assessments" className="text-xs font-bold text-brand-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {assessments.map((assess) => (
                <div
                  key={assess.id}
                  className="rounded-2xl border border-slate-200/80 p-4 hover:border-amber-200 transition-all bg-amber-50/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          {assess.subject}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {assess.durationMinutes} Mins • {assess.totalMarks} Marks
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{assess.title}</h3>
                      <p className="text-xs text-slate-500">{assess.description}</p>
                    </div>

                    <Link
                      href={`/trainee/assessments/${assess.id}`}
                      className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 transition shrink-0 text-center"
                    >
                      Attempt MCQ
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommendations & Announcements */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Recommended Course Card */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-900 to-brand-900 p-6 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-bold text-brand-200 border border-white/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" /> AI Recommended
              </span>
              <span className="text-xs font-bold text-emerald-400">96.5% Match</span>
            </div>

            <div>
              <h3 className="text-base font-bold">Machine Learning & Neural Systems Mastery</h3>
              <p className="text-xs text-slate-300 mt-1">
                Directly targets your Level 2 ML competency gap to prepare for advanced AI engineering.
              </p>
            </div>

            <div className="border-t border-white/10 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center text-xs font-bold">
                  RV
                </div>
                <div className="text-[11px]">
                  <p className="font-bold">Dr. Rajesh Verma</p>
                  <p className="text-slate-400">4.95 ★ (1,420 trainees)</p>
                </div>
              </div>
              <Link
                href="/trainee/recommendations"
                className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-slate-100 transition"
              >
                Enroll
              </Link>
            </div>
          </div>

          {/* Institutional Announcements */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Organization Announcements
            </h3>
            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-brand-600 pl-3 space-y-1">
                <p className="font-bold text-slate-800">National Capacity Building Summit</p>
                <p className="text-slate-500 text-[11px]">
                  Enterprise competency benchmarks and specialized tracks are active.
                </p>
              </div>
              <div className="border-l-2 border-indigo-600 pl-3 space-y-1">
                <p className="font-bold text-slate-800">New AI Competency Matrix</p>
                <p className="text-slate-500 text-[11px]">
                  Take the diagnostic assessments to update your verified profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
