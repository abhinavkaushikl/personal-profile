'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { skillGroups, skillLinks } from '@/lib/data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';

const N = skillGroups.length;
const R = 40;
const nodes = skillGroups.map((_, i) => {
  const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
});

export default function Systems() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  const related = new Set<number>([active]);
  skillLinks.forEach(([a, b]) => {
    if (a === active) related.add(b);
    if (b === active) related.add(a);
  });
  const spin = { animationPlayState: hovering ? 'paused' : 'running' } as const;
  const group = skillGroups[active];

  return (
    <section id="systems" data-sector="Systems" data-index="06" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          index="06"
          label="Systems — capability map"
          title={<>Every tool,<br />in orbit.</>}
          kicker="Every cluster, one gravity well. Hover a cluster to trace what it connects to."
        />

        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <div
              className="relative mx-auto aspect-square w-[80%] max-w-[600px] sm:w-full"
              onPointerEnter={() => setHovering(true)}
              onPointerLeave={() => setHovering(false)}
            >
              <div className="absolute inset-[10%] rounded-full border border-white/[0.06]" />
              <div className="absolute inset-[30%] rounded-full border border-dashed border-white/[0.05]" />
              <div className="absolute inset-0 animate-[spin_140s_linear_infinite]" style={spin}>
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
                  {skillLinks.map(([a, b]) => {
                    const on = a === active || b === active;
                    return (
                      <line
                        key={`${a}-${b}`}
                        x1={nodes[a].x}
                        y1={nodes[a].y}
                        x2={nodes[b].x}
                        y2={nodes[b].y}
                        stroke={on ? '#5EE8F5' : '#ffffff'}
                        strokeOpacity={on ? 0.85 : 0.08}
                        strokeWidth={on ? 1.2 : 0.8}
                        vectorEffect="non-scaling-stroke"
                        className={on ? 'trail' : ''}
                        style={{ transition: 'stroke-opacity .5s, stroke .5s' }}
                      />
                    );
                  })}
                  {nodes.map((n, i) => (
                    <line
                      key={`s${i}`}
                      x1={50}
                      y1={50}
                      x2={n.x}
                      y2={n.y}
                      stroke="#ffffff"
                      strokeOpacity={i === active ? 0.35 : 0.04}
                      vectorEffect="non-scaling-stroke"
                      style={{ transition: 'stroke-opacity .5s' }}
                    />
                  ))}
                </svg>

                {skillGroups.map((g, i) => {
                  const isActive = i === active;
                  const isRelated = related.has(i);
                  return (
                    <button
                      key={g.name}
                      onPointerEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${nodes[i].x}%`, top: `${nodes[i].y}%` }}
                      aria-pressed={isActive}
                    >
                      <span className="flex animate-[spin_140s_linear_infinite_reverse] flex-col items-center gap-2" style={spin}>
                        <span className="relative flex h-4 w-4 items-center justify-center">
                          {isActive && (
                            <span className="absolute inset-0 rounded-full bg-ion/50" style={{ animation: 'ping-soft 1.6s ease-out infinite' }} />
                          )}
                          <span
                            className={`relative rounded-full transition-all duration-500 ${
                              isActive
                                ? 'h-3.5 w-3.5 bg-ion shadow-[0_0_20px_4px_rgba(94,232,245,0.6)]'
                                : isRelated
                                  ? 'h-2.5 w-2.5 bg-star'
                                  : 'h-2 w-2 bg-star/35'
                            }`}
                          />
                        </span>
                        <span
                          className={`whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.12em] transition-colors duration-500 sm:text-[10px] sm:tracking-[0.16em] md:text-[11px] ${
                            isActive ? 'text-star' : isRelated ? 'text-star/70' : 'text-star/30'
                          }`}
                        >
                          {g.name}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-void/80">
                <span className="absolute inset-0 rounded-full border border-ion/30" style={{ animation: 'ping-soft 3s ease-out infinite' }} />
                <span className="text-chrome text-2xl font-semibold tracking-[-0.04em]">AK</span>
              </div>
            </div>
          </Reveal>

          <div className="min-h-[340px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.name}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow">
                  <span className="text-ion">Cluster</span> · capability map
                </p>
                <h3 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none tracking-[-0.04em]">{group.name}</h3>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {group.items.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 + i * 0.025, type: 'spring', stiffness: 300, damping: 22 }}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[14px] text-star/80"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
                <p className="mt-8 text-[13px] text-star/40">
                  Linked to{' '}
                  {[...related]
                    .filter((i) => i !== active)
                    .map((i) => skillGroups[i].name)
                    .join(' · ')}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
