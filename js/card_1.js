const actividadesDB = {
  baloncesto: {
    title: "TORNEO DE BALONCESTO 3X3",
    category: "DEPORTE",
    fecha: "SÁB 2 AGO",
    lugar: "Cancha INATEC, León",
    cupos: "12 cupos",
    duracion: "3 – 4 horas",
    nivel: "Todos los niveles",
    requisitos: "Ropa cómoda y ganas de divertirse",
    img: "img/baloncesto.jpg"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id') || 'baloncesto';
  
  const data = actividadesDB[activityId] || actividadesDB['baloncesto'];

  const titleEl = document.getElementById('detail-title');
  const catEl = document.getElementById('detail-category');
  const fechaEl = document.getElementById('detail-fecha');
  const lugarEl = document.getElementById('detail-lugar');
  const cuposEl = document.getElementById('detail-cupos');
  const duracionEl = document.getElementById('detail-duracion');
  const nivelEl = document.getElementById('detail-nivel');
  const reqEl = document.getElementById('detail-requisitos');
  const imgEl = document.getElementById('detail-img');

  if (titleEl) titleEl.textContent = data.title;
  if (catEl) catEl.textContent = data.category;
  if (fechaEl) fechaEl.textContent = data.fecha;
  if (lugarEl) lugarEl.textContent = data.lugar;
  if (cuposEl) cuposEl.textContent = data.cupos;
  if (duracionEl) duracionEl.textContent = data.duracion;
  if (nivelEl) nivelEl.textContent = data.nivel;
  if (reqEl) reqEl.textContent = data.requisitos;
  if (imgEl) imgEl.src = data.img;
});


window.expandToStep2 = function() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.classList.add('step-2');
  }
};

window.closeModal = function() {
  const container = document.getElementById('modal-container');
  const overlay = document.getElementById('modal-overlay');
  
  if (container) {
    container.classList.remove('step-2', 'step-success');
  }
  if (overlay) {
    overlay.style.display = 'none';
  }
};


window.handleFormSubmit = async function(event) {
  event.preventDefault(); 

  const form = event.target;

  const inputsTexto = form.querySelectorAll('input[type="text"]');
  const nombre = inputsTexto[0]?.value.trim() || '';
  const apellido = inputsTexto[1]?.value.trim() || '';
  const correo = form.querySelector('input[type="email"]')?.value.trim() || '';
  const telefono = form.querySelector('input[type="tel"]')?.value.trim() || '';

  const actividadElement = document.querySelector('.modal-step-form .modal-title') || document.getElementById('detail-title');
  const actividad = actividadElement ? actividadElement.innerText.trim() : 'TORNEO DE BALONCESTO 3X3';

  try {
    // Se corrigió el endpoint a /api/participantes/inscribir que es el expuesto por tu backend
    const respuesta = await fetch('http://localhost:3000/api/participantes/inscribir', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre,
        apellido,
        correo,
        telefono,
        actividad
      })
    });

    const datos = await respuesta.json();

    if (!respuesta.ok || !datos.exito) {
      alert(datos.mensaje || 'Hubo un error al procesar tu inscripción.');
      return;
    }
    const container = document.getElementById('modal-container');
    if (container) {
      container.classList.remove('step-2');
      container.classList.add('step-success');
    }

  } catch (error) {
    console.error('Error de conexión con el servidor:', error);
    alert('No se pudo conectar con el servidor. Verifica que Node.js esté activo.');
  }
};

window.goToHome = function() {
  window.location.href = 'principal.html';
};