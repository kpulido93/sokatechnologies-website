import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const initProcessTimeline = () => {
  const process = document.querySelector<HTMLElement>(".js-process");

  if (!process) {
    return () => {};
  }

  const context = gsap.context(() => {
    const line = process.querySelector<HTMLElement>(".js-process-line");
    const steps = Array.from(process.querySelectorAll<HTMLElement>(".js-process-step"));
    const isDesktop = window.matchMedia("(min-width: 821px)").matches;
    const revealTargets = [line, ...steps].filter((target): target is HTMLElement => Boolean(target));

    if (revealTargets.length === 0) {
      return;
    }

    gsap.set(revealTargets, { willChange: "transform, opacity" });
    const setActiveStep = (index: number) => {
      steps.forEach((step, stepIndex) => {
        step.classList.toggle("is-active", index === stepIndex);
      });
    };

    const reveal = gsap.timeline({
      defaults: {
        ease: "power2.out",
        overwrite: "auto"
      },
      scrollTrigger: {
        trigger: process,
        start: "top 78%",
        once: true
      }
    });

    if (line && isDesktop) {
      reveal.from(line, {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.82,
        clearProps: "transform,opacity,visibility"
      });
    }

    if (steps.length > 0) {
      reveal.from(
        steps,
        {
          autoAlpha: 0,
          y: 20,
          duration: 0.54,
          stagger: 0.08,
          clearProps: "transform,opacity,visibility"
        },
        line && isDesktop ? "-=0.42" : 0
      );
    }

    reveal.eventCallback("onComplete", () => {
      gsap.set(revealTargets, { clearProps: "willChange" });
    });

    if (isDesktop) {
      steps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center+=80",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveStep(index);
            }
          }
        });
      });
    }

    setActiveStep(0);
  }, process);

  return () => context.revert();
};
