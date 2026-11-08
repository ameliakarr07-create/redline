const artworks = [
  { id: '01', title: 'The Redline Logo', category: 'symbol', label: 'OFFICIAL-STYLE LOGO · BRAND MARK', file: 'redline-logo.svg', image: 'assets/redline-logo.svg', description: 'The signature Redline mark takes center stage: glossy pink lettering, a crimson splash, a little heart, and the teddy-bear mascot. This is the archive’s featured image.' },
  { id: '02', title: 'Character Card', category: 'portrait', label: 'CHARACTER · PORTRAIT CARD', file: 'character-card.svg', image: 'assets/character-card.svg', description: 'A portrait-card interpretation of the pink-haired character, her black bear companion, and the playful, unsettling sticker-card aesthetic.' },
  { id: '03', title: 'After Class', category: 'scene', label: 'SCENE · CLASSROOM', file: 'classroom-scene.svg', image: 'assets/classroom-scene.svg', description: 'A classroom scene built around the character, her teddy companion, and the warm late-day light of the supplied reference.' },
  { id: '04', title: 'The Story Isn’t Over', category: 'scene', label: 'BANNER · STORY ART', file: 'redline-banner.svg', image: 'assets/redline-banner.svg', description: 'A wide story-banner composition pairing the Redline wordmark with a character portrait against a dark chalkboard atmosphere.' }
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
    <article class="art-card${art.id === '01' ? ' featured-card' : ''}" tabindex="0" role="button" aria-label="View details for ${art.title}" data-id="${art.id}">
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
