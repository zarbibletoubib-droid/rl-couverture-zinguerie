/* ═══════════════════════════════════════
   RL ZINC — Scripts v2
   ═══════════════════════════════════════ */
(function () {
  "use strict";

  /* ── Header ── */
  var header = document.getElementById("header");
  var burgerFloat = document.getElementById("burger-float");
  var lastY = 0;
  var isMobile = window.matchMedia("(max-width: 899px)").matches;

  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);

    // Sur mobile : cacher le header après 120px de scroll, afficher le burger flottant
    if (isMobile) {
      if (y > 120) {
        header.classList.add("hidden");
        if (burgerFloat) burgerFloat.classList.add("visible");
      } else {
        header.classList.remove("hidden");
        if (burgerFloat) burgerFloat.classList.remove("visible");
      }
    }
    lastY = y;
  }, { passive: true });

  // Resize : recalcule si on passe de mobile à desktop
  window.addEventListener("resize", function () {
    isMobile = window.matchMedia("(max-width: 899px)").matches;
    if (!isMobile) {
      header.classList.remove("hidden");
      if (burgerFloat) burgerFloat.classList.remove("visible");
    }
  });

  /* ── Burger ── */
  var burger = document.getElementById("burger");
  var navM = document.getElementById("nav-mobile");
  var backdrop = document.getElementById("nav-backdrop");
  function openMenu() {
    navM.classList.add("open");
    if (backdrop) backdrop.classList.add("open");
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    navM.classList.remove("open");
    if (backdrop) backdrop.classList.remove("open");
    document.body.classList.remove("menu-open");
  }
  function toggleMenu() {
    if (navM.classList.contains("open")) closeMenu(); else openMenu();
  }
  burger.addEventListener("click", toggleMenu);
  if (burgerFloat) burgerFloat.addEventListener("click", toggleMenu);
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  navM.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var t = document.querySelector(this.getAttribute("href"));
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top, behavior: "smooth" });
    });
  });

  /* ── Timelapse Vidéo pilotée au scroll ── */
  var tl = document.querySelector(".timelapse");
  if (tl) {
    var video = document.getElementById("tl-video");
    var tlBar = tl.querySelector(".tl-bar");
    var tlHint = tl.querySelector(".tl-hint");
    var phaseBefore = tl.querySelector(".tl-phase--before");
    var phaseAfter = tl.querySelector(".tl-phase--after");
    var videoReady = false;

    // Débloquer la vidéo sur mobile (iOS/Android exigent une interaction)
    function unlockVideo() {
      if (videoReady) return;
      video.play().then(function () {
        video.pause();
        video.currentTime = 0;
        videoReady = true;
      }).catch(function () {});
    }

    // Déclencher au premier touch OU scroll
    document.addEventListener("touchstart", unlockVideo, { once: true });
    document.addEventListener("scroll", unlockVideo, { once: true });
    document.addEventListener("click", unlockVideo, { once: true });

    // Marquer prêt quand les métadonnées sont chargées
    video.addEventListener("loadedmetadata", function () {
      video.currentTime = 0;
      videoReady = true;
    });

    // Forcer le préchargement complet
    video.load();

    window.addEventListener("scroll", function () {
      var rect = tl.getBoundingClientRect();
      var total = tl.offsetHeight - window.innerHeight;
      var p = Math.max(0, Math.min(1, -rect.top / total));

      // Piloter la vidéo avec le scroll
      if (video.duration && isFinite(video.duration)) {
        try { video.currentTime = p * video.duration; } catch (e) {}
      }

      // Labels
      if (p < 0.1) {
        phaseBefore.classList.add("active");
        phaseAfter.classList.remove("active");
      } else if (p > 0.85) {
        phaseBefore.classList.remove("active");
        phaseAfter.classList.add("active");
      } else {
        phaseBefore.classList.remove("active");
        phaseAfter.classList.remove("active");
      }

      // Barre de progression
      tlBar.style.width = (p * 100) + "%";

      // Hint
      tlHint.style.opacity = p < 0.06 ? 1 : Math.max(0, 1 - (p - 0.06) * 12);

    }, { passive: true });
  }

  /* ── Reveal ── */
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var d = parseInt(en.target.dataset.d) || 0;
      setTimeout(function () { en.target.classList.add("visible"); }, d);
      obs.unobserve(en.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { obs.observe(el); });

  /* ── Gallery arrows ── */
  var track = document.getElementById("real-track");
  var prev = document.querySelector(".real-arr--prev");
  var next = document.querySelector(".real-arr--next");
  if (track && prev && next) {
    var scrollAmt = 360;
    prev.addEventListener("click", function () { track.scrollBy({ left: -scrollAmt, behavior: "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: scrollAmt, behavior: "smooth" }); });
  }

  /* ── Form — envoi réel via FormSubmit ── */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function () {
      var btn = form.querySelector("button[type=submit]");
      btn.innerHTML = "Envoi en cours...";
      btn.disabled = true;
    });
  }

})();
