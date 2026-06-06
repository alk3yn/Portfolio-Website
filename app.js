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

// Run image preloading and scroll init after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    initializeWorkScroll();
});

// ─── MARQUEE & DRAG SCROLL LOGIC ────────────────────────────────────────────

let isDown = false;
let startX;
let scrollLeft;
let isDragging = false;
let isHovered = false;

function initializeWorkScroll() {
    // Query inside the function so the DOM is guaranteed to exist
    const gamesScroll = document.querySelector('.games-scroll');
    if (!gamesScroll) return;

    const originalChildren = Array.from(gamesScroll.children);
    if (originalChildren.length === 0) return;

    // Clone enough times to fill the strip and allow seamless looping
    // Two full sets of clones is sufficient for a continuous loop
    originalChildren.forEach(child => gamesScroll.appendChild(child.cloneNode(true)));
    originalChildren.forEach(child => gamesScroll.appendChild(child.cloneNode(true)));

    // ── Drag / touch controls ──────────────────────────────────────────────

    gamesScroll.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - gamesScroll.offsetLeft;
        scrollLeft = gamesScroll.scrollLeft;
        isDragging = true;
        gamesScroll.classList.add('dragging');
    });

    gamesScroll.addEventListener('mouseleave', () => {
        isHovered = false;
        isDown = false;
        isDragging = false;
        gamesScroll.classList.remove('dragging');
    });

    gamesScroll.addEventListener('mouseenter', () => { isHovered = true; });

    gamesScroll.addEventListener('mouseup', () => {
        isDown = false;
        isDragging = false;
        gamesScroll.classList.remove('dragging');
    });

    gamesScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - gamesScroll.offsetLeft;
        const walk = (x - startX) * 2;
        gamesScroll.scrollLeft = scrollLeft - walk;
    });

    gamesScroll.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - gamesScroll.offsetLeft;
        scrollLeft = gamesScroll.scrollLeft;
        isDragging = true;
    });

    gamesScroll.addEventListener('touchend', () => {
        isDown = false;
        isDragging = false;
    });

    gamesScroll.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - gamesScroll.offsetLeft;
        const walk = (x - startX) * 2;
        gamesScroll.scrollLeft = scrollLeft - walk;
    });

    // ── Auto-scroll with seamless loop ────────────────────────────────────
    // Wait two frames so the browser has laid out all the cloned elements
    // and offsetLeft / scrollWidth values are accurate.
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // The loop point is exactly one full set of original items wide.
            // When we reach that offset we silently jump back to 0.
            const singleSetWidth = originalChildren.reduce((total, child) => {
                const style = getComputedStyle(child);
                const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
                return total + child.offsetWidth + margin;
            }, 0);

            // Also account for the gap set via CSS (grab it from the flex gap)
            const gap = parseFloat(getComputedStyle(gamesScroll).gap) || 30;
            const jumpPoint = singleSetWidth + gap * originalChildren.length;

            function autoScroll() {
                if (!isHovered && !isDragging) {
                    gamesScroll.scrollLeft += 1;

                    // Seamlessly jump back once we've scrolled one full set
                    if (gamesScroll.scrollLeft >= jumpPoint) {
                        gamesScroll.scrollLeft -= jumpPoint;
                    }
                }
                requestAnimationFrame(autoScroll);
            }

            requestAnimationFrame(autoScroll);
        });
    });
}