import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../animation/gsap";

export function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopViewport = window.matchMedia("(min-width: 769px)");
    let stopSmoothScroll;

    const syncSmoothScroll = () => {
      stopSmoothScroll?.();
      stopSmoothScroll = undefined;

      // Native touch scrolling is intentionally kept on phones/tablets. It is
      // faster, respects browser chrome changes, and avoids a second scroll
      // abstraction competing with mobile viewport resizing.
      if (reducedMotion.matches || !desktopViewport.matches) {
        ScrollTrigger.refresh();
        return;
      }

      const lenis = new Lenis({
        duration: 1.05,
        smoothWheel: true,
        syncTouch: false,
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
    desktopViewport.addEventListener("change", syncSmoothScroll);
    syncSmoothScroll();

    return () => {
      reducedMotion.removeEventListener("change", syncSmoothScroll);
      desktopViewport.removeEventListener("change", syncSmoothScroll);
      stopSmoothScroll?.();
    };
  }, []);
}
