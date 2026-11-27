// Tiny signal so the hero can wait for the intro loader to finish.
let done = false;
const listeners = new Set();

export function markIntroDone() {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function onIntroDone(listener) {
  if (done) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function shouldPlayIntro() {
  try {
    return !window.sessionStorage.getItem("ma-intro-seen");
  } catch {
    return true;
  }
}

export function rememberIntro() {
  try {
    window.sessionStorage.setItem("ma-intro-seen", "1");
  } catch {
    /* storage unavailable — intro simply plays again */
  }
}
