const actividadesDB = {
  copafutbol: {
    title: "COPA COMUNITARIA FUTBOL",
    category: "FUTBOL",
    fecha: "SÁB 15 AGO",
    lugar: "COLEGIO CALASANZ",
    cupos: "18 cupos",
    duracion: "7AM",
    nivel: "Todos los niveles",
    requisitos: "Ropa cómoda y ganas de socializar",
    img: "https://images.unsplash.com/photo-1570498839593-e565b39455fc?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZnV0Ym9sJTIwY2FtcG98ZW58MHx8MHx8fDA%3D"
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const activityId = urlParams.get('id') || 'copafutbol';
  
  const data = actividadesDB[activityId] || actividadesDB['copafutbol'];

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

  const formTitle = document.getElementById('form-title');
  const formCatBadge = document.getElementById('form-category-badge');
  const formFecha = document.getElementById('form-summary-fecha');
  const formLugar = document.getElementById('form-summary-lugar');
  const formCupos = document.getElementById('form-summary-cupos');

  if (formTitle) formTitle.textContent = data.title;
  if (formCatBadge) formCatBadge.textContent = data.category;
  if (formFecha) formFecha.textContent = data.fecha;
  if (formLugar) formLugar.textContent = data.lugar;
  if (formCupos) formCupos.textContent = data.cupos;

  const successFecha = document.getElementById('success-fecha');
  const successLugar = document.getElementById('success-lugar');

  if (successFecha) successFecha.textContent = data.fecha;
  if (successLugar) successLugar.textContent = data.lugar;
});


window.expandToStep2 = function() {
  const container = document.getElementById('modal-container');
  if (container) {
    container.classList.add('step-2');
  }
};

window.closeModal = function() {
  window.location.href = 'principal.html';
};

window.handleFormSubmit = async function(event) {
  event.preventDefault();

  const form = event.target;

  const inputsTexto = form.querySelectorAll('input[type="text"]');
  const nombre = inputsTexto[0]?.value.trim() || '';
  const apellido = inputsTexto[1]?.value.trim() || '';
  const correo = form.querySelector('input[type="email"]')?.value.trim() || '';
  const telefono = form.querySelector('input[type="tel"]')?.value.trim() || '';

  const formTitle = document.getElementById('form-title');
  const detailTitle = document.getElementById('detail-title');
  const actividad = (formTitle?.textContent || detailTitle?.textContent || 'COPA COMUNITARIA FUTBOL').trim();

  try {
    // Se actualizó la URL al endpoint correcto expuesto por la API
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
      alert(datos.mensaje || 'Hubo un error al guardar la inscripción.');
      return;
    }

    const container = document.getElementById('modal-container');
    if (container) {
      container.classList.remove('step-2');
      container.classList.add('step-success');
    }

  } catch (error) {
    console.error('Error al conectar con el servidor:', error);
    alert('No se pudo conectar con el servidor. Verifica que Node.js esté en ejecución.');
  }
};

window.goToHome = function() {
  window.location.href = 'principal.html';
};