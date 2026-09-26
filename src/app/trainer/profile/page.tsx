'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, Award, BookOpen, Star, Save, User, Mail } from 'lucide-react';

export default function TrainerProfilePage() {
  const { user, refreshUser } = useAuth();
  const profile = user?.trainerProfile || {};

  const [name, setName] = useState(user?.name || 'Dr. Rajesh Verma');
  const [qualifications, setQualifications] = useState(profile.qualifications || 'Ph.D. in Artificial Intelligence, IIT Bombay');
  const [experience, setExperience] = useState(profile.experience || '8+ Years Research & Industry Consulting');
  const [expertise, setExpertise] = useState(profile.expertise || 'Machine Learning, Deep Learning, Generative AI, PyTorch');
  const [subjects, setSubjects] = useState(profile.subjects || 'Machine Learning, Deep Learning, MLOps, Data Science');
  const [certifications, setCertifications] = useState(profile.certifications || 'TensorFlow Certified Professional, AWS ML Specialty');
  const [bio, setBio] = useState(
    profile.bio || 'Former ISRO Research Fellow and AI Systems Architect with 8+ years guiding corporate capacity building in AI/ML.'
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          trainerProfile: {
            qualifications,
            experience,
            expertise,
            subjects,
            certifications,
            bio,
          },
        }),
      });

      if (res.ok) {
        await refreshUser();
        setSaved(true);
        setTimeout(() => setSaved(false), 3500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Trainer Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Maintain your master credentials, domain expertise, and accreditation records.
          </p>
        </div>
        {saved && (
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 animate-in fade-in">
            Credentials Updated in PostgreSQL!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
              alt={name}
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/20"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-indigo-600 font-semibold">{qualifications}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.95 Rating
                </span>
                <span className="text-[11px] text-slate-400">• 1,420 Trainees Guided</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualifications</label>
              <input
                type="text"
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Master Competencies */}
        <div className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200/80 shadow-subtle space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Domain Expertise & Certifications
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expertise Domains</label>
              <input
                type="text"
                value={expertise}
                onChange={(e) => setExpertise(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teaching Subjects</label>
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Industry Certifications</label>
              <input
                type="text"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trainer Bio / Professional Summary</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <Save className="w-4 h-4" /> Save Trainer Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
