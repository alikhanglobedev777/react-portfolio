import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../animation/gsap";
import { registerSmoothScroller } from "../animation/scrollController";

export function useSmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopViewport = window.matchMedia("(min-width: 769px)");
    let stopSmoothScroll;
    let mobileRefreshFrame = null;
    let lastViewportWidth = window.visualViewport?.width || window.innerWidth;

    const refreshMobileLayout = () => {
      if (desktopViewport.matches) return;
      const nextWidth = window.visualViewport?.width || window.innerWidth;
      // Ignore address-bar height changes; only a meaningful width/orientation
      // change needs a full ScrollTrigger recalculation on touch devices.
      if (Math.abs(nextWidth - lastViewportWidth) < 2) return;
      lastViewportWidth = nextWidth;
      if (mobileRefreshFrame !== null) window.cancelAnimationFrame(mobileRefreshFrame);
      mobileRefreshFrame = window.requestAnimationFrame(() => {
        mobileRefreshFrame = null;
        ScrollTrigger.refresh();
      });
    };

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
        // Internal navigation should cancel any remaining wheel/trackpad
        // inertia instead of allowing it to compete with a new destination.
        stopInertiaOnNavigate: true,
      });

      const updateScrollTrigger = () => ScrollTrigger.update();
      const advanceLenis = (time) => lenis.raf(time * 1000);

      const unregisterSmoothScroller = registerSmoothScroller(lenis);
      lenis.on("scroll", updateScrollTrigger);
      gsap.ticker.add(advanceLenis);
      gsap.ticker.lagSmoothing(0);

      stopSmoothScroll = () => {
        unregisterSmoothScroller();
        lenis.off("scroll", updateScrollTrigger);
        gsap.ticker.remove(advanceLenis);
        lenis.destroy();
        gsap.ticker.lagSmoothing(500, 33);
      };
    };

    reducedMotion.addEventListener("change", syncSmoothScroll);
    desktopViewport.addEventListener("change", syncSmoothScroll);
    window.addEventListener("orientationchange", refreshMobileLayout);
    window.addEventListener("resize", refreshMobileLayout, { passive: true });
    window.visualViewport?.addEventListener("resize", refreshMobileLayout, { passive: true });
    syncSmoothScroll();

    // Fonts can change line wrapping after first paint, especially on mobile.
    // Refresh once they settle so section starts match the final layout.
    document.fonts?.ready?.then(() => {
      if (!desktopViewport.matches) ScrollTrigger.refresh();
    });

    return () => {
      reducedMotion.removeEventListener("change", syncSmoothScroll);
      desktopViewport.removeEventListener("change", syncSmoothScroll);
      window.removeEventListener("orientationchange", refreshMobileLayout);
      window.removeEventListener("resize", refreshMobileLayout);
      window.visualViewport?.removeEventListener("resize", refreshMobileLayout);
      if (mobileRefreshFrame !== null) window.cancelAnimationFrame(mobileRefreshFrame);
      stopSmoothScroll?.();
    };
  }, []);
}
