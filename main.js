/* DermoElite — main.js */

// ─── ROUTER ───
const routes = {
  '': 'home',
  'home': 'home',
  'about': 'about',
  'contact': 'contact',
  'policy': 'policy',
  'faq': 'faq'
};

function getPage() {
  const path = window.location.pathname
    .replace(/^\//, '')
    .replace(/\.html$/, '')
    .split('/').pop() || '';
  return routes[path] || 'home';
}

function navigate(page) {
  // update URL without .html
  const url = page === 'home' ? '/' : `/${page}`;
  window.history.pushState({}, '', url);
  showPage(page);
  closeMenu();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
  });
  const target = document.getElementById(`page-${pageId}`);
  if (target) {
    target.classList.add('active');
    setTimeout(initReveal, 100);
  }
  // Update active menu link
  document.querySelectorAll('.menu-links a').forEach(a => {
    a.classList.toggle('active-link', a.dataset.page === pageId);
  });
}

// ─── NAVIGATION ───
document.addEventListener('DOMContentLoaded', () => {
  // handle all internal links
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (link) {
      e.preventDefault();
      navigate(link.dataset.page);
    }
  });

  // browser back/forward
  window.addEventListener('popstate', () => {
    showPage(getPage());
  });

  // initial load
  showPage(getPage());
});

// ─── BURGER MENU ───
const burger = document.getElementById('burger');
const menuOverlay = document.getElementById('menuOverlay');
const menuBackdrop = document.getElementById('menuBackdrop');

function openMenu() {
  burger.classList.add('active');
  menuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  burger.classList.remove('active');
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  if (menuOverlay.classList.contains('open')) closeMenu();
  else openMenu();
});

menuBackdrop.addEventListener('click', closeMenu);

// ─── HEADER SCROLL ───
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ─── MODAL (app store) ───
const modal = document.getElementById('appModal');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.app-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    modal.classList.add('open');
  });
});

function closeModal() { modal.classList.remove('open'); }

modalBackdrop.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); closeMenu(); }
});

// ─── SCROLL REVEAL ───
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.page.active .reveal').forEach(el => {
    if (!el.classList.contains('visible')) {
      observer.observe(el);
    }
  });
}

// ─── FAQ ACCORDION ───
document.addEventListener('click', e => {
  const question = e.target.closest('.faq-question');
  if (!question) return;
  const item = question.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
});

// ─── CONTACT FORM ───
document.addEventListener('submit', e => {
  if (e.target.id === 'contactForm') {
    e.preventDefault();
    const success = document.getElementById('formSuccess');
    if (success) {
      success.style.display = 'block';
      e.target.reset();
      setTimeout(() => success.style.display = 'none', 5000);
    }
  }
});

// ─── NEWSLETTER ───
document.addEventListener('submit', e => {
  if (e.target.id === 'newsletterForm') {
    e.preventDefault();
    const btn = e.target.querySelector('.btn');
    const originalText = btn.textContent;
    btn.textContent = 'Thank you!';
    btn.style.background = 'var(--gold-dark)';
    e.target.reset();
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  }
});
