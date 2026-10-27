'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';

type Tier = 'small' | 'frontier' | 'search';

const STAGES: { id: string; label: string; sub: string; tier: Tier; ms: number }[] = [
  { id: 'intent', label: 'Intent Router', sub: 'Classify + guardrails', tier: 'small', ms: 120 },
  { id: 'hyde', label: 'HyDE Rewrite', sub: 'Hypothetical-doc query', tier: 'small', ms: 260 },
  { id: 'retrieve', label: 'Hybrid Retrieval', sub: 'BM25 ∪ Titan vectors', tier: 'search', ms: 210 },
  { id: 'rerank', label: 'Cross-Encoder', sub: 'Fine-tuned re-ranker', tier: 'search', ms: 180 },
  { id: 'generate', label: 'Grounded Gen', sub: 'Answer with citations', tier: 'frontier', ms: 1350 },
  { id: 'judge', label: 'LLM-as-Judge', sub: 'Hallucination gate', tier: 'small', ms: 380 },
];

const COST: Record<Tier, number> = { small: 1.85, frontier: 10, search: 0.5 };
const effTier = (t: Tier, routing: boolean): Tier => (t === 'search' ? 'search' : routing ? t : 'frontier');
const totalCost = (routing: boolean) => STAGES.reduce((s, st) => s + COST[effTier(st.tier, routing)], 0);
const SAVING = Math.round((1 - totalCost(true) / totalCost(false)) * 100);

const QUESTIONS = [
  'Is telehealth covered under my plan?',
  "What's my in-network out-of-pocket max?",
  'Do I need a referral for a specialist?',
];

const TIER_STYLE: Record<Tier, string> = {
  small: 'border-ion/30 bg-ion/10 text-ion',
  frontier: 'border-signal/35 bg-signal/10 text-signal',
  search: 'border-white/10 bg-white/[0.04] text-star/50',
};
const TIER_LABEL: Record<Tier, string> = { small: 'small model', frontier: 'frontier', search: 'retrieval' };

type Log = { t: string; k: 'in' | 'step' | 'ok' };

function traceLine(i: number, routing: boolean, q: number): string {
  const tier = effTier(STAGES[i].tier, routing);
  const model = tier === 'search' ? '' : ` · ${TIER_LABEL[tier]}`;
  const lines = [
    `intent.route      policy_qa · conf 0.9${7 - q}${model}`,
    `hyde.rewrite      +1 hypothetical passage${model}`,
    `retrieve.hybrid   bm25 k=40 ∪ titan k=40 → ${61 + q * 3} unique`,
    `rerank.xenc       ${61 + q * 3} → top 8 · fine-tuned cross-encoder`,
    `generate          ${4 - (q % 2)} citations · grounded${model}`,
    `judge.verify      faithfulness 0.9${6 - (q % 2)} · PASS${model}`,
  ];
  return lines[i];
}

