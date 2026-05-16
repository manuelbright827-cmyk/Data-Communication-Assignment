document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const backTop = document.getElementById("backTop");
  const pageLoader = document.getElementById("pageLoader");

  const closeMobileMenu = () => {
    if (!mobileMenu || !hamburger) return;
    mobileMenu.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileMenu();
    });
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
  }

  let rafId = null;
  let lastScrollY = 0;

  const setScrollCssVar = () => {
    rafId = null;
    const root = document.documentElement;

    // Normalize scroll into a small, stable value for subtle motion.
    // Clamp so the movement stays small even if you scroll far.
    const y = Math.max(0, lastScrollY);
    const clamped = Math.min(1800, y);
    const px = clamped;

    root.style.setProperty("--scrollY", `${px}px`);
  };

  const updateScrollState = () => {
    lastScrollY = window.scrollY;

    const isScrolled = lastScrollY > 24;
    if (navbar) navbar.classList.toggle("scrolled", isScrolled);
    if (backTop) backTop.classList.toggle("visible", lastScrollY > 360);

    if (rafId == null) {
      rafId = window.requestAnimationFrame(setScrollCssVar);
    }
  };


  const hideLoader = () => {
    if (!pageLoader) return;
    document.body.classList.remove("is-loading-resource");
    pageLoader.classList.remove("active");
    pageLoader.setAttribute("aria-hidden", "true");
  };

  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll("[data-link-loader]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !pageLoader) return;

      event.preventDefault();
      const resourceWindow = window.open("", "_blank");

      document.body.classList.add("is-loading-resource");
      pageLoader.classList.add("active");
      pageLoader.setAttribute("aria-hidden", "false");

      window.setTimeout(() => {
        if (resourceWindow) {
          resourceWindow.opener = null;
          resourceWindow.location.href = href;
          hideLoader();
        } else {
          window.location.href = href;
        }
      }, 650);
    });
  });

  window.addEventListener("pageshow", hideLoader);
  window.addEventListener("focus", () => {
    window.setTimeout(hideLoader, 150);
  });
});
