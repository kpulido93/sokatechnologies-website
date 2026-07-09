import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initCardInteractions } from "./cardInteractions";
import { runMotionCleanup, setMotionCleanup } from "./cleanup";
import { initHeroTimeline } from "./heroTimeline";
import { initPortikStory } from "./portikStory";
import { initProcessTimeline } from "./processTimeline";
import { initScrollReveals } from "./scrollReveals";

let pluginsRegistered = false;
let refreshFrame: number | undefined;

const registerPlugins = () => {
  if (pluginsRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    limitCallbacks: true
  });
  pluginsRegistered = true;
};

const scheduleRefresh = () => {
  if (typeof window === "undefined" || ScrollTrigger.getAll().length === 0) {
    return () => {};
  }

  let cancelled = false;

  const refresh = () => {
    if (cancelled || ScrollTrigger.getAll().length === 0) {
      return;
    }

    if (refreshFrame) {
      window.cancelAnimationFrame(refreshFrame);
    }

    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = undefined;

      if (!cancelled && ScrollTrigger.getAll().length > 0) {
        ScrollTrigger.refresh();
      }
    });
  };

  refresh();

  if ("fonts" in document) {
    void document.fonts.ready.then(() => {
      refresh();
    });
  }

  return () => {
    cancelled = true;

    if (refreshFrame) {
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = undefined;
    }
  };
};

export const destroySiteMotion = () => {
  runMotionCleanup();
};

export const initSiteMotion = () => {
  if (typeof window === "undefined") {
    return;
  }

  runMotionCleanup();
  registerPlugins();

  const cleanups: Array<() => void> = [];
  cleanups.push(initCardInteractions());
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const animationCleanups = [
      initHeroTimeline(),
      initScrollReveals(),
      initProcessTimeline(),
      initPortikStory()
    ];
    const cancelRefresh = scheduleRefresh();

    return () => {
      cancelRefresh();
      animationCleanups.reverse().forEach((cleanup) => cleanup());
    };
  });

  cleanups.push(() => mm.revert());

  setMotionCleanup(() => {
    cleanups.reverse().forEach((cleanup) => cleanup());
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  });
};
