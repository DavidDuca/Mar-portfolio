/* ================================================================
   MARISSA PORTFOLIO — main.js
   Loader · Theme toggle · Typing · Nav · Reveal · Modal · Form
================================================================ */

/* ── THEME TOGGLE ───────────────────────────────────────────── */
(function initTheme() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ── LOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    loader.classList.add('out');
    setTimeout(() => loader.remove(), 600);
    revealAll();
  }, 1100);
});

/* ── TYPING EFFECT ──────────────────────────────────────────── */
const roles = [
  'Web Developer',
  'Data Analyst',
  'Information Systems Student',
  'Performing Dancer',
  'Home Cook',
];
let ri = 0, ci = 0, deleting = false;
const typeEl = document.getElementById('type-el');

function type() {
  if (!typeEl) return;
  const word = roles[ri];
  typeEl.textContent = deleting
    ? word.substring(0, ci - 1)
    : word.substring(0, ci + 1);
  deleting ? ci-- : ci++;

  let delay = deleting ? 45 : 80;
  if (!deleting && ci === word.length) { delay = 1800; deleting = true; }
  else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 350; }

  setTimeout(type, delay);
}
setTimeout(type, 1500);

/* ── NAV SCROLL & ACTIVE LINK ───────────────────────────────── */
const nav = document.getElementById('nav');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a')];

function onScroll() {
  nav?.classList.toggle('scrolled', window.scrollY > 24);
  let current = '';
  for (const s of sections) {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  }
  navLinks.forEach(a =>
    a.classList.toggle('active', a.getAttribute('href') === '#' + current)
  );
  revealAll();
}
window.addEventListener('scroll', onScroll, { passive: true });

/* ── SMOOTH SCROLL ─────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - (nav?.offsetHeight || 60) + 1,
      behavior: 'smooth',
    });
    closeMobileMenu();
  });
});

/* ── HAMBURGER ─────────────────────────────────────────────── */
const hbg = document.getElementById('hbg');
const mobNav = document.getElementById('mob-nav');
function closeMobileMenu() {
  hbg?.classList.remove('open');
  mobNav?.classList.remove('open');
}
hbg?.addEventListener('click', () => {
  hbg.classList.toggle('open');
  mobNav?.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (mobNav?.classList.contains('open') && !mobNav.contains(e.target) && !hbg.contains(e.target)) {
    closeMobileMenu();
  }
});

/* ── SCROLL REVEAL ─────────────────────────────────────────── */
// Add `rv` class to sections & cards automatically for subtle animation
document.querySelectorAll('section header.sec-head, .about-card, .sk-card, .hobby-card, .proj-card, .cert-card, .hobby-featured, .hero-grid, .hero-strip, .contact-info, .cf-box')
  .forEach(el => el.classList.add('rv'));

function revealAll() {
  document.querySelectorAll('.rv:not(.in)').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 60) {
      el.classList.add('in');
    }
  });
}
window.addEventListener('load', revealAll);

/* ── PDF MODAL ─────────────────────────────────────────────── */
const pdfModal = document.getElementById('pdf-modal');
const pdfTitle = document.getElementById('pdf-cert-title');
const pdfSub   = document.getElementById('pdf-cert-sub');
const pdfName  = document.getElementById('pdf-modal-cert-name');
const pdfDlBtn = document.getElementById('pdf-dl-btn');
const pdfFrame = document.getElementById('pdf-frame-wrap');

window.openCertModal = function(title, issuer, pdfUrl, certName) {
  if (!pdfModal) return;
  pdfTitle.textContent = title;
  pdfSub.textContent   = issuer;
  pdfName.textContent  = certName || title;
  if (pdfDlBtn) {
    pdfDlBtn.href = pdfUrl || '#';
    pdfDlBtn.download = (certName || title).replace(/\s+/g, '-') + '.pdf';
  }
  if (pdfUrl && pdfUrl !== '#') {
    pdfFrame.innerHTML = `<iframe src="${pdfUrl}" width="100%" height="460" style="border:none;border-radius:10px;" title="${title} Certificate"></iframe>`;
  } else {
    pdfFrame.innerHTML = `
      <div class="pdf-placeholder">
        <i class="fa-regular fa-file-pdf"></i>
        <p>Certificate PDF will appear here once uploaded.<br>Click <strong>Download</strong> to save the file.</p>
      </div>`;
  }
  pdfModal.classList.add('on');
  document.body.style.overflow = 'hidden';
};
window.closeCertModal = function() {
  pdfModal?.classList.remove('on');
  document.body.style.overflow = '';
};
pdfModal?.addEventListener('click', e => { if (e.target === pdfModal) closeCertModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCertModal(); });

/* ── CONTACT FORM ──────────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const sendBtn = document.getElementById('send-btn');

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name    = document.getElementById('cf-name')?.value.trim();
  const email   = document.getElementById('cf-email')?.value.trim();
  const subject = document.getElementById('cf-subject')?.value.trim();
  const message = document.getElementById('cf-message')?.value.trim();

  if (!name || !email || !message) return showStatus('Please fill in all required fields.', 'error');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showStatus('Please enter a valid email address.', 'error');

  sendBtn.disabled = true;
  sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

  // Demo-only — wire to your backend / form service of choice.
  setTimeout(() => {
    showStatus('Thanks! Your message was sent. I\'ll get back to you soon.', 'success');
    contactForm.reset();
    sendBtn.disabled = false;
    sendBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Send Message';
  }, 900);
});

function showStatus(msg, type) {
  if (!statusEl) return;
  statusEl.textContent = msg;
  statusEl.className = 'form-status ' + type;
  setTimeout(() => { statusEl.className = 'form-status'; statusEl.textContent = ''; }, 5500);
}

/* ── FOOTER YEAR ──────────────────────────────────────────── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();
