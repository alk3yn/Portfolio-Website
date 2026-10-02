// ─── LANGUAGE TOGGLE ───────────────────────────────────────────────────────
const langBtns = document.querySelectorAll('.lang-btn');
const htmlEl = document.documentElement;
const langAnnounce = document.getElementById('langAnnounce');

// Swap language-dependent attributes (hrefs, downloads, aria-labels)
function applyLangAttrs(lang) {
    document.querySelectorAll('[data-href-ja][data-href-en]').forEach(el => {
        el.setAttribute('href', el.getAttribute('data-href-' + lang));
        const dl = el.getAttribute('data-download-' + lang);
        if (dl) el.setAttribute('download', dl);
    });
    document.querySelectorAll('[data-aria-ja][data-aria-en]').forEach(el => {
        el.setAttribute('aria-label', el.getAttribute('data-aria-' + lang));
    });
}

function setLanguage(lang, announce = true) {
    htmlEl.setAttribute('data-lang', lang);
    htmlEl.setAttribute('lang', lang);
    langBtns.forEach(btn => {
        const isActive = btn.getAttribute('data-set-lang') === lang;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', String(isActive));
    });

    // Set lang attribute on every language span/div
    document.querySelectorAll('.lang-jp').forEach(el => el.setAttribute('lang', 'ja'));
    document.querySelectorAll('.lang-en').forEach(el => el.setAttribute('lang', 'en'));

    applyLangAttrs(lang);

    if (announce && langAnnounce) {
        langAnnounce.textContent = lang === 'ja'
            ? '日本語に切り替えました'
            : 'Switched to English';
    }
}

// Initialize lang attributes on page load
document.querySelectorAll('.lang-jp').forEach(el => el.setAttribute('lang', 'ja'));
document.querySelectorAll('.lang-en').forEach(el => el.setAttribute('lang', 'en'));

langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.getAttribute('data-set-lang'));
    });
});

// Honour ?lang=en / ?lang=ja (the page's hreflang alternates point to ?lang=en)
(function () {
    const q = new URLSearchParams(window.location.search).get('lang');
    setLanguage(q === 'en' || q === 'ja' ? q : 'ja', false);
})();

// ─── MOBILE MENU ───────────────────────────────────────────────────────────
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
        navList.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
    });
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobileMenu();
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
});

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

function activateSlide(container) {
    if (!container) return;
    const bg = container.querySelector('.background-slide');
    const sl = container.querySelector('.slide');
    if (bg) bg.classList.add('active');
    if (sl) sl.classList.add('active');
}

function deactivateSlide(container) {
    if (!container) return;
    const bg = container.querySelector('.background-slide');
    const sl = container.querySelector('.slide');
    if (bg) bg.classList.remove('active');
    if (sl) sl.classList.remove('active');
}

function initializeSlideshow() {
    try {
        const containers = document.querySelectorAll('.slide-container');
        if (!containers.length) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            activateSlide(containers[0]);
            return;
        }

        let idx = Math.floor(Math.random() * containers.length);
        activateSlide(containers[idx]);

        const transition = () => {
            deactivateSlide(containers[idx]);
            idx = (idx + 1) % containers.length;
            activateSlide(containers[idx]);
        };

        slideInterval = setInterval(transition, 5000);

        const wrapper = document.querySelector('.slideshow-container');
        if (wrapper) {
            wrapper.addEventListener('mouseenter', () => {
                if (slideInterval) {
                    clearInterval(slideInterval);
                    slideInterval = null;
                }
            });
            wrapper.addEventListener('mouseleave', () => {
                if (!slideInterval) {
                    slideInterval = setInterval(transition, 5000);
                }
            });
        }
    } catch (err) {
        console.error('Slideshow init failed:', err);
        activateSlide(document.querySelector('.slide-container'));
    }
}

// ─── SMOOTH SCROLL ─────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
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
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
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

// ─── FORM HANDLING (Formspree JSON endpoint) ───────────────────────────────
const FORM_MSG = {
    ja: {
        network: '送信できませんでした。通信環境をご確認のうえ、もう一度お試しください。',
        generic: '送信に失敗しました。時間をおいて再度お試しください。'
    },
    en: {
        network: 'Could not send your message. Please check your connection and try again.',
        generic: 'Something went wrong while sending. Please try again in a moment.'
    }
};
const FORM_FIELDS = ['name', 'email', 'message'];

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    const btn = contactForm.querySelector('[data-fs-submit-btn]');
    const btnText = btn && btn.querySelector('.btn-text');
    const btnLoader = btn && btn.querySelector('.btn-loader');
    const successEl = document.querySelector('.form-success');
    const msg = key => FORM_MSG[htmlEl.getAttribute('data-lang') === 'en' ? 'en' : 'ja'][key];

    const setSubmitting = on => {
        if (!btn) return;
        btn.disabled = on;
        if (btnText) btnText.style.display = on ? 'none' : '';
        if (btnLoader) btnLoader.style.display = on ? 'inline-block' : '';
    };

    const clearErrors = () => {
        contactForm.querySelectorAll('.field-error.visible, .form-error.visible').forEach(el => {
            el.classList.remove('visible');
            el.textContent = '';
        });
        contactForm.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
    };

    // Per-field error helper
    contactForm.showFieldError = function (fieldName, message) {
        const errorEl = contactForm.querySelector(`.field-error[data-fs-error="${fieldName}"]`);
        const input = contactForm.querySelector(`[name="${fieldName}"]`);
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
        if (input) input.setAttribute('aria-invalid', 'true');
    };

    // Form-level error
    contactForm.showFormError = function (message) {
        const errorEl = contactForm.querySelector('.form-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    };

    const showSuccess = () => {
        contactForm.reset();
        contactForm.style.display = 'none';
        if (successEl) successEl.classList.add('visible');
    };

    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        clearErrors();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        // Honeypot: silently drop bot submissions
        const gotcha = contactForm.querySelector('[name="_gotcha"]');
        if (gotcha && gotcha.value) {
            showSuccess();
            return;
        }

        setSubmitting(true);
        let ok = false;
        try {
            const res = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });
            let data = {};
            try { data = await res.json(); } catch (_) { /* non-JSON response */ }

            if (res.ok) {
                ok = true;
                showSuccess();
            } else if (Array.isArray(data.errors) && data.errors.length) {
                data.errors.forEach(err => {
                    if (FORM_FIELDS.includes(err.field)) {
                        contactForm.showFieldError(err.field, err.message);
                    } else {
                        contactForm.showFormError(err.message || msg('generic'));
                    }
                });
            } else {
                contactForm.showFormError(msg('generic'));
            }
        } catch (err) {
            contactForm.showFormError(msg('network'));
        } finally {
            if (!ok) setSubmitting(false);
        }
    });
}

// ─── CLEANUP ───────────────────────────────────────────────────────────────
window.addEventListener('beforeunload', () => {
    if (scrollObserver) scrollObserver.disconnect();
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
});