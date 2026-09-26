'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CompetencyRadar } from '@/components/competency/CompetencyRadar';
import { Sparkles, RefreshCw, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { getClientCached, setClientCached } from '@/lib/client-cache';

export default function CompetenciesPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(() => getClientCached('trainee_competency_data', null));
  const [loading, setLoading] = useState(() => !data);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompetencies = async () => {
    try {
      const res = await fetch(`/api/competency?traineeId=${user?.id || ''}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setClientCached('trainee_competency_data', json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCompetencies();
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCompetencies();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200 mb-1">
            <Sparkles className="w-3 h-3 text-brand-600" />
            AI Competency Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Competency Mapping & Gap Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Continuous comparison between your verified proficiencies and target organizational competency tiers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
            Recalculate AI Gaps
          </button>
          <Link
            href="/trainee/recommendations"
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700 transition"
          >
            Bridge Gaps <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading competency matrix...</div>
      ) : data?.analysis ? (
        <CompetencyRadar
          items={data.analysis.items}
          overallReadiness={data.analysis.overallReadiness}
          onRefresh={fetchCompetencies}
        />
      ) : (
        <div className="p-12 text-center text-xs text-slate-400">No competency records found.</div>
      )}
    </div>
  );
}
