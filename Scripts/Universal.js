(function () {
    'use strict';

    /* ======================================================================
       CONFIGURATION
       CUSTOMIZE: Adjust these values to change behavior.
       - HEADER_SCROLL_THRESHOLD: pixels scrolled before header gets shadow
       - ENABLE_ANIMATIONS: set to false to disable scroll animations entirely
       ====================================================================== */
    var CONFIG = {
        HEADER_SCROLL_THRESHOLD: 50,
        ENABLE_ANIMATIONS: true
    };

    document.addEventListener('DOMContentLoaded', function () {
        initHeaderScroll();
        initSmoothScrollLinks();
        initCurrentYear();
        if (CONFIG.ENABLE_ANIMATIONS) initScrollAnimations();
    });

    /* Header Scroll Shadow */
    function initHeaderScroll() {
        var header = document.querySelector('.site-header');
        if (!header) return;

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    header.classList.toggle('scrolled', window.scrollY > CONFIG.HEADER_SCROLL_THRESHOLD);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* Smooth Scroll */
    function initSmoothScrollLinks() {
        var anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                var targetId = link.getAttribute('href');
                if (targetId === '#') return;
                var target = document.querySelector(targetId);
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus({ preventScroll: false });
                }
            });
        });
    }

    /* Scroll Animations
       Elements with class "animate-on-scroll" will fade in when they enter the viewport.
       This respects the user's prefers-reduced-motion setting automatically. */
    function initScrollAnimations() {
        var elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        elements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        elements.forEach(function (el) { observer.observe(el); });
    }

    /* Copyright Year - Automatically updates the year in the footer */
    function initCurrentYear() {
        var yearEl = document.getElementById('current-year');
        if (yearEl) yearEl.textContent = new Date().getFullYear();
    }
})();
