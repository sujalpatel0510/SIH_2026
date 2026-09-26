'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Trophy, Plus, CheckCircle2, Megaphone, Award, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [targetRole, setTargetRole] = useState('ALL');
  const [submitting, setSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const achievements = [
    {
      id: '1',
      title: 'Top Competency Growth Award',
      recipient: 'Priya Sharma (Trainee)',
      category: 'Cloud & AI Architecture',
      description: 'Advanced 2 complete competency tiers within 6 weeks of targeted learning.',
    },
    {
      id: '2',
      title: 'Master Trainer Excellence Award',
      recipient: 'Dr. Rajesh Verma (Trainer)',
      category: 'Curriculum Leadership',
      description: 'Maintained 4.95/5 star rating across 1,420 trained candidates.',
    },
  ];

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch('/api/admin/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          priority,
          targetRole,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnnouncements([data.announcement, ...announcements]);
        setTitle('');
        setContent('');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        showToast('Announcement broadcasted to all platform dashboards!');
      } else {
        alert('Failed to publish announcement');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, annTitle: string) => {
    if (!confirm(`Are you sure you want to remove "${annTitle}"?`)) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setAnnouncements(announcements.filter((a) => a.id !== id));
        showToast('Announcement removed.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-purple-700 text-white px-5 py-3 shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-bottom-2 border border-purple-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-purple-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Announcements & Institutional Achievements
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Broadcast organization-wide updates and recognize high-performing trainees and trainers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Broadcast Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-600" /> Broadcast New Announcement
            </h2>

            <form onSubmit={handlePublish} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule for Live Industry Guest Lecture"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="NORMAL">Normal Priority</option>
                    <option value="HIGH">High Priority (Pinned)</option>
                    <option value="URGENT">Urgent Alert</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="ALL">All Users (Trainees & Trainers)</option>
                    <option value="TRAINEE">Trainees Only</option>
                    <option value="TRAINER">Trainers Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide detailed announcements, instructions, or scheduling notices..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting || !title || !content}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {submitting ? 'Broadcasting...' : 'Broadcast to Dashboards'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Live Feed & Achievements Column */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Broadcasts */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" /> Active Platform Broadcasts ({announcements.length})
            </h2>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-4 transition-all relative group ${
                    a.priority === 'HIGH' || a.priority === 'URGENT'
                      ? 'border-purple-300 bg-purple-50/40'
                      : 'border-slate-200/80 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        a.priority === 'HIGH' || a.priority === 'URGENT'
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {a.priority}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">
                        {new Date(a.createdAt || Date.now()).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        title="Delete Broadcast"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2">{a.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.content}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Author: {a.authorName}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Achievements */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Platform Accolades
            </h2>

            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="rounded-2xl border border-slate-200/80 p-4 bg-slate-50/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-800">{ach.title}</h3>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Award className="w-3 h-3" /> {ach.category}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-900 font-semibold">{ach.recipient}</p>
                  <p className="text-[11px] text-slate-500">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
