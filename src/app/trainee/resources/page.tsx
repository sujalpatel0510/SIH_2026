'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderArchive,
  FileText,
  Video,
  Presentation,
  Download,
  ExternalLink,
  Sparkles,
  Search,
  CheckCircle2,
  X,
  Play,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { getClientCached, setClientCached } from '@/lib/client-cache';
import { Modal } from '@/components/ui/Modal';

interface ResourceItem {
  id: string;
  title: string;
  course: string;
  type: 'PDF' | 'VIDEO' | 'PPT' | 'DOCUMENT' | 'NOTES';
  duration: string;
  trainer: string;
  description?: string;
  fileUrl?: string;
  contentSnippet?: string;
}

const DEFAULT_RESOURCES: ResourceItem[] = [
  {
    id: '1',
    title: 'Module 1: Mathematical Foundations of Machine Learning & Linear Algebra',
    course: 'Machine Learning & Neural Systems Mastery',
    type: 'PDF',
    duration: '45 Pages',
    trainer: 'Dr. Rajesh Verma',
    description: 'Comprehensive lecture notes covering vector spaces, eigenvalues, matrix decompositions, and multivariate calculus essential for neural optimization.',
    fileUrl: 'https://arxiv.org/pdf/1802.01528.pdf',
    contentSnippet: 'Chapter 1: Vectors, Matrices, and Linear Transformations.\n1.1 Vector Spaces and Inner Products\n1.2 Matrix Factorization & SVD\n1.3 Gradient Vectors and the Hessian Matrix\n1.4 Convex Optimization in Machine Learning\n\nTheorem 1.1: Every real symmetric matrix has real eigenvalues and an orthogonal basis of eigenvectors.',
  },
  {
    id: '2',
    title: 'Module 2: Video Lecture — Gradient Descent, Backpropagation & Loss Surfaces',
    course: 'Machine Learning & Neural Systems Mastery',
    type: 'VIDEO',
    duration: '52 Mins',
    trainer: 'Dr. Rajesh Verma',
    description: 'Full HD masterclass breakdown of stochastic gradient descent variants (Adam, RMSProp) with visual step-by-step tensor computation graphs.',
    fileUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    contentSnippet: 'Video Masterclass Breakdown:\n- [00:00] Introduction to High-Dimensional Loss Surfaces\n- [12:30] Forward Pass & Activation Functions (ReLU vs GELU)\n- [24:15] Backpropagation Calculus & Chain Rule Application\n- [38:40] Adaptive Optimizers: AdamW vs AdaGrad\n- [49:10] Vanishing and Exploding Gradient Mitigations',
  },
  {
    id: '3',
    title: 'Module 3: Hands-on Lab Notebook & Model Evaluation Deck',
    course: 'Machine Learning & Neural Systems Mastery',
    type: 'PPT',
    duration: '38 Slides',
    trainer: 'Dr. Rajesh Verma',
    description: 'Architecture slide deck for presenting model confusion matrices, ROC-AUC curves, cross-validation strategies, and production latency tradeoffs.',
    fileUrl: '#',
    contentSnippet: 'Slide 1: Production Machine Learning Evaluation Frameworks\nSlide 2: Beyond Accuracy — Precision, Recall, and F1 at Scale\nSlide 3: Precision-Recall Curves for Imbalanced Cohorts\nSlide 4: Calibration Curves & Brier Scores\nSlide 5: Automated Drift Detection & Continuous Retraining Loops',
  },
  {
    id: '4',
    title: 'Enterprise Microservices Patterns & Kubernetes Ingress Blueprint',
    course: 'Cloud Architecture & Enterprise Microservices',
    type: 'PDF',
    duration: '62 Pages',
    trainer: 'Prof. Sunita Nair',
    description: 'Enterprise guide on gRPC service meshes, circuit breaking with Envoy, zero-trust network policies, and horizontal pod autoscaling patterns.',
    fileUrl: 'https://kubernetes.io/docs/concepts/services-networking/ingress/',
    contentSnippet: 'Section 1: Distributed Architecture Best Practices.\n1.1 Database-per-service vs Shared Operational Stores\n1.2 Event-Driven Architecture with Kafka & Pub/Sub\n1.3 Ingress Controllers & TLS Termination Strategies\n1.4 Distributed Tracing with OpenTelemetry and Jaeger',
  },
];

