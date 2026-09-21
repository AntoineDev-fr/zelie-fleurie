/**
 * Zélie Fleurie — maquette commerciale
 * JS vanilla : header au scroll, panneaux (menu mobile / panier), toasts de
 * démonstration, révélation au scroll. Aucune logique métier (panier réel,
 * réservation, paiement) : tout est visuel et simulé.
 *
 * Note : la classe "js-enabled" est ajoutée sur <html> par un script inline
 * dans <head> (avant le premier rendu), pas ici — voir index.html.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     Header state on scroll
     ========================================================================== */
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

  /* ==========================================================================
     Slide-in panels (menu mobile + panier de démo)
     Both share the same backdrop and open/close/focus behaviour:
     - toggling `inert` + aria-hidden so closed panels are never reachable
       by keyboard/screen reader ;
     - locking body scroll while open ;
     - closing on Escape, backdrop click, close button or link click ;
     - restoring focus to the trigger button on close.
     ========================================================================== */
  var backdrop = document.getElementById("drawer-backdrop");
  var openPanel = null; // { panel, trigger, close }
  var backgroundEls = [document.getElementById("main"), document.querySelector(".site-footer")].filter(Boolean);

  function lockBody(lock) {
    document.body.style.overflow = lock ? "hidden" : "";
  }

  // While a panel (menu / cart) is open, keep the rest of the page out of
  // the tab order so keyboard/screen-reader users can't wander behind it.
  function setBackgroundInert(inert) {
    backgroundEls.forEach(function (el) {
      if (inert) {
        el.setAttribute("inert", "");
      } else {
        el.removeAttribute("inert");
      }
    });
  }

  function setPanelState(panel, isOpen) {
    panel.classList.toggle("is-open", isOpen);
    panel.setAttribute("aria-hidden", String(!isOpen));
    if (isOpen) {
      panel.removeAttribute("inert");
    } else {
      panel.setAttribute("inert", "");
    }
  }

  function makePanel(panel, trigger, openClassTarget) {
    function close() {
      setPanelState(panel, false);
      trigger.setAttribute("aria-expanded", "false");
      if (backdrop) backdrop.classList.remove("is-visible");
      lockBody(false);
      setBackgroundInert(false);
      openPanel = null;
      trigger.focus();
    }

    function open() {
      if (openPanel) openPanel.close();
      setPanelState(panel, true);
      trigger.setAttribute("aria-expanded", "true");
      if (backdrop) backdrop.classList.add("is-visible");
      lockBody(true);
      setBackgroundInert(true);
      openPanel = { panel: panel, trigger: trigger, close: close };

      var focusable = panel.querySelector("a, button");
      if (focusable) focusable.focus();
    }

    trigger.addEventListener("click", function () {
      var isOpen = panel.classList.contains("is-open");
      if (isOpen) {
        close();
      } else {
        open();
      }
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    panel.querySelectorAll("[data-panel-close]").forEach(function (btn) {
      btn.addEventListener("click", close);
    });

    return { panel: panel, open: open, close: close };
  }

  var panels = [];

  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (menuToggle && mobileNav) {
    panels.push(makePanel(mobileNav, menuToggle));
  }

  var cartToggle = document.getElementById("cart-toggle");
  var cartDrawer = document.getElementById("cart-drawer");
  if (cartToggle && cartDrawer) {
    var cartClose = document.getElementById("cart-drawer-close");
    var cartDismiss = cartDrawer.querySelector(".cart-drawer-dismiss");
    if (cartClose) cartClose.setAttribute("data-panel-close", "");
    if (cartDismiss) cartDismiss.setAttribute("data-panel-close", "");
    panels.push(makePanel(cartDrawer, cartToggle));
  }

  if (backdrop) {
    backdrop.addEventListener("click", function () {
      if (openPanel) openPanel.close();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && openPanel) {
      openPanel.close();
    }
  });

  /* ==========================================================================
     Toasts de démonstration
     Any element with [data-demo-action] shows a short, dismissible toast
     instead of performing the (not-yet-built) real action. The message comes
     from data-demo-message, with a generic fallback.
     ========================================================================== */
  var toastRegion = document.getElementById("toast-region");
  var toastTimer = null;
  var DEFAULT_DEMO_MESSAGE = "Fonctionnalité disponible dans la version finale.";

  function showToast(message) {
    if (!toastRegion) return;

    if (toastTimer) {
      clearTimeout(toastTimer);
      toastRegion.innerHTML = "";
    }

    var toast = document.createElement("p");
    toast.className = "toast";
    toast.textContent = message || DEFAULT_DEMO_MESSAGE;
    toastRegion.appendChild(toast);

    // Force reflow so the enter transition actually plays.
    void toast.offsetWidth;
    toast.classList.add("is-visible");

    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
      window.setTimeout(function () {
        toast.remove();
      }, reduceMotion ? 0 : 400);
    }, 3200);
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-demo-action]");
    if (!trigger) return;
    e.preventDefault();
    showToast(trigger.getAttribute("data-demo-message"));
  });

  /* ==========================================================================
     Reveal on scroll
     ========================================================================== */
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