export default function Pipeline() {
  const [q, setQ] = useState(0);
  const [routing, setRouting] = useState(true);
  const [step, setStep] = useState(-1);
  const [log, setLog] = useState<Log[]>([]);
  const timers = useRef<number[]>([]);
  const logBox = useRef<HTMLDivElement>(null);

  const running = step >= 0 && step < STAGES.length;
  const done = step === STAGES.length;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    if (logBox.current) logBox.current.scrollTop = logBox.current.scrollHeight;
  }, [log]);

  const launch = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const slow = routing ? 1 : 1.8;
    let t = 0;
    setLog([{ k: 'in', t: `> query.received   "${QUESTIONS[q]}"` }]);
    setStep(0);
    STAGES.forEach((s, i) => {
      const at = 450 + i * 720;
      timers.current.push(
        window.setTimeout(() => {
          setStep(i);
          t += s.ms * (s.tier === 'search' ? 1 : slow);
          const stamp = `[${(t / 1000).toFixed(3).padStart(6, '0')}s]`;
          setLog((l) => [...l, { k: 'step', t: `${stamp} ${traceLine(i, routing, q)}` }]);
        }, at),
      );
    });
    timers.current.push(
      window.setTimeout(() => {
        setStep(STAGES.length);
        const cost = totalCost(routing).toFixed(1);
        setLog((l) => [
          ...l,
          {
            k: 'ok',
            t: `✓ answer released · ${(t / 1000).toFixed(2)}s · ${cost} cost units${routing ? ` (−${SAVING}% vs all-frontier)` : ''}`,
          },
        ]);
      }, 450 + STAGES.length * 720),
    );
  };

  const progress = step < 0 ? 0 : Math.min(step, STAGES.length - 1) / (STAGES.length - 1);
  const ratio = totalCost(true) / totalCost(false);

  return (
    <section id="simulator" data-sector="Simulator" data-index="05" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Simulator — inside an agent"
          title={<>Watch an agent<br />think.</>}
          kicker="A six-stage RAG pipeline of the kind I architect: query rewriting, hybrid retrieval, re-ranking, grounded generation, and a judge that refuses to let hallucinations through. Flip model routing to see where the money goes."
        />

        <Reveal>
          <div className="panel overflow-hidden rounded-[32px]">
            <div className="flex flex-col gap-5 border-b border-white/[0.06] p-5 md:flex-row md:items-center md:justify-between md:p-7">
              <div className="flex flex-wrap gap-2">
                {QUESTIONS.map((text, i) => (
                  <button
                    key={text}
                    onClick={() => !running && setQ(i)}
                    disabled={running}
                    className={`rounded-full border px-4 py-2 text-[13px] transition-all duration-300 disabled:cursor-not-allowed ${
                      q === i ? 'border-ion/50 bg-ion/10 text-star' : 'border-white/10 text-star/50 hover:border-white/25 hover:text-star/80'
                    }`}
                  >
                    {text}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-5">
                <div className="flex select-none items-center gap-3">
                  <span className="eyebrow">Model routing</span>
                  <button
                    role="switch"
                    aria-checked={routing}
                    aria-label="Model routing"
                    onClick={() => !running && setRouting((r) => !r)}
                    className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${routing ? 'bg-ion' : 'bg-white/15'}`}
                  >
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${routing ? 'right-1' : 'left-1'}`}
                    />
                  </button>
                </div>
                <button
                  onClick={launch}
                  disabled={running}
                  className="relative overflow-hidden whitespace-nowrap rounded-full bg-star px-6 py-3 text-[14px] font-medium text-void transition-all duration-300 hover:bg-ion disabled:opacity-60"
                >
                  {running ? 'Running…' : done ? 'Run again' : 'Launch query'}
                </button>
              </div>
            </div>

            <div className="px-5 py-10 md:px-10 md:py-14">
              <div className="relative">
              <div className="absolute left-[calc(100%/12-6.67px)] right-[calc(100%/12-6.67px)] top-[28px] hidden h-px bg-white/10 md:block">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-ion/40 to-ion"
                  animate={{ width: `${progress * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                />
                {step >= 0 && (
                  <motion.span
                    className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ion shadow-[0_0_18px_6px_rgba(94,232,245,0.55)]"
                    animate={{ left: `${progress * 100}%`, opacity: done ? 0 : 1 }}
                    transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
                  />
                )}
              </div>

              <ol className="relative grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-6">
                {STAGES.map((s, i) => {
                  const state = step > i || done ? 'done' : step === i ? 'active' : 'idle';
                  const tier = effTier(s.tier, routing);
                  return (
                    <li key={s.id} className="flex flex-col items-center text-center">
                      <div className="relative">
                        {state === 'active' && (
                          <span className="absolute inset-0 rounded-full bg-ion/40" style={{ animation: 'ping-soft 1.2s ease-out infinite' }} />
                        )}
                        <div
                          className={`relative flex h-14 w-14 items-center justify-center rounded-full border font-mono text-[13px] transition-all duration-500 ${
                            state === 'active'
                              ? 'border-ion bg-ion/15 text-ion shadow-[0_0_30px_rgba(94,232,245,0.45)]'
                              : state === 'done'
                                ? 'border-ion/50 bg-ion/10 text-star'
                                : 'border-white/12 bg-void text-star/40'
                          }`}
                        >
                          {state === 'done' ? '✓' : String(i + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <p className={`mt-4 text-[15px] font-medium tracking-tight transition-colors ${state === 'idle' ? 'text-star/60' : 'text-star'}`}>
                        {s.label}
                      </p>
                      <p className="mt-1 text-[12px] text-star/40">{s.sub}</p>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={tier}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.25 }}
                          className={`mt-3 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${TIER_STYLE[tier]}`}
                        >
                          {TIER_LABEL[tier]}
                        </motion.span>
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ol>
              </div>
            </div>

            <div className="grid border-t border-white/[0.06] md:grid-cols-[1.5fr_1fr]">
              <div className="border-b border-white/[0.06] p-5 md:border-b-0 md:border-r md:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <span className="eyebrow">Trace</span>
                  <span className="eyebrow text-star/30">simulated</span>
                </div>
                <div
                  ref={logBox}
                  data-lenis-prevent
                  className="h-[200px] overflow-y-auto rounded-2xl bg-black/40 p-4 font-mono text-[12px] leading-[1.9]"
                >
                  {log.length === 0 && <p className="text-star/30">› pick a question and hit Launch query</p>}
                  {log.map((l, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`whitespace-pre-wrap ${l.k === 'ok' ? 'text-go' : l.k === 'in' ? 'text-star' : 'text-star/60'}`}
                    >
                      {l.t}
                    </motion.p>
                  ))}
                </div>
              </div>
              <div className="p-5 md:p-7">
                <span className="eyebrow">Cost per answer</span>
                <div className="mt-6 space-y-5">
                  {[
                    { label: 'All-frontier', w: 1, on: !routing },
                    { label: 'Routed per step', w: ratio, on: routing },
                  ].map((b) => (
                    <div key={b.label}>
                      <div className="mb-2 flex justify-between text-[13px]">
                        <span className={b.on ? 'text-star' : 'text-star/40'}>{b.label}</span>
                        <span className="font-mono text-star/50">{(b.w * totalCost(false)).toFixed(1)}u</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <motion.div
                          className={`h-full rounded-full ${b.on ? 'bg-ion' : 'bg-white/20'}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${b.w * 100}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex items-baseline gap-3">
                  <motion.span
                    key={String(routing)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`font-mono text-5xl font-medium tracking-tight ${routing ? 'text-ion' : 'text-star/30'}`}
                  >
                    −{routing ? SAVING : 0}%
                  </motion.span>
                  <span className="text-[13px] leading-snug text-star/45">
                    Small models for routing &amp; judging,
                    <br />
                    frontier only where reasoning pays.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-star/30">
          Illustrative simulation of the architecture — no real data or models are called.
        </p>
      </div>
    </section>
  );
}
