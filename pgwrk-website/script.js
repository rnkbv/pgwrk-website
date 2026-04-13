(function () {
  'use strict';

  // EmailJS
  emailjs.init({ publicKey: '_HChCcLaXS6Az7CGR' });

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Intersection observer – fade in on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const observeTargets = [
    '.service-card',
    '.process-step',
    '.portfolio-item',
    '.testi-card',
  ];

  observeTargets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = `opacity 0.55s ${i * 0.07}s ease, transform 0.55s ${i * 0.07}s ease`;
      observer.observe(el);
    });
  });

  // Contact form
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const btnArrow = document.getElementById('btnArrow');
  const btnSpinner = document.getElementById('btnSpinner');
  const formMsg = document.getElementById('formMsg');

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.textContent = loading ? 'Sending…' : 'Send Message';
    btnArrow.classList.toggle('hidden', loading);
    btnSpinner.classList.toggle('hidden', !loading);
  }

  function showMessage(type, text) {
    formMsg.className = 'form-message ' + type;
    formMsg.textContent = text;
    formMsg.classList.remove('hidden');
  }

  function hideMessage() {
    formMsg.classList.add('hidden');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideMessage();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const business_name = form.business_name.value.trim();
    const website_type = form.website_type.value;
    const budget = form.budget.value;
    const message = form.message.value.trim();

    if (!name || !email || !business_name || !website_type || !budget || !message) {
      showMessage('error', 'Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage('error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);

    const templateParams = {
      name,
      email,
      phone: form.phone.value.trim() || 'Not provided',
      business_name,
      website_type,
      budget,
      message,
    };

    try {
      await emailjs.send('service_chlxovr', 'template_ibal4aj', templateParams);
      showMessage('success', '✓ Message sent! We\'ll be in touch within 24 hours.');
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      showMessage('error', 'Something went wrong. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  });

})();