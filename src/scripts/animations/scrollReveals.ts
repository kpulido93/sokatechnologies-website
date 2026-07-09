import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const initScrollReveals = () => {
  const context = gsap.context(() => {
    const revealDescendants =
      ".js-reveal, .js-reveal-card, .js-service-card, .js-case-card, .js-final-cta, .js-process-step, .js-portik-panel, .js-portik-module, .js-visual-card, .js-visual-node";
    const batchReveal = (
      selector: string,
      vars: {
        y?: number;
        scale?: number;
        duration: number;
        stagger: number;
      }
    ) => {
      ScrollTrigger.batch(selector, {
        interval: 0.12,
        batchMax: 4,
        once: true,
        start: "top 88%",
        onEnter: (batch) => {
          gsap.set(batch, { willChange: "transform, opacity" });
          gsap.from(batch, {
            autoAlpha: 0,
            y: vars.y ?? 20,
            scale: vars.scale,
            duration: vars.duration,
            ease: "power2.out",
            stagger: vars.stagger,
            overwrite: "auto",
            clearProps: "transform,opacity,visibility",
            onComplete: () => {
              gsap.set(batch, { clearProps: "willChange" });
            }
          });
        }
      });
    };

    gsap.utils.toArray<HTMLElement>(".js-section").forEach((section) => {
      if (section.classList.contains("js-hero") || section.matches(".js-final-cta") || section.querySelector(revealDescendants)) {
        return;
      }

      gsap.set(section, { willChange: "transform, opacity" });
      gsap.from(section, {
        autoAlpha: 0,
        y: 16,
        duration: 0.46,
        ease: "power2.out",
        overwrite: "auto",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: {
          trigger: section,
          start: "top 86%",
          once: true
        },
        onComplete: () => {
          gsap.set(section, { clearProps: "willChange" });
        }
      });
    });

    batchReveal(".js-reveal", {
      y: 18,
      duration: 0.56,
      stagger: 0.08
    });
    batchReveal(".js-reveal-card:not(.js-service-card):not(.js-case-card):not(.js-visual-card)", {
      y: 22,
      scale: 0.985,
      duration: 0.62,
      stagger: 0.08
    });
    batchReveal(".js-service-card", {
      y: 22,
      scale: 0.985,
      duration: 0.62,
      stagger: 0.08
    });
    batchReveal(".js-case-card", {
      y: 22,
      scale: 0.985,
      duration: 0.62,
      stagger: 0.08
    });
    batchReveal(".js-visual-card, .js-visual-node", {
      y: 18,
      scale: 0.99,
      duration: 0.54,
      stagger: 0.05
    });

    const noiseSection = document.querySelector<HTMLElement>(".js-noise-transform");

    if (noiseSection) {
      const problems = Array.from(noiseSection.querySelectorAll<HTMLElement>(".js-noise-problem"));
      const results = Array.from(noiseSection.querySelectorAll<HTMLElement>(".js-noise-result"));
      const motionTargets = [...problems, ...results];

      if (motionTargets.length > 0) {
        gsap.set(motionTargets, { willChange: "transform, opacity" });

        const noiseTimeline = gsap.timeline({
          defaults: {
            ease: "power2.out",
            overwrite: "auto"
          },
          scrollTrigger: {
            trigger: noiseSection,
            start: "top 80%",
            once: true
          }
        });

        if (problems.length > 0) {
          noiseTimeline.from(problems, {
            autoAlpha: 0,
            y: 16,
            duration: 0.42,
            stagger: 0.045,
            clearProps: "transform,opacity,visibility"
          });
        }

        if (results.length > 0) {
          noiseTimeline.from(
            results,
            {
              autoAlpha: 0,
              y: 16,
              duration: 0.42,
              stagger: 0.045,
              clearProps: "transform,opacity,visibility"
            },
            problems.length > 0 ? "+=0.06" : 0
          );
        }

        noiseTimeline.eventCallback("onComplete", () => {
          gsap.set(motionTargets, { clearProps: "willChange" });
        });
      }
    }

    const finalCtas = gsap.utils.toArray<HTMLElement>(".js-final-cta");

    finalCtas.forEach((cta) => {
      gsap.set(cta, { willChange: "transform, opacity" });
      gsap.from(cta, {
        autoAlpha: 0,
        y: 20,
        duration: 0.56,
        ease: "power2.out",
        overwrite: "auto",
        clearProps: "transform,opacity,visibility",
        scrollTrigger: {
          trigger: cta,
          start: "top 88%",
          once: true
        },
        onComplete: () => {
          gsap.set(cta, { clearProps: "willChange" });
        }
      });
    });
  });

  return () => context.revert();
};
