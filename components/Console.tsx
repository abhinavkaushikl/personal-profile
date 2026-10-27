'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { education, missions, profile, projects, skillGroups } from '@/lib/data';
import { downloadResume, engageWarp, scrollToId } from '@/lib/store';
import SectionHeader from './ui/SectionHeader';
import Reveal from './ui/Reveal';

type Line = { k: 'in' | 'out' | 'hl' | 'err' | 'dim'; t: string };

const SECTORS: Record<string, string> = {
  top: 'top',
  about: 'about',
  'flight-log': 'flight-log',
  payload: 'payload',
  simulator: 'simulator',
  systems: 'systems',
  academy: 'academy',
  contact: 'transmission',
  transmission: 'transmission',
};

const COMMANDS = ['help', 'whoami', 'about', 'experience', 'projects', 'skills', 'stack', 'education', 'contact', 'resume', 'github', 'warp', 'ls', 'cd', 'date', 'clear', 'hire'];

const out = (t: string): Line => ({ k: 'out', t });

function execute(raw: string): Line[] | 'clear' {
  const [cmdRaw = '', ...args] = raw.trim().split(/\s+/);
  const cmd = cmdRaw.toLowerCase();
  const arg = args.join(' ').toLowerCase();

  switch (cmd) {
    case '':
      return [];
    case 'help':
      return [
        { k: 'dim', t: 'available commands' },
        ...[
          ['whoami', 'who is flying this thing'],
          ['about', 'the short version'],
          ['experience', 'flight log, condensed'],
          ['projects', 'payload manifest'],
          ['skills', 'systems by cluster'],
          ['stack', 'daily drivers'],
          ['education', 'academy records'],
          ['contact', 'open a channel'],
          ['resume', 'download the résumé'],
          ['github', 'open GitHub'],
          ['warp', 'engage warp drive'],
          ['ls · cd <sector>', 'navigate the ship'],
          ['clear', 'wipe the screen'],
        ].map(([c, d]) => out(`  ${c.padEnd(18)}${d}`)),
      ];
    case 'whoami':
      return [{ k: 'hl', t: 'abhinav kaushik' }, out('senior applied scientist · unitedhealth group · bengaluru')];
    case 'about':
      return [
        out('9+ years across ML, NLP and LLMs. I take multi-agent and RAG systems'),
        out('from research to production — measured against baselines, not vibes.'),
        out('Also building ThinkTree.AI, a non-profit for learners with ADHD.'),
      ];
    case 'experience':
    case 'xp':
      return missions.map((m) => out(`  [${m.code}] ${m.period.padEnd(22)}${m.role} @ ${m.company}`));
    case 'projects':
      return projects.map((p) => out(`  ▸ ${p.name.padEnd(32)}${p.status.toLowerCase()}`));
    case 'skills':
      return skillGroups.map((g) => out(`  ${g.name.padEnd(24)}${g.items.slice(0, 5).join(', ')}…`));
    case 'stack':
      return [out('python · pytorch · langgraph · claude · aws bedrock · databricks · mlflow · fastapi · pydantic')];
    case 'education':
      return education.map((e) => out(`  ${e.period}  ${e.degree} — ${e.school}`));
    case 'contact':
      return [
        out(`  email     ${profile.email}`),
        out(`  github    ${profile.github.replace('https://', '')}`),
        ...(profile.linkedin ? [out(`  linkedin  ${profile.linkedin.replace('https://', '')}`)] : []),
        out(`  base      ${profile.location}`),
      ];
    case 'resume':
      downloadResume(profile.resume);
      return [{ k: 'hl', t: 'transmitting résumé… received ✓' }];
    case 'github':
      window.open(profile.github, '_blank', 'noopener,noreferrer');
      return [out('opening github…')];
    case 'linkedin':
      if (!profile.linkedin) return [{ k: 'err', t: 'linkedin channel not configured yet' }];
      window.open(profile.linkedin, '_blank', 'noopener,noreferrer');
      return [out('opening linkedin…')];
    case 'warp':
      engageWarp(1.25);
      return [{ k: 'hl', t: 'warp drive engaged. hold on.' }];
    case 'ls':
      return [out('  about/  academy/  flight-log/  payload/  simulator/  systems/  contact/  resume.pdf')];
    case 'cd': {
      const target = SECTORS[arg.replace(/\/$/, '')];
      if (!target) return [{ k: 'err', t: `cd: no such sector: ${arg || '(none)'}` }];
      window.setTimeout(() => scrollToId(target), 150);
      return [out(`navigating to ${arg}…`)];
    }
    case 'date':
      return [
        out(
          new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long', timeZone: 'Asia/Kolkata' }).format(new Date()),
        ),
      ];
    case 'clear':
      return 'clear';
    case 'hire':
    case 'sudo':
      if (cmd === 'sudo' && !arg.includes('hire')) return [{ k: 'err', t: 'nice try. this incident will be reported to mission control.' }];
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Let’s build something')}`;
      return [{ k: 'hl', t: 'permission granted. opening comms channel…' }];
    case 'echo':
      return [out(args.join(' '))];
    default:
      return [{ k: 'err', t: `command not found: ${cmd} — try help` }];
  }
}

