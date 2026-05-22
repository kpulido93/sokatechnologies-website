import { gsap } from "gsap";

type AnimationCleanup = () => void;
type AnimationContext = {
  root: ParentNode;
  reduceMotion: boolean;
  isDesktop: boolean;
  isMobile: boolean;
};

const interactiveCardSelector = ".card:not(.form-card):not(.hero-visual):not(.product-panel):not(.story-panel)";

export function cardInteractions({ root, reduceMotion }: AnimationContext): AnimationCleanup {
  if (typeof window === "undefined") {
    return () => {};
  }

  const cards = Array.from(root.querySelectorAll<HTMLElement>(interactiveCardSelector));
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (!cards.length || reduceMotion || !canHover) {
    return () => {};
  }

  const cleanupHandlers: AnimationCleanup[] = [];

  cards.forEach((card) => {
    const accentTargets = Array.from(
      card.querySelectorAll<HTMLElement>(".card__meta, .card__title, .card__body, .bullet-list li, .action-row > *")
    );

    const activate = () => {
      if (card.dataset.cardInteractionActive === "true") {
        return;
      }

      card.dataset.cardInteractionActive = "true";
      gsap.killTweensOf(card);
      gsap.killTweensOf(accentTargets);

      gsap.set(card, { willChange: "transform" });
      if (accentTargets.length) {
        gsap.set(accentTargets, { willChange: "transform" });
      }

      gsap.to(card, {
        y: -6,
        scale: 1.01,
        duration: 0.24,
        ease: "power2.out"
      });

      if (accentTargets.length) {
        gsap.to(accentTargets, {
          y: -2,
          duration: 0.22,
          ease: "power2.out",
          stagger: 0.018
        });
      }
    };

    const reset = () => {
      card.dataset.cardInteractionActive = "false";
      gsap.killTweensOf(card);
      gsap.killTweensOf(accentTargets);

      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.28,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(card, { clearProps: "willChange" });
        }
      });

      if (accentTargets.length) {
        gsap.to(accentTargets, {
          y: 0,
          duration: 0.24,
          ease: "power2.out",
          stagger: {
            each: 0.012,
            from: "end"
          },
          onComplete: () => {
            gsap.set(accentTargets, { clearProps: "willChange" });
          }
        });
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget;

      if (nextTarget instanceof Node && card.contains(nextTarget)) {
        return;
      }

      reset();
    };

    card.addEventListener("pointerenter", activate);
    card.addEventListener("pointerleave", reset);
    card.addEventListener("focusin", activate);
    card.addEventListener("focusout", handleFocusOut);

    cleanupHandlers.push(() => {
      card.removeEventListener("pointerenter", activate);
      card.removeEventListener("pointerleave", reset);
      card.removeEventListener("focusin", activate);
      card.removeEventListener("focusout", handleFocusOut);
    });
  });

  return () => {
    cleanupHandlers.forEach((cleanup) => cleanup());
    cards.forEach((card) => {
      const accentTargets = Array.from(
        card.querySelectorAll<HTMLElement>(".card__meta, .card__title, .card__body, .bullet-list li, .action-row > *")
      );

      gsap.killTweensOf(card);
      gsap.killTweensOf(accentTargets);
      delete card.dataset.cardInteractionActive;
      gsap.set(card, { clearProps: "transform,willChange" });

      if (accentTargets.length) {
        gsap.set(accentTargets, { clearProps: "transform,willChange" });
      }
    });
  };
}
