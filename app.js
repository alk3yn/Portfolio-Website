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

// Handles slideshow functionality safely without breaking the DOM
function initializeSlideshow() {
    try {
        const slideContainers = document.querySelectorAll('.slide-container');
        if (slideContainers.length === 0) return;

        // Start with a random slide
        let currentIndex = Math.floor(Math.random() * slideContainers.length);
        
        const activateSlide = (index) => {
            slideContainers[index].querySelector('.background-slide').classList.add('active');
            slideContainers[index].querySelector('.slide').classList.add('active');
        };
        
        activateSlide(currentIndex);

        const transitionSlide = () => {
            const currentContainer = slideContainers[currentIndex];
            currentContainer.querySelector('.background-slide').classList.remove('active');
            currentContainer.querySelector('.slide').classList.remove('active');
            
            currentIndex = (currentIndex + 1) % slideContainers.length;
            
            const nextContainer = slideContainers[currentIndex];
            nextContainer.querySelector('.background-slide').classList.add('active');
            nextContainer.querySelector('.slide').classList.add('active');
        };

        let slideInterval = setInterval(transitionSlide, 4000);
        const container = document.querySelector('.slideshow-container');
        
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', () => {
            slideInterval = setInterval(transitionSlide, 4000);
        });
    } catch (error) {
        console.error("Error initializing slideshow:", error);
    }
}

// Ensure the page actually waits for resources to load instead of using a fake timer
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    const counter = document.querySelector('.loading-counter');
    let count = 0;

    // Rapidly finish the counter visualization once the actual page is loaded
    const finishLoading = setInterval(() => {
        if (count < 100) {
            count += Math.floor(Math.random() * 10) + 5;
            if (count > 100) count = 100;
            counter.textContent = count;
        } else {
            clearInterval(finishLoading);
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                document.getElementById('mainContent').classList.add('content-loaded');
                initializeSlideshow();
            }, 800);
        }
    }, 30);
});

// Run image preloading early
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    initializeWorkScroll();
});

// MARQUEE & DRAG SCROLL LOGIC
const gamesScroll = document.querySelector('.games-scroll');
let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;
let isHovered = false;
let autoScrollSpeed = 1; // Pixels per frame

// Mouse Events
gamesScroll.addEventListener('mousedown', (e) => handleDragStart(e));
gamesScroll.addEventListener('mouseleave', () => {
    isHovered = false;
    handleDragEnd();
});
gamesScroll.addEventListener('mouseenter', () => isHovered = true);
gamesScroll.addEventListener('mouseup', () => handleDragEnd());
gamesScroll.addEventListener('mousemove', (e) => handleDragMove(e));

// Touch Events
gamesScroll.addEventListener('touchstart', (e) => handleDragStart(e.touches[0]));
gamesScroll.addEventListener('touchend', () => handleDragEnd());
gamesScroll.addEventListener('touchmove', (e) => handleDragMove(e.touches[0]));

function handleDragStart(e) {
    isDown = true;
    startX = e.pageX - gamesScroll.offsetLeft;
    scrollLeft = gamesScroll.scrollLeft;
    isDragging = true;
    gamesScroll.classList.add('dragging');
}

function handleDragEnd() {
    isDown = false;
    isDragging = false;
    gamesScroll.classList.remove('dragging');
}

function handleDragMove(e) {
    if (!isDown || !isDragging) return;
    e.preventDefault();
    const x = e.pageX - gamesScroll.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    gamesScroll.scrollLeft = scrollLeft - walk;
}

// Prevent users from dragging images manually
document.querySelectorAll('img').forEach(img => {
    img.ondragstart = () => false;
});

// Duplicates the game items and handles the smooth Javascript continuous scroll
function initializeWorkScroll() {
    const gamesScroll = document.querySelector('.games-scroll');
    // Duplicate the content to allow infinite scrolling
    gamesScroll.innerHTML += gamesScroll.innerHTML;

    function autoScroll() {
        // Only scroll automatically if the user isn't hovering or dragging
        if (!isHovered && !isDragging) {
            gamesScroll.scrollLeft += autoScrollSpeed;

            // If we've scrolled past the first set of items, seamlessly jump back
            if (gamesScroll.scrollLeft >= gamesScroll.scrollWidth / 2) {
                gamesScroll.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScroll);
    }
    
    // Start the animation loop
    requestAnimationFrame(autoScroll);
}