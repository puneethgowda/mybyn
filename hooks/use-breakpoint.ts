import { useEffect, useState } from "react";

const breakpoints: Record<string, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint(): {
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
} {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey | null>(null);

  const getCurrent = () => {
    if (typeof window === "undefined") return null;

    const width = window.innerWidth;

    // Determine the largest matching breakpoint
    let current: BreakpointKey | null = null;

    for (const [key, minWidth] of Object.entries(breakpoints)) {
      if (width >= minWidth) {
        current = key as BreakpointKey;
      }
    }

    return current;
  };

  useEffect(() => {
    const update = () => {
      setBreakpoint(getCurrent());
    };

    update(); // initial check
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const isSm = breakpoint === "sm" || breakpoint === "xs";
  const isMd = breakpoint === "md";
  const isLg = breakpoint === "lg";

  return {
    isSm,
    isMd,
    isLg,
  };
}
