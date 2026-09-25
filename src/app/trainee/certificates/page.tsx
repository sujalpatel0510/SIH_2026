'use client';

import React, { useState } from 'react';
import { Award, ShieldCheck, Download, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';

export default function CertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<any>(null);

  const certificates = [
    {
      id: '1',
      certificateNumber: 'CP-CERT-2026-CLOUD-8841',
      title: 'Cloud Architecture & Enterprise Microservices — Professional Certification',
      issueDate: 'September 18, 2026',
      recipientName: 'Priya Sharma',
      verificationCode: 'VERIFY-CP-8841-XYZ',
      issuer: 'CampusPilot AI National Capacity Board',
      grade: 'Distinction (94%)',
      status: 'VERIFIED',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 mb-1">
          <Award className="w-3 h-3 text-emerald-600" />
          Accredited Competency Credentials
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          My Verified Certificates
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Tamper-proof verifiable credentials issued upon passing subject competency assessments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-3xl bg-white p-6 border border-slate-200/80 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-5"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Credential
                </span>
                <span className="font-mono text-[10px] text-slate-400">{cert.certificateNumber}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">{cert.title}</h2>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <p>
                  Recipient: <strong className="text-slate-800">{cert.recipientName}</strong>
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5" /> Issued on {cert.issueDate} • Grade: {cert.grade}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500">Security Verification:</span>
                <span className="font-mono text-[11px] font-bold text-slate-800">
                  {cert.verificationCode}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Blockchain Certified
              </span>
              <button
                onClick={() => setSelectedCert(cert)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600 transition flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Digital Certificate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl border-4 border-double border-indigo-200 relative text-center space-y-6">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xs font-bold p-2"
            >
              ✕ Close
            </button>

            <div className="space-y-2">
              <div className="h-16 w-16 mx-auto rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-xs uppercase tracking-widest text-brand-600 font-extrabold">
                Certificate of Competency Achievement
              </h2>
              <p className="text-xs text-slate-400">Awarded by CampusPilot AI Capacity Connect</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-500">This is to proudly certify that</p>
              <h3 className="text-2xl font-black text-slate-900">{selectedCert.recipientName}</h3>
              <p className="text-xs text-slate-500">
                has successfully fulfilled all rigorous evaluation standards in
              </p>
              <h4 className="text-base font-bold text-indigo-900 pt-1">{selectedCert.title}</h4>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
              <div className="text-left">
                <p className="font-bold text-slate-800">{selectedCert.certificateNumber}</p>
                <p className="text-[10px]">Issued on {selectedCert.issueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-emerald-600 font-bold">{selectedCert.verificationCode}</p>
                <p className="text-[10px]">Verified Digital Credential</p>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-brand-700 transition"
            >
              Download PDF Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
