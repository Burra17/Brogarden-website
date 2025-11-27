// Brogården - Modern JavaScript
document.addEventListener("DOMContentLoaded", () => {
    initMobileMenu();
    initLightbox();
    initSmoothScroll();
});

// ===== Mobilmeny =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = navLinks.classList.toggle('show');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        menuToggle.classList.toggle('active');

        // Förhindra scrollning när menyn är öppen
        document.body.style.overflow = isExpanded ? 'hidden' : '';
    });

    // Stäng meny vid klick på länk
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Stäng meny vid klick utanför
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('show');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== Lightbox för bildvisning =====
function initLightbox() {
    // Skapa lightbox-element
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox');
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Stäng bildvisning">&times;</button>
        <button class="lightbox-prev" aria-label="Föregående bild">&#10094;</button>
        <button class="lightbox-next" aria-label="Nästa bild">&#10095;</button>
        <img src="" alt="Förstorad bild">
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const counter = lightbox.querySelector('.lightbox-counter');

    let currentGroup = [];
    let currentIndex = 0;

    // Funktion för att visa bild
    const showImage = (index) => {
        if (!currentGroup.length) return;

        const img = currentGroup[index];
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        currentIndex = index;

        // Uppdatera räknare
        counter.textContent = `${index + 1} / ${currentGroup.length}`;

        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    // Hitta alla bildgrupper (room-cards och gallery)
    document.querySelectorAll('.room-card, .gallery').forEach(group => {
        const images = Array.from(group.querySelectorAll('img'));

        images.forEach((img, i) => {
            img.style.cursor = 'pointer';
            img.setAttribute('tabindex', '0');

            // Klick
            img.addEventListener('click', () => {
                currentGroup = images;
                showImage(i);
            });

            // Tangentbord (Enter/Space)
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentGroup = images;
                    showImage(i);
                }
            });
        });
    });

    // Navigation
    const showNext = () => showImage((currentIndex + 1) % currentGroup.length);
    const showPrev = () => showImage((currentIndex - 1 + currentGroup.length) % currentGroup.length);

    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Stäng lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = '';
        currentGroup = [];
    };

    closeBtn.addEventListener('click', closeLightbox);

    // Stäng vid klick på bakgrund
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Tangentbord
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;

        switch (e.key) {
            case 'ArrowRight':
                showNext();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    });

    // Touch/Swipe-stöd för mobil
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    const handleSwipe = () => {
        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 50;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance < 0) {
                showNext(); // Swipe left
            } else {
                showPrev(); // Swipe right
            }
        }
    };
}

// ===== Smooth scroll för interna länkar =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Navbar scroll effect =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});