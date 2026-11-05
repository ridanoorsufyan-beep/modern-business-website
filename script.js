// ===== Aurora Digital Agency - JavaScript =====
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    navToggle.classList.toggle('active', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
    });
  });

  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const sections = document.querySelectorAll('section[id]');
  const setActiveLink = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }, { passive: true });
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Add reveal classes before setting up observers
  document.querySelectorAll('.section-header, .hero-content, .hero-visual, .about-content, .about-visual').forEach(el => el.classList.add('reveal'));

  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .service-card, .portfolio-card, .testimonial-card, .why-card, .stat');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  // Fallback: ensure content becomes visible even if observer doesn't fire
  setTimeout(() => {
    revealEls.forEach(el => el.classList.add('visible'));
  }, 2000);

  const counters = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1500;
        const step = Math.max(1, Math.ceil(target / (duration / 16)));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = current;
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
  // ----- Contact Form Validation -----
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const fields = {
    name: { el: document.getElementById('name'), err: document.getElementById('nameError'), validate: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
    email: { el: document.getElementById('email'), err: document.getElementById('emailError'), validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    phone: { el: document.getElementById('phone'), err: document.getElementById('phoneError'), validate: v => v.trim() === '' || /^[+\d\s().-]{7,}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.' },
    subject: { el: document.getElementById('subject'), err: document.getElementById('subjectError'), validate: v => v.trim().length >= 3 ? '' : 'Please enter a subject.' },
    message: { el: document.getElementById('message'), err: document.getElementById('messageError'), validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' }
  };
  const showError = (field, msg) => { field.el.classList.toggle('error', !!msg); field.err.textContent = msg; };
  Object.values(fields).forEach(f => {
    f.el.addEventListener('input', () => showError(f, f.validate(f.el.value)));
    f.el.addEventListener('blur', () => showError(f, f.validate(f.el.value)));
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    Object.values(fields).forEach(f => {
      const msg = f.validate(f.el.value);
      showError(f, msg);
      if (msg) valid = false;
    });
    if (!valid) { status.textContent = 'Please fix the errors above and try again.'; status.className = 'form-status error'; return; }
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true; submitBtn.textContent = 'Sending...';
    setTimeout(() => {
      form.reset();
      Object.values(fields).forEach(f => showError(f, ''));
      status.textContent = 'Thank you! Your message has been sent successfully.';
      status.className = 'form-status success';
      submitBtn.disabled = false; submitBtn.textContent = 'Send Message';
    }, 1200);
  });
  // ----- Theme Toggle -----
  const themeToggle = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  };
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});