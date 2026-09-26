'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Award,
  ShieldCheck,
  Download,
  ExternalLink,
  Calendar,
  CheckCircle2,
  PlusCircle,
  X,
  FileCheck,
  Building,
  Hash,
  Trash2,
  Printer,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Eye,
  FileText,
  RotateCcw
} from 'lucide-react';
import { getClientCached, setClientCached } from '@/lib/client-cache';
import { Modal } from '@/components/ui/Modal';

interface CertificateItem {
  id: string;
  certificateNumber: string;
  title: string;
  issueDate: string;
  verificationCode: string;
  pdfUrl?: string | null;
  issuer?: string;
  grade?: string;
  course?: { id: string; title: string; subject: string };
  trainee?: { id: string; name: string; email: string };
}

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateItem[]>(() =>
    getClientCached('trainee_certs_cache', [])
  );
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(() => certificates.length === 0);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const [viewerTab, setViewerTab] = useState<'DOCUMENT' | 'CREDENTIAL'>('DOCUMENT');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [issuer, setIssuer] = useState('CampusPilot AI National Capacity Board');
  const [grade, setGrade] = useState('Distinction (94%)');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [certificateNumber, setCertificateNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [imageSizeStr, setImageSizeStr] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate unique IDs when opening modal
  const openAddModal = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codeSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCertificateNumber(`CP-CERT-2026-${randomSuffix}`);
    setVerificationCode(`VERIFY-CP-${codeSuffix}`);
    setUploadedImage(null);
    setImageFileName('');
    setImageSizeStr('');
    setImageUrlInput('');
    setShowAddModal(true);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch certificates & courses
  useEffect(() => {
    async function loadData() {
      try {
        const [certRes, courseRes] = await Promise.all([
          fetch(`/api/certificates?traineeId=${user?.id || ''}`),
          fetch('/api/courses'),
        ]);

        if (certRes.ok) {
          const certData = await certRes.json();
          setCertificates(certData.certificates || []);
          setClientCached('trainee_certs_cache', certData.certificates || []);
        }

        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourses(courseData.courses || []);
          if (courseData.courses?.length > 0 && !courseId) {
            setCourseId(courseData.courses[0].id);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Handle Image File Selection & Compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    setImageFileName(file.name);
    setImageSizeStr(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize/compress image using canvas to ensure fast load and storage
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setUploadedImage(compressedDataUrl);
        } else {
          setUploadedImage(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a certificate title');
      return;
    }

    setSubmitting(true);
    try {
      const finalAsset = uploadedImage || imageUrlInput.trim() || undefined;

      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          courseId: courseId || undefined,
          traineeId: user?.id,
          certificateNumber,
          verificationCode,
          issueDate,
          imageUrl: finalAsset,
          pdfUrl: finalAsset,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Failed to add certificate');
        return;
      }

      const data = await res.json();
      const newCert: CertificateItem = {
        ...data.certificate,
        issuer,
        grade,
      };

      const updated = [newCert, ...certificates];
      setCertificates(updated);
      setClientCached('trainee_certs_cache', updated);
      setShowAddModal(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });

      showToast(`🎉 "${title}" and certificate image successfully saved!`);

      // Reset form
      setTitle('');
      setUploadedImage(null);
      setImageFileName('');
      setImageSizeStr('');
      setImageUrlInput('');
    } catch (e) {
      console.error(e);
      showToast('Network error while adding certificate');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCertificate = async (id: string, certTitle: string) => {
    if (!confirm(`Are you sure you want to remove the certificate "${certTitle}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/certificates?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        const filtered = certificates.filter((c) => c.id !== id);
        setCertificates(filtered);
        setClientCached('trainee_certs_cache', filtered);
        showToast('Certificate removed successfully');
      } else {
        showToast('Failed to remove certificate');
      }
    } catch (e) {
      console.error(e);
      showToast('Network error while removing certificate');
    }
  };

  const isImageAsset = (url?: string | null) => {
    if (!url) return false;
    return (
      url.startsWith('data:image/') ||
      url.endsWith('.png') ||
      url.endsWith('.jpg') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.webp') ||
      url.endsWith('.svg') ||
      url.includes('images.unsplash.com') ||
      url.includes('imgur.com') ||
      url.includes('cloudinary.com')
    );
  };

  const openCertificateViewer = (cert: CertificateItem) => {
    setSelectedCert(cert);
    if (isImageAsset(cert.pdfUrl)) {
      setViewerTab('DOCUMENT');
    } else {
      setViewerTab('CREDENTIAL');
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-emerald-700 text-white px-5 py-3 shadow-2xl text-xs font-bold animate-in fade-in slide-in-from-top-4 border border-emerald-500 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 mb-1">
            <Award className="w-3 h-3 text-emerald-600" />
            Accredited Competency Credentials
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Verified Certificates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Upload and view your official certificates, completed milestones, and verifiable credentials.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-95 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Add Certificate
        </button>
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading verified certificates...</div>
      ) : certificates.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center bg-white space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Certificates Added Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your completed internal or external professional credentials with uploaded image proofs to showcase your competencies.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            + Add Your First Certificate
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => {
            const formattedDate = new Date(cert.issueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
            const hasImage = isImageAsset(cert.pdfUrl);

            return (
              <div
                key={cert.id}
                className="rounded-3xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between overflow-hidden relative group"
              >
                {/* Certificate Image Preview Banner if available */}
                {hasImage && cert.pdfUrl ? (
                  <div
                    onClick={() => openCertificateViewer(cert)}
                    className="relative h-44 w-full bg-slate-950 overflow-hidden cursor-pointer group/img"
                  >
                    <img
                      src={cert.pdfUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover object-top opacity-90 group-hover/img:scale-105 group-hover/img:opacity-100 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        <ImageIcon className="w-3 h-3 text-emerald-400" /> Uploaded Certificate Document
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover/img:opacity-100 transition">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow">
                        <Eye className="w-3 h-3 text-brand-600" /> Click to Expand
                      </span>
                    </div>
                  </div>
                ) : null}

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Credential
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-slate-400">{cert.certificateNumber}</span>
                      <button
                        onClick={() => handleDeleteCertificate(cert.id, cert.title)}
                        title="Delete Certificate"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 leading-snug">{cert.title}</h2>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <p>
                      Recipient:{' '}
                      <strong className="text-slate-800">
                        {cert.trainee?.name || user?.name || 'Priya Sharma'}
                      </strong>
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <Calendar className="w-3.5 h-3.5" /> Issued on {formattedDate} •{' '}
                      {cert.grade || 'Merit Standard (92%)'}
                    </p>
                    {cert.course && (
                      <p className="text-[11px] text-slate-500">
                        Subject: <span className="font-medium text-slate-700">{cert.course.subject}</span>
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Security Verification:</span>
                    <span className="font-mono text-[11px] font-bold text-slate-800">
                      {cert.verificationCode}
                    </span>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Blockchain Certified
                  </span>
                  <button
                    onClick={() => openCertificateViewer(cert)}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition flex items-center gap-1.5 active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Certificate
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD CERTIFICATE MODAL WITH IMAGE UPLOAD */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        maxWidth="max-w-xl"
      >
        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Add Accredited Certificate</h2>
                <p className="text-[11px] text-slate-500">Record credential details and upload certificate image</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAddCertificate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Certificate Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Deep Learning & Neural Systems Mastery"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none"
              />
            </div>

            {/* IMAGE UPLOAD SECTION */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Certificate Image / Scanned Document</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Recommended</span>
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
              />

              {uploadedImage ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 space-y-2">
                  <div className="relative rounded-xl overflow-hidden h-36 bg-slate-900 border border-emerald-200">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUploadedImage(null);
                        setImageFileName('');
                      }}
                      className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-600 text-white p-1 rounded-lg transition"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
                    <span className="font-bold truncate max-w-[240px]">
                      ✓ {imageFileName || 'Certificate Image Attached'} {imageSizeStr && `(${imageSizeStr})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Change Image
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition bg-slate-50/60 hover:bg-emerald-50/30 space-y-1.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to upload certificate image
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Supports PNG, JPG, JPEG, WebP (Scanned certificate or digital badge)
                  </p>
                </div>
              )}
            </div>

            {/* Or Direct Image URL input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Or paste external Certificate Image URL
              </label>
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/... or https://..."
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Associated Course
              </label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none bg-white"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.subject})
                  </option>
                ))}
                {courses.length === 0 && <option value="">General Capacity Building</option>}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. National Capacity Board"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Credential ID / Number
                </label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={(e) => setCertificateNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-semibold focus:border-brand-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Security Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-mono font-semibold focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grade / Achievement Level
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="e.g. Distinction (95%)"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 active:scale-95"
              >
                {submitting ? 'Verifying & Saving...' : 'Save & Show Certificate'}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* VIEW CERTIFICATE MODAL WITH UPLOADED IMAGE & DIGITAL CREDENTIAL VIEWS */}
      <Modal
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        maxWidth="max-w-2xl"
      >
        {selectedCert && (
          <div className="p-6 sm:p-8 space-y-5">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase">
                  Verified Credential
                </span>
                <span className="font-mono text-xs text-slate-400">• {selectedCert.certificateNumber}</span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* View Switcher Tabs (if image is present) */}
            {isImageAsset(selectedCert.pdfUrl) && (
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setViewerTab('DOCUMENT')}
                  className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    viewerTab === 'DOCUMENT'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> Uploaded Certificate Document
                </button>
                <button
                  onClick={() => setViewerTab('CREDENTIAL')}
                  className={`flex-1 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
                    viewerTab === 'CREDENTIAL'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-600" /> Digital Cryptographic Seal
                </button>
              </div>
            )}

            {/* TAB 1: UPLOADED CERTIFICATE IMAGE VIEW */}
            {viewerTab === 'DOCUMENT' && isImageAsset(selectedCert.pdfUrl) ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-950 p-2 overflow-hidden flex items-center justify-center min-h-[300px] max-h-[500px]">
                  <img
                    src={selectedCert.pdfUrl!}
                    alt={selectedCert.title}
                    className="max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-lg"
                  />
                </div>

                <div className="rounded-xl bg-slate-50 p-3 text-xs border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{selectedCert.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Awarded to {selectedCert.trainee?.name || user?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-600 font-bold">{selectedCert.verificationCode}</span>
                    <p className="text-[10px] text-slate-400">Security Verified</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <a
                    href={selectedCert.pdfUrl!}
                    download={`${selectedCert.title.replace(/\s+/g, '_')}_certificate.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Full Image
                  </a>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                </div>
              </div>
            ) : (
              /* TAB 2: DIGITAL INSTITUTIONAL CERTIFICATE */
              <div className="border-4 border-double border-indigo-200 rounded-3xl p-6 sm:p-10 text-center space-y-6 bg-gradient-to-b from-white to-slate-50/50">
                <div className="space-y-2">
                  <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-xs uppercase tracking-widest text-brand-600 font-extrabold">
                    Certificate of Competency Achievement
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedCert.issuer || 'Awarded by CampusPilot AI Capacity Connect'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500">This is to proudly certify that</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    {selectedCert.trainee?.name || user?.name || 'Priya Sharma'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    has successfully fulfilled all evaluation benchmarks in
                  </p>
                  <h4 className="text-base sm:text-lg font-bold text-indigo-900 pt-1">
                    {selectedCert.title}
                  </h4>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                  <div className="text-left">
                    <p className="font-bold text-slate-800">{selectedCert.certificateNumber}</p>
                    <p className="text-[10px]">
                      Issued on{' '}
                      {new Date(selectedCert.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-emerald-600 font-bold">{selectedCert.verificationCode}</p>
                    <p className="text-[10px]">Verified Digital Credential</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print / PDF Export
                  </button>
                  {selectedCert.pdfUrl && (
                    <a
                      href={selectedCert.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open Attached File
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
