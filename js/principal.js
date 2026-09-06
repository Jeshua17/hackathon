document.addEventListener('DOMContentLoaded', () => {
  const userRole = localStorage.getItem('usuarioRol');
  const savedUserName = localStorage.getItem('userName');
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || '{}');

  const nombreMostrar = savedUserName || usuarioActivo.nombre;

  // Elementos DOM
  const adminSection = document.getElementById('seccion-admin');
  const btnIrAdmin = document.getElementById('btn-panel-admin');
  const userGreeting = document.getElementById('user-greeting');
  const navUserText = document.getElementById('user-name-display');
  const loginBtnNav = document.getElementById('btn-login-nav');
  const formInscripcion = document.getElementById('form-inscripcion');

  // Mostrar el usuario activo en la barra de navegación
  if (nombreMostrar) {
    if (userGreeting) userGreeting.textContent = `Hola, ${nombreMostrar}`;
    if (navUserText) {
      navUserText.textContent = `Hola, ${nombreMostrar}`;
      navUserText.style.display = 'inline-block';
    }
    if (loginBtnNav) loginBtnNav.style.display = 'none';
  } else {
    if (navUserText) navUserText.textContent = 'Invitado';
    if (loginBtnNav) loginBtnNav.style.display = 'inline-block';
  }

  // BOTÓN EXCLUSIVO PARA ADMINISTRADORES
  if (userRole === 'Admin') {
    if (adminSection) adminSection.style.display = 'block';
    if (btnIrAdmin) {
      btnIrAdmin.style.display = 'inline-block';
      btnIrAdmin.addEventListener('click', () => {
        window.location.href = 'admin.html';
      });
    }
  } else {
    if (adminSection) adminSection.style.display = 'none';
    if (btnIrAdmin) btnIrAdmin.style.display = 'none';
  }

  // PROCESAR INSCRIPCIÓN
  if (formInscripcion) {
    formInscripcion.addEventListener('submit', async (e) => {
      e.preventDefault();

      const datosParticipante = {
        nombre: document.getElementById('p-nombre')?.value.trim() || '',
        apellido: document.getElementById('p-apellido')?.value.trim() || '',
        correo: document.getElementById('p-correo')?.value.trim() || '',
        telefono: document.getElementById('p-telefono')?.value.trim() || '',
        actividad: document.getElementById('p-actividad')?.value || ''
      };

      if (!datosParticipante.nombre || !datosParticipante.apellido || 
          !datosParticipante.correo || !datosParticipante.actividad) {
        alert('Por favor, completa todos los campos requeridos para la inscripción.');
        return;
      }

      try {
        const respuesta = await fetch('http://localhost:3000/api/participantes/inscribir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosParticipante)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok && resultado.exito) {
          alert(resultado.mensaje || '¡Inscripción realizada correctamente!');
          formInscripcion.reset();
        } else {
          alert(resultado.mensaje || 'No se pudo realizar la inscripción.');
        }

      } catch (error) {
        console.error('Error al enviar la inscripción:', error);
        alert('No se pudo conectar con la base de datos. Inténtalo nuevamente.');
      }
    });
  }
});

function cerrarSesion() {
  localStorage.clear();
  window.location.href = 'login.html';
}