const BOOT: Line[] = [
  { k: 'dim', t: 'DEEPSPACE OS 8.0 — mission console' },
  { k: 'dim', t: 'link established · latency 12ms · all systems nominal' },
  { k: 'out', t: 'type `help` to list commands. try `warp`.' },
];

const COLORS: Record<Line['k'], string> = {
  in: 'text-star',
  out: 'text-star/65',
  hl: 'text-ion',
  err: 'text-signal',
  dim: 'text-star/35',
};

export default function Console() {
  const [lines, setLines] = useState<Line[]>(BOOT);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [lines]);

  const submit = (cmd: string) => {
    const res = execute(cmd);
    if (res === 'clear') {
      setLines([]);
    } else {
      setLines((l) => [...l, { k: 'in', t: `❯ ${cmd}` }, ...res]);
    }
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 50));
    setHIdx(-1);
    setValue('');
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit(value);
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(hIdx + 1, history.length - 1);
      if (history[i] !== undefined) {
        setHIdx(i);
        setValue(history[i]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(Math.max(i, -1));
      setValue(i >= 0 ? history[i] : '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(value.trim().toLowerCase()));
      if (match && value.trim()) setValue(match);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section id="console" data-sector="Console" data-index="07" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          index="07"
          label="Console — talk to the ship"
          title={<>A working terminal.<br />Go on, type.</>}
          kicker={
            <>
              Ask it anything it knows. Start with <code className="font-mono text-ion">help</code> — or{' '}
              <code className="font-mono text-ion">warp</code> if you&apos;re in a hurry.
            </>
          }
        />
        <Reveal>
          <div
            className="panel mx-auto max-w-4xl overflow-hidden rounded-[24px] shadow-[0_60px_160px_-60px_rgba(94,232,245,0.25)]"
            onClick={() => input.current?.focus({ preventScroll: true })}
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
              <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
              <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
              <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              <span className="ml-4 font-mono text-[12px] text-star/40">abhinav@deepspace — zsh — 96×24</span>
            </div>
            <div ref={box} data-lenis-prevent className="h-[380px] overflow-y-auto px-5 py-5 font-mono text-[13px] leading-[1.85] md:px-7">
              {lines.map((l, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.01 }}
                  className={`whitespace-pre-wrap break-words ${COLORS[l.k]}`}
                >
                  {l.t}
                </motion.p>
              ))}
              <div className="flex items-center gap-2">
                <span className="text-ion">❯</span>
                <span className="text-star/40">~</span>
                <div className="relative flex-1">
                  <input
                    ref={input}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={onKey}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    aria-label="Terminal input"
                    className="w-full bg-transparent text-star caret-ion outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="mx-auto mt-5 flex max-w-4xl flex-wrap gap-2">
          {['help', 'whoami', 'experience', 'projects', 'warp', 'resume'].map((c) => (
            <button
              key={c}
              onClick={() => submit(c)}
              className="rounded-full border border-white/10 px-3.5 py-1.5 font-mono text-[12px] text-star/55 transition-colors duration-300 hover:border-ion/50 hover:text-ion"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
