'use strict';

/* ---------- Header: mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

function closeNav() {
  if (!primaryNav) return;
  primaryNav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('nav-open');
}

if (navToggle && primaryNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', isOpen);
  });

  primaryNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeNav();
  });

  document.addEventListener('click', (e) => {
    if (!primaryNav.classList.contains('is-open')) return;
    if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });
}

/* ---------- Project filtering ---------- */
const filters = document.querySelectorAll('.filter');
const projectCards = document.querySelectorAll('.project-card');

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');

    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      const cats = (card.dataset.category || '').split(/\s+/);
      const show = filter === 'all' || cats.includes(filter);
      card.hidden = !show;
    });
  });
});

/* ---------- Reveal on scroll ---------- */
const revealTargets = document.querySelectorAll(
  '.section .card, .section-head, .timeline-item, .hero-photo, .hero-badge'
);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  revealTargets.forEach((el) => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealTargets.forEach((el) => io.observe(el));
}

/* ---------- Contact form (no backend, opens mail client) ---------- */
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const CONTACT_EMAIL = 'REPLACE-WITH-YOUR-EMAIL';

function setError(field, message) {
  const wrapper = field.closest('.field');
  if (!wrapper) return;
  wrapper.classList.toggle('has-error', Boolean(message));
  const err = wrapper.querySelector('.field-error');
  if (err) err.textContent = message || '';
}

function validate() {
  let valid = true;
  const name = form.name;
  const email = form.email;
  const subject = form.subject;
  const message = form.message;

  if (!name.value.trim() || name.value.trim().length < 2) {
    setError(name, 'Please enter your name.');
    valid = false;
  } else setError(name, '');

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  if (!emailOk) {
    setError(email, 'Please enter a valid email address.');
    valid = false;
  } else setError(email, '');

  if (!subject.value.trim() || subject.value.trim().length < 3) {
    setError(subject, 'Please add a short subject.');
    valid = false;
  } else setError(subject, '');

  if (!message.value.trim() || message.value.trim().length < 10) {
    setError(message, 'Message should be at least 10 characters.');
    valid = false;
  } else setError(message, '');

  return valid;
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    if (!validate()) {
      formStatus.textContent = 'Please fix the errors above and try again.';
      formStatus.classList.add('error');
      return;
    }

    const { name, email, subject, message } = form;
    const body = `Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    formStatus.textContent = 'Opening your email app… If nothing happens, please email me directly.';
    formStatus.classList.add('success');
  });

  ['name','email','subject','message'].forEach((n) => {
    const el = form[n];
    if (!el) return;
    el.addEventListener('input', () => {
      if (el.closest('.field').classList.contains('has-error')) validate();
    });
  });
}

/* ---------- Year ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
/* ---------- Recruiter Quick View ---------- */
(function () {
  const qvDate = document.getElementById('qvDate');
  if (qvDate) {
    const now = new Date();
    qvDate.textContent = now.toLocaleDateString('en-GB', {
      month: 'short', year: 'numeric'
    });
  }

  const qvCopy = document.getElementById('qvCopy');
  if (qvCopy) {
    const summary = `Sharan Puthran — Warehouse, Retail, Inventory & Supply Chain Operations
Roles sought: Assistant Manager (Retail / Warehouse) · Inventory Controller · Logistics & Supply Chain Operations
Location: Dubai / Abu Dhabi (UAE)
Availability: 30-day notice period (currently employed)
Experience: 5+ years · UAE & India · Retail, Warehouse, Inventory & Supply Chain Operations
Current: Storekeeper – Central Warehouse, Lulu Central Logistics, Dubai
Systems: SAP ERP, SAP WMS, LFS, Advanced Excel (VLOOKUP, XLOOKUP, Pivot, VBA)
Education: MBA – Marketing & HR · BBA + Diploma in Aviation & Hospitality
Languages: English, Hindi, Kannada, Tulu
Contact: sharanputhransrn@gmail.com · linkedin.com/in/sharan-puthran-ab54611a2
CV: https://sharanputhran.vercel.app/assets/Sharan-Puthran-CV.pdf`;

    qvCopy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(summary);
        qvCopy.classList.add('is-copied');
        const original = qvCopy.lastChild.textContent;
        qvCopy.lastChild.textContent = ' Copied!';
        setTimeout(() => {
          qvCopy.classList.remove('is-copied');
          qvCopy.lastChild.textContent = ' Copy summary';
        }, 2000);
      } catch {
        alert('Copy failed — please select the text manually.');
      }
    });
  }
})();