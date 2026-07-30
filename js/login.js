/**
 * ==========================
 * CHECK - INICIO DE SESIÓN
 * ==========================
 * Maneja:
 * - Validación de campos
 * - Autenticación (localStorage / simulación)
 * - Redirección a la página principal
 * - Mensajes de error
 */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. ELEMENTOS DEL DOM
    // ============================================
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    // ============================================
    // 2. SI EL USUARIO YA ESTÁ LOGUEADO, REDIRIGIR
    // ============================================
    const usuarioLogueado = localStorage.getItem('usuarioLogueado');
    if (usuarioLogueado) {
        window.location.href = 'index.html';
    }

    // ============================================
    // 3. MANEJAR EL ENVÍO DEL FORMULARIO
    // ============================================
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener valores
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Limpiar mensaje de error anterior
        errorMessage.classList.remove('show');

        // ============================================
        // 4. VALIDACIÓN DE CAMPOS
        // ============================================
        if (!username || !password) {
            mostrarError('❌ Por favor, completa todos los campos.');
            return;
        }

        // ============================================
        // 5. SIMULACIÓN DE AUTENTICACIÓN
        // ============================================
        // Aquí iría la llamada a tu backend real (fetch a /login)
        // Por ahora, simulamos con localStorage

        const usuarios = JSON.parse(localStorage.getItem('usuariosDB')) || [];

        // Buscar usuario por username o email
        const usuarioEncontrado = usuarios.find(user => 
            (user.username === username || user.email === username) && 
            user.password === password
        );

        if (usuarioEncontrado) {
            // Guardar usuario en localStorage (sesión activa)
            localStorage.setItem('usuarioLogueado', usuarioEncontrado.username);
            
            // Redirigir a la página principal
            window.location.href = 'index.html';
        } else {
            // Si no existe usuario con esas credenciales
            mostrarError('❌ Usuario o contraseña incorrectos.');
        }

        // ============================================
        // 6. (OPCIONAL) INTEGRACIÓN CON BACKEND REAL
        // ============================================
        /*
        // Si tienes un servidor Node.js corriendo:
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: username,
                contraseña: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('usuarioLogueado', data.usuario.nombre_usuario);
                window.location.href = 'index.html';
            } else {
                mostrarError('❌ ' + data.mensaje);
            }
        })
        .catch(err => {
            mostrarError('❌ Error de conexión con el servidor.');
            console.error('Error:', err);
        });
        */
    });

    // ============================================
    // 7. FUNCIÓN PARA MOSTRAR ERRORES
    // ============================================
    function mostrarError(mensaje) {
        errorMessage.textContent = mensaje;
        errorMessage.classList.add('show');
    }

    // ============================================
    // 8. LIMPIAR ERROR AL ESCRIBIR
    // ============================================
    usernameInput.addEventListener('input', function() {
        errorMessage.classList.remove('show');
    });

    passwordInput.addEventListener('input', function() {
        errorMessage.classList.remove('show');
    });

    console.log('✅ CHECK - Login cargado correctamente');
});