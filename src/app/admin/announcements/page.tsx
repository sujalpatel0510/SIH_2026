'use client';

import React, { useState } from 'react';
import { Bell, Trophy, Plus, CheckCircle2, Megaphone, Award } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [published, setPublished] = useState(false);

  const announcements = [
    {
      id: '1',
      title: 'National Digital Capacity Building Initiative Launched',
      content: 'CampusPilot AI has deployed the enterprise Capacity Connect infrastructure across regional training academies. Check your schedules for live mentorship sessions.',
      date: 'Sept 20, 2026',
      author: 'Central Training Directorate',
      priority: 'HIGH',
    },
    {
      id: '2',
      title: 'New AI Competency Assessment Benchmark Active',
      content: 'All trainees are encouraged to take the revised subject-wise assessments to update their personalized competency profiles.',
      date: 'Sept 22, 2026',
      author: 'AI Assessment Board',
      priority: 'NORMAL',
    },
  ];

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

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      setTitle('');
      setContent('');
      alert('Announcement broadcasted to all platform dashboards!');
    }, 1200);
  };

  return (
    <div className="space-y-8">
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
                <label className="block font-semibold text-slate-700 mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Details of the announcement..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={published || !title}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm transition flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Broadcast Announcement
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Existing Feed & Achievements */}
        <div className="lg:col-span-6 space-y-6">
          {/* Active Announcements */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" /> Active Platform Broadcasts
            </h2>

            <div className="space-y-3">
              {announcements.map((a) => (
                <div key={a.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{a.title}</span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                      {a.priority}
                    </span>
                  </div>
                  <p className="text-slate-600">{a.content}</p>
                  <p className="text-[10px] text-slate-400 pt-1">
                    {a.author} • {a.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Hall of Fame Achievements */}
          <div className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" /> Institutional Achievements & Honors
            </h2>

            <div className="space-y-3">
              {achievements.map((ach) => (
                <div key={ach.id} className="p-4 rounded-2xl border border-amber-200/70 bg-amber-50/20 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950">{ach.title}</span>
                    <span className="text-[10px] font-bold text-amber-800">{ach.category}</span>
                  </div>
                  <p className="font-semibold text-slate-800">{ach.recipient}</p>
                  <p className="text-slate-500 text-[11px]">{ach.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
