document.addEventListener('DOMContentLoaded', () => {
  const formContacto = document.querySelector('form'); 

  if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
      e.preventDefault();

      const inputNombre = formContacto.querySelector('input[type="text"]:not([name="asunto"])') || formContacto.querySelectorAll('input[type="text"]')[0];
      const inputCorreo = formContacto.querySelector('input[type="email"]');
      const inputAsunto = formContacto.querySelector('input[name="asunto"]') || formContacto.querySelectorAll('input[type="text"]')[1];
      const inputMensaje = formContacto.querySelector('textarea');

      const nombre = inputNombre ? inputNombre.value.trim() : '';
      const correo = inputCorreo ? inputCorreo.value.trim() : '';
      const asunto = inputAsunto ? inputAsunto.value.trim() : '';
      const mensaje = inputMensaje ? inputMensaje.value.trim() : '';

      if (!nombre || !correo || !mensaje) {
        alert('Por favor llena los campos obligatorios (Nombre, Correo y Mensaje).');
        return;
      }

      try {
        const respuesta = await fetch('http://localhost:3000/api/contacto', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, correo, asunto, mensaje })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.exito) {
          alert(datos.mensaje || 'Hubo un error al enviar tu mensaje.');
          return;
        }

        alert(datos.mensaje);
        formContacto.reset();
      } catch (error) {
        console.error('Error de conexión:', error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }
});