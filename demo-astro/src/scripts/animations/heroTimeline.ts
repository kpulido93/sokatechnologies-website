import { gsap } from "gsap";

type AnimationCleanup = () => void;
type AnimationContext = {
  root: ParentNode;
  reduceMotion: boolean;
  isDesktop: boolean;
  isMobile: boolean;
};

export function heroTimeline({ root, reduceMotion }: AnimationContext): AnimationCleanup {
  const hero = root.querySelector<HTMLElement>(".js-hero");

  if (!hero) {
    return () => {};
  }

  const eyebrow = hero.querySelector<HTMLElement>(".js-hero-eyebrow");
  const title = hero.querySelector<HTMLElement>(".js-hero-title");
  const subtitle = hero.querySelector<HTMLElement>(".js-hero-subtitle");
  const actions = Array.from(hero.querySelectorAll<HTMLElement>(".js-hero-cta"));
  const visualPanel = hero.querySelector<HTMLElement>(".js-hero-visual");
  const panelItems = Array.from(hero.querySelectorAll<HTMLElement>(".js-hero-visual-item"));
  const targets = [eyebrow, title, subtitle, ...actions, visualPanel, ...panelItems].filter(Boolean) as HTMLElement[];

  if (!targets.length || reduceMotion) {
    gsap.set(targets, { clearProps: "all" });
    return () => {};
  }

  gsap.set(targets, { willChange: "transform, opacity" });
  gsap.set(visualPanel, { transformOrigin: "center center" });

  const timeline = gsap.timeline({
    defaults: {
      duration: 0.42,
      ease: "power3.out"
    }
  });

  if (eyebrow) {
    timeline.from(eyebrow, { autoAlpha: 0, y: 12 }, 0);
  }

  if (title) {
    timeline.from(title, { autoAlpha: 0, y: 30, duration: 0.52 }, 0.05);
  }

  if (subtitle) {
    timeline.from(subtitle, { autoAlpha: 0, y: 22, duration: 0.38 }, 0.16);
  }

  if (actions.length) {
    timeline.from(
      actions,
      {
        autoAlpha: 0,
        y: 18,
        duration: 0.32,
        stagger: 0.08
      },
      0.26
    );
  }

  if (visualPanel) {
    timeline.from(
      visualPanel,
      {
        autoAlpha: 0,
        y: 24,
        scale: 0.97,
        duration: 0.56
      },
      0.12
    );
  }

  if (panelItems.length) {
    timeline.from(
      panelItems,
      {
        autoAlpha: 0,
        y: 16,
        duration: 0.26,
        stagger: 0.06
      },
      0.34
    );
  }

  timeline.eventCallback("onComplete", () => {
    gsap.set(targets, { clearProps: "willChange,transformOrigin" });
  });

  return () => {
    timeline.kill();
    gsap.set(targets, { clearProps: "willChange,transformOrigin" });
  };
}
