'use client';

import dynamic from 'next/dynamic';

const Starfield = dynamic(() => import('./Starfield'), { ssr: false });

export default function Backdrop() {
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-30 overflow-hidden">
        <div
          className="absolute -left-[20%] -top-[25%] h-[85vh] w-[85vw] rounded-full opacity-70 blur-[120px]"
          style={{
            background: 'radial-gradient(closest-side, rgba(60,36,140,0.55), rgba(26,16,51,0.25) 60%, transparent)',
            animation: 'nebula-a 38s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -bottom-[30%] -right-[15%] h-[80vh] w-[70vw] rounded-full opacity-60 blur-[140px]"
          style={{
            background: 'radial-gradient(closest-side, rgba(94,232,245,0.16), rgba(40,30,110,0.25) 55%, transparent)',
            animation: 'nebula-b 46s ease-in-out infinite',
          }}
        />
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-20">
        <Starfield />
      </div>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.6) 100%)' }}
      />
      <div aria-hidden className="grain pointer-events-none fixed inset-0 z-[70] opacity-[0.045] mix-blend-overlay" />
    </>
  );
}
