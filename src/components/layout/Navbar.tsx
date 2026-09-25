'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setShowNotifications(false);
    setShowProfileMenu(false);
  }, [pathname]);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'TRAINER') return '/trainer/dashboard';
    return '/trainee/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all">
      {/* Full width container spanning entire screen, eliminating awkward empty margins */}
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* LEFT: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-all duration-300">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-brand-500 to-purple-500 opacity-0 group-hover:opacity-40 blur-sm transition-opacity" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                  Campus<span className="text-brand-600">Pilot</span>
                </span>
                <span className="rounded-full bg-gradient-to-r from-brand-50 to-indigo-50 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-brand-700 border border-brand-200/80 shadow-xs uppercase leading-none">
                  AI PLATFORM
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block mt-1 leading-none">
                Capacity Building & Competency Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* RIGHT: User Profile / Navigation / Auth Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Quick Navigation Links */}
              <div className="hidden md:flex items-center gap-1 mr-1">
                <Link
                  href={getDashboardLink()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/trainee/courses"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
                >
                  Courses
                </Link>
                <Link
                  href="/trainee/assessments"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition"
                >
                  Assessments
                </Link>
              </div>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition border border-transparent hover:border-slate-200"
                  aria-label="Notifications"
                >
                  <Bell className="h-4.5 w-4.5" />
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
                  </span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2.5 w-84 rounded-2xl bg-white p-3.5 shadow-2xl border border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-brand-600" />
                        Live Notifications (3)
                      </span>
                      <span className="text-[10px] text-brand-600 font-semibold cursor-pointer hover:underline">
                        Mark read
                      </span>
                    </div>
                    <div className="mt-2.5 space-y-2 text-xs">
                      <div className="rounded-xl bg-gradient-to-r from-brand-50/80 to-indigo-50/50 p-3 border border-brand-100">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-brand-950">AI Competency Gap Detected</p>
                          <span className="text-[9px] font-bold text-brand-600 bg-white px-1.5 py-0.5 rounded border border-brand-200">Action</span>
                        </div>
                        <p className="text-brand-800 text-[11px] mt-1 leading-relaxed">
                          Machine Learning evaluated at Level 2/5. Recommended training intervention available.
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                        <p className="font-bold text-slate-800">Assessment Deadline in 14 Days</p>
                        <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                          Machine Learning Verification Assessment 1 is ready for completion.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill & Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="group flex items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1 bg-white hover:bg-slate-50/90 border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200"
                  aria-expanded={showProfileMenu}
                  aria-label="User menu"
                >
                  {/* Avatar with online status ring */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/40 transition"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  {/* User Name & Role Pill */}
                  <div className="hidden sm:flex sm:flex-col items-start text-left min-w-0">
                    <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate max-w-[130px]">
                      {user.name}
                    </span>
                    <span className={`mt-0.5 inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${
                      user.role === 'ADMIN'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
                        : user.role === 'TRAINER'
                        ? 'bg-purple-50 text-purple-700 border-purple-200/70'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200/70'
                    }`}>
                      {user.role === 'ADMIN' ? 'Admin' : user.role === 'TRAINER' ? 'Trainer' : 'Trainee'}
                    </span>
                  </div>

                  {/* Dropdown Chevron */}
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${
                    showProfileMenu ? 'rotate-180 text-indigo-600' : ''
                  }`} />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200/90 z-50 animate-in fade-in slide-in-from-top-2">
                    {/* Header info */}
                    <div className="flex items-center gap-3 px-3 py-3 border-b border-slate-100 bg-slate-50/50 rounded-xl mb-1.5">
                      <img
                        src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/25"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wider uppercase border ${
                            user.role === 'ADMIN'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : user.role === 'TRAINER'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}>
                            {user.role} Account
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 rounded-xl transition"
                      >
                        <Layers className="w-4 h-4 text-indigo-600" />
                        Dashboard
                      </Link>
                      <Link
                        href={user.role === 'TRAINER' ? '/trainer/profile' : user.role === 'ADMIN' ? '/admin/dashboard' : '/trainee/profile'}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-700 rounded-xl transition"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        My Profile
                      </Link>
                      {user.role === 'TRAINEE' && (
                        <Link
                          href="/trainee/certificates"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50/70 hover:text-amber-700 rounded-xl transition"
                        >
                          <Award className="w-4 h-4 text-amber-500" />
                          My Certificates
                        </Link>
                      )}
                      {user.role === 'TRAINER' && (
                        <Link
                          href="/trainer/assessments"
                          onClick={() => setShowProfileMenu(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50/70 hover:text-purple-700 rounded-xl transition"
                        >
                          <BookOpen className="w-4 h-4 text-purple-600" />
                          Questionnaires Studio
                        </Link>
                      )}
                    </div>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : loading ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-xl" />
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-700 hover:text-brand-600 transition px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-indigo-700 transition"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
