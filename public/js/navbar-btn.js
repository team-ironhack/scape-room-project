document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelectorAll('.nav-btn'); 

    const currentUrl = window.location.pathname;
    
    navBtns.forEach((btn) => {
      if (btn.getAttribute('href') === currentUrl) {
        btn.classList.add('navbar-active'); 
      }
    });
  });
  