document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('#activities-grid .card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-category');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'todos' || cardCategory === category) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
});