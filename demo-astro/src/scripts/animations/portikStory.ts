import { gsap } from "gsap";

type AnimationCleanup = () => void;
type AnimationContext = {
  root: ParentNode;
  reduceMotion: boolean;
  isDesktop: boolean;
  isMobile: boolean;
};

export function portikStory({ root, reduceMotion, isDesktop }: AnimationContext): AnimationCleanup {
  const section = root.querySelector<HTMLElement>(".js-portik-story");

  if (!section) {
    return () => {};
  }

  const intro = section.querySelector<HTMLElement>(".js-portik-story-intro");
  const moduleCards = Array.from(section.querySelectorAll<HTMLElement>(".js-portik-module-card"));
  const panel = section.querySelector<HTMLElement>(".js-portik-panel");
  const panelItems = Array.from(section.querySelectorAll<HTMLElement>(".js-portik-panel-item"));
  const targets = [intro, ...moduleCards, panel, ...panelItems].filter(Boolean) as HTMLElement[];

  if (!targets.length || reduceMotion) {
    gsap.set(targets, { clearProps: "all" });
    return () => {};
  }

  gsap.set(panelItems, { transformOrigin: "center center" });

  const setWillChange = () => {
    gsap.set(targets, { willChange: "transform, opacity" });
  };

  const clearWillChange = () => {
    gsap.set(targets, { clearProps: "willChange" });
  };

  const timeline = gsap.timeline({
    defaults: {
      duration: 0.46,
      ease: "power2.out"
    },
    scrollTrigger: {
      trigger: section,
      start: isDesktop ? "top 76%" : "top 88%",
      end: isDesktop ? "bottom 62%" : "bottom 72%",
      scrub: isDesktop ? 0.45 : false,
      once: !isDesktop,
      onEnter: setWillChange,
      onEnterBack: setWillChange,
      onLeave: clearWillChange,
      onLeaveBack: clearWillChange
    }
  });

  if (intro) {
    timeline.fromTo(
      intro,
      {
        autoAlpha: 0,
        y: 24
      },
      {
        autoAlpha: 1,
        y: 0
      },
      0
    );
  }

  if (panel) {
    timeline.fromTo(
      panel,
      {
        autoAlpha: 0,
        y: 26,
        scale: 0.985
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.52
      },
      0.08
    );
  }

  if (moduleCards.length) {
    timeline.fromTo(
      moduleCards,
      {
        autoAlpha: 0,
        y: 22
      },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08
      },
      0.16
    );
  }

  if (panelItems.length) {
    timeline.fromTo(
      panelItems,
      {
        autoAlpha: 0,
        y: 14,
        scale: 0.98
      },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.32,
        stagger: 0.07
      },
      isDesktop ? 0.28 : 0.36
    );
  }

  timeline.eventCallback("onComplete", () => {
    clearWillChange();
  });

  return () => {
    timeline.kill();
    gsap.set(targets, { clearProps: "willChange,transformOrigin" });
  };
}
