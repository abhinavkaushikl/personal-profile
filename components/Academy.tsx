import { education, internships } from '@/lib/data';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';

export default function Academy() {
  return (
    <section id="academy" data-sector="Academy" data-index="02" className="relative py-28 md:py-36">
      <div className="shell">
        <SectionHeader index="02" label="Academy — training" title="Trained for the deep end." />
        <div className="grid gap-5 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.degree} delay={i * 0.08}>
              <div className="panel group relative h-full overflow-hidden rounded-[28px] p-8 md:p-10">
                <div className="absolute -bottom-24 -right-24 h-56 w-56 rounded-full bg-ion/0 blur-[80px] transition-colors duration-700 group-hover:bg-ion/15" />
                <div className="flex h-[76px] items-center justify-between gap-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={e.logo}
                    alt={e.school}
                    draggable={false}
                    className="h-[calc(var(--h)*0.8)] w-auto max-w-[70%] object-contain object-left opacity-90 transition-[opacity,filter] duration-500 group-hover:opacity-100 group-hover:[filter:drop-shadow(0_0_14px_rgba(94,232,245,0.5))] md:h-[var(--h)]"
                    style={{ ['--h' as string]: `${e.logoH}px` }}
                  />
                  <p className="shrink-0 font-mono text-[12px] uppercase tracking-[0.2em] text-ion">{e.period}</p>
                </div>
                <h3 className="mt-10 text-[clamp(1.6rem,2.6vw,2.3rem)] font-semibold leading-tight tracking-[-0.03em]">{e.degree}</h3>
                <p className="mt-2 text-star/55">{e.school}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="eyebrow mr-2">Early flight hours</span>
            {internships.map((x) => (
              <span key={x} className="chip">
                {x}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
