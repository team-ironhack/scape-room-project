const roleBtns = document.querySelectorAll('.role-btn');
   const googleBtn = document.querySelector('.google-btn-container');
   const createAccount = document.getElementById('create-account');
   const spanWord = createAccount.querySelector('span');
   const anchorLink = createAccount.querySelector('a');
   const actionForm = document.querySelector('form');
   const email = document.getElementById('email');

   roleBtns.forEach((btn) => {
    console.log('entra')
    btn.addEventListener('click', (event) => {
      const clickedBtn = event.currentTarget;
      if (!clickedBtn.classList.contains('active')) {
        clickedBtn.classList.add('active');
        if (clickedBtn.nextElementSibling) {
          clickedBtn.nextElementSibling.classList.remove('active');
          actionForm.action = '/login?type=player';
          email.value = ' ';
          email.classList.remove('is-invalid')
        } else {
          clickedBtn.previousElementSibling.classList.remove('active');
          actionForm.action = '/login?type=company';
          email.value = ' ';
          email.classList.remove('is-invalid')
        }

        if (clickedBtn.innerText === 'Soy empresa') {
          googleBtn.classList.add('hidden');
          spanWord.innerText = 'empresa';
          anchorLink.href = '/register-company'
        } else {
          googleBtn.classList.remove('hidden');
          spanWord.innerText = 'jugador';
          anchorLink.href = '/register-player'
        }
      }
    })
   })