import { companies } from '@/lib/data';
import Reveal from './ui/Reveal';

export default function BrandBar() {
  const row = [...companies, ...companies];
  return (
    <section aria-label="Companies" className="relative py-16 md:py-24">
      <div className="shell">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <p className="eyebrow">
              <span className="text-ion">Deployed at</span> — mission history
            </p>
            <p className="eyebrow">6 missions · 5 organisations · 2017 → now</p>
          </div>
        </Reveal>
      </div>
      <div
        className="marquee-wrap relative overflow-hidden border-y border-white/[0.06] py-10"
        style={{ maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' }}
      >
        <div className="marquee flex w-max items-center">
          {row.map((c, i) => (
            <div key={i} className="group flex items-center px-10 md:px-16">
              <div className="flex flex-col items-start">
                <div className="flex h-10 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.logo}
                    alt={i < companies.length ? c.name : ''}
                    aria-hidden={i >= companies.length}
                    draggable={false}
                    className="h-[calc(var(--h)*0.8)] w-auto opacity-45 transition-[opacity,filter] duration-500 [filter:brightness(0)_invert(1)] group-hover:opacity-100 group-hover:[filter:brightness(0)_invert(1)_drop-shadow(0_0_14px_rgba(94,232,245,0.6))] md:h-[var(--h)]"
                    style={{ ['--h' as string]: `${c.h}px` }}
                  />
                </div>
                <span className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-star/25 transition-colors duration-500 group-hover:text-ion">
                  {c.years}
                </span>
              </div>
              <span className="ml-20 h-1 w-1 rounded-full bg-white/20 md:ml-32" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
