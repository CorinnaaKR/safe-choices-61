import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Evidence, EvidenceVisual } from '@/types/simulation';
import { useTypewriter } from '@/hooks/useTypewriter';

// ─── Phone message view ───────────────────────────────────────────────────────

function PhoneInspect({ visual }: { visual: EvidenceVisual }) {
  const { thread = [], contactName = 'Unknown', contactInitial = '?' } = visual;
  return (
    <div className="flex flex-col h-full max-h-[480px]">
      {/* Phone chrome */}
      <div
        className="mx-auto w-full max-w-[260px] flex flex-col border border-border bg-background overflow-hidden"
        style={{ borderRadius: '2rem', minHeight: '360px' }}
      >
        {/* Status bar */}
        <div className="flex justify-between items-center px-5 pt-5 pb-1 shrink-0">
          <span className="font-mono text-[9px] text-muted-foreground">09:41</span>
          <div className="w-2.5 h-1.5 border border-muted-foreground rounded-sm" />
        </div>

        {/* Contact */}
        <div className="flex items-center gap-2 px-4 pb-2 border-b border-border shrink-0">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <span className="font-mono text-[11px] text-foreground">{contactInitial}</span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
            {contactName}
          </span>
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 min-h-0">
          {thread.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-2.5 py-1.5 text-[11px] leading-relaxed ${
                  msg.sender === 'you'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground'
                }`}
                style={{
                  borderRadius:
                    msg.sender === 'you' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                }}
              >
                {msg.text}
                {msg.time && (
                  <p className="text-[9px] opacity-60 mt-0.5 text-right">{msg.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Home bar */}
        <div className="flex justify-center py-2">
          <div className="w-16 h-0.5 bg-foreground/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// ─── Extremist poster view ────────────────────────────────────────────────────

function PosterInspect({ visual }: { visual: EvidenceVisual }) {
  const {
    posterTitle = '',
    posterBody = [],
    posterTagline = '',
    posterAccentColor = '#C0392B',
  } = visual;

  return (
    <div
      className="w-full max-w-[280px] mx-auto border-4 p-5 flex flex-col gap-3 min-h-[320px]"
      style={{ borderColor: posterAccentColor, background: '#0D0D0D' }}
    >
      {/* Geometric symbol — abstract angular sun, deliberately not a real symbol */}
      <div className="flex justify-center mb-1">
        <svg viewBox="0 0 60 60" width="52" height="52" fill="none">
          <polygon
            points="30,4 36,22 55,22 40,33 46,52 30,41 14,52 20,33 5,22 24,22"
            fill={posterAccentColor}
            opacity="0.9"
          />
          <circle cx="30" cy="30" r="8" fill="#0D0D0D" />
          <circle cx="30" cy="30" r="4" fill={posterAccentColor} opacity="0.6" />
        </svg>
      </div>

      {/* Title */}
      {posterTitle && (
        <p
          className="font-mono text-[13px] uppercase tracking-[0.2em] text-center leading-tight"
          style={{ color: posterAccentColor }}
        >
          {posterTitle}
        </p>
      )}

      {/* Body paragraphs */}
      {posterBody.map((line, i) => (
        <p key={i} className="text-[11px] text-white/80 leading-relaxed text-center">
          {line}
        </p>
      ))}

      {/* Tagline */}
      {posterTagline && (
        <p
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-center mt-auto"
          style={{ color: posterAccentColor, opacity: 0.7 }}
        >
          {posterTagline}
        </p>
      )}

      {/* Torn-paper edge texture hint */}
      <div className="absolute inset-x-0 bottom-0 h-1 opacity-20"
        style={{ background: `repeating-linear-gradient(90deg, ${posterAccentColor} 0 3px, transparent 3px 6px)` }}
      />
    </div>
  );
}

// ─── TV news screen view ──────────────────────────────────────────────────────

function TVInspect({ visual }: { visual: EvidenceVisual }) {
  const {
    channelName = 'NEWS',
    tvHeadline = '',
    tvSubheadline = '',
    tvTicker = '',
  } = visual;

  return (
    <div
      className="w-full max-w-[320px] mx-auto border-2 border-border overflow-hidden"
      style={{ background: '#08090C', aspectRatio: '16/9' }}
    >
      {/* Channel bug top-left */}
      <div className="flex items-start justify-between p-2">
        <div
          className="bg-red-700 px-2 py-0.5"
        >
          <span className="font-mono text-[9px] font-bold text-white uppercase tracking-widest">
            {channelName}
          </span>
        </div>
        <span className="font-mono text-[8px] text-white/40">LIVE</span>
      </div>

      {/* Main headline area */}
      <div className="px-3 mt-2 mb-1">
        {tvHeadline && (
          <p className="text-white font-bold text-[12px] leading-tight uppercase tracking-wide">
            {tvHeadline}
          </p>
        )}
        {tvSubheadline && (
          <p className="text-white/70 text-[10px] mt-1 leading-tight">
            {tvSubheadline}
          </p>
        )}
      </div>

      {/* Ticker strip at bottom */}
      {tvTicker && (
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden py-1 px-2"
          style={{ background: '#B91C1C' }}
        >
          <motion.p
            className="font-mono text-[9px] text-white whitespace-nowrap uppercase tracking-wider"
            animate={{ x: ['100%', '-200%'] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          >
            {tvTicker}
          </motion.p>
        </div>
      )}
    </div>
  );
}

// ─── Document / printout view ─────────────────────────────────────────────────

function DocumentInspect({ visual }: { visual: EvidenceVisual }) {
  const { documentTitle = '', documentBody = [] } = visual;
  return (
    <div className="w-full max-w-[280px] mx-auto bg-[#F2EDE2] border border-border p-5 min-h-[240px]">
      {documentTitle && (
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A] mb-3 pb-2 border-b border-[#CCC]">
          {documentTitle}
        </p>
      )}
      {documentBody.map((line, i) => (
        <p key={i} className="text-[11px] text-[#2A2A2A] leading-relaxed mb-2">
          {line}
        </p>
      ))}
    </div>
  );
}

// ─── Default text inspect (existing case-file panel) ─────────────────────────

function DefaultInspect({ evidence, evidenceNumber, onDismiss }: {
  evidence: Evidence;
  evidenceNumber: number;
  onDismiss: () => void;
}) {
  const { text, done } = useTypewriter(evidence.content);
  return (
    <div className="case-panel">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <span className="hud-label text-primary">
          Case file — Evidence {String(evidenceNumber).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-3">
          <span className="key-hint"><b>[SCROLL]</b> Zoom</span>
          <button
            onClick={onDismiss}
            className="key-hint hover:text-foreground transition-colors"
            aria-label="Close evidence panel"
          >
            <b>[ESC]</b> Close
          </button>
        </div>
      </div>

      <div className="px-5 py-4">
        <h4 className="font-mono text-sm uppercase tracking-[0.15em] text-foreground mb-1">
          {evidence.title}
        </h4>
        <p className="hud-label mb-4">{evidence.timestamp}</p>
        <p
          className={`text-sm text-foreground/85 leading-relaxed min-h-[3.5rem] ${done ? '' : 'type-caret'}`}
          aria-label={evidence.content}
        >
          {text}
        </p>
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {evidence.category && (
            <span className="hud-label border border-border px-2 py-1">{evidence.category}</span>
          )}
          {evidence.importance && (
            <span className={`hud-label border px-2 py-1 ${evidence.importance === 'critical' ? 'border-primary text-primary' : 'border-border'}`}>
              {evidence.importance}
            </span>
          )}
          <span className="hud-label text-primary ml-auto">Logged ✓</span>
        </div>
      </div>
    </div>
  );
}

// ─── Public export: routes to the right visual ───────────────────────────────

interface InspectViewerProps {
  evidence: Evidence;
  evidenceNumber: number;
  onDismiss: () => void;
}

export function InspectViewer({ evidence, evidenceNumber, onDismiss }: InspectViewerProps) {
  const visual = evidence.visual;
  const titleRef = useRef<HTMLParagraphElement>(null);

  if (!visual) {
    return <DefaultInspect evidence={evidence} evidenceNumber={evidenceNumber} onDismiss={onDismiss} />;
  }

  return (
    <div className="case-panel overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <span className="hud-label text-primary">
          Case file — Evidence {String(evidenceNumber).padStart(2, '0')}
        </span>
        <button
          onClick={onDismiss}
          className="key-hint hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <b>[ESC]</b> Close
        </button>
      </div>

      {/* Visual inspect area */}
      <div className="px-4 pt-4 pb-2 relative flex justify-center">
        {visual.type === 'phone-message' && <PhoneInspect visual={visual} />}
        {visual.type === 'poster' && <PosterInspect visual={visual} />}
        {visual.type === 'tv-screen' && <TVInspect visual={visual} />}
        {visual.type === 'document' && <DocumentInspect visual={visual} />}
      </div>

      {/* Evidence metadata strip */}
      <div className="px-5 py-3 border-t border-border">
        <p ref={titleRef} className="font-mono text-xs uppercase tracking-[0.15em] text-foreground mb-1">
          {evidence.title}
        </p>
        <p className="text-xs text-foreground/70 leading-relaxed">{evidence.content}</p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {evidence.category && (
            <span className="hud-label border border-border px-2 py-1">{evidence.category}</span>
          )}
          {evidence.importance && (
            <span className={`hud-label border px-2 py-1 ${evidence.importance === 'critical' ? 'border-primary text-primary' : 'border-border'}`}>
              {evidence.importance}
            </span>
          )}
          <span className="hud-label text-primary ml-auto">Logged ✓</span>
        </div>
      </div>
    </div>
  );
}
