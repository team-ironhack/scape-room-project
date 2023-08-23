
const likeButtons = document.querySelectorAll('.like-button');
const markButtons = document.querySelectorAll('.mark-button');
const doneButtons = document.querySelectorAll('.done-button');
const stars = document.querySelectorAll('.rating i.bi-star');
const starsRatingInput = document.querySelector('#stars-rating');
const commentContainers = document.querySelectorAll('.comment');



likeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const heartBtn = btn.querySelector('i')
    axios.post(`http://localhost:3000/likes/${btn.dataset.user}/${btn.dataset.id}`)
      .then(response => {
        if (response.data === 'DELETED') {
          heartBtn.classList.remove('bi-heart-fill')
          heartBtn.classList.add('bi-heart')

        } else {
          heartBtn.classList.remove('bi-heart')
          heartBtn.classList.add('bi-heart-fill')
          console.log('entro al else')
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
});

markButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const markBtn = btn.querySelector('i')
    axios.post(`http://localhost:3000/marks/${btn.dataset.user}/${btn.dataset.id}`)
      .then(response => {
        if (response.data === 'DELETED') {
          markBtn.classList.remove('bi-bookmark-fill')
          markBtn.classList.add('bi-bookmark')

        } else {
          markBtn.classList.remove('bi-bookmark')
          markBtn.classList.add('bi-bookmark-fill')
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
});

doneButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const doneBtn = btn.querySelector('i')
    axios.post(`http://localhost:3000/dones/${btn.dataset.user}/${btn.dataset.id}`)
      .then(response => {
        if (response.data === 'DELETED') {
          doneBtn.classList.remove('bi-check-circle-fill')
          doneBtn.classList.add('bi-check-circle')
        } else {
          doneBtn.classList.remove('bi-check-circle')
          doneBtn.classList.add('bi-check-circle-fill')
        }
      })
      .catch(err => {
        console.log(err)
      })
  })
});



stars.forEach((star, index) => {
  star.addEventListener('click', () => {
    for (let i = 0; i <= index; i++) {
      stars[i].classList.replace('bi-star', 'bi-star-fill');
    }
    for (let i = index + 1; i < stars.length; i++) {
      stars[i].classList.replace('bi-star-fill', 'bi-star');
    }
    starsRatingInput.value = index + 1;
  });
});



commentContainers.forEach(comment => {
  const starsContainer = comment.querySelector('.comment-stars');
  const starsRatingInput = comment.querySelector('.comment-rating');
  const stars = starsContainer.querySelectorAll('.bi-star');

  function initializeStars(value) {
    for (let i = 0; i < stars.length; i++) {
      if (i < value) {
        stars[i].classList.replace('bi-star', 'bi-star-fill');
      } else {
        stars[i].classList.replace('bi-star-fill', 'bi-star');
      }
    }
  }

  const initialRatingValue = parseInt(starsRatingInput.value);
  initializeStars(initialRatingValue);
});
