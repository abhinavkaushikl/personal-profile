'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE, profile } from '@/lib/data';
import { scrollToId } from '@/lib/store';
import ResumeButton from './ui/ResumeButton';
import Magnetic from './ui/Magnetic';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1.2, ease: EASE, delay },
});

function Portrait() {
  return (
    <div className="relative h-[290px] w-[290px] sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px]" style={{ perspective: 1100 }}>
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        <div className="absolute inset-[16%] rounded-full bg-ion/20 blur-[70px]" />
        <motion.div
          className="absolute inset-[20%] overflow-hidden rounded-full"
          initial={{ opacity: 0, scale: 0.86, filter: 'blur(14px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
        >
          <Image
            src={profile.photo}
            alt="Portrait of Abhinav Kaushik"
            fill
            priority
            sizes="(min-width: 1024px) 264px, 216px"
            className="object-cover contrast-[1.06] grayscale-[12%]"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 38%, transparent 48%, rgba(5,6,10,0.7) 100%)' }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,0.14), inset -18px -10px 40px -18px rgba(94,232,245,0.55), inset 12px 8px 30px -20px rgba(255,255,255,0.4)',
            }}
          />
        </motion.div>
        <div className="orbit orbit-c" />
        <div className="orbit orbit-b">
          <span className="sat sat-b" />
        </div>
        <div className="orbit orbit-a">
          <span className="sat sat-a" />
        </div>
      </div>

      <motion.div
        {...rise(1.4)}
        className="absolute -right-2 top-[6%] hidden font-mono text-[10px] uppercase leading-[1.9] tracking-[0.22em] text-star/45 sm:block"
      >
        <div className="mb-2 h-px w-16 bg-gradient-to-r from-ion/70 to-transparent" />
        <div>
          Subject <span className="text-star/80">A. Kaushik</span>
        </div>
        <div>
          Class <span className="text-star/80">Applied Sci.</span>
        </div>
        <div>
          Orbit <span className="text-ion">9+ yrs</span>
        </div>
      </motion.div>
      <motion.div
        {...rise(1.55)}
        className="absolute -left-2 bottom-[8%] hidden font-mono text-[10px] uppercase tracking-[0.22em] text-star/40 sm:block"
      >
        {profile.coords}
        <div className="mt-2 h-px w-16 bg-gradient-to-r from-white/30 to-transparent" />
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const photoX = useTransform(sx, (v) => v * 26);
  const photoY = useTransform(sy, (v) => v * 20);
  const textX = useTransform(sx, (v) => v * -12);
  const textY = useTransform(sy, (v) => v * -8);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(inner.current, {
        yPercent: -14,
        scale: 0.93,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="top" data-sector="Launch" data-index="00" className="relative flex min-h-[100svh] items-center pb-28 pt-28">
      <div ref={inner} className="shell grid items-center gap-10 will-change-transform lg:grid-cols-[1.3fr_1fr] lg:gap-4">
        <motion.div style={{ x: textX, y: textY }} className="order-2 lg:order-1">
          <motion.p {...rise(0.35)} className="eyebrow flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-go" style={{ animation: 'ping-soft 2s ease-out infinite' }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-go" />
            </span>
            Online · {profile.location}
          </motion.p>

          <h1 className="mt-7 text-[clamp(3.5rem,10vw,9.25rem)] font-semibold leading-[0.86] tracking-[-0.05em]">
            {['ABHINAV', 'KAUSHIK'].map((w, i) => (
              <span key={w} className="block overflow-hidden pb-[0.07em]">
                <motion.span
                  className="text-chrome block"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.55 + i * 0.12 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p {...rise(0.95)} className="mt-8 text-xl font-medium tracking-tight text-star/85 md:text-2xl">
            Senior Applied Scientist <span className="text-star/30">—</span> LLMs, Agentic AI &amp; Production ML
          </motion.p>
          <motion.p {...rise(1.05)} className="mt-4 max-w-xl text-[17px] leading-relaxed text-star/50">
            9+ years turning ambiguous business problems into production ML and agentic systems across Healthcare,
            Telecom &amp; AIOps.
          </motion.p>

          <motion.div {...rise(1.2)} className="mt-10 flex flex-wrap items-center gap-4">
            <ResumeButton />
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToId('payload')}
                className="group inline-flex h-14 items-center gap-3 rounded-full border border-white/15 px-7 text-[15px] font-medium text-star/85 transition-colors duration-300 hover:border-white/40 hover:text-star"
              >
                View Work
                <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
              </button>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div style={{ x: photoX, y: photoY }} className="order-1 justify-self-center lg:order-2">
          <Portrait />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.2 }}
        className="shell absolute inset-x-0 bottom-8 grid grid-cols-1 items-end md:grid-cols-3"
      >
        <span className="eyebrow hidden md:block">T+ 09+ yrs · ML / NLP / LLM</span>
        <button onClick={() => scrollToId('about')} className="eyebrow flex flex-col items-center gap-3 justify-self-center">
          Scroll to engage
          <span className="relative h-10 w-px overflow-hidden bg-white/15">
            <span className="absolute left-0 top-0 h-4 w-full bg-ion" style={{ animation: 'drop 2.2s cubic-bezier(.65,0,.35,1) infinite' }} />
          </span>
        </button>
        <span className="eyebrow hidden items-center gap-2 justify-self-end md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-go" /> All systems nominal
        </span>
      </motion.div>
    </section>
  );
}
