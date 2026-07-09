import gsap from "gsap";

export const initPortikStory = () => {
  const sections = gsap.utils.toArray<HTMLElement>(".js-portik");

  if (sections.length === 0) {
    return () => {};
  }

  const context = gsap.context(() => {
    sections.forEach((section) => {
      const panel = section.querySelector<HTMLElement>(".js-portik-panel");
      const modules = Array.from(section.querySelectorAll<HTMLElement>(".js-portik-module"));
      const motionTargets = [panel, ...modules].filter((target): target is HTMLElement => Boolean(target));

      if (motionTargets.length === 0) {
        return;
      }

      gsap.set(motionTargets, { willChange: "transform, opacity" });

      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
          overwrite: "auto"
        },
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          once: true
        }
      });

      if (panel) {
        tl.from(panel, {
          autoAlpha: 0,
          y: 24,
          duration: 0.62,
          clearProps: "transform,opacity,visibility"
        });
      }

      if (modules.length > 0) {
        tl.from(
          modules,
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.42,
            stagger: 0.04,
            clearProps: "transform,opacity,visibility"
          },
          panel ? "-=0.18" : 0
        );
      }

      tl.eventCallback("onComplete", () => {
        gsap.set(motionTargets, { clearProps: "willChange" });
      });
    });
  });

  return () => context.revert();
};
