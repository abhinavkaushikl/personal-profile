'use client';

import { useEffect, useRef } from 'react';
import { missions } from '@/lib/data';
import SectionHeader from './ui/SectionHeader';

const STICK_TOP = 0.11;
const STEP = 16;

export default function FlightLog() {
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const dims = useRef<(HTMLDivElement | null)[]>([]);

  // Sticky cards are measured live each frame (not cached like ScrollTrigger), so the stack stays
  // correct regardless of when fonts or images settle the layout.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)');
    let raf = 0;

    const update = () => {
      const vh = window.innerHeight;
      const n = items.current.length;
      const progress = items.current.map((el, i) => {
        if (!el) return 0;
        const stick = vh * STICK_TOP + i * STEP;
        const top = el.getBoundingClientRect().top;
        return Math.min(1, Math.max(0, (vh - top) / (vh - stick)));
      });
      for (let i = 0; i < n; i++) {
        let covered = 0;
        for (let j = i + 1; j < n; j++) covered += progress[j];
        const card = cards.current[i];
        const dim = dims.current[i];
        if (!card || !dim) continue;
        if (!mq.matches) {
          card.style.transform = '';
          dim.style.opacity = '0';
          continue;
        }
        const scale = 1 - Math.min(covered, 3) * 0.035;
        card.style.transform = `scale(${scale})`;
        dim.style.opacity = String(Math.min(0.75, covered * 0.32));
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="flight-log" data-sector="Flight Log" data-index="03" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Flight log — trajectory"
          title={<>Nine years.<br />Six missions.</>}
          kicker="From SQL pipelines to frontier-model agents — every role shipped something that ran in production."
        />

        <div className="relative space-y-6 md:space-y-[8vh] md:pb-[6vh]">
          {missions.map((m, i) => (
            <div
              key={m.code}
              ref={(el) => {
                items.current[i] = el;
              }}
              className="md:sticky"
              style={{ top: `calc(${STICK_TOP * 100}vh + ${i * STEP}px)` }}
            >
              <article
                ref={(el) => {
                  cards.current[i] = el;
                }}
                className="panel-solid relative origin-top overflow-hidden rounded-[32px] will-change-transform"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-ion/10 blur-[90px]"
                />
                <div className="relative grid gap-10 p-7 md:min-h-[62vh] md:grid-cols-[0.95fr_1.4fr] md:gap-14 md:p-12">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="eyebrow">Mission {m.code}</span>
                      {m.active ? (
                        <span className="flex items-center gap-2 rounded-full border border-go/30 bg-go/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-go">
                          <span className="h-1.5 w-1.5 rounded-full bg-go" style={{ animation: 'ping-soft 2s ease-out infinite' }} />
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-star/40">
                          Complete
                        </span>
                      )}
                    </div>
                    <div className="text-chrome mt-6 font-mono text-[clamp(4rem,9vw,8rem)] font-medium leading-none tracking-[-0.06em] opacity-90">
                      {m.code}
                    </div>
                    <h3 className="mt-8 flex h-[54px] items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.logo}
                        alt={m.company}
                        draggable={false}
                        className="h-[calc(var(--h)*0.75)] w-auto max-w-full object-contain object-left [filter:brightness(0)_invert(1)] md:h-[var(--h)]"
                        style={{ ['--h' as string]: `${m.logoH}px` }}
                      />
                    </h3>
                    <p className="mt-5 text-lg text-star/80">{m.role}</p>
                    <p className="mt-5 font-mono text-[12px] uppercase leading-relaxed tracking-[0.18em] text-star/40">
                      {m.company} · {m.location}
                      <br />
                      {m.period}
                    </p>
                    <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-star/50 md:mt-auto md:pt-8">{m.summary}</p>
                  </div>

                  <div className="flex flex-col">
                    <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
                      {m.highlights.map((h) => (
                        <li key={h.text} className="grid grid-cols-[96px_1fr] items-baseline gap-5 py-5 md:grid-cols-[132px_1fr]">
                          <span className="font-mono text-[clamp(1.1rem,1.8vw,1.6rem)] font-medium tracking-tight text-ion">
                            {h.metric}
                          </span>
                          <span className="text-[15px] leading-relaxed text-star/70 md:text-base">{h.text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-2 md:mt-auto md:pt-8">
                      {m.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  ref={(el) => {
                    dims.current[i] = el;
                  }}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-void opacity-0"
                />
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
