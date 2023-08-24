const images = [
    'buscador-img-1.jpg',
    'buscador-img-2.jpg',
    'buscador-img-3.jpg',
    'buscador-img-4.jpg',
];

function getRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    return `url(../images/${images[randomIndex]})`;
}

window.addEventListener('load', () => {
    const dynamicBackground = document.querySelector('.search-section');
    const randomImage = getRandomImage();
    dynamicBackground.style.backgroundImage = randomImage;
});
