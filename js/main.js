/**
 * Subtle reveal animations — vanilla JS + IntersectionObserver
 */
(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const HERO_SELECTORS = [
    ".hero-image",
    ".hero-greeting",
    ".hero-title",
    ".hero-subtitle",
  ];

  const SECTION_SELECTORS = "#about, #skills, #education, #contact";

  const HERO_STAGGER_MS = 120;
  const OBSERVER_OPTIONS = {
    threshold: 0.15,
    rootMargin: "0px 0px -8% 0px",
  };

  function revealElements(elements, stagger = 0) {
    elements.forEach((element, index) => {
      if (!element) return;

      if (prefersReducedMotion || stagger === 0) {
        element.classList.add("is-visible");
        return;
      }

      window.setTimeout(() => {
        element.classList.add("is-visible");
      }, index * stagger);
    });
  }

  function initHeroAnimation() {
    const heroElements = HERO_SELECTORS.map((selector) =>
      document.querySelector(selector)
    ).filter(Boolean);

    if (heroElements.length === 0) return;

    if (prefersReducedMotion) {
      revealElements(heroElements);
      return;
    }

    window.requestAnimationFrame(() => {
      revealElements(heroElements, HERO_STAGGER_MS);
    });
  }

  function initSectionObserver() {
    const sections = document.querySelectorAll(SECTION_SELECTORS);
    if (sections.length === 0) return;

    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTIONS);

    sections.forEach((section) => observer.observe(section));
  }

  function init() {
    initHeroAnimation();
    initSectionObserver();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
