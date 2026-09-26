'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Sparkles,
  FileQuestion,
  Award,
  FolderArchive,
  Users,
  BarChart3,
  Bot,
  User,
  GraduationCap,
  Wand2,
  Bell,
  LogOut,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role = user?.role || 'TRAINEE';

  const traineeLinks = [
    { href: '/trainee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/trainee/competencies', label: 'Competency Mapping', icon: Target, badge: 'AI Gap' },
    { href: '/trainee/recommendations', label: 'Smart Recommendations', icon: Sparkles, badge: 'Match' },
    { href: '/trainee/courses', label: 'Course Catalog', icon: BookOpen },
    { href: '/trainee/resources', label: 'Learning Library', icon: FolderArchive },
    { href: '/trainee/assessments', label: 'MCQ Assessments', icon: FileQuestion },
    { href: '/trainee/certificates', label: 'My Certificates', icon: Award },
    { href: '/trainee/ai-assistant', label: 'AI Learning Copilot', icon: Bot },
  ];

  const trainerLinks = [
    { href: '/trainer/dashboard', label: 'Trainer Dashboard', icon: LayoutDashboard },
    { href: '/trainer/courses', label: 'Course Management', icon: BookOpen },
    { href: '/trainer/resources', label: 'Content Library', icon: FolderArchive },
    { href: '/trainer/assessments', label: 'Questionnaires & MCQs', icon: FileQuestion },
    { href: '/trainer/ai-mcq-generator', label: 'AI MCQ Generator', icon: Wand2, badge: 'AI Studio' },
    { href: '/trainer/trainees', label: 'Trainee Cohorts', icon: BarChart3 },
    { href: '/trainer/profile', label: 'Trainer Profile', icon: GraduationCap },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { href: '/admin/users', label: 'User Approvals & RBAC', icon: Users, badge: '1 Pending' },
    { href: '/admin/courses', label: 'Course Governance', icon: BookOpen },
    { href: '/admin/analytics', label: 'Platform Analytics', icon: BarChart3 },
    { href: '/admin/announcements', label: 'Announcements & Feed', icon: Bell },
  ];

  const links = role === 'ADMIN' ? adminLinks : role === 'TRAINER' ? trainerLinks : traineeLinks;

  const profileHref =
    role === 'ADMIN' ? '/admin/dashboard' : role === 'TRAINER' ? '/trainer/profile' : '/trainee/profile';

  return (
    <aside className="w-64 flex-shrink-0 hidden md:flex border-r border-slate-200/80 bg-white h-[calc(100vh-4rem)] sticky top-16 p-4 flex-col justify-between shadow-xs select-none z-30">
      <div className="flex flex-col min-h-0 flex-1 overflow-hidden space-y-3">
        {/* Sleek Role Workspace Banner */}
        <div className="flex-shrink-0 rounded-2xl bg-gradient-to-r from-brand-50/80 via-indigo-50/50 to-purple-50/30 p-3 border border-brand-100/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black tracking-wider text-slate-800 uppercase">
              {role} Workspace
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">
            {role === 'ADMIN' && 'Governance, Telemetry & Approvals'}
            {role === 'TRAINER' && 'Curriculum & Assessment Hub'}
            {role === 'TRAINEE' && 'Capacity & Competency Tracker'}
          </p>
        </div>

        {/* Navigation Links (Scrollable if height is constrained) */}
        <nav className="space-y-1 overflow-y-auto flex-1 pr-1 -mr-1 custom-scrollbar">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-600'
                    }`}
                  />
                  <span className="truncate">{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap leading-none ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : 'bg-brand-50 text-brand-700 border border-brand-200'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card at bottom (Permanently fixed at bottom of sidebar) */}
      <div className="flex-shrink-0 pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50/90 hover:bg-slate-100/90 border border-slate-200/80 transition-all group">
          <Link
            href={profileHref}
            prefetch={true}
            className="flex items-center gap-2.5 min-w-0 flex-1 mr-2"
          >
            <div className="relative shrink-0">
              <img
                src={
                  user?.avatarUrl ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'User')}`
                }
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/25"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-brand-600 transition-colors leading-tight">
                {user?.name || 'Active User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate leading-tight mt-0.5">
                {user?.email || `${role.toLowerCase()}@campuspilot.ai`}
              </p>
            </div>
          </Link>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition shrink-0 active:scale-90"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
