import { createContext, useContext } from "react";

export const ProjectTransitionContext = createContext(null);

export function useProjectTransition() {
  const context = useContext(ProjectTransitionContext);
  if (!context) throw new Error("useProjectTransition must be used inside ProjectTransitionProvider");
  return context;
}