export default function LearningResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>(DEFAULT_RESOURCES);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [activeModalResource, setActiveModalResource] = useState<ResourceItem | null>(null);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>(() =>
    getClientCached('cp_completed_resources', { '1': true })
  );
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);

  // Fetch dynamic resources from courses in database
  useEffect(() => {
    async function loadCourseResources() {
      try {
        const res = await fetch('/api/courses');
        if (res.ok) {
          const data = await res.json();
          const dbResources: ResourceItem[] = [];
          if (data.courses) {
            for (const c of data.courses) {
              if (c.resources && c.resources.length > 0) {
                for (const r of c.resources) {
                  dbResources.push({
                    id: r.id,
                    title: r.title,
                    course: c.title,
                    type: (r.resourceType as any) || 'PDF',
                    duration: r.duration || '30 Mins',
                    trainer: c.trainer?.name || 'Master Trainer',
                    description: r.description || `Learning material for ${c.title}`,
                    fileUrl: r.fileUrl,
                    contentSnippet: `Official curriculum asset published for ${c.title}.\nType: ${r.resourceType}\nDuration: ${r.duration || '30 Mins'}\nAccess verified by institutional capacity matrix.`,
                  });
                }
              }
            }
          }
          if (dbResources.length > 0) {
            setResources([...dbResources, ...DEFAULT_RESOURCES]);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadCourseResources();
  }, []);

  const toggleComplete = (id: string) => {
    setCompletedIds((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      setClientCached('cp_completed_resources', updated);
      return updated;
    });
  };

  const filteredResources = resources.filter((item) => {
    const matchesType = selectedType === 'ALL' || item.type === selectedType;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.course.toLowerCase().includes(search.toLowerCase()) ||
      item.trainer.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <Video className="w-4 h-4" />;
      case 'PPT':
        return <Presentation className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'PPT':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-rose-600 bg-rose-50 border-rose-200';
    }
  };

  const handleDownload = (resource: ResourceItem) => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `============================================================\n` +
          `CAMPUSPILOT AI — OFFICIAL STUDY MATERIAL\n` +
          `============================================================\n` +
          `Title: ${resource.title}\n` +
          `Course: ${resource.course}\n` +
          `Trainer: ${resource.trainer}\n` +
          `Type: ${resource.type} • ${resource.duration}\n` +
          `============================================================\n\n` +
          (resource.contentSnippet || resource.description || 'Verified course document.')
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
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

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Completed:{' '}
            <strong className="text-emerald-600 font-bold">
              {Object.values(completedIds).filter(Boolean).length} / {resources.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PDF', 'VIDEO', 'PPT'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === type
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {type === 'ALL' ? 'All Content' : type === 'PPT' ? 'Presentations' : type === 'VIDEO' ? 'Video Masterclasses' : 'Documents'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by topic, trainer, or course..."
            className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-1.5 text-xs font-medium focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((item) => {
          const isDone = !!completedIds[item.id];
          return (
            <div
              key={item.id}
              className={`rounded-3xl bg-white p-5 border transition-all flex flex-col justify-between space-y-4 ${
                isDone ? 'border-emerald-200/90 shadow-xs' : 'border-slate-200/80 shadow-subtle hover:shadow-card'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-lg px-2.5 py-1 border font-bold text-[11px] flex items-center gap-1.5 ${getTypeStyle(
                      item.type
                    )}`}
                  >
                    {getTypeIcon(item.type)} {item.type}
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
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={`text-xs font-semibold flex items-center gap-1.5 transition ${
                    isDone ? 'text-emerald-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isDone ? 'text-emerald-600 fill-emerald-100' : 'text-slate-300'}`} />
                  {isDone ? 'Studied' : 'Mark as Studied'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(item)}
                    title="Download Notes"
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setActiveModalResource(item);
                      setCurrentSlideIndex(1);
                    }}
                    className="rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brand-600 transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {item.type === 'VIDEO' ? 'Watch Stream' : item.type === 'PPT' ? 'View Slides' : 'Read Document'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RESOURCE VIEWER MODAL */}
      <Modal isOpen={!!activeModalResource} onClose={() => setActiveModalResource(null)} maxWidth="max-w-3xl">
        {activeModalResource && (
          <div className="p-6 sm:p-8 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold border ${getTypeStyle(
                    activeModalResource.type
                  )}`}
                >
                  {getTypeIcon(activeModalResource.type)} {activeModalResource.type} • {activeModalResource.duration}
                </span>
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {activeModalResource.title}
                </h2>
                <p className="text-xs text-slate-500">
                  Course: <strong className="text-slate-700">{activeModalResource.course}</strong> • Instructor:{' '}
                  {activeModalResource.trainer}
                </p>
              </div>

              <button
                onClick={() => setActiveModalResource(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Viewer */}
            {activeModalResource.type === 'VIDEO' ? (
              <div className="space-y-4">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800 shadow-inner group">
                  <div className="text-center text-white space-y-3 p-6">
                    <div className="h-16 w-16 mx-auto rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition cursor-pointer">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Interactive Masterclass Video Stream</h4>
                      <p className="text-xs text-slate-400 mt-1 max-w-md">
                        Streaming: {activeModalResource.title} (52 Minutes Full HD)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Lecture Key Timestamps
                  </h4>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed">
                    {activeModalResource.contentSnippet}
                  </pre>
                </div>
              </div>
            ) : activeModalResource.type === 'PPT' ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white min-h-[220px] flex flex-col justify-between border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{activeModalResource.course}</span>
                    <span className="font-bold bg-white/10 px-2 py-0.5 rounded">
                      Slide {currentSlideIndex} of 5
                    </span>
                  </div>
                  <div className="my-6">
                    <h3 className="text-lg font-black text-amber-300">
                      {currentSlideIndex === 1 && 'Production ML Architecture & Pipeline Fundamentals'}
                      {currentSlideIndex === 2 && 'Precision, Recall, ROC-AUC Curves and Cutoff Thresholds'}
                      {currentSlideIndex === 3 && 'High-Dimensional Loss Geometries & Backprop Calculus'}
                      {currentSlideIndex === 4 && 'Model Calibration, Brier Scores & Confidence Bounds'}
                      {currentSlideIndex === 5 && 'Automated Continuous Deployment & Data Drift Sentinel'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      {currentSlideIndex === 1 && 'Understanding end-to-end telemetry from data ingestion to model serving latency.'}
                      {currentSlideIndex === 2 && 'Balancing false positives and false negatives under critical institutional SLA guarantees.'}
                      {currentSlideIndex === 3 && 'Evaluating gradient vector flow through vanishing gradient resilient structures.'}
                      {currentSlideIndex === 4 && 'Translating raw logit outputs into reliable probabilistic calibrated predictions.'}
                      {currentSlideIndex === 5 && 'Configuring automated retrain triggers on Kolmogorov-Smirnov drift detection.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-white/10 pt-3">
                    <button
                      disabled={currentSlideIndex <= 1}
                      onClick={() => setCurrentSlideIndex((prev) => Math.max(1, prev - 1))}
                      className="flex items-center gap-1 font-bold text-slate-300 hover:text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous Slide
                    </button>
                    <button
                      disabled={currentSlideIndex >= 5}
                      onClick={() => setCurrentSlideIndex((prev) => Math.min(5, prev + 1))}
                      className="flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 disabled:opacity-30"
                    >
                      Next Slide <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 max-h-72 overflow-y-auto space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-700">Digital Document Preview</span>
                    <span>Verified Academic Syllabus Resource</span>
                  </div>
                  <pre className="text-xs text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
                    {activeModalResource.contentSnippet}
                  </pre>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleComplete(activeModalResource.id);
                  setActiveModalResource(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  completedIds[activeModalResource.id]
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedIds[activeModalResource.id] ? 'Completed ✓' : 'Mark as Studied & Close'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(activeModalResource)}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Download className="w-4 h-4" />
                  Save Notes File
                </button>
                <button
                  onClick={() => setActiveModalResource(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
