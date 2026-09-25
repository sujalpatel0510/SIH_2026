'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function TrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 min-w-0">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
