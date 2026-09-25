'use client';

import React, { useState } from 'react';
import { FolderArchive, Upload, FileText, Video, Presentation, CheckCircle2, Plus } from 'lucide-react';

export default function TrainerResourcesPage() {
  const [uploaded, setUploaded] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('PDF');
  const [course, setCourse] = useState('Machine Learning & Neural Systems Mastery');

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setUploaded(true);
    setTimeout(() => {
      setUploaded(false);
      setTitle('');
      alert('Material uploaded and added to Course Library!');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200 mb-1">
          <FolderArchive className="w-3 h-3 text-indigo-600" />
          Content Repository Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Upload & Manage Learning Materials
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Publish recorded lectures, PDF manuals, presentation decks, and supplementary study resources.
        </p>
      </div>

      {/* Upload Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-600" /> Add New Course Resource
        </h2>

        <form onSubmit={handleUpload} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resource Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Module 4: Transformers & Multi-Head Self-Attention"
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Association</label>
              <select
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="Machine Learning & Neural Systems Mastery">Machine Learning & Neural Systems Mastery</option>
                <option value="Advanced Python for Production Engineering">Advanced Python for Production Engineering</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="PDF">PDF Document / Notes</option>
                <option value="VIDEO">Video Lecture Link</option>
                <option value="PPT">Presentation Deck (PPTX)</option>
                <option value="LAB">Jupyter Notebook / Code</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Simulation */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-indigo-400 transition cursor-pointer bg-slate-50/50">
            <Upload className="w-8 h-8 text-indigo-500 mx-auto" />
            <p className="font-bold text-slate-800">Click or drag & drop files here to upload</p>
            <p className="text-[11px] text-slate-400">Supports PDF, PPTX, MP4, IPYNB up to 100MB</p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={uploaded || !title}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2"
            >
              {uploaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Uploading to Server...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Publish to Trainees
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
