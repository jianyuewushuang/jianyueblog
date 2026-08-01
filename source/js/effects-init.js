// effects-init.js — Particle & cursor effects initializer.
// Loaded as a regular <script> via inject.footer (NOT an ES module).
// Reads runtime toggles from window.theme.effects. Uses a swup guard so the
// script does not re-initialize on every swup page navigation (the inject
// mechanism adds data-swup-reload-script which re-executes the script).
(function () {
  "use strict";

  // --- Swup guard: prevent duplicate initialization on page navigation ---
  if (window.__effectsInitialized) return;
  window.__effectsInitialized = true;

  // --- Read runtime config defensively ---
  // Priority: window.__effectsConfig (injected via inject.head) >
  //            window.theme.effects (if theme exports it) >
  //            default both enabled
  const effects = window.__effectsConfig || (window.theme && window.theme.effects) || { particles: true, cursoreffects: true };
  const particlesEnabled = effects.particles !== false;
  const cursorEnabled = effects.cursoreffects !== false;

  // If neither effect is enabled, there is nothing to do.
  if (!particlesEnabled && !cursorEnabled) return;

  // --- Helper: dynamically load a script tag into <head> ---
  function loadScript(url, onLoad, onError) {
    const el = document.createElement("script");
    el.src = url;
    el.async = true;
    el.onload = onLoad;
    el.onerror = onError;
    document.head.appendChild(el);
    return el;
  }

  // --- Particles initialization ---
  function initParticles() {
    // Create the #particles-js container only if it does not already exist.
    let container = document.getElementById("particles-js");
    if (!container) {
      container = document.createElement("div");
      container.id = "particles-js";
      container.setAttribute(
        "style",
        "position:fixed;top:0;left:0;width:100%;height:100%;z-index:1;pointer-events:none;background:transparent;"
      );
      document.body.appendChild(container);
    }

    // Exact particles config from themes/redefine/docs/effects.md
    const particlesConfig = {
      "particles": {
        "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#ffffff" },
        "shape": { "type": "circle" },
        "opacity": { "value": 0.5, "random": true },
        "size": { "value": 3, "random": true },
        "line_linked": { "enable": false },
        "move": { "enable": true, "speed": 1, "direction": "bottom", "random": true, "straight": false }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": { "enable": false },
          "onclick": { "enable": false }
        }
      },
      "retina_detect": true
    };

    function start() {
      try {
        if (typeof particlesJS === "function") {
          particlesJS("particles-js", particlesConfig);
        } else {
          console.warn("[effects-init] particlesJS is not available after CDN load");
        }
      } catch (err) {
        console.warn("[effects-init] particlesJS init failed:", err);
      }
    }

    // Only load the CDN if the global is not yet available.
    if (typeof particlesJS === "undefined") {
      loadScript(
        "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js",
        start,
        function () {
          console.warn("[effects-init] Failed to load particles.js CDN");
        }
      );
    } else {
      start();
    }
  }

  // --- Cursor effects initialization ---
  function initCursor() {
    function start() {
      try {
        if (typeof cursoreffects !== "undefined" && typeof cursoreffects.emojiCursor === "function") {
          new cursoreffects.emojiCursor({ emoji: ["❄️"], length: 4, size: 8 });
        } else {
          console.warn("[effects-init] cursoreffects.emojiCursor is not available after CDN load");
        }
      } catch (err) {
        console.warn("[effects-init] cursor-effects init failed:", err);
      }
    }

    if (typeof cursoreffects === "undefined") {
      loadScript(
        "https://unpkg.com/cursor-effects@latest/dist/browser.js",
        start,
        function () {
          console.warn("[effects-init] Failed to load cursor-effects CDN");
        }
      );
    } else {
      start();
    }
  }

  // --- Run once the DOM is ready ---
  function bootstrap() {
    if (particlesEnabled) initParticles();
    if (cursorEnabled) initCursor();
  }

  if (document.readyState !== "loading") {
    // DOM already parsed (or complete) — bootstrap immediately.
    bootstrap();
  } else {
    document.addEventListener("DOMContentLoaded", bootstrap);
  }
})();
