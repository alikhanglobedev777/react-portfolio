import { useLayoutEffect } from "react";
import { gsap } from "../animation/gsap";

export function useGSAPContext(scopeRef, setup) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined;
    let cleanup;
    const context = gsap.context(() => {
      cleanup = setup();
    }, scopeRef);
    return () => {
      cleanup?.();
      context.revert();
    };
  }, [scopeRef, setup]);
}
