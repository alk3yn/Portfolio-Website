// ─── LANGUAGE TOGGLE ───────────────────────────────────────────────────────
const langBtns = document.querySelectorAll('.lang-btn');
const htmlEl = document.documentElement;

function setLanguage(lang) {
    htmlEl.setAttribute('data-lang', lang);
    htmlEl.setAttribute('lang', lang === 'jp' ? 'ja' : 'en');
    langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-set-lang').toLowerCase() === lang);
    });
}

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-set-lang').toLowerCase();
        setLanguage(lang);
    });
});

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navList = document.getElementById('navList');

if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('open');
        const icon = mobileMenuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('open');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
}

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 400);
        }, 300);
    }
    initializeSlideshow();
});

// ─── SLIDESHOW ───────────────────────────────────────────────────────────────
function initializeSlideshow() {
    const slideContainers = document.querySelectorAll('.slide-container');
    if (slideContainers.length === 0) return;

    let currentIndex = Math.floor(Math.random() * slideContainers.length);

    const activateSlide = (index) => {
        const bg = slideContainers[index].querySelector('.background-slide');
        const slide = slideContainers[index].querySelector('.slide');
        if (bg) bg.classList.add('active');
        if (slide) slide.classList.add('active');
    };

    const deactivateSlide = (index) => {
        const bg = slideContainers[index].querySelector('.background-slide');
        const slide = slideContainers[index].querySelector('.slide');
        if (bg) bg.classList.remove('active');
        if (slide) slide.classList.remove('active');
    };

    activateSlide(currentIndex);

    const transitionSlide = () => {
        deactivateSlide(currentIndex);
        currentIndex = (currentIndex + 1) % slideContainers.length;
        activateSlide(currentIndex);
    };

    let slideInterval = setInterval(transitionSlide, 5000);
    const container = document.querySelector('.slideshow-container');

    if (container) {
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', () => {
            slideInterval = setInterval(transitionSlide, 5000);
        });
    }
}

// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── SCROLL-TO-TOP ───────────────────────────────────────────────────────────
const scrollTopButton = document.getElementById('scrollTop');
if (scrollTopButton) {
    window.addEventListener('scroll', () => {
        scrollTopButton.classList.toggle('show', window.scrollY > 400);
    });
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── NAV BACKGROUND ON SCROLL ────────────────────────────────────────────────
const mainNav = document.getElementById('mainNav');
if (mainNav) {
    window.addEventListener('scroll', () => {
        mainNav.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ─── SCROLL-TRIGGERED ANIMATIONS ────────────────────────────────────────────
function initScrollAnimations() {
    const sections = document.querySelectorAll('.main-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(section => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);