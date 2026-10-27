'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

export default function Tilt({
  children,
  className = '',
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 14 });
  const sry = useSpring(ry, { stiffness: 120, damping: 14 });

  return (
    <div className="h-full" style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        className={`group relative h-full ${className}`}
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse' || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry.set((px - 0.5) * 2 * max);
          rx.set(-(py - 0.5) * 2 * max);
          ref.current.style.setProperty('--mx', `${px * 100}%`);
          ref.current.style.setProperty('--my', `${py * 100}%`);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgba(94,232,245,0.11), transparent 42%)',
          }}
        />
      </motion.div>
    </div>
  );
}
