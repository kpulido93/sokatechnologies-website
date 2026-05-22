import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cardInteractions } from "./cardInteractions";
import { heroTimeline } from "./heroTimeline";
import { portikStory } from "./portikStory";
import { processTimeline } from "./processTimeline";
import { scrollReveals } from "./scrollReveals";

type AnimationCleanup = () => void;
type AnimationContext = {
  root: ParentNode;
  reduceMotion: boolean;
  isDesktop: boolean;
  isMobile: boolean;
};

type WindowWithAnimationCleanup = Window & {
  __sokaDemoAnimationsCleanup?: AnimationCleanup;
};

let isScrollTriggerRegistered = false;

function registerScrollTriggerOnce() {
  if (isScrollTriggerRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  isScrollTriggerRegistered = true;
}

export function initAnimations(root: Document | HTMLElement = document): AnimationCleanup {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  registerScrollTriggerOnce();

  const scopedWindow = window as WindowWithAnimationCleanup;
  scopedWindow.__sokaDemoAnimationsCleanup?.();

  gsap.defaults({
    duration: 0.7,
    ease: "power2.out",
    overwrite: "auto"
  });

  const media = gsap.matchMedia();

  media.add(
    {
      isDesktop: "(min-width: 960px)",
      isMobile: "(max-width: 959px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      const conditions = context.conditions as {
        isDesktop?: boolean;
        isMobile?: boolean;
        reduceMotion?: boolean;
      };

      const animationContext: AnimationContext = {
        root,
        reduceMotion: Boolean(conditions.reduceMotion),
        isDesktop: Boolean(conditions.isDesktop),
        isMobile: Boolean(conditions.isMobile)
      };

      const cleanups = [
        portikStory(animationContext),
        processTimeline(animationContext),
        scrollReveals(animationContext),
        cardInteractions(animationContext),
        heroTimeline(animationContext)
      ];

      if (!animationContext.reduceMotion) {
        ScrollTrigger.refresh();
      }

      return () => {
        cleanups
          .reverse()
          .forEach((cleanup) => cleanup());
      };
    }
  );

  const cleanup = () => {
    media.revert();

    if (scopedWindow.__sokaDemoAnimationsCleanup === cleanup) {
      delete scopedWindow.__sokaDemoAnimationsCleanup;
    }
  };

  scopedWindow.__sokaDemoAnimationsCleanup = cleanup;

  return cleanup;
}
