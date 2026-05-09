import { podcasts, genres } from './data.js';

class PodcastApp {
  constructor() {
    this.podcasts = podcasts;
    this.genres = genres;
    this.filteredPodcasts = [...this.podcasts];
    this.genreSelect = document.getElementById('genreFilter');
    this.gridContainer = document.getElementById('podcastGrid');
    this.modal = document.getElementById('podcastModal');
    this.modalBody = document.getElementById('modalBody');
    this.closeBtn = document.getElementById('closeModal');

    this.init();
  }

  init() {
    this.populateGenres();
    this.renderPodcasts();
    this.addEventListeners();
  }

  populateGenres() {
    this.genres.forEach((genre) => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.title;
      this.genreSelect.appendChild(option);
    });
  }

  renderPodcasts() {
    this.gridContainer.innerHTML = '';
    this.filteredPodcasts.forEach((podcast) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.id = podcast.id;
      card.innerHTML = `
        <img src="${podcast.image}" alt="${podcast.title} Cover Image" />
        <div class="card-body">
          <div class="card-title">${podcast.title}</div>
          <div class="card-details">
            Seasons: ${podcast.seasons} <br/>
            Genres: ${this.getGenreNames(podcast.genres).join(', ')} <br/>
            Last Updated: ${new Date(podcast.updated).toLocaleDateString()}
          </div>
        </div>
      `;
      this.gridContainer.appendChild(card);
    });
  }

  getGenreNames(genreIds) {
    return this.genres
      .filter((g) => genreIds.includes(g.id))
      .map((g) => g.title);
  }

  addEventListeners() {
    // Filter change
    this.genreSelect.addEventListener('change', (e) => {
      this.filterPodcasts(e.target.value);
    });

    // Open modal on card click
    this.gridContainer.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (card) {
        const id = card.dataset.id;
        this.openModal(id);
      }
    });

    // Close modal
    this.closeBtn.addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.getAttribute('aria-hidden') === 'false') {
        this.closeModal();
      }
    });
  }

  filterPodcasts(genreId) {
    if (genreId === 'all') {
      this.filteredPodcasts = [...this.podcasts];
    } else {
      this.filteredPodcasts = this.podcasts.filter(p => p.genres.includes(parseInt(genreId)));
    }
    this.renderPodcasts();
  }

  openModal(id) {
    const podcast = this.podcasts.find(p => p.id === id);
    if (!podcast) return;

    const genreNames = this.getGenreNames(podcast.genres);
    const seasons = this.getSeasonsForPodcast(id);

    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.style.display = 'flex';

    this.modalBody.innerHTML = `
      <h2>${podcast.title}</h2>
      <img src="${podcast.image}" alt="${podcast.title} Cover Image" style="width:100%; max-height:300px; object-fit:cover; margin-bottom:1rem;" />
      <p>${podcast.description}</p>
      <p><strong>Genres:</strong> ${genreNames.join(', ')}</p>
      <p><strong>Last Updated:</strong> ${new Date(podcast.updated).toLocaleDateString()}</p>
      <h3>Seasons</h3>
      <ul>
        ${seasons.map(s => `<li><strong>${s.title}</strong>: ${s.episodes} episodes</li>`).join('')}
      </ul>
    `;
  }

  getSeasonsForPodcast(podcastId) {
    const seasonData = seasons.find(s => s.id === podcastId);
    if (seasonData) {
      return seasonData.seasonDetails;
    }
    return [];
  }

  closeModal() {
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.style.display = 'none';
  }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  new PodcastApp();
});