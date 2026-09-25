import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { AIAssistantWidget } from '@/components/ai/AIAssistantWidget';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CampusPilot AI — Smart Learning, Smarter Growth',
  description:
    'Enterprise AI-powered capacity building and learning management platform. Intelligent competency mapping, skill gap analysis, personalized course pathways, and verified digital certifications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable}`}>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <AIAssistantWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
