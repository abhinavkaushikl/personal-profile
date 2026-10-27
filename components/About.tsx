'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeader from './ui/SectionHeader';
import CountUp from './ui/CountUp';
import Reveal from './ui/Reveal';
import LendhubMark from './ui/LendhubMark';

const BIO: [string, boolean][] = [
  ['I build multi-agent and RAG systems that make it from whiteboard to', false],
  ['production — not demos.', true],
  ["Today I'm a Senior Applied Scientist at", false],
  ['UnitedHealth Group,', true],
  ['leading engineers on frontier-model extraction pipelines, agentic analytics and the evals that keep them honest. Before that, four years at', false],
  ['Viavi', true],
  ['turning telecom alarm floods into root causes and forecasts. Off the clock I’m building', false],
  ['ThinkTree.AI', true],
  ['— a non-profit platform helping NGO teachers support students with ADHD.', false],
];

const STATS = [
  { to: 9, suffix: '+', label: 'Years shipping ML, NLP & LLM systems' },
  { to: 98, suffix: '%', label: 'Manual analysis removed by a multi-agent analytics chatbot' },
  { to: 60, suffix: '%', label: 'Token cost cut with per-step model routing' },
  { to: 67, suffix: '%', label: 'Network downtime reduced via SLA-breach prediction' },
  { to: 83, suffix: '%', label: 'Lift in semantic alarm classification' },
  { to: 7, suffix: ' / 15', label: 'Research prototypes promoted to production' },
];

const FACTS: [string, React.ReactNode][] = [
  ['Now', 'UnitedHealth Group'],
  [
    'Building',
    <span key="b" className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      ThinkTree.AI <span className="text-star/30">·</span> <LendhubMark className="text-[17px]" />
    </span>,
  ],
  ['Based', 'Bengaluru, India'],
  ['Learning', 'German · A1'],
];

export default function About() {
  const bio = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        bio.current!.querySelectorAll('.w'),
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.08,
          scrollTrigger: { trigger: bio.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="about" data-sector="About" data-index="01" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader index="01" label="About — the pilot" title={<>Research rigor.<br />Production gravity.</>} />
        <div className="grid gap-16 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          <div>
            <p ref={bio} className="text-[clamp(1.5rem,2.6vw,2.4rem)] font-medium leading-[1.3] tracking-[-0.02em]">
              {BIO.map(([seg, hl], i) => (
                <span key={i} className={hl ? 'text-ion' : 'text-star'}>
                  {seg.split(' ').map((w, j) => (
                    <span key={j} className="w">
                      {w}{' '}
                    </span>
                  ))}
                </span>
              ))}
            </p>
            <Reveal delay={0.1}>
              <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] sm:grid-cols-4">
                {FACTS.map(([k, v]) => (
                  <div key={k} className="bg-void/90 p-5">
                    <dt className="eyebrow">{k}</dt>
                    <dd className="mt-2 text-[15px] text-star/85">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:pt-2">
            <div className="panel relative overflow-hidden rounded-[28px] p-2">
              <div className="flex items-center justify-between px-5 pb-3 pt-4">
                <span className="eyebrow">Telemetry</span>
                <span className="eyebrow flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-go" /> live
                </span>
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] bg-white/[0.06]">
                {STATS.map((s) => (
                  <div key={s.label} className="bg-ink/95 p-6 md:p-7">
                    <div className="font-mono text-[clamp(1.9rem,3vw,2.6rem)] font-medium tracking-tight text-star">
                      <CountUp to={s.to} suffix={s.suffix} />
                    </div>
                    <p className="mt-3 text-[13px] leading-snug text-star/45">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
