'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/lib/data';
import { scrollToId } from '@/lib/store';
import SectionHeader from './ui/SectionHeader';
import ResumeButton from './ui/ResumeButton';
import Magnetic from './ui/Magnetic';
import Reveal from './ui/Reveal';
import LendhubMark from './ui/LendhubMark';

function useIST() {
  const [t, setT] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    });
    const f = () => setT(fmt.format(new Date()));
    f();
    const id = window.setInterval(f, 1000);
    return () => window.clearInterval(id);
  }, []);
  return t;
}

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Magnetic strength={0.25}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex h-14 items-center gap-3 rounded-full border border-white/15 px-7 text-[15px] font-medium text-star/85 transition-colors duration-300 hover:border-white/40 hover:text-star"
      >
        {children}
        <span className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
      </a>
    </Magnetic>
  );
}

export default function Transmission() {
  const time = useIST();
  const info: [string, React.ReactNode][] = [
    ['Base', profile.location],
    ['Local time', time ? `${time} IST` : '—'],
    ['Languages', 'English · German (A1)'],
    [
      'Currently building',
      <span key="c" className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        ThinkTree.AI <span className="text-star/30">·</span> <LendhubMark className="font-sans text-[18px]" />
      </span>,
    ],
  ];

  return (
    <footer
      id="transmission"
      data-sector="Transmission"
      data-index="08"
      className="relative overflow-hidden pt-28 md:pt-40"
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(5,6,10,0.75) 45%, #05060A 85%)' }}
    >
      <div className="shell">
        <SectionHeader index="08" label="Transmission — open a channel" title={<>Let&apos;s build<br />what&apos;s next.</>} />

        <Reveal>
          <Magnetic strength={0.12}>
            <a
              href={`mailto:${profile.email}`}
              className="group relative inline-block break-all text-[clamp(1.5rem,4.4vw,4rem)] font-medium tracking-[-0.03em] text-star/90 transition-colors duration-500 hover:text-ion"
            >
              {profile.email}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ion transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100" />
            </a>
          </Magnetic>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <ResumeButton />
            <Pill href={profile.github}>GitHub</Pill>
            {profile.linkedin && <Pill href={profile.linkedin}>LinkedIn</Pill>}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-4">
            {info.map(([k, v]) => (
              <div key={k} className="bg-void p-6">
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-2 font-mono text-[14px] tabular-nums text-star/85">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="relative mt-28 flex h-[38vh] min-h-[260px] items-center justify-center">
        <div className="absolute h-[2px] w-[2px] rounded-full bg-white shadow-[0_0_24px_8px_rgba(94,232,245,0.55),0_0_80px_30px_rgba(94,232,245,0.12)]" />
        <span className="absolute h-[2px] w-[2px] rounded-full bg-ion/60" style={{ animation: 'ping-soft 3.5s ease-out infinite' }} />
        <p className="eyebrow absolute bottom-[22%] text-star/25">End of transmission</p>
      </div>

      <div className="shell flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 md:flex-row">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-star/35">
          © {new Date().getFullYear()} Abhinav Kaushik · Designed in deep space
        </p>
        <button
          onClick={() => scrollToId('top')}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-star/50 transition-colors hover:text-ion"
        >
          Back to orbit ↑
        </button>
      </div>
    </footer>
  );
}
