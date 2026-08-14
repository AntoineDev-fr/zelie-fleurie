/**
 * Zélie Fleurie — maquette commerciale
 * JS vanilla : header au scroll, menu mobile, révélation au scroll.
 * Aucune logique métier (panier, réservation, paiement) : tout est visuel.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header state on scroll ---------- */
  var header = document.getElementById("site-header");
  var heroSentinel = document.getElementById("hero");

  if (header && heroSentinel) {
    var toggleHeader = function () {
      var triggerPoint = Math.min(heroSentinel.offsetHeight - 80, window.innerHeight * 0.6);
      header.classList.toggle("is-scrolled", window.scrollY > triggerPoint);
    };

    if ("IntersectionObserver" in window) {
      var headerObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            header.classList.toggle("is-scrolled", !entry.isIntersecting || entry.intersectionRatio < 0.4);
          });
        },
        { threshold: [0, 0.4, 1] }
      );
      headerObserver.observe(heroSentinel);
    } else {
      window.addEventListener("scroll", toggleHeader, { passive: true });
      toggleHeader();
    }
  }

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (menuToggle && mobileNav) {
    var closeMenu = function () {
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      document.body.style.overflow = "";
    };

    var openMenu = function () {
      mobileNav.classList.add("is-open");
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Fermer le menu");
      document.body.style.overflow = "hidden";
    };

    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el, index) {
      el.style.transitionDelay = (Math.min(index % 4, 3) * 90) + "ms";
      revealObserver.observe(el);
    });
  }
})();
