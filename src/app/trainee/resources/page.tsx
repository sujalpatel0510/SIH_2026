'use client';

import React from 'react';
import { FolderArchive, FileText, Video, Presentation, Download, ExternalLink, Sparkles } from 'lucide-react';

export default function LearningResourcesPage() {
  const resources = [
    {
      id: '1',
      title: 'Module 1: Mathematical Foundations of Machine Learning',
      course: 'Machine Learning & Neural Systems Mastery',
      type: 'PDF',
      duration: '45 Pages',
      trainer: 'Dr. Rajesh Verma',
      icon: FileText,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      action: 'Read Document',
    },
    {
      id: '2',
      title: 'Module 2: Video Lecture — Gradient Descent & Backprop Demystified',
      course: 'Machine Learning & Neural Systems Mastery',
      type: 'VIDEO',
      duration: '52 Mins',
      trainer: 'Dr. Rajesh Verma',
      icon: Video,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      action: 'Watch Stream',
    },
    {
      id: '3',
      title: 'Module 3: Hands-on Lab Notebook & Model Evaluation Deck',
      course: 'Machine Learning & Neural Systems Mastery',
      type: 'PPT',
      duration: '38 Slides',
      trainer: 'Dr. Rajesh Verma',
      icon: Presentation,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      action: 'View Presentation',
    },
    {
      id: '4',
      title: 'Enterprise Microservices Patterns & Kubernetes Ingress Blueprint',
      course: 'Cloud Architecture & Enterprise Microservices',
      type: 'PDF',
      duration: '62 Pages',
      trainer: 'Prof. Sunita Nair',
      icon: FileText,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      action: 'Read Document',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 mb-1">
          <FolderArchive className="w-3 h-3 text-brand-600" />
          Trainer Content Repository
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Learning Resources & Study Materials
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access recorded lectures, slides, research documents, and practice notebooks published by course trainers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="rounded-3xl bg-white p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-lg p-2 border font-bold text-xs flex items-center gap-1.5 ${item.color}`}
                  >
                    <Icon className="w-4 h-4" /> {item.type}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{item.duration}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500">
                  Course: <span className="font-semibold text-slate-700">{item.course}</span>
                </p>
                <p className="text-[11px] text-slate-400">Published by {item.trainer}</p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Approved Material
                </span>
                <button
                  onClick={() => alert(`Opening resource: ${item.title}`)}
                  className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-600 transition flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3 h-3" /> {item.action}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
