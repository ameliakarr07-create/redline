const artworks = [
  { id: '01', title: 'Velvet Vow', category: 'portrait', label: 'PORTRAIT · ORIGINAL CONCEPT', file: 'velvet-vow.svg', image: 'assets/velvet-vow.svg', description: 'A quiet promise beneath a watchful red moon. Velvet Vow is an original portrait study in devotion, distance, and the line between them.' },
  { id: '02', title: 'Crimson Hour', category: 'scene', label: 'SCENE · ORIGINAL CONCEPT', file: 'crimson-hour.svg', image: 'assets/crimson-hour.svg', description: 'The school corridors empty at dusk, but not every shadow has gone home. A cinematic scene study in deep reds and late-night stillness.' },
  { id: '03', title: 'Only Yours', category: 'portrait', label: 'PORTRAIT · ORIGINAL CONCEPT', file: 'only-yours.svg', image: 'assets/only-yours.svg', description: 'A soft gaze, a sharp contrast. This stylized character portrait pairs delicate rose details with the darker edge of an all-consuming crush.' },
  { id: '04', title: 'Red Thread', category: 'symbol', label: 'SYMBOL · ORIGINAL CONCEPT', file: 'red-thread.svg', image: 'assets/red-thread.svg', description: 'An abstract emblem inspired by the idea of an unbreakable bond: a single crimson thread winding its way through the dark.' }
];

const grid = document.querySelector('#gallery-grid');
const search = document.querySelector('#search');
const emptyState = document.querySelector('#empty-state');
const modal = document.querySelector('#art-modal');
let activeFilter = 'all';

function renderGallery() {
  const query = search.value.trim().toLowerCase();
  const filtered = artworks.filter((art) => {
    const matchesCategory = activeFilter === 'all' || art.category === activeFilter;
    const matchesSearch = `${art.title} ${art.label} ${art.description}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  grid.innerHTML = filtered.map((art) => `
    <article class="art-card" tabindex="0" role="button" aria-label="View details for ${art.title}" data-id="${art.id}">
      <div class="card-image"><img src="${art.image}" alt="${art.title}, ${art.label.toLowerCase()}" loading="lazy"><span class="card-number">FILE / ${art.id}</span><span class="card-overlay"></span><span class="view-mark" aria-hidden="true">↗</span></div>
      <div class="card-info"><div><h3>${art.title}</h3><p>${art.label}</p></div><a class="card-download" href="${art.image}" download="${art.file}" aria-label="Download ${art.title}" title="Download ${art.title}">↓</a></div>
    </article>`).join('');
  emptyState.hidden = filtered.length !== 0;
}

function openArtwork(id) {
  const art = artworks.find((item) => item.id === id);
  if (!art) return;
  document.querySelector('#modal-image').src = art.image;
  document.querySelector('#modal-image').alt = `${art.title} artwork`;
  document.querySelector('#modal-title').textContent = art.title;
  document.querySelector('#modal-category').textContent = `${art.id} / ${art.label}`;
  document.querySelector('#modal-description').textContent = art.description;
  document.querySelector('#modal-file').textContent = art.file;
  const download = document.querySelector('#download-link');
  download.href = art.image;
  download.download = art.file;
  modal.showModal();
}

document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active')?.classList.remove('active');
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    renderGallery();
  });
});
search.addEventListener('input', renderGallery);
grid.addEventListener('click', (event) => {
  if (event.target.closest('.card-download')) return;
  const card = event.target.closest('.art-card');
  if (card) openArtwork(card.dataset.id);
});
grid.addEventListener('keydown', (event) => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.art-card')) {
    event.preventDefault();
    openArtwork(event.target.dataset.id);
  }
});
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) modal.close();
});
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  const isOpen = nav.classList.toggle('mobile-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => {
  document.querySelector('.main-nav').classList.remove('mobile-open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
renderGallery();
