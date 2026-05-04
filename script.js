// ── Header scroll state ──────────────────────────────
const header = document.getElementById("site-header");

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 40);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// ── Mobile menu ──────────────────────────────────────
const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menu-close");
const mobileOverlay = document.getElementById("mobile-overlay");

function openMenu() {
  mobileOverlay.classList.add("open");
  mobileOverlay.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  mobileOverlay.classList.remove("open");
  mobileOverlay.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

menuToggle?.addEventListener("click", openMenu);
menuClose?.addEventListener("click", closeMenu);
mobileOverlay?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", closeMenu)
);

// ── Scroll reveal ────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ── Reel carousel ────────────────────────────────────
const reelTrack = document.getElementById("reels-track");
const reelPrev = document.getElementById("reelPrev");
const reelNext = document.getElementById("reelNext");
const reelsNav = document.getElementById("reels-nav");
let reelIndex = 0;

function visibleReels() {
  if (window.innerWidth <= 540) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function updateReels() {
  if (!reelTrack) return;
  const slides = reelTrack.querySelectorAll(".reel-item");
  if (!slides.length) return;

  const gap = 20;
  const slideW = slides[0].getBoundingClientRect().width + gap;
  const maxIndex = Math.max(0, slides.length - visibleReels());

  reelIndex = Math.min(Math.max(0, reelIndex), maxIndex);
  reelTrack.style.transform = `translateX(-${reelIndex * slideW}px)`;

  if (reelPrev) reelPrev.disabled = reelIndex === 0;
  if (reelNext) reelNext.disabled = reelIndex >= maxIndex;

  if (reelsNav) reelsNav.style.display = maxIndex > 0 ? "" : "none";
}

reelPrev?.addEventListener("click", () => { reelIndex--; updateReels(); });
reelNext?.addEventListener("click", () => { reelIndex++; updateReels(); });
window.addEventListener("resize", updateReels, { passive: true });
window.addEventListener("load", updateReels);

// ── Testimonials ─────────────────────────────────────
const testimonialCards = Array.from(document.querySelectorAll(".quote"));
const dotButtons = Array.from(document.querySelectorAll("[data-quote-dot]"));
let activeQuote = 0;
let testimonialPaused = false;

function showQuote(index) {
  activeQuote = (index + testimonialCards.length) % testimonialCards.length;

  testimonialCards.forEach((card, i) =>
    card.classList.toggle("active", i === activeQuote)
  );

  dotButtons.forEach((dot, i) => {
    dot.classList.toggle("active", i === activeQuote);
    dot.setAttribute("aria-selected", String(i === activeQuote));
  });
}

dotButtons.forEach((dot, i) => dot.addEventListener("click", () => showQuote(i)));

const testimonialWrap = document.querySelector("[data-testimonials]");
testimonialWrap?.addEventListener("mouseenter", () => { testimonialPaused = true; });
testimonialWrap?.addEventListener("mouseleave", () => { testimonialPaused = false; });
testimonialWrap?.addEventListener("focusin", () => { testimonialPaused = true; });
testimonialWrap?.addEventListener("focusout", () => { testimonialPaused = false; });

if (testimonialCards.length) {
  showQuote(0);
  setInterval(() => {
    if (!testimonialPaused) showQuote(activeQuote + 1);
  }, 6500);
}

// ── Contact form ─────────────────────────────────────
const form = document.querySelector(".email-capture");
const feedback = form?.querySelector(".form-feedback");

if (form && feedback) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString(),
      });
      feedback.textContent =
        "Thanks. A&S will review your inquiry and reply with availability, scope guidance, and a custom quote shortly.";
      form.reset();
    } catch {
      feedback.textContent =
        "Something went wrong — please email us directly at ascommercialmedia@gmail.com.";
    }
  });
}
