const bibtex = document.querySelector('#bibtex');
const copyButton = document.querySelector('#copy-bib');
const copyFeedback = document.querySelector('#copy-feedback');

copyButton?.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(bibtex.textContent.trim());
    copyFeedback.textContent = 'BibTeX copied to clipboard.';
  } catch {
    copyFeedback.textContent = 'Select the BibTeX block to copy it.';
  }
  window.setTimeout(() => { copyFeedback.textContent = ''; }, 2400);
});

document.querySelectorAll('[data-video-slot]').forEach((slot) => {
  slot.addEventListener('click', () => {
    if (slot.dataset.videoSlot === 'main') return;
    slot.classList.toggle('is-selected');
  });
});

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('.carousel-track');
  const previous = carousel.querySelector('[data-carousel-prev]');
  const next = carousel.querySelector('[data-carousel-next]');
  if (!track || !previous || !next) return;
  const updateButtons = () => {
    previous.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  };
  previous.addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * 0.86, behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: track.clientWidth * 0.86, behavior: 'smooth' }));
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
});
