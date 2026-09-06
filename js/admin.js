document.addEventListener('DOMContentLoaded', () => {
  const userRole = localStorage.getItem('usuarioRol');

  // Verificar que sea cuenta administrador
  if (userRole !== 'Admin') {
    alert('No tienes permisos para acceder a esta sección.');
    window.location.href = 'principal.html';
    return;
  }

  cargarInscripciones();
});

async function cargarInscripciones() {
  const userRole = localStorage.getItem('usuarioRol');
  const tablaCuerpo = document.getElementById('tabla-inscripciones-body');

  if (!tablaCuerpo) return;

  try {
    const respuesta = await fetch('http://localhost:3000/api/admin/participantes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': userRole || ''
      }
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok || !resultado.exito) {
      alert(resultado.mensaje || 'Error al obtener las inscripciones.');
      tablaCuerpo.innerHTML = `<tr><td colspan="7" style="text-align:center;">Error al cargar datos.</td></tr>`;
      return;
    }

    tablaCuerpo.innerHTML = '';

    if (!resultado.participantes || resultado.participantes.length === 0) {
      tablaCuerpo.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay inscripciones registradas.</td></tr>`;
      return;
    }

    resultado.participantes.forEach(p => {
      const fecha = p.fecha_inscripcion ? new Date(p.fecha_inscripcion).toLocaleDateString('es-ES') : 'N/A';
      const fila = document.createElement('tr');

      fila.innerHTML = `
        <td>#${p.id_inscripcion || p.id || '—'}</td>
        <td>${p.nombre || ''} ${p.apellido || ''}</td>
        <td>${p.correo || '—'}</td>
        <td>${p.telefono || '—'}</td>
        <td>${p.actividad || '—'}</td>
        <td>${fecha}</td>
        <td>
          <button class="btn-delete" onclick="eliminarInscripcion(${p.id_inscripcion || p.id}, '${p.nombre || 'Participante'}')">
            Eliminar
          </button>
        </td>
      `;

      tablaCuerpo.appendChild(fila);
    });

  } catch (error) {
    console.error('Error al cargar inscripciones:', error);
    tablaCuerpo.innerHTML = `<tr><td colspan="7" style="text-align:center;">No se pudo conectar con el servidor.</td></tr>`;
  }
}

async function eliminarInscripcion(id, nombre) {
  const userRole = localStorage.getItem('usuarioRol');

  const confirmacion = confirm(`¿Deseas eliminar la inscripción de ${nombre}?`);
  if (!confirmacion) return;

  try {
    const respuesta = await fetch(`http://localhost:3000/api/admin/participantes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-role': userRole || ''
      }
    });

    const resultado = await respuesta.json();

    if (respuesta.ok && resultado.exito) {
      alert('Inscripción eliminada correctamente.');
      cargarInscripciones();
    } else {
      alert(resultado.mensaje || 'No se pudo eliminar la inscripción.');
    }

  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('Error al conectar con la base de datos.');
  }
}