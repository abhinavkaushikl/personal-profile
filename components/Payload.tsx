'use client';

import { motion } from 'framer-motion';
import { projects, type Project } from '@/lib/data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';
import Tilt from './ui/Tilt';

const BRANCHES = [
  'M200 270 C200 235 200 205 200 175',
  'M200 175 C198 140 160 128 132 102',
  'M200 175 C202 140 240 128 268 102',
  'M200 175 C202 135 200 100 200 62',
  'M132 102 C120 82 98 70 78 52',
  'M132 102 C136 82 150 66 160 44',
  'M268 102 C264 82 250 66 240 44',
  'M268 102 C280 82 302 70 322 52',
];
const NODES: [number, number][] = [
  [200, 270], [200, 175], [132, 102], [268, 102], [200, 62], [78, 52], [160, 44], [240, 44], [322, 52],
];

function ThinkTreeViz() {
  return (
    <svg viewBox="0 0 400 290" className="h-[200px] w-full md:h-[240px]" aria-hidden>
      <defs>
        <linearGradient id="branch" gradientUnits="userSpaceOnUse" x1="0" y1="290" x2="0" y2="20">
          <stop offset="0%" stopColor="#F5F6FA" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#5EE8F5" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      {BRANCHES.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="url(#branch)"
          strokeWidth={1.4}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1.4, delay: 0.2 + (i < 4 ? i * 0.12 : 0.6 + (i - 4) * 0.1), ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
      {NODES.map(([x, y], i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200, damping: 14 }}
          style={{ transformOrigin: `${x}px ${y}px` }}
        >
          <circle cx={x} cy={y} r={i === 0 ? 5 : 3.5} fill={i > 4 ? '#5EE8F5' : '#F5F6FA'} />
          {i > 4 && (
            <circle cx={x} cy={y} r={10} fill="none" stroke="#5EE8F5" strokeOpacity={0.4}>
              <animate attributeName="r" values="4;14;4" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur={`${2.4 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          )}
        </motion.g>
      ))}
    </svg>
  );
}

function Status({ s }: { s: string }) {
  const live = s === 'Live' || s === 'In flight';
  return (
    <span
      className={`flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] ${
        live ? 'border-go/30 bg-go/10 text-go' : 'border-white/10 text-star/45'
      }`}
    >
      {live && <span className="h-1.5 w-1.5 rounded-full bg-go" />}
      {s}
    </span>
  );
}

function Card({ p }: { p: Project }) {
  return (
    <Tilt className="panel flex flex-col rounded-[28px] p-7 md:p-9" max={p.feature ? 4 : 7}>
      <div className="flex items-center justify-between gap-4" style={{ transform: 'translateZ(30px)' }}>
        <span className="eyebrow">{p.kind}</span>
        <Status s={p.status} />
      </div>
      {p.feature && (
        <div className="mt-6" style={{ transform: 'translateZ(50px)' }}>
          <ThinkTreeViz />
        </div>
      )}
      <div className="mt-auto pt-10" style={{ transform: 'translateZ(40px)' }}>
        {p.metric && (
          <div className="mb-5 flex items-baseline gap-3">
            <span className="font-mono text-5xl font-medium tracking-tight text-ion">{p.metric.v}</span>
            <span className="text-sm text-star/45">{p.metric.l}</span>
          </div>
        )}
        <h3 className={`${p.feature ? 'text-3xl md:text-[2.6rem]' : 'text-2xl md:text-[1.75rem]'} font-semibold leading-tight tracking-[-0.03em]`}>
          {p.name}
        </h3>
        <p className={`mt-3 leading-relaxed text-star/55 ${p.feature ? 'max-w-2xl text-[17px]' : 'text-[15px]'}`}>{p.desc}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Tilt>
  );
}

const SPANS = ['md:col-span-4', 'md:col-span-2', 'md:col-span-3', 'md:col-span-3'];

export default function Payload() {
  return (
    <section id="payload" data-sector="Payload" data-index="04" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Payload — launched"
          title={<>Things I&apos;ve put<br />into orbit.</>}
          kicker="Side missions and live systems — agents, evals and a non-profit built for learners who think differently."
        />
        <div className="grid gap-5 md:grid-cols-6">
          {projects.map((p, i) => (
            <Reveal key={p.name} delay={(i % 3) * 0.08} className={SPANS[i]}>
              <Card p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
