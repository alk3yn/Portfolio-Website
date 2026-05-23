// Enable smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Show or hide the scroll-to-top button based on scroll position
const scrollTopButton = document.getElementById('scrollTop');
if (scrollTopButton) {
    window.addEventListener('scroll', () => {
        scrollTopButton.classList.toggle('show', window.scrollY > 0);
    });
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Preload images used in the slideshow for smoother transitions
function preloadImages() {
    const images = document.querySelectorAll('.slide');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            const image = new Image();
            image.src = src;
        }
    });
}

// Run image preloading and loading screen logic when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    // Start the loading screen counter
    startLoadingScreenCounter();
});

// Handles slideshow functionality with shuffle, transitions, and pause-on-hover
function initializeSlideshow() {
    try {
        const slideContainers = Array.from(document.querySelectorAll('.slide-container'));
        let currentIndex = 0;
        const shuffleArray = (array) => {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        };
        let shuffledSlides = shuffleArray([...slideContainers]);
        const activateSlide = (index) => {
            shuffledSlides[index].querySelector('.background-slide').classList.add('active');
            shuffledSlides[index].querySelector('.slide').classList.add('active');
        };
        activateSlide(currentIndex);

        const transitionSlide = () => {
            const currentContainer = shuffledSlides[currentIndex];
            currentContainer.querySelector('.background-slide').classList.remove('active');
            currentContainer.querySelector('.slide').classList.remove('active');
            currentIndex = (currentIndex + 1) % shuffledSlides.length;
            const nextContainer = shuffledSlides[currentIndex];
            if (!nextContainer) {
                return;
            }

            const backgroundSlide = nextContainer.querySelector('.background-slide');
            const slide = nextContainer.querySelector('.slide');

            if (!backgroundSlide || !slide) {
                return;
            }
            backgroundSlide.classList.add('active');
            slide.classList.add('active');
        };
        let slideInterval = setInterval(transitionSlide, 3000);
        const container = document.querySelector('.slideshow-container');
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', () => {
            slideInterval = setInterval(transitionSlide, 3000);
        });
        return slideInterval;
    } catch (error) {
        console.error("Error initializing slideshow:", error);
    }
}

// Displays a loading counter and fades out the loading screen when complete
function startLoadingScreenCounter() {
    const loadingScreen = document.getElementById('loadingScreen');
    const counter = document.querySelector('.loading-counter');
    let count = 0;

    const updateCounter = () => {
        if (count < 100) {
            count++;
            counter.textContent = count;
            setTimeout(updateCounter, 20);
        } else {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.remove();
                    document.getElementById('mainContent').classList.add('content-loaded');
                    initializeSlideshow();
                }, 800);
            }, 200);
        }
    };

    updateCounter();
}

// Enables horizontal drag-to-scroll behavior for the games section
const gamesScroll = document.querySelector('.games-scroll');
let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;

gamesScroll.addEventListener('mousedown', (e) => handleDragStart(e));
gamesScroll.addEventListener('mouseleave', () => handleDragEnd());
gamesScroll.addEventListener('mouseup', () => handleDragEnd());
gamesScroll.addEventListener('mousemove', (e) => handleDragMove(e));

gamesScroll.addEventListener('touchstart', (e) => handleDragStart(e.touches[0]));
gamesScroll.addEventListener('touchend', () => handleDragEnd());
gamesScroll.addEventListener('touchmove', (e) => handleDragMove(e.touches[0]));

// Initializes drag state on mouse/touch start
function handleDragStart(e) {
    isDown = true;
    startX = e.pageX - gamesScroll.offsetLeft;
    scrollLeft = gamesScroll.scrollLeft;
    isDragging = true;
    gamesScroll.classList.add('dragging');
}

// Clears drag state on mouse/touch end or leave
function handleDragEnd() {
    isDown = false;
    isDragging = false;
    gamesScroll.classList.remove('dragging');
}

// Scrolls the container based on drag movement
function handleDragMove(e) {
    if (!isDown || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - gamesScroll.offsetLeft;
    const walk = (x - startX) * 2;
    gamesScroll.scrollLeft = scrollLeft - walk;
}

// Prevent users from dragging images manually
document.querySelectorAll('img').forEach(img => {
    img.ondragstart = () => false;
});

// Duplicates the game items inside the scroll container to create a looped effect
function initializeWorkScroll() {
    const gamesScroll = document.querySelector('.games-scroll');
    gamesScroll.innerHTML += gamesScroll.innerHTML;
}

// Runs the continuous scroll initializer when the page loads
document.addEventListener('DOMContentLoaded', initializeWorkScroll);