'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Curriculum Governance & Course Supervision
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review published curricula, audit subject alignment with national capacity frameworks, and govern course lifecycles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle p-6 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="rounded-md bg-purple-50 px-2 py-0.5 text-purple-700">
                  {course.subject}
                </span>
                <span className="text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ACCREDITED
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900">{course.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed">{course.description}</p>

              <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1">
                <p>
                  Trainer: <strong className="text-slate-800">{course.trainer?.name}</strong>
                </p>
                <p className="text-[11px] text-slate-400">
                  {course.durationHours} Hours • {course.difficulty} Difficulty
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-500">Status: PUBLISHED</span>
              <button
                onClick={() => alert(`Course audit report generated for ${course.title}`)}
                className="text-purple-600 font-bold hover:underline"
              >
                Audit Compliance
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
