'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export default function Hud() {
  const [sector, setSector] = useState({ index: '00', name: 'Launch' });
  const [visible, setVisible] = useState(false);
  const pct = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-sector]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          setSector({ index: el.dataset.index ?? '00', name: el.dataset.sector ?? '' });
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        if (pct.current) pct.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
        if (bar.current) bar.current.style.transform = `scaleY(${p})`;
        setVisible(window.scrollY > window.innerHeight * 0.6);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-40 hidden justify-between px-8 transition-opacity duration-700 md:flex ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="eyebrow flex items-center gap-3">
        <span className="text-ion">Sector {sector.index}</span>
        <span className="h-px w-6 bg-white/20" />
        <span className="relative h-4 overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={sector.name}
              className="block"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {sector.name}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
      <div className="eyebrow flex items-center gap-3">
        ALT <span ref={pct} className="tabular-nums text-star/80">000</span>%
        <span className="relative h-8 w-px overflow-hidden bg-white/15">
          <div ref={bar} className="absolute inset-0 origin-top bg-ion" style={{ transform: 'scaleY(0)' }} />
        </span>
      </div>
    </div>
  );
}
