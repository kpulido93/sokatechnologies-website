declare global {
  interface Window {
    __sokaSiteMotionCleanup?: () => void;
  }
}

export const setMotionCleanup = (cleanup: () => void) => {
  window.__sokaSiteMotionCleanup = cleanup;
};

export const runMotionCleanup = () => {
  window.__sokaSiteMotionCleanup?.();
  window.__sokaSiteMotionCleanup = undefined;
};
