'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FolderArchive,
  Upload,
  FileText,
  Video,
  Presentation,
  CheckCircle2,
  Trash2,
  Search,
  ExternalLink,
  BookOpen,
  Filter,
  Eye,
  X,
  FileCode,
  FileCheck
} from 'lucide-react';
import { getClientCached, setClientCached } from '@/lib/client-cache';
import { Modal } from '@/components/ui/Modal';

interface ResourceItem {
  id: string;
  title: string;
  courseId: string;
  course?: { id: string; title: string };
  resourceType: 'PDF' | 'VIDEO' | 'PPT' | 'DOCUMENT' | 'NOTES';
  duration?: string;
  fileUrl: string;
  description?: string;
  createdAt?: string;
  trainer?: { id: string; name: string };
}

export default function TrainerResourcesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [type, setType] = useState<'PDF' | 'VIDEO' | 'PPT' | 'DOCUMENT' | 'NOTES'>('PDF');
  const [duration, setDuration] = useState('30 Mins');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [previewResource, setPreviewResource] = useState<ResourceItem | null>(null);

  const loadData = async () => {
    try {
      const [coursesRes, resourcesRes] = await Promise.all([
        fetch('/api/courses'),
        fetch('/api/resources')
      ]);

      if (coursesRes.ok) {
        const cData = await coursesRes.json();
        const courseList = cData.courses || [];
        setCourses(courseList);
        if (courseList.length > 0 && !selectedCourseId) {
          setSelectedCourseId(courseList[0].id);
        }
      }

      if (resourcesRes.ok) {
        const rData = await resourcesRes.json();
        setResources(rData.resources || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedCourseId) return;

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        courseId: selectedCourseId,
        trainerId: user?.id,
        resourceType: type,
        duration: duration || '30 Mins',
        fileUrl: fileUrl.trim() || (type === 'VIDEO' ? 'https://www.youtube.com/embed/aircAruvnKk' : 'https://arxiv.org/pdf/1802.01528.pdf'),
        description: description.trim() || `Course resource for institutional learning.`
      };

      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setToastMessage(`Material "${title}" successfully published to Course Library!`);
        setTitle('');
        setFileUrl('');
        setDescription('');
        loadData();
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        const err = await res.json();
        setToastMessage(`Error: ${err.error || 'Failed to upload resource'}`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (e) {
      console.error(e);
      setToastMessage('Network error while saving resource.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, resTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${resTitle}"?`)) return;

    try {
      const res = await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToastMessage(`Resource "${resTitle}" deleted successfully.`);
        loadData();
        setTimeout(() => setToastMessage(null), 3500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredResources = resources.filter((r) => {
    const matchesType = typeFilter === 'ALL' || r.resourceType === typeFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.course?.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (resType: string) => {
    switch (resType) {
      case 'VIDEO':
        return <Video className="w-4 h-4 text-rose-500" />;
      case 'PPT':
        return <Presentation className="w-4 h-4 text-amber-500" />;
      case 'DOCUMENT':
      case 'NOTES':
        return <FileCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/20 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          Publish recorded lectures, PDF manuals, presentation decks, and supplementary study resources to enrolled trainees.
        </p>
      </div>

      {/* Upload Card */}
      <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Course Association</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                {courses.length === 0 ? (
                  <option value="">No courses available</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resource Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              >
                <option value="PDF">PDF Document / Notes</option>
                <option value="VIDEO">Video Lecture Link</option>
                <option value="PPT">Presentation Deck (PPTX)</option>
                <option value="DOCUMENT">Article / Documentation</option>
                <option value="NOTES">Summary Notes / Cheat Sheet</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Estimated Duration / Pages</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 45 Pages or 50 Mins"
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Direct Resource / Document URL</label>
              <input
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder={type === 'VIDEO' ? 'https://www.youtube.com/watch?v=...' : 'https://arxiv.org/pdf/... or cloud storage URL'}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brief Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key concepts, syllabus coverage or reading guidance..."
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick upload guideline badge */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-800">PostgreSQL Integrated Learning Catalog</p>
                <p className="text-[11px] text-slate-500">Trainees enrolled in this course will instantly receive access on their dashboard.</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting || !title.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Publish Material
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Resources List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Published Learning Materials</h2>
            <p className="text-xs text-slate-500">All live lecture notes, presentations, and recordings.</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search materials..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Types</option>
              <option value="PDF">PDFs</option>
              <option value="VIDEO">Videos</option>
              <option value="PPT">PPT Decks</option>
              <option value="DOCUMENT">Documents</option>
              <option value="NOTES">Notes</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading published course resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center border border-slate-200/80 shadow-subtle space-y-2">
            <FolderArchive className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No resources found</p>
            <p className="text-xs text-slate-400">Publish your first lecture or reading manual using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-subtle hover:shadow-card transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 uppercase">
                      {getTypeIcon(res.resourceType)}
                      {res.resourceType}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {res.duration || '30 Mins'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{res.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {res.description || 'Institutional curriculum resource'}
                  </p>
                  <p className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> {res.course?.title || 'Course Asset'}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setPreviewResource(res)}
                    className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Quick Preview
                  </button>

                  <button
                    onClick={() => handleDelete(res.id, res.title)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resource Preview Modal */}
      <Modal isOpen={!!previewResource} onClose={() => setPreviewResource(null)} maxWidth="max-w-2xl">
        {previewResource && (
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase">
                  {previewResource.resourceType} • {previewResource.duration}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{previewResource.title}</h3>
                <p className="text-xs text-slate-500">{previewResource.course?.title}</p>
              </div>
              <button
                onClick={() => setPreviewResource(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <p className="font-semibold text-slate-800 mb-1">Curriculum Description</p>
                <p className="leading-relaxed">{previewResource.description || 'No additional description provided.'}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-1">
                <p className="font-semibold text-slate-800">Resource Target URL</p>
                <a
                  href={previewResource.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 font-bold hover:underline flex items-center gap-1 break-all"
                >
                  {previewResource.fileUrl} <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <a
                href={previewResource.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs hover:bg-indigo-700 transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open Direct Asset
              </a>
              <button
                onClick={() => setPreviewResource(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
