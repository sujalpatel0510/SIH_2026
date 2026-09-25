'use client';

import React, { useState } from 'react';
import { Check, Copy, Lightbulb, Sparkles, Target } from 'lucide-react';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
}

/**
 * Parses inline formatting like **bold**, *italic*, and `code` into styled React elements
 * without leaving any raw asterisks or backticks.
 */
function renderInlineText(text: string, isUser = false): React.ReactNode[] {
  // Regex to match **bold**, *italic*, `code`, and severity keywords
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\bCRITICAL\b|\bHIGH\b|\bMEDIUM\b|\bMODERATE\b|\bOPTIMAL\b)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const inner = part.slice(2, -2);
      if (['CRITICAL', 'HIGH', 'MEDIUM', 'MODERATE', 'OPTIMAL'].includes(inner.trim())) {
        return renderSeverityBadge(inner.trim(), idx);
      }
      return (
        <strong key={idx} className={isUser ? 'font-bold text-white' : 'font-bold text-slate-900'}>
          {inner}
        </strong>
      );
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <span key={idx} className={isUser ? 'italic text-white/90' : 'italic text-slate-700'}>
          {inner}
        </span>
      );
    }

    // Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 text-indigo-700 font-mono text-[11px] border border-slate-200"
        >
          {inner}
        </code>
      );
    }

    // Severity keywords without asterisks
    if (['CRITICAL', 'HIGH', 'MEDIUM', 'MODERATE', 'OPTIMAL'].includes(part.trim())) {
      return renderSeverityBadge(part.trim(), idx);
    }

    // Regular text (clean up any residual unclosed asterisks)
    const cleaned = part.replace(/\*+/g, '');
    return <span key={idx}>{cleaned}</span>;
  });
}

function renderSeverityBadge(severity: string, key: number | string) {
  switch (severity) {
    case 'CRITICAL':
      return (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          Critical Gap
        </span>
      );
    case 'HIGH':
      return (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          High Gap
        </span>
      );
    case 'MEDIUM':
    case 'MODERATE':
      return (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Medium Gap
        </span>
      );
    case 'OPTIMAL':
      return (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Optimal
        </span>
      );
    default:
      return (
        <span
          key={key}
          className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded text-[10px] font-bold bg-slate-100 text-slate-700"
        >
          {severity}
        </span>
      );
  }
}

/**
 * Code Block Component with Copy functionality
 */
const CodeBlockView: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
        <span className="font-mono uppercase font-bold tracking-wider text-indigo-400">
          {language || 'Code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white transition px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[11px] font-mono text-emerald-300 leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isUser = false }) => {
  if (isUser) {
    return <p className="whitespace-pre-line leading-relaxed">{content}</p>;
  }

  // Pre-process code blocks:
  // Split on ``` delimiters so code blocks are preserved intact
  const segments = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2">
      {segments.map((segment, segIdx) => {
        // If it's a code block segment
        if (segment.startsWith('```') && segment.endsWith('```')) {
          const inner = segment.slice(3, -3);
          const firstLineBreak = inner.indexOf('\n');
          let language = 'code';
          let codeText = inner;
          if (firstLineBreak !== -1) {
            const possibleLang = inner.slice(0, firstLineBreak).trim();
            if (possibleLang && !possibleLang.includes(' ')) {
              language = possibleLang;
              codeText = inner.slice(firstLineBreak + 1);
            }
          }
          return <CodeBlockView key={`code-${segIdx}`} language={language} code={codeText.trim()} />;
        }

        // Otherwise, it's regular markdown text
        const lines = segment.split('\n');
        const blocks: React.ReactNode[] = [];

        let i = 0;
        while (i < lines.length) {
          const rawLine = lines[i];
          const line = rawLine.trim();

          // Empty lines
          if (!line) {
            i++;
            continue;
          }

          // 1. Headings (e.g. ### Heading or ## Heading - NEVER plain # to prevent code comments collision)
          if (line.startsWith('### ') || line.startsWith('## ')) {
            const headingText = line.replace(/^#+\s*/, '').replace(/\*+/g, '');
            blocks.push(
              <div key={`heading-${segIdx}-${i}`} className="pt-2 pb-1 border-b border-slate-200/80 mb-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {headingText}
                </h4>
              </div>
            );
            i++;
            continue;
          }

          // 2. Action plan / numbered step (e.g. 1. Step description)
          const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
          if (numberedMatch) {
            const stepNum = numberedMatch[1];
            const stepText = numberedMatch[2];
            blocks.push(
              <div
                key={`step-${segIdx}-${i}`}
                className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50/80 border border-slate-200/60 my-1"
              >
                <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black">
                  {stepNum}
                </span>
                <div className="flex-1 text-xs leading-relaxed text-slate-800">
                  {renderInlineText(stepText)}
                </div>
              </div>
            );
            i++;
            continue;
          }

          // 3. Bullet items (e.g. • or - or *)
          const bulletMatch = line.match(/^[•\-*]\s+(.*)/);
          if (bulletMatch) {
            const bulletContent = bulletMatch[1];

            // Check if next line is a "Recommended Action:" line
            let nextActionLine: string | null = null;
            if (i + 1 < lines.length) {
              const nextCandidate = lines[i + 1].trim();
              if (
                nextCandidate.toLowerCase().includes('recommended action:') ||
                nextCandidate.toLowerCase().includes('action:')
              ) {
                nextActionLine = nextCandidate;
                i++; // Consume next line
              }
            }

            blocks.push(
              <div
                key={`bullet-${segIdx}-${i}`}
                className="my-1.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all space-y-1.5"
              >
                <div className="flex items-start gap-2">
                  <Target className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="flex-1 text-xs leading-relaxed text-slate-800">
                    {renderInlineText(bulletContent)}
                  </div>
                </div>

                {nextActionLine && (
                  <div className="flex items-start gap-2 mt-1.5 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600 bg-amber-50/50 rounded-xl p-2 border border-amber-100">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-amber-900 mr-1">Recommended Action:</span>
                      <span>
                        {renderInlineText(
                          nextActionLine.replace(/^\*?Recommended Action:\*?\s*/i, '').replace(/\*+/g, '')
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
            i++;
            continue;
          }

          // 4. Highlighted subhead lines
          if (line.includes('**AI Competency Gap Evaluation**') || line.includes('Immediate Action Plan')) {
            blocks.push(
              <div key={`lead-${segIdx}-${i}`} className="pt-1 pb-1">
                <p className="text-xs font-bold text-slate-900 leading-relaxed flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {renderInlineText(line)}
                </p>
              </div>
            );
            i++;
            continue;
          }

          // 5. Standard paragraph
          blocks.push(
            <p key={`p-${segIdx}-${i}`} className="text-xs leading-relaxed text-slate-800 my-1">
              {renderInlineText(line)}
            </p>
          );
          i++;
        }

        return <React.Fragment key={`seg-${segIdx}`}>{blocks}</React.Fragment>;
      })}
    </div>
  );
};
