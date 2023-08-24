const navBtns = document.querySelectorAll('.nav-btn');
let activeBtn = null; 
navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        // Si hay un botón activo previo, quitar la clase
        if (activeBtn) {
            activeBtn.classList.remove('navbar-active');
        }

        // Agregar la clase 'navbar-active' al botón clicado
        btn.classList.add('navbar-active');

        // Actualizar el botón activo con el nuevo botón clicado
        activeBtn = btn;
    });
});





