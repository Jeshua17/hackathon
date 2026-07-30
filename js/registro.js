/**
 * ==========================
 * CHECK - REGISTRO DE USUARIOS
 * ==========================
 * Maneja:
 * - Validación de campos
 * - Registro de nuevos usuarios (localStorage / simulación)
 * - Verificación de usuarios existentes
 * - Redirección al login
 * - Mensajes de éxito/error
 */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. ELEMENTOS DEL DOM
    // ============================================
    const registroForm = document.getElementById('registro-form');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageBox = document.getElementById('message-box');

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
    registroForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obtener valores
        const nombre = nombreInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Limpiar mensaje anterior
        ocultarMensaje();

        // ============================================
        // 4. VALIDACIÓN DE CAMPOS
        // ============================================
        if (!nombre || !email || !password) {
            mostrarMensaje('❌ Por favor, completa todos los campos.', 'error');
            return;
        }

        // ============================================
        // 5. VALIDACIÓN DE CONTRASEÑA
        // ============================================
        if (password.length < 4) {
            mostrarMensaje('❌ La contraseña debe tener al menos 4 caracteres.', 'error');
            return;
        }

        // ============================================
        // 6. VALIDACIÓN DE EMAIL (básica)
        // ============================================
        if (!email.includes('@') || !email.includes('.')) {
            mostrarMensaje('❌ Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }

        // ============================================
        // 7. SIMULACIÓN DE REGISTRO (localStorage)
        // ============================================
        // Aquí iría la llamada a tu backend real (fetch a /registro)
        // Por ahora, simulamos con localStorage

        let usuarios = JSON.parse(localStorage.getItem('usuariosDB')) || [];

        // Verificar si el usuario o correo ya existe
        const usuarioExistente = usuarios.find(user => 
            user.username === nombre || user.email === email
        );

        if (usuarioExistente) {
            mostrarMensaje('❌ Este usuario o correo ya está registrado.', 'error');
            return;
        }

        // Crear nuevo usuario
        const nuevoUsuario = {
            username: nombre,
            email: email,
            password: password,
            fechaRegistro: new Date().toISOString()
        };

        // Guardar en la "base de datos" simulada
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuariosDB', JSON.stringify(usuarios));

        // Mostrar mensaje de éxito
        mostrarMensaje('✅ ¡Registro exitoso! Redirigiendo al login...', 'success');

        // Deshabilitar el botón para evitar doble envío
        const btnSubmit = document.querySelector('.btn-submit');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Registrando...';

        // ============================================
        // 8. REDIRIGIR AL LOGIN DESPUÉS DE 2 SEGUNDOS
        // ============================================
        setTimeout(function() {
            window.location.href = 'login.html';
        }, 2000);

        // ============================================
        // 9. (OPCIONAL) INTEGRACIÓN CON BACKEND REAL
        // ============================================
        /*
        fetch('http://localhost:3001/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre_usuario: nombre,
                correo: email,
                contraseña: password
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                mostrarMensaje('✅ ¡Registro exitoso! Redirigiendo al login...', 'success');
                const btnSubmit = document.querySelector('.btn-submit');
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Registrando...';
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                mostrarMensaje('❌ ' + data.mensaje, 'error');
            }
        })
        .catch(err => {
            mostrarMensaje('❌ Error de conexión con el servidor.', 'error');
            console.error('Error:', err);
        });
        */
    });

    // ============================================
    // 10. FUNCIONES PARA MENSAJES
    // ============================================
    function mostrarMensaje(texto, tipo) {
        messageBox.textContent = texto;
        messageBox.className = 'message-box ' + tipo;
        messageBox.style.display = 'block';
    }

    function ocultarMensaje() {
        messageBox.className = 'message-box';
        messageBox.style.display = 'none';
    }

    // ============================================
    // 11. LIMPIAR MENSAJES AL ESCRIBIR
    // ============================================
    nombreInput.addEventListener('input', ocultarMensaje);
    emailInput.addEventListener('input', ocultarMensaje);
    passwordInput.addEventListener('input', ocultarMensaje);

    console.log('✅ CHECK - Registro cargado correctamente');
});