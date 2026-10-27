'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Magnetic from './Magnetic';
import { profile } from '@/lib/data';
import { downloadResume } from '@/lib/store';

type Phase = 'idle' | 'sending' | 'done';

export default function ResumeButton({ size = 'lg' }: { size?: 'lg' | 'md' }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const [burst, setBurst] = useState(0);

  const pad = size === 'lg' ? 'h-14 px-8 text-[15px]' : 'h-12 px-6 text-[14px]';

  const setFrom = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (phase !== 'idle') return;
    setPhase('sending');
    window.setTimeout(() => {
      downloadResume(profile.resume);
      setBurst((b) => b + 1);
      setPhase('done');
      window.setTimeout(() => setPhase('idle'), 1900);
    }, 1100);
  };

  return (
    <Magnetic strength={0.25}>
      <a
        ref={ref}
        href={profile.resume}
        download
        onClick={onClick}
        onPointerEnter={(e) => {
          setFrom(e);
          setHover(true);
        }}
        onPointerLeave={(e) => {
          setFrom(e);
          setHover(false);
        }}
        className={`relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-star font-medium tracking-tight text-void ${pad}`}
      >
        <motion.span
          aria-hidden
          className="absolute -z-10 aspect-square w-[260%] rounded-full bg-signal"
          style={{ left: `${origin.x}%`, top: `${origin.y}%`, x: '-50%', y: '-50%' }}
          initial={false}
          animate={{ scale: hover && phase === 'idle' ? 1 : 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          aria-hidden
          className="absolute inset-0 -z-10 origin-left bg-ion"
          initial={false}
          animate={{ scaleX: phase === 'idle' ? 0 : 1 }}
          transition={{ duration: phase === 'sending' ? 1.1 : 0.4, ease: phase === 'sending' ? [0.65, 0, 0.35, 1] : 'easeOut' }}
        />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phase}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className={`flex items-center gap-3 transition-colors duration-300 ${hover && phase === 'idle' ? 'text-white' : ''}`}
          >
            {phase === 'idle' && (
              <>
                Download Résumé
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M7 1v9m0 0L3 6m4 4 4-4M1.5 13h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>
            )}
            {phase === 'sending' && <span className="font-mono text-[12px] uppercase tracking-[0.22em]">Transmitting…</span>}
            {phase === 'done' && <span className="font-mono text-[12px] uppercase tracking-[0.22em]">Received ✓</span>}
          </motion.span>
        </AnimatePresence>
        {burst > 0 && (
          <span key={burst} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2">
            {Array.from({ length: 14 }).map((_, i) => {
              const a = (i / 14) * Math.PI * 2;
              const d = 70 + (i % 3) * 22;
              return (
                <motion.span
                  key={i}
                  className="absolute h-1 w-1 rounded-full bg-ion shadow-[0_0_8px_2px_rgba(94,232,245,0.8)]"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d * 0.55, opacity: 0, scale: 0.2 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
          </span>
        )}
      </a>
    </Magnetic>
  );
}
