import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AnimationCleanup = () => void;
type AnimationContext = {
  root: ParentNode;
  reduceMotion: boolean;
  isDesktop: boolean;
  isMobile: boolean;
};

export function scrollReveals({ root, reduceMotion, isMobile }: AnimationContext): AnimationCleanup {
  const revealBlocks = Array.from(root.querySelectorAll<HTMLElement>(".js-reveal"));
  const revealCards = Array.from(root.querySelectorAll<HTMLElement>(".js-reveal-card")).filter(
    (card) => !card.classList.contains("js-service-card")
  );
  const servicesGrid = root.querySelector<HTMLElement>(".js-services-grid");
  const serviceCards = servicesGrid ? Array.from(servicesGrid.querySelectorAll<HTMLElement>(".js-service-card")) : [];
  const portikHighlight = root.querySelector<HTMLElement>(".js-portik-highlight");
  const finalCta = root.querySelector<HTMLElement>(".js-final-cta");
  const batchTriggers: ScrollTrigger[] = [];
  const specialAnimations: gsap.core.Animation[] = [];
  const allTargets = [
    ...revealBlocks,
    ...revealCards,
    ...serviceCards,
    portikHighlight,
    finalCta
  ].filter(Boolean) as HTMLElement[];

  if (reduceMotion) {
    gsap.set(allTargets, { clearProps: "all" });
    return () => {};
  }

  if (revealBlocks.length) {
    batchTriggers.push(
      ...ScrollTrigger.batch(revealBlocks, {
        start: "top 88%",
        once: true,
        interval: 0.12,
        batchMax: isMobile ? 1 : 2,
        onEnter: (batch) => {
          gsap.set(batch, { willChange: "transform, opacity" });
          gsap.fromTo(
            batch,
            {
              autoAlpha: 0,
              y: 20
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              overwrite: true,
              onComplete: () => {
                gsap.set(batch, { clearProps: "willChange" });
              }
            }
          );
        }
      })
    );
  }

  if (revealCards.length) {
    batchTriggers.push(
      ...ScrollTrigger.batch(revealCards, {
        start: "top 90%",
        once: true,
        interval: 0.12,
        batchMax: isMobile ? 2 : 4,
        onEnter: (batch) => {
          gsap.set(batch, { willChange: "transform, opacity" });
          gsap.fromTo(
            batch,
            {
              autoAlpha: 0,
              y: 24
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.52,
              stagger: 0.08,
              ease: "power2.out",
              overwrite: true,
              onComplete: () => {
                gsap.set(batch, { clearProps: "willChange" });
              }
            }
          );
        }
      })
    );
  }

  if (servicesGrid && serviceCards.length) {
    gsap.set(serviceCards, { willChange: "transform, opacity" });

    const servicesTimeline = gsap.timeline({
      defaults: {
        duration: 0.5,
        ease: "power2.out"
      },
      scrollTrigger: {
        trigger: servicesGrid,
        start: "top 84%",
        once: true
      }
    });

    servicesTimeline.fromTo(
      serviceCards,
      {
        autoAlpha: 0,
        y: 22
      },
      {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08
      }
    );

    servicesTimeline.eventCallback("onComplete", () => {
      gsap.set(serviceCards, { clearProps: "willChange" });
    });

    specialAnimations.push(servicesTimeline);
  }

  if (portikHighlight) {
    gsap.set(portikHighlight, { willChange: "transform, opacity", transformOrigin: "center center" });

    specialAnimations.push(
      gsap.fromTo(
        portikHighlight,
        {
          autoAlpha: 0,
          y: 18,
          scale: 0.985
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.56,
          ease: "power2.out",
          clearProps: "transform,willChange,transformOrigin",
          scrollTrigger: {
            trigger: portikHighlight,
            start: "top 86%",
            once: true
          }
        }
      )
    );
  }

  if (finalCta) {
    gsap.set(finalCta, { willChange: "transform, opacity" });

    specialAnimations.push(
      gsap.fromTo(
        finalCta,
        {
          autoAlpha: 0,
          y: 22
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.54,
          ease: "power2.out",
          clearProps: "transform,willChange",
          scrollTrigger: {
            trigger: finalCta,
            start: "top 88%",
            once: true
          }
        }
      )
    );
  }

  return () => {
    batchTriggers.forEach((trigger) => trigger.kill());
    specialAnimations.forEach((animation) => animation.kill());
    gsap.set(allTargets, { clearProps: "willChange,transformOrigin" });
  };
}
