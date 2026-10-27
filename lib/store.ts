import type Lenis from 'lenis';

// Mutable, render-free state shared between the scroll engine, pointer and the WebGL starfield.
export const motionStore = {
  scroll: 0,
  warp: 0,
  mouseX: -9999,
  mouseY: -9999,
  mouseActive: false,
  lenis: null as Lenis | null,
};

export function engageWarp(power = 1.2) {
  motionStore.warp = Math.max(motionStore.warp, power);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (motionStore.lenis) {
    motionStore.lenis.scrollTo(el, { duration: 1.8, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export function downloadResume(href: string) {
  const a = document.createElement('a');
  a.href = href;
  a.download = 'Abhinav_Kaushik_Resume.pdf';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
