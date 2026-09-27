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
