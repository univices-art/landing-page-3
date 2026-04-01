/* =====================================================
   UniVices Landing Page – script.js
   ===================================================== */

/* ---- Init AOS (graceful fallback if CDN is unavailable) ---- */
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 700,
    once: true,
    offset: 80,
  });
}

/* ---- Navbar: scroll effect + active link ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

function updateActiveLink() {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
});

updateNavbar();
updateActiveLink();

/* ---- Hamburger Menu ---- */
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  navLinksContainer.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksContainer.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ---- Smooth scroll for all anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    const targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: targetPos, behavior: 'smooth' });
  });
});

/* ---- Testimonials Slider ---- */
const track = document.getElementById('testimonialTrack');
const dots = document.querySelectorAll('.dot');
let currentIndex = 0;
let autoSlideInterval;

function goToSlide(index) {
  currentIndex = index;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

function nextSlide() {
  const total = track.children.length;
  goToSlide((currentIndex + 1) % total);
}

function startAutoSlide() {
  autoSlideInterval = setInterval(nextSlide, 4500);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    stopAutoSlide();
    goToSlide(parseInt(dot.dataset.index));
    startAutoSlide();
  });
});

// Touch/swipe support for slider
let touchStartX = 0;
let touchEndX = 0;

track.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  stopAutoSlide();
}, { passive: true });

track.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  const diff = touchStartX - touchEndX;
  const total = track.children.length;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      goToSlide((currentIndex + 1) % total);
    } else {
      goToSlide((currentIndex - 1 + total) % total);
    }
  }
  startAutoSlide();
});

startAutoSlide();

/* ---- Contact Form ---- */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;

  submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
  submitBtn.disabled = true;
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  try {
    const formData = new FormData(contactForm);
    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        formStatus.textContent = '✅ Message sent! We\'ll get back to you shortly.';
        formStatus.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } else {
      throw new Error('Server error');
    }
  } catch {
    formStatus.textContent = '❌ Something went wrong. Please try again or email us directly.';
    formStatus.classList.add('error');
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

/* ---- Footer Year ---- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---- Lazy loading images (native + IntersectionObserver fallback) ---- */
if ('loading' in HTMLImageElement.prototype) {
  // Native lazy loading is supported — already set via loading="lazy" in HTML
} else {
  // Fallback for older browsers
  const images = document.querySelectorAll('img[loading="lazy"]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) img.src = src;
        imageObserver.unobserve(img);
      }
    });
  });
  images.forEach((img) => imageObserver.observe(img));
}
