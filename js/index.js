/**
 * ==========================
 * CHECK - PÁGINA PRINCIPAL
 * ==========================
 * Maneja:
 * - Mostrar el nombre del usuario logueado
 * - Cerrar sesión
 * - Filtros interactivos (Todos, Eventos, Misiones, Comunidad)
 * - Navegación a perfil, eventos, etc.
 */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. MOSTRAR USUARIO LOGUEADO
    // ============================================
    const usuario = localStorage.getItem('usuarioLogueado');
    const nombreSpan = document.getElementById('nombre-usuario');
    const avatar = document.querySelector('.avatar');

    if (usuario) {
        nombreSpan.textContent = usuario;
        // Mostrar iniciales en el avatar
        const iniciales = usuario.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
        avatar.textContent = iniciales || 'U';
    } else {
        nombreSpan.textContent = 'Invitado';
        avatar.textContent = 'U';
    }

    // ============================================
    // 2. CERRAR SESIÓN
    // ============================================
    const logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('usuarioLogueado');
            window.location.href = 'login.html';
        });
    }

    // ============================================
    // 3. FILTROS INTERACTIVOS
    // ============================================
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remover clase 'active' de todos los filtros
            tags.forEach(t => t.classList.remove('active'));
            // Agregar 'active' al filtro seleccionado
            this.classList.add('active');

            // Aquí puedes agregar lógica para filtrar contenido
            const filtro = this.textContent.trim();
            console.log(`Filtro seleccionado: ${filtro}`);
            // Ejemplo: mostrar un mensaje según el filtro
            // alert(`Mostrando: ${filtro}`);
        });
    });

    // ============================================
    // 4. MENÚ HAMBURGUESA (toggle - opcional)
    // ============================================
    const menuHamburger = document.querySelector('.menu-hamburger');
    const navRight = document.querySelector('.nav-right');

    if (menuHamburger) {
        menuHamburger.addEventListener('click', function() {
            navRight.classList.toggle('nav-right-open');
            // Puedes agregar una clase para mostrar/ocultar el menú en móvil
            // con CSS: .nav-right { display: flex; } y .nav-right-open { display: flex; flex-wrap: wrap; }
        });
    }

    // ============================================
    // 5. BÚSQUEDA (ejemplo básico)
    // ============================================
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const busqueda = this.value.trim();
                if (busqueda) {
                    console.log(`Buscando: ${busqueda}`);
                    // Aquí puedes implementar la búsqueda real
                    // alert(`Buscaste: ${busqueda}`);
                }
            }
        });
    }

    // ============================================
    // 6. TARJETAS INTERACTIVAS (check-box)
    // ============================================
    const checkBoxes = document.querySelectorAll('.check-box');
    checkBoxes.forEach(box => {
        box.addEventListener('click', function(e) {
            e.stopPropagation();
            // Alternar estado (ejemplo visual)
            if (this.textContent === '✓') {
                this.textContent = '✔';
                this.style.background = '#28a745';
                this.style.color = '#fff';
            } else {
                this.textContent = '✓';
                this.style.background = 'var(--check-white)';
                this.style.color = 'var(--check-blue)';
            }
            // Aquí puedes agregar lógica para marcar tarea completada
            const card = this.closest('.container-card');
            const titulo = card ? card.querySelector('.footer-text')?.textContent : 'Tarea';
            console.log(`Check-box toggled: ${titulo}`);
        });
    });

    // ============================================
    // 7. AVATAR / USUARIO - Redirigir a perfil
    // ============================================
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.addEventListener('click', function() {
            // Si tienes una página de perfil, redirige a ella
            // window.location.href = 'perfil.html';
            console.log('Ir a perfil de usuario');
            alert('Perfil de usuario (próximamente)');
        });
    }

    console.log('✅ CHECK - Página principal cargada correctamente');
});