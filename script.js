let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const slideNumber = document.getElementById('slideNumber');

// Show slide function
function showSlide(n) {
    if (n >= totalSlides) {
        currentSlide = 0;
    } else if (n < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = n;
    }

    slides.forEach(slide => {
        slide.classList.remove('active');
    });

    slides[currentSlide].classList.add('active');
    slideNumber.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

// Next slide
function nextSlide() {
    showSlide(currentSlide + 1);
}

// Previous slide
function prevSlide() {
    showSlide(currentSlide - 1);
}

// Button event listeners
nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
    }
});

// Fullscreen toggle
fullscreenBtn.addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenBtn.textContent = '⛶';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fullscreenBtn.textContent = '⛶';
        }
    }
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        prevSlide();
    }
}

// Initialize
showSlide(0);

