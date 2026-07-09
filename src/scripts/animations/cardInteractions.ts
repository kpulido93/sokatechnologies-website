import gsap from "gsap";

export const initCardInteractions = () => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reducedMotion || !supportsHover) {
    return () => {};
  }

  const elements = Array.from(
    document.querySelectorAll<HTMLElement>("[data-card-interaction], [data-link-shift]")
  );

  const listeners: Array<() => void> = [];

  elements.forEach((element) => {
    const shift = element.hasAttribute("data-link-shift") ? 3 : 5;

    const enter = () => {
      gsap.killTweensOf(element);
      gsap.set(element, { willChange: "transform" });
      gsap.to(element, {
        y: -shift,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto"
      });
    };

    const leave = () => {
      gsap.killTweensOf(element);
      gsap.to(element, {
        y: 0,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
        clearProps: "transform,willChange"
      });
    };

    element.addEventListener("mouseenter", enter);
    element.addEventListener("mouseleave", leave);
    element.addEventListener("focus", enter);
    element.addEventListener("blur", leave);

    listeners.push(() => {
      element.removeEventListener("mouseenter", enter);
      element.removeEventListener("mouseleave", leave);
      element.removeEventListener("focus", enter);
      element.removeEventListener("blur", leave);
    });
  });

  return () => {
    listeners.forEach((listener) => listener());
  };
};
