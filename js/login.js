document.addEventListener('DOMContentLoaded', () => {
  // Elementos principales
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.querySelector('form#form-register');
  const closeBtn = document.getElementById('close-modal-btn');

  /* ==========================================
     1. CAMBIO DE PESTAÑAS (LOGIN / REGISTRO)
     ========================================== */
  function showLogin(e) {
    if (e) e.preventDefault();
    if (tabLogin) tabLogin.classList.add('active');
    if (tabRegister) tabRegister.classList.remove('active');

    if (formLogin) formLogin.classList.add('active');
    if (formRegister) formRegister.classList.remove('active');
  }

  function showRegister(e) {
    if (e) e.preventDefault();
    if (tabRegister) tabRegister.classList.add('active');
    if (tabLogin) tabLogin.classList.remove('active');

    if (formRegister) formRegister.classList.add('active');
    if (formLogin) formLogin.classList.remove('active');
  }

  if (tabLogin) tabLogin.addEventListener('click', showLogin);
  if (tabRegister) tabRegister.addEventListener('click', showRegister);

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      window.location.href = 'principal.html';
    });
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('action') === 'register') {
    showRegister();
  } else {
    showLogin();
  }

  /* ==========================================
     2. MOSTRAR / OCULTAR CONTRASEÑA
     ========================================== */
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
      }
    });
  });

  /* ==========================================
     3. PROCESAR INICIO DE SESIÓN
     ========================================== */
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Captura directa de los campos del login
      const inputCorreo = formLogin.querySelector('input[type="email"]');
      const inputPassword = formLogin.querySelector('input[type="password"]') || formLogin.querySelector('.input-password-wrapper input');

      const correo = inputCorreo ? inputCorreo.value.trim() : '';
      const password = inputPassword ? inputPassword.value.trim() : '';

      if (!correo || !password) {
        alert('Por favor ingresa tu correo y contraseña.');
        return;
      }

      try {
        const respuesta = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, password })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.exito) {
          alert(datos.mensaje || 'Error al iniciar sesión.');
          return;
        }

        alert(`¡Bienvenido/a ${datos.usuario.nombre} (${datos.usuario.rol})!`);

        localStorage.setItem('usuarioActivo', JSON.stringify(datos.usuario));
        localStorage.setItem('userName', datos.usuario.nombre);
        localStorage.setItem('usuarioRol', datos.usuario.rol || 'Usuario');

        window.location.href = 'principal.html';

      } catch (error) {
        console.error('Error en login:', error);
        alert('No se pudo conectar con el servidor.');
      }
    });
  }

  /* ==========================================
     4. PROCESAR REGISTRO DE CUENTA
     ========================================== */
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();

      const inputsTexto = formRegister.querySelectorAll('input[type="text"]');
      const nombre = inputsTexto[0]?.value.trim() || '';
      const apellido = inputsTexto[1]?.value.trim() || '';
      const correo = formRegister.querySelector('input[type="email"]')?.value.trim() || '';
      const selectCiudad = formRegister.querySelector('select');
      const ciudad = selectCiudad ? selectCiudad.value : '';
      const passwordInput = formRegister.querySelector('input[type="password"]');
      const password = passwordInput ? passwordInput.value : '';

      const checkboxes = formRegister.querySelectorAll('input[name="activity"]:checked');
      const actividades = Array.from(checkboxes).map(cb => cb.value);

      if (!nombre || !apellido || !correo || !ciudad || !password) {
        alert('Por favor, completa todos los campos del formulario.');
        return;
      }

      try {
        const respuesta = await fetch('http://localhost:3000/api/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre,
            apellido,
            correo,
            ciudad,
            password,
            actividades
          })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok || !datos.exito) {
          alert(datos.mensaje || 'Error al crear la cuenta.');
          return;
        }

        alert('¡Cuenta creada con éxito!');

        const usuarioSesion = {
          nombre: nombre,
          apellido: apellido,
          correo: correo,
          rol: 'Usuario'
        };

        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSesion));
        localStorage.setItem('userName', nombre);
        localStorage.setItem('usuarioRol', 'Usuario');

        window.location.href = 'principal.html';

      } catch (error) {
        console.error('Error al registrar cuenta:', error);
        alert('Error de conexión con el servidor al intentar registrarte.');
      }
    });
  }
});