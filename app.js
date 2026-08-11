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
    if (langAnnounce) {
        langAnnounce.textContent = lang === 'jp' ? '日本語に切り替えました' : 'Switched to English';
    }
}

langBtns.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-set-lang').toLowerCase()));
});

// ─── MOBILE MENU ───────────────────────────────────────────────────────────
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navList = document.getElementById('navList');

function closeMobileMenu() {
    if (!navList) return;
    navList.classList.remove('open');
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) { icon.classList.add('fa-bars'); icon.classList.remove('fa-times'); }
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
}

function openMobileMenu() {
    if (!navList) return;
    navList.classList.add('open');
    if (mobileMenuToggle) {
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
}

if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    navList.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 768) closeMobileMenu(); });

// ─── LOADING SCREEN ────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const ls = document.getElementById('loadingScreen');
    if (ls) {
        setTimeout(() => {
            ls.classList.add('hidden');
            setTimeout(() => ls.remove(), 500);
        }, 300);
    }
    initializeSlideshow();
});

// ─── SLIDESHOW ─────────────────────────────────────────────────────────────
let slideInterval = null;

function initializeSlideshow() {
    try {
        const containers = document.querySelectorAll('.slide-container');
        if (!containers.length) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            const bg = containers[0].querySelector('.background-slide');
            const sl = containers[0].querySelector('.slide');
            if (bg) bg.classList.add('active');
            if (sl) sl.classList.add('active');
            return;
        }

        let idx = Math.floor(Math.random() * containers.length);

        const activate = i => {
            const c = containers[i];
            if (!c) return;
            const bg = c.querySelector('.background-slide');
            const sl = c.querySelector('.slide');
            if (bg) bg.classList.add('active');
            if (sl) sl.classList.add('active');
        };
        const deactivate = i => {
            const c = containers[i];
            if (!c) return;
            const bg = c.querySelector('.background-slide');
            const sl = c.querySelector('.slide');
            if (bg) bg.classList.remove('active');
            if (sl) sl.classList.remove('active');
        };

        activate(idx);

        const transition = () => {
            deactivate(idx);
            idx = (idx + 1) % containers.length;
            activate(idx);
        };

        slideInterval = setInterval(transition, 5000);

        const wrapper = document.querySelector('.slideshow-container');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => { if (slideInterval) clearInterval(slideInterval); });
            wrapper.addEventListener('mouseleave', () => { slideInterval = setInterval(transition, 5000); });
        }
    } catch (err) {
        console.error('Slideshow init failed:', err);
        const first = document.querySelector('.slide-container');
        if (first) {
            const bg = first.querySelector('.background-slide');
            const sl = first.querySelector('.slide');
            if (bg) bg.classList.add('active');
            if (sl) sl.classList.add('active');
        }
    }
}

// ─── SMOOTH SCROLL ─────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
        }
    });
});

// ─── SCROLL-TO-TOP ─────────────────────────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── NAV SCROLL STATE ──────────────────────────────────────────────────────
const mainNav = document.getElementById('mainNav');
if (mainNav) {
    window.addEventListener('scroll', () => {
        mainNav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
}

// ─── SCROLL-TRIGGERED ANIMATIONS ───────────────────────────────────────────
let scrollObserver = null;

function initScrollAnimations() {
    const sections = document.querySelectorAll('.main-section');
    scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    sections.forEach(s => scrollObserver.observe(s));
}

document.addEventListener('DOMContentLoaded', initScrollAnimations);

window.addEventListener('beforeunload', () => {
    if (scrollObserver) scrollObserver.disconnect();
    if (slideInterval) clearInterval(slideInterval);
});

// ─── FORM HANDLING ─────────────────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function () {
        const btn = contactForm.querySelector('[data-fs-submit-btn]');
        if (!btn) return;
        const text = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.btn-loader');
        btn.disabled = true;
        if (text) text.style.display = 'none';
        if (loader) loader.style.display = 'inline-block';
    });
}