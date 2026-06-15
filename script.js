/* ================================================================
   RYANTO RESORT — JAVASCRIPT
   ================================================================
   SECTIONS:
   1.  Sticky Navbar
   2.  Mobile Menu (Hamburger)
   3.  Hero Slideshow
   4.  Scroll Reveal Animations
   5.  Active Nav Link on Scroll
   6.  Testimonial Slider
   7.  Gallery Lightbox
   8.  Contact Form
   9.  Back to Top Button
   10. Lazy Loading
   ================================================================ */

/* ─── Wait for the entire page to load before running scripts ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* ==============================================================
     1. STICKY NAVBAR
     Adds 'scrolled' class to navbar when user scrolls down.
     CHANGE: The pixel value (50) to trigger the scroll effect sooner or later.
  ============================================================== */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {   // ← CHANGE: Scroll distance to trigger effect
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run on load


  /* ==============================================================
     2. MOBILE MENU (HAMBURGER)
     Toggles the mobile nav drawer open/closed.
     CHANGE: Nothing needed here unless you rename your HTML IDs.
  ============================================================== */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  /* ==============================================================
     3. HERO SLIDESHOW
     Auto-rotates hero background images.
     CHANGE: slideInterval (in milliseconds) to change slide speed.
     E.g. 5000 = 5 seconds per slide
  ============================================================== */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots   = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  // CHANGE: Slide duration in milliseconds (5000 = 5 seconds)
  const SLIDE_DURATION = 5000;

  function goToSlide(index) {
    // Remove active from current
    heroSlides[currentSlide].classList.remove('active');
    heroDots[currentSlide].classList.remove('active');

    // Update index with wrap-around
    currentSlide = (index + heroSlides.length) % heroSlides.length;

    // Add active to new slide
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
  }

  function startSlideshow() {
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, SLIDE_DURATION);
  }

  function resetSlideshow() {
    clearInterval(slideInterval);
    startSlideshow();
  }

  // Dot click navigation
  heroDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToSlide(i);
      resetSlideshow();
    });
  });

  // Start auto-slideshow
  startSlideshow();

  // Pause slideshow when tab is not visible (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(slideInterval);
    } else {
      startSlideshow();
    }
  });


  /* ==============================================================
     4. SCROLL REVEAL ANIMATIONS
     Reveals elements with a fade-in + slide-up effect as they enter
     the viewport.
     CHANGE: 'threshold' below (0 to 1) — higher = more of the element
     must be visible before it reveals. 0.1 = 10% visible.
  ============================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stop observing once revealed (better performance)
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,      // ← CHANGE: 0.1 = reveal when 10% visible
    rootMargin: '0px 0px -40px 0px'  // ← CHANGE: Negative = trigger slightly before element enters viewport
  });

  revealElements.forEach(el => revealObserver.observe(el));


  /* ==============================================================
     5. ACTIVE NAV LINK ON SCROLL
     Highlights the correct nav link as you scroll through sections.
     CHANGE: Nothing needed unless you add/remove sections.
  ============================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,          // ← CHANGE: How much of a section must be visible
    rootMargin: '-80px 0px 0px 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));


  /* ==============================================================
     6. TESTIMONIAL SLIDER
     Swipeable carousel for guest testimonials.
     CHANGE: AUTO_PLAY_DELAY (in milliseconds) to change auto-scroll speed.
  ============================================================== */
  const track      = document.getElementById('testimonialTrack');
  const dotsWrap   = document.getElementById('testiDots');
  const cards      = track ? track.querySelectorAll('.testimonial-card') : [];
  let currentTesti = 0;
  let testiInterval;
  let cardsPerView = window.innerWidth < 900 ? 1 : 3;

  // CHANGE: Delay between auto-scroll (milliseconds)
  const AUTO_PLAY_DELAY = 4000;

  function getCardsPerView() {
    return window.innerWidth < 900 ? 1 : 3;
  }

  function totalSlides() {
    const cpv = getCardsPerView();
    return Math.max(1, cards.length - cpv + 1);
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    for (let i = 0; i < totalSlides(); i++) {
      const d = document.createElement('button');
      d.classList.add('dot');
      d.setAttribute('aria-label', `Testimonial ${i + 1}`);
      if (i === 0) d.classList.add('active');
      d.addEventListener('click', () => {
        goToTesti(i);
        resetTestiTimer();
      });
      dotsWrap.appendChild(d);
    }
  }

  function goToTesti(index) {
    const cpv = getCardsPerView();
    const max = totalSlides() - 1;
    currentTesti = Math.max(0, Math.min(index, max));

    const cardWidth = cards[0].offsetWidth;
    const gap = 24; // Must match CSS gap (1.5rem = 24px)
    const offset = currentTesti * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentTesti);
    });
  }

  function resetTestiTimer() {
    clearInterval(testiInterval);
    testiInterval = setInterval(() => {
      const next = (currentTesti + 1) >= totalSlides() ? 0 : currentTesti + 1;
      goToTesti(next);
    }, AUTO_PLAY_DELAY);
  }

  // Touch/swipe support for testimonials
  let testiTouchStartX = 0;

  if (track) {
    track.addEventListener('touchstart', (e) => {
      testiTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = testiTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goToTesti(diff > 0 ? currentTesti + 1 : currentTesti - 1);
        resetTestiTimer();
      }
    });
  }

  // Init
  if (cards.length > 0) {
    buildDots();
    resetTestiTimer();
  }

  // Recalculate on resize
  window.addEventListener('resize', () => {
    buildDots();
    goToTesti(0);
  });


  /* ==============================================================
     7. GALLERY LIGHTBOX
     Opens full-size image when gallery items are clicked.
     CHANGE: Nothing needed unless you add more gallery items.
  ============================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxPrev    = document.getElementById('lightboxPrev');
  const lightboxNext    = document.getElementById('lightboxNext');

  let currentLightboxIndex = 0;
  const galleryImages = [];

  // Build image data array from gallery
  galleryItems.forEach((item, i) => {
    const img   = item.querySelector('img');
    const label = item.querySelector('.gallery-label');
    galleryImages.push({
      src: img ? img.src : '',
      alt: img ? img.alt : '',
      caption: label ? label.textContent : ''
    });

    item.addEventListener('click', () => {
      openLightbox(i);
    });

    // Keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    galleryItems[currentLightboxIndex].focus();
  }

  function updateLightboxImage() {
    const data = galleryImages[currentLightboxIndex];
    lightboxImg.src = data.src;
    lightboxImg.alt = data.alt;
    lightboxCaption.textContent = data.caption;
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', prevLightbox);
  if (lightboxNext)  lightboxNext.addEventListener('click', nextLightbox);

  // Close lightbox on background click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
  });

  // Touch swipe for lightbox
  let lightboxTouchStartX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      lightboxTouchStartX = e.touches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = lightboxTouchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextLightbox() : prevLightbox();
      }
    });
  }


  /* ==============================================================
     8. CONTACT FORM
     Handles the contact/booking form submission.

     CHANGE THIS SECTION to connect your form to a real backend.
     Options:
     A) Use Formspree: https://formspree.io — replace the fetch URL
     B) Use EmailJS: https://www.emailjs.com
     C) Use a WhatsApp redirect (see option below)
     D) Connect to your own server/API endpoint
  ============================================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus  = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // ─── Collect form values ───
      const name     = document.getElementById('name').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const email    = document.getElementById('email').value.trim();
      const checkin  = document.getElementById('checkin').value;
      const checkout = document.getElementById('checkout').value;
      const roomtype = document.getElementById('roomtype').value;
      const message  = document.getElementById('message').value.trim();

      // ─── Basic validation ───
      if (!name || !phone || !email) {
        showFormStatus('Please fill in your name, phone, and email.', 'error');
        return;
      }

      // CHANGE: Choose ONE of the options below and delete the others.

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         OPTION A: SEND ENQUIRY VIA WHATSAPP (default — no backend needed)
         This opens WhatsApp with all form details pre-filled.
         CHANGE: The phone number and message format below.
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      const waMessage = `Hello Ryanto Resort! 🌿

*New Booking Enquiry*
────────────────────
👤 Name: ${name}
📞 Phone: ${phone}
📧 Email: ${email}
🛏️ Room: ${roomtype || 'Not specified'}
📅 Check-in: ${checkin || 'To be decided'}
📅 Check-out: ${checkout || 'To be decided'}
💬 Message: ${message || 'No special requests'}
────────────────────
Sent via ryantoresort.com`;

      // CHANGE: WhatsApp phone number (no spaces, include country code)
      const waPhone = '917306880738';  // ← CHANGE: Your WhatsApp number
      const waUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`;

      showFormStatus('Redirecting to WhatsApp…', 'success');
      setTimeout(() => {
        window.open(waUrl, '_blank');
        contactForm.reset();
        showFormStatus('Thank you! We will be in touch shortly.', 'success');
      }, 800);

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         OPTION B: FORMSPREE (uncomment to use)
         1. Sign up at https://formspree.io
         2. Create a form and copy your Form ID
         3. Replace 'YOUR_FORM_ID' below
         4. Delete OPTION A above and uncomment this block

      try {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', { // ← CHANGE: Your Formspree ID
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, email, checkin, checkout, roomtype, message })
        });

        if (response.ok) {
          showFormStatus('Thank you! We will contact you within 24 hours.', 'success');
          contactForm.reset();
        } else {
          showFormStatus('Something went wrong. Please try WhatsApp instead.', 'error');
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Enquiry';
      } catch (err) {
        showFormStatus('Network error. Please contact us on WhatsApp.', 'error');
      }
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    });
  }

  // Helper: show form status message
  function showFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    // Auto-clear after 6 seconds
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 6000);
  }


  /* ==============================================================
     9. BACK TO TOP BUTTON
     Shows a "scroll to top" button after the user scrolls down.
     CHANGE: The '400' below to show button sooner or later.
  ============================================================== */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {  // ← CHANGE: Pixel scroll amount to show button
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ==============================================================
     10. LAZY LOADING IMAGES
     Uses native lazy loading (loading="lazy" in HTML).
     This script adds a fade-in effect as images load.
     CHANGE: Nothing needed here.
  ============================================================== */
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(img => {
    // Start invisible
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    // Fade in when loaded
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      img.addEventListener('error', () => {
        // If image fails to load, show placeholder
        img.style.opacity = '0.3';
        img.alt = 'Image unavailable';
      });
    }
  });


  /* ==============================================================
     BONUS: SMOOTH ANCHOR LINK SCROLLING WITH NAVBAR OFFSET
     Ensures clicking nav links accounts for the fixed navbar height.
     CHANGE: '80' below to match your navbar height (in pixels).
  ============================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbarHeight = navbar.offsetHeight;
      const offset = 20;  // ← CHANGE: Extra gap below navbar (pixels)
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight - offset;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

}); // End DOMContentLoaded
