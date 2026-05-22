import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AnimationCleanup = () => void;
type AnimationContext = {
  root: ParentNode;
  reduceMotion: boolean;
  isDesktop: boolean;
  isMobile: boolean;
};

export function processTimeline({ root, reduceMotion, isDesktop }: AnimationContext): AnimationCleanup {
  const section = root.querySelector<HTMLElement>(".js-process");

  if (!section) {
    return () => {};
  }

  const progressLine = section.querySelector<HTMLElement>(".js-process-line");
  const steps = Array.from(section.querySelectorAll<HTMLElement>(".js-process-step"));
  const dots = Array.from(section.querySelectorAll<HTMLElement>(".js-process-dot"));
  const targets = [progressLine, ...steps, ...dots].filter(Boolean) as HTMLElement[];
  const stepTriggers: ScrollTrigger[] = [];

  if (!targets.length || reduceMotion) {
    gsap.set(targets, { clearProps: "all" });
    steps.forEach((step) => step.classList.remove("is-active"));
    return () => {};
  }

  gsap.set(progressLine, { transformOrigin: "center top" });
  gsap.set(dots, { transformOrigin: "center center" });

  const setWillChange = () => {
    gsap.set(targets, { willChange: "transform, opacity" });
  };

  const clearWillChange = () => {
    gsap.set(targets, { clearProps: "willChange" });
  };

  const timeline = gsap.timeline({
    defaults: {
      ease: "power2.out"
    },
    scrollTrigger: {
      trigger: section,
      start: isDesktop ? "top 72%" : "top 84%",
      end: isDesktop ? "bottom 58%" : "bottom 70%",
      scrub: isDesktop ? 0.7 : false,
      once: !isDesktop,
      onEnter: setWillChange,
      onEnterBack: setWillChange,
      onLeave: clearWillChange,
      onLeaveBack: clearWillChange
    }
  });

  if (progressLine) {
    timeline.fromTo(
      progressLine,
      { scaleY: 0 },
      { scaleY: 1, duration: isDesktop ? 0.92 : 0.58 },
      0
    );
  }

  if (steps.length) {
    timeline.fromTo(
      steps,
      {
        autoAlpha: 0,
        y: 24
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.42,
        stagger: isDesktop ? 0.18 : 0.1
      },
      0.08
    );
  }

  steps.forEach((step, index) => {
    stepTriggers.push(
      ScrollTrigger.create({
        trigger: step,
        start: isDesktop ? "top 74%" : "top 88%",
        once: !isDesktop,
        onEnter: () => step.classList.add("is-active"),
        onEnterBack: () => step.classList.add("is-active"),
        onLeaveBack: () => {
          if (isDesktop) {
            step.classList.remove("is-active");
          }
        }
      })
    );

    const dot = dots[index];

    if (!dot) {
      return;
    }

    timeline.fromTo(
      dot,
      {
        autoAlpha: 0.45,
        y: 4
      },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.24
      },
      0.14 + index * (isDesktop ? 0.18 : 0.1)
    );
  });

  timeline.eventCallback("onComplete", () => {
    clearWillChange();
  });

  return () => {
    timeline.kill();
    stepTriggers.forEach((trigger) => trigger.kill());
    steps.forEach((step) => step.classList.remove("is-active"));
    gsap.set(targets, { clearProps: "willChange,transformOrigin" });
  };
}
