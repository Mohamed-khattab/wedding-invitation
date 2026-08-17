/* ============================================================
   Engagement invitation page
   Plain JS. No build step. Drop into GitHub Pages and ship.
   ============================================================ */

/* ---------- 1. CONFIG (edit only this block) ---------- */
const CONFIG = {
  names: { groom: "Mohamed", bride: "Hajer" },

  // Event time WITH your timezone offset, e.g. "2026-11-20T19:00:00+02:00"
  eventISO: "2026-08-20T21:30:00+02:00",
  eventEndISO: "2026-08-21T01:30:00+02:00",

  venue: {
    name: "Infinity Wedding Hall",
    address: "Damanhur, Beheira, Egypt",
    mapsUrl: "https://maps.app.goo.gl/rQzUpLJPhTiAVCQp8"
  },

  hashtag: "#MohamedAndHajer"
};

/* ---------- 2. Helpers ---------- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- 3. Envelope intro ---------- */
(function envelope() {
  const overlay = document.getElementById("envelope-overlay");
  if (!overlay) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    overlay.classList.add("hidden");
    return;
  }

  let opened = false;
  function open() {
    if (opened) return;
    opened = true;
    overlay.classList.add("open");
    // start music on this user gesture
    if (typeof window.__startMusic === "function") window.__startMusic();
    // remove overlay from the layer after the fly/fade completes (~1.85s)
    setTimeout(() => overlay.classList.add("hidden"), 2000);
  }

  overlay.addEventListener("click", open);
  overlay.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
})();

/* ---------- 4. Countdown ---------- */
(function countdown() {
  const target = new Date(CONFIG.eventISO).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs")
  };
  const done = document.getElementById("countdown-done");
  const wrap = document.getElementById("countdown");

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      wrap.hidden = true;
      done.hidden = false;
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent = d;
    els.hours.textContent = String(h).padStart(2, "0");
    els.mins.textContent = String(m).padStart(2, "0");
    els.secs.textContent = String(s).padStart(2, "0");
  }
  tick();
  const timer = setInterval(tick, 1000);
})();

/* ---------- 5. Calendar links ---------- */
(function calendar() {
  const start = new Date(CONFIG.eventISO);
  const end = new Date(CONFIG.eventEndISO);
  const fmt = d =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const title = encodeURIComponent(
    `Engagement of ${CONFIG.names.groom} & ${CONFIG.names.bride}`
  );
  const location = encodeURIComponent(
    `${CONFIG.venue.name}, ${CONFIG.venue.address}`
  );
  const details = encodeURIComponent("With love — see you there!");

  // Google Calendar
  const gcalUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${title}` +
    `&dates=${fmt(start)}/${fmt(end)}` +
    `&location=${location}` +
    `&details=${details}`;
  document.getElementById("gcal-btn").href = gcalUrl;
})();

/* ---------- 6. Hashtag tap-to-copy ---------- */
(function hashtag() {
  document.getElementById("hashtag").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.hashtag);
      showToast("Copied!");
    } catch {
      showToast(CONFIG.hashtag);
    }
  });
})();

/* ---------- 8. Music: auto-play on first user gesture, with toggle ---------- */
(function music() {
  const btn = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-audio");
  audio.volume = 0.5;
  let playing = false;

  // Playlist: plays each track in order, then loops back to the first.
  const playlist = ["music.mp3", "music2.mp3"];
  let track = 0;
  audio.addEventListener("ended", () => {
    track = (track + 1) % playlist.length;
    audio.src = playlist[track];
    audio.play().catch(() => {});
  });

  function setState(on) {
    playing = on;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  async function tryPlay() {
    try {
      await audio.play();
      setState(true);
    } catch {
      // First gesture didn't unlock it; user can still tap the toggle.
    }
  }

  // expose so the envelope intro can start music on its open gesture
  window.__startMusic = tryPlay;

  // Try immediately (will succeed in Safari iOS sometimes, fail in Chrome).
  tryPlay();

  // On the very first user gesture, start music.
  function firstGesture() {
    cleanup();
    if (!playing) tryPlay();
  }
  function cleanup() {
    ["pointerdown", "keydown", "touchstart", "scroll"].forEach(ev =>
      window.removeEventListener(ev, firstGesture, true)
    );
  }
  ["pointerdown", "keydown", "touchstart", "scroll"].forEach(ev =>
    window.addEventListener(ev, firstGesture, { capture: true, once: false, passive: true })
  );

  // Manual toggle (always works).
  btn.addEventListener("click", async e => {
    e.stopPropagation();
    if (!playing) {
      try {
        await audio.play();
        setState(true);
      } catch {
        showToast("Music unavailable");
      }
    } else {
      audio.pause();
      setState(false);
    }
  });
})();

/* ---------- 9. On-scroll reveal ---------- */
(function scrollReveal() {
  const obs = new IntersectionObserver(
    entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add("in-view");
          obs.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach(el => obs.observe(el));
})();

/* ---------- 10. Details roll-up accordion ---------- */
(function accordion() {
  const items = Array.from(document.querySelectorAll(".acc-item"));
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector(".acc-trigger");
    trigger.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      // single-open: collapse everything first
      items.forEach(i => {
        i.classList.remove("open");
        i.querySelector(".acc-trigger").setAttribute("aria-expanded", "false");
      });
      // then expand the clicked one if it had been closed
      if (!wasOpen) {
        item.classList.add("open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });
})();
