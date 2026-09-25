'use client';

import React, { useState } from 'react';
import { Target, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, ArrowRight, Zap, Award } from 'lucide-react';
import Link from 'next/link';

interface CompetencyItem {
  competencyId: string;
  competencyName: string;
  category: string;
  currentLevel: number; // 1-5
  targetLevel: number;  // 1-5
  gap: number;
  assessmentScore: number;
  status: 'OPTIMAL' | 'MODERATE_GAP' | 'HIGH_GAP' | 'CRITICAL_GAP';
  recommendedAction: string;
}

interface CompetencyRadarProps {
  items: CompetencyItem[];
  overallReadiness: number;
  onRefresh?: () => void;
}

const LEVEL_NAMES = ['', 'Novice', 'Beginner', 'Intermediate', 'Advanced', 'Master'];

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({
  items,
  overallReadiness,
  onRefresh,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category)))];
  const filteredItems = filterCategory === 'ALL' ? items : items.filter((i) => i.category === filterCategory);

  const totalGaps = items.filter((i) => i.gap > 0).length;
  const criticalGaps = items.filter((i) => i.status === 'CRITICAL_GAP').length;

  return (
    <div className="space-y-6">
      {/* Top Readiness Score Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-brand-950 to-slate-900 p-7 sm:p-8 text-white shadow-xl border border-indigo-900/60">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3.5 py-1 text-xs font-bold text-brand-200 border border-brand-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Competency & Gap Engine
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Competency Maturity Matrix</h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Standardized against organizational capacity benchmarks. Assessment scores dynamically upgrade verified proficiencies and bridge identified skill deficits.
            </p>
            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Critical Gaps: <strong className="text-white">{criticalGaps}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Total Active Gaps: <strong className="text-white">{totalGaps}</strong>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Benchmark Standard: <strong className="text-white">Level 4 (Advanced)</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 shrink-0">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-white/20"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-brand-400 transition-all duration-1000 ease-out"
                  strokeDasharray={`${overallReadiness}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-black">{overallReadiness}%</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-300 font-extrabold">
                Overall Maturity
              </p>
              <p className="text-xs font-bold text-brand-200 mt-0.5">
                {overallReadiness >= 80 ? 'Target Benchmark Met' : 'Active Interventions Needed'}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">Continuous evaluation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                filterCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Competency Gap Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isGap = item.gap > 0;
          const statusBadge =
            item.status === 'CRITICAL_GAP'
              ? { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Critical Gap (Level 1/5)' }
              : item.status === 'HIGH_GAP'
              ? { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'High Gap (Level 2/5)' }
              : item.status === 'MODERATE_GAP'
              ? { bg: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Moderate Gap (Level 3/5)' }
              : { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Benchmark Standard Met' };

          return (
            <div
              key={item.competencyId}
              className={`rounded-3xl bg-white p-6 border shadow-subtle transition-all hover:shadow-card flex flex-col justify-between space-y-4 ${
                item.status === 'CRITICAL_GAP' || item.status === 'HIGH_GAP'
                  ? 'border-amber-300/90 ring-1 ring-amber-400/20'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.competencyName}</h3>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold border ${statusBadge.bg} shrink-0`}
                  >
                    {statusBadge.label}
                  </span>
                </div>

                {/* 5-Tier Step Visualizer */}
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-semibold">5-Tier Proficiency</span>
                    <span className="font-extrabold text-slate-800">
                      Level {item.currentLevel} ({LEVEL_NAMES[item.currentLevel]}) → Target: Level {item.targetLevel} ({LEVEL_NAMES[item.targetLevel]})
                    </span>
                  </div>

                  {/* 5 Segment Step Bar */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const isCurrent = lvl <= item.currentLevel;
                      const isTarget = lvl <= item.targetLevel && !isCurrent;
                      return (
                        <div key={lvl} className="space-y-1">
                          <div
                            className={`h-2.5 rounded-full transition-all ${
                              isCurrent
                                ? item.status === 'CRITICAL_GAP'
                                  ? 'bg-rose-500'
                                  : item.status === 'HIGH_GAP'
                                  ? 'bg-amber-500'
                                  : 'bg-brand-600'
                                : isTarget
                                ? 'bg-slate-200'
                                : 'bg-slate-100'
                            }`}
                          />
                          <p className="text-[9px] text-center font-bold text-slate-400">L{lvl}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verified Assessment Score & Gap Indicator */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-600" />
                    <span>Verified Assessment Score:</span>
                    <span className="font-extrabold text-slate-900">{item.assessmentScore}%</span>
                  </div>
                  <div className="text-[11px] font-bold">
                    {isGap ? (
                      <span className="text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Deficit: -{item.gap} Levels
                      </span>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Benchmark
                      </span>
                    )}
                  </div>
                </div>

                {/* AI Recommended Intervention */}
                <div className="rounded-2xl bg-slate-50 p-3.5 text-slate-700 text-xs border border-slate-200/80 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed text-slate-700 font-medium">{item.recommendedAction}</p>
                </div>
              </div>

              {/* Bottom Quick-Action Link */}
              {isGap && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <Link
                    href="/trainee/recommendations"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    View Targeted Courses & Trainers <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
