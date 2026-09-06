document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  lightbox.id = 'lightbox';

  lightbox.innerHTML = `
    <span class="lightbox-close" id="lightbox-close">&times;</span>
    <img class="lightbox-content" id="lightbox-img" src="" alt="Vista ampliada">
  `;

  document.body.appendChild(lightbox);

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  const cards = document.querySelectorAll('.gallery-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-img');
      if (img) {
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
      }
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
    }
  });
});

async function cargarGaleria() {
  try {
    const respuesta = await fetch('http://localhost:3000/api/galeria');
    const fotos = await respuesta.json();

    const contenedor = document.querySelector('.gallery-container');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    fotos.forEach(foto => {
      const cardHTML = `
        <div class="gallery-card">
          <img src="${foto.imagen_url}" alt="${foto.titulo}" class="gallery-img">
          <div class="gallery-overlay">
            <div class="overlay-content">
              <span class="overlay-action">
                <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                VER FOTO
              </span>
              <h3 class="overlay-title">${foto.titulo}</h3>
              <span class="overlay-location">
                <svg class="icon-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                ${foto.lugar}, ${foto.ciudad}
              </span>
            </div>
          </div>
        </div>
      `;
      contenedor.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error('Error al cargar la galería:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarGaleria);