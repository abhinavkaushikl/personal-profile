import Reveal from './Reveal';

export default function SectionHeader({
  index,
  label,
  title,
  kicker,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  kicker?: React.ReactNode;
}) {
  return (
    <div className="mb-14 md:mb-20">
      <Reveal>
        <div className="eyebrow flex items-center gap-4">
          <span className="text-ion">{index}</span>
          <span className="h-px w-10 bg-white/20" />
          {label}
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="text-chrome mt-6 max-w-5xl pb-2 text-[clamp(2.5rem,6.2vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
          {title}
        </h2>
      </Reveal>
      {kicker && (
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-star/55">{kicker}</p>
        </Reveal>
      )}
    </div>
  );
}
