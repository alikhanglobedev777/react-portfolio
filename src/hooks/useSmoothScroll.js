import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../animation/gsap";

export function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let stopSmoothScroll;

    const syncSmoothScroll = () => {
      stopSmoothScroll?.();
      stopSmoothScroll = undefined;

      if (reducedMotion.matches) {
        ScrollTrigger.refresh();
        return;
      }

      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.15,
      });

      const updateScrollTrigger = () => ScrollTrigger.update();
      const advanceLenis = (time) => lenis.raf(time * 1000);

      lenis.on("scroll", updateScrollTrigger);
      gsap.ticker.add(advanceLenis);
      gsap.ticker.lagSmoothing(0);

      stopSmoothScroll = () => {
        lenis.off("scroll", updateScrollTrigger);
        gsap.ticker.remove(advanceLenis);
        lenis.destroy();
        gsap.ticker.lagSmoothing(500, 33);
      };
    };

    reducedMotion.addEventListener("change", syncSmoothScroll);
    syncSmoothScroll();

    return () => {
      reducedMotion.removeEventListener("change", syncSmoothScroll);
      stopSmoothScroll?.();
    };
  }, []);
}
