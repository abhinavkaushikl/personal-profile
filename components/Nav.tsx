'use client';

import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { profile } from '@/lib/data';
import { scrollToId } from '@/lib/store';

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'academy', label: 'Academy' },
  { id: 'flight-log', label: 'Flight Log' },
  { id: 'payload', label: 'Payload' },
  { id: 'simulator', label: 'Simulator' },
  { id: 'systems', label: 'Systems' },
  { id: 'console', label: 'Console' },
  { id: 'transmission', label: 'Contact' },
];

export default function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [entered, setEntered] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const t = window.setTimeout(() => setEntered(true), 1600);
    return () => window.clearTimeout(t);
  }, []);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const d = y - lastY.current;
    if (Math.abs(d) < 10) return;
    setHidden(d > 0 && y > 260);
    lastY.current = y;
  });

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: hidden ? -90 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 28, delay: entered ? 0 : 1.2 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="glass flex items-center rounded-full py-1.5 pl-4 pr-1.5">
        <button
          onClick={() => scrollToId('top')}
          className="mr-2 flex items-center gap-2 font-mono text-[12px] tracking-[0.22em] text-star"
          aria-label="Back to top"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ion shadow-[0_0_10px_#5EE8F5]" />
          AK
        </button>
        <ul className="hidden items-center lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => scrollToId(l.id)}
                className="rounded-full px-3.5 py-2 text-[13px] text-star/55 transition-colors duration-300 hover:bg-white/[0.06] hover:text-star"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => scrollToId('transmission')}
          className="rounded-full px-3.5 py-2 text-[13px] text-star/60 lg:hidden"
        >
          Contact
        </button>
        <a
          href={profile.resume}
          download
          className="ml-1 rounded-full bg-star px-4 py-2 text-[13px] font-medium text-void transition-colors duration-300 hover:bg-ion"
        >
          Résumé
        </a>
      </nav>
    </motion.header>
  );
}
