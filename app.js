const isPreview = new URLSearchParams(window.location.search).has('preview');
if (isPreview) {
    document.body.classList.add('preview-mode');
}

// ─── LANGUAGE TOGGLE ───────────────────────────────────────────────────────
const langBtns = document.querySelectorAll('.lang-btn');
const htmlEl = document.documentElement;
const langAnnounce = document.getElementById('langAnnounce');

function setLanguage(lang) {
    htmlEl.setAttribute('data-lang', lang);
    htmlEl.setAttribute('lang', lang === 'jp' ? 'ja' : 'en');
    langBtns.forEach(btn => {
        const isActive = btn.getAttribute('data-set-lang').toLowerCase() === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    });
    // Announce language change to screen readers
    if (langAnnounce) {
        langAnnounce.textContent = lang === 'jp' ? '日本語に切り替えました' : 'Switched to English';
    }
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

function closeMobileMenu() {
    if (!navList) return;
    navList.classList.remove('open');
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
}

function openMobileMenu() {
    if (!navList) return;
    navList.classList.add('open');
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
}

if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', () => {
        const isOpen = navList.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking a link
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Close mobile menu on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
});

// Close mobile menu when resizing to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 400);
        }, 300);
    }
    if (!isPreview) {
        initializeSlideshow();
    }
    resizeSitePreview(); // <-- ADD THIS
});

// ─── SLIDESHOW ───────────────────────────────────────────────────────────────
let slideInterval = null;

function initializeSlideshow() {
    try {
        const slideContainers = document.querySelectorAll('.slide-container');
        if (slideContainers.length === 0) return;

        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            // Show first slide only, no animation
            const firstBg = slideContainers[0].querySelector('.background-slide');
            const firstSlide = slideContainers[0].querySelector('.slide');
            if (firstBg) firstBg.classList.add('active');
            if (firstSlide) firstSlide.classList.add('active');
            return;
        }

        let currentIndex = Math.floor(Math.random() * slideContainers.length);

        const activateSlide = (index) => {
            const container = slideContainers[index];
            if (!container) return;
            const bg = container.querySelector('.background-slide');
            const slide = container.querySelector('.slide');
            if (bg) bg.classList.add('active');
            if (slide) slide.classList.add('active');
        };

        const deactivateSlide = (index) => {
            const container = slideContainers[index];
            if (!container) return;
            const bg = container.querySelector('.background-slide');
            const slide = container.querySelector('.slide');
            if (bg) bg.classList.remove('active');
            if (slide) slide.classList.remove('active');
        };

        activateSlide(currentIndex);

        const transitionSlide = () => {
            deactivateSlide(currentIndex);
            currentIndex = (currentIndex + 1) % slideContainers.length;
            activateSlide(currentIndex);
        };

        slideInterval = setInterval(transitionSlide, 5000);
        const container = document.querySelector('.slideshow-container');

        if (container) {
            container.addEventListener('mouseenter', () => {
                if (slideInterval) clearInterval(slideInterval);
            });
            container.addEventListener('mouseleave', () => {
                slideInterval = setInterval(transitionSlide, 5000);
            });
        }

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (slideInterval) clearInterval(slideInterval);
        });
    } catch (error) {
        console.error('Slideshow initialization failed:', error);
        // Fallback: show first slide
        const firstContainer = document.querySelector('.slide-container');
        if (firstContainer) {
            const bg = firstContainer.querySelector('.background-slide');
            const slide = firstContainer.querySelector('.slide');
            if (bg) bg.classList.add('active');
            if (slide) slide.classList.add('active');
        }
    }
}

// ─── SMOOTH SCROLL ───────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Set focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
});

// ─── SCROLL-TO-TOP ───────────────────────────────────────────────────────────
const scrollTopButton = document.getElementById('scrollTop');
if (scrollTopButton) {
    window.addEventListener('scroll', () => {
        scrollTopButton.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ─── NAV BACKGROUND ON SCROLL ────────────────────────────────────────────────
const mainNav = document.getElementById('mainNav');
if (mainNav) {
    window.addEventListener('scroll', () => {
        mainNav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ─── SCROLL-TRIGGERED ANIMATIONS ────────────────────────────────────────────
let scrollObserver = null;

function initScrollAnimations() {
    const sections = document.querySelectorAll('.main-section');

    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    sections.forEach(section => scrollObserver.observe(section));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

// Cleanup observer on page unload
window.addEventListener('beforeunload', () => {
    if (scrollObserver) {
        scrollObserver.disconnect();
    }
    if (slideInterval) {
        clearInterval(slideInterval);
    }
});

// ─── FORM HANDLING (Enhanced) ───────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const submitBtn = contactForm.querySelector('[data-fs-submit-btn]');
        const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
        const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;

        if (submitBtn) {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';
        }

        // Formspree AJAX will handle the actual submission
        // This just provides visual feedback while loading
    });
}

function resizeSitePreview() {
    const wrappers = document.querySelectorAll('.site-preview-wrapper');
    wrappers.forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        if (!iframe) return;
        const scale = wrapper.clientWidth / 1280;
        iframe.style.transform = `scale(${scale})`;
        wrapper.style.height = `${800 * scale}px`;
    });
}
window.addEventListener('resize', resizeSitePreview);