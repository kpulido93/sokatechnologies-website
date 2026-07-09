import gsap from "gsap";

export const initHeroTimeline = () => {
  const hero = document.querySelector<HTMLElement>(".js-hero");

  if (!hero) {
    return () => {};
  }

  const context = gsap.context(() => {
    const select = gsap.utils.selector(hero);
    const eyebrow = select<HTMLElement>(".js-hero-eyebrow");
    const title = select<HTMLElement>(".js-hero-title");
    const subtitle = select<HTMLElement>(".js-hero-subtitle");
    const ctas = select<HTMLElement>(".js-hero-cta");
    const visual = select<HTMLElement>(".js-hero-visual");
    const cards = select<HTMLElement>(".js-hero-panel-card");
    const signals = select<HTMLElement>(".js-hero-signal");
    const motionTargets = [...eyebrow, ...title, ...subtitle, ...ctas, ...visual, ...cards, ...signals];

    if (motionTargets.length === 0) {
      return;
    }

    gsap.set(motionTargets, { willChange: "transform, opacity" });

    const tl = gsap.timeline({
      defaults: {
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto"
      }
    });

    tl.from(eyebrow, {
      autoAlpha: 0,
      y: 18,
      clearProps: "transform,opacity,visibility"
    })
      .from(
        title,
        {
          autoAlpha: 0,
          y: 26,
          clearProps: "transform,opacity,visibility"
        },
        "-=0.06"
      )
      .from(
        subtitle,
        {
          autoAlpha: 0,
          y: 22,
          clearProps: "transform,opacity,visibility"
        },
        "-=0.08"
      )
      .from(
        ctas,
        {
          autoAlpha: 0,
          y: 16,
          stagger: 0.05,
          clearProps: "transform,opacity,visibility"
        },
        "-=0.06"
      )
      .from(
        visual,
        {
          autoAlpha: 0,
          scale: 0.97,
          clearProps: "transform,opacity,visibility"
        },
        "-=0.12"
      )
      .from(
        cards,
        {
          autoAlpha: 0,
          y: 16,
          stagger: 0.035,
          clearProps: "transform,opacity,visibility"
        },
        "-=0.08"
      )
      .from(
        signals,
        {
          autoAlpha: 0,
          scale: 0.8,
          stagger: 0.025,
          clearProps: "transform,opacity,visibility"
        },
        "-=0.05"
      );

    tl.eventCallback("onComplete", () => {
      gsap.set(motionTargets, { clearProps: "willChange" });
    });
  }, hero);

  return () => context.revert();
};
