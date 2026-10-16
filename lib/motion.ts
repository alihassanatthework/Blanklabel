// All animation timings live here (spec section 7).
export const durations = { fast: 0.15, base: 0.22, slow: 0.4, reveal: 0.5 } as const;

export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const spring = { type: "spring" as const, stiffness: 380, damping: 34 };

export const stagger = { children: 0.07, hero: 0.06, maxItems: 8 };

export const reveal = { y: 20, amount: 0.25 };

/** Delay for item i in a stagger: max 8 staggered, the rest appear together. */
export const staggerDelay = (i: number, step: number = stagger.children) =>
  Math.min(i, stagger.maxItems) * step;

export const loops = { floatY: 6, floatDuration: 6, feedEvery: 4, marquee: 40, rotateAnnouncement: 5 };
