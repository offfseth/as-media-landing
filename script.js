const revealItems = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("revealed");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const captureForm = document.querySelector(".email-capture");
const feedback = document.querySelector(".form-feedback");

if (captureForm && feedback) {
  captureForm.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent = "Thanks. We will send the checklist to your inbox shortly.";
    captureForm.reset();
  });
}

const pricingButtons = document.querySelectorAll("[data-billing]");
const pricingCards = document.querySelectorAll(".price-card");

function setBilling(mode) {
  pricingButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.billing === mode);
    button.setAttribute("aria-selected", String(button.dataset.billing === mode));
  });

  pricingCards.forEach((card) => {
    const amount = card.querySelector(".amount");
    const note = card.querySelector(".billing-note");
    if (!amount || !note) return;

    amount.textContent = card.dataset[mode] || amount.textContent;
    note.textContent =
      mode === "monthly"
        ? card.dataset.noteMonthly || note.textContent
        : card.dataset.noteYearly || note.textContent;
  });
}

pricingButtons.forEach((button) => {
  button.addEventListener("click", () => setBilling(button.dataset.billing));
});

setBilling("monthly");

const testimonialCards = Array.from(document.querySelectorAll(".quote"));
const dotButtons = Array.from(document.querySelectorAll("[data-quote-dot]"));
let activeQuote = 0;

function showQuote(index) {
  activeQuote = (index + testimonialCards.length) % testimonialCards.length;

  testimonialCards.forEach((card, cardIndex) => {
    card.classList.toggle("active", cardIndex === activeQuote);
  });

  dotButtons.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeQuote);
    dot.setAttribute("aria-selected", String(dotIndex === activeQuote));
  });
}

dotButtons.forEach((dot, index) => {
  dot.addEventListener("click", () => showQuote(index));
});

if (testimonialCards.length > 0) {
  showQuote(0);
  setInterval(() => showQuote(activeQuote + 1), 6500);
}

const reelTrack = document.querySelector("[data-reel-track]");
const reelPrev = document.querySelector("#reelsPrev");
const reelNext = document.querySelector("#reelsNext");
let reelIndex = 0;

function slidesPerView() {
  if (window.innerWidth <= 620) return 1;
  if (window.innerWidth <= 1080) return 2;
  return 3;
}

function updateReelSlider() {
  if (!reelTrack) return;

  const slides = reelTrack.querySelectorAll(".reel-slide");
  if (slides.length === 0) return;

  const computed = getComputedStyle(reelTrack);
  const gap = parseFloat(computed.gap) || 0;
  const slideWidth = slides[0].getBoundingClientRect().width + gap;
  const maxIndex = Math.max(0, slides.length - slidesPerView());

  reelIndex = Math.min(Math.max(0, reelIndex), maxIndex);
  reelTrack.style.transform = `translateX(-${reelIndex * slideWidth}px)`;

  if (reelPrev) reelPrev.disabled = reelIndex === 0;
  if (reelNext) reelNext.disabled = reelIndex === maxIndex;
}

if (reelPrev && reelNext) {
  reelPrev.addEventListener("click", () => {
    reelIndex -= 1;
    updateReelSlider();
  });

  reelNext.addEventListener("click", () => {
    reelIndex += 1;
    updateReelSlider();
  });
}

window.addEventListener("resize", updateReelSlider);
window.addEventListener("load", updateReelSlider);
