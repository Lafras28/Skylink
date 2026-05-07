/* =====================================================================
   SKYLINK — SHARED JS
   Loader · Custom cursor · Scroll progress · Nav · Mobile menu ·
   Scroll reveal · Testimonials slider · Contact form · Smooth scroll ·
   Hero parallax
   ---------------------------------------------------------------------
   All section-specific blocks below are defensively guarded so this
   single file can be included from every page (Home, Services,
   Drone Security, Industrial) without errors when an element isn't
   present on that page.
===================================================================== */

/* LOADER */
window.addEventListener('load', () => {
  const fill = document.getElementById('lfill');
  const loader = document.getElementById('loader');
  if (!fill || !loader) return;
  setTimeout(() => { fill.style.width = '100%'; }, 80);
  setTimeout(() => {
    loader.classList.add('out');
    setTimeout(() => { loader.style.display = 'none'; }, 900);
  }, 1900);
});

/* CURSOR */
const cur = document.getElementById('cur');
const ring = document.getElementById('curRing');
let cx = 0, cy = 0, rx = 0, ry = 0;
if (cur && ring) {
  document.addEventListener('mousemove', e => {
    cx = e.clientX; cy = e.clientY;
    cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
  });
  (function tickRing() {
    rx += (cx - rx) * 0.12; ry += (cy - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(tickRing);
  })();
  document.querySelectorAll('a,button,.srv-card,.pf-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('hov'); ring.classList.add('hov'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('hov'); ring.classList.remove('hov'); });
  });
  if ('ontouchstart' in window) { cur.style.display = 'none'; ring.style.display = 'none'; }
}

/* SCROLL PROGRESS */
const pbar = document.getElementById('pbar');
if (pbar) {
  window.addEventListener('scroll', () => {
    const t = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    pbar.style.width = (t / h * 100) + '%';
  }, { passive: true });
}

/* NAV SCROLL */
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scroll', window.scrollY > 60);
  }, { passive: true });
}

/* HAMBURGER */
const ham = document.getElementById('ham');
const mob = document.getElementById('mobMenu');
if (ham && mob) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
}
function closeMob() {
  if (!ham || !mob) return;
  ham.classList.remove('open');
  mob.classList.remove('open');
  document.body.style.overflow = '';
}

/* SCROLL REVEAL */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.rv').forEach(el => obs.observe(el));

/* TESTIMONIALS SLIDER */
const track = document.getElementById('tesTrack');
const dots  = document.querySelectorAll('.tdot');
let cur_s = 0, auto;

if (track && dots.length) {
  function cardW() {
    const c = track.querySelector('.tes-card');
    return c.offsetWidth + parseInt(getComputedStyle(track).gap || '28');
  }
  function goTo(i) {
    cur_s = i;
    track.style.transform = `translateX(-${i * cardW()}px)`;
    dots.forEach((d, j) => d.classList.toggle('act', j === i));
  }
  dots.forEach(d => d.addEventListener('click', () => { clearInterval(auto); goTo(+d.dataset.i); startAuto(); }));
  function startAuto() { auto = setInterval(() => goTo((cur_s + 1) % dots.length), 4500); }
  startAuto();

  let ts = 0;
  track.addEventListener('touchstart', e => { ts = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = ts - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 40) {
      clearInterval(auto);
      goTo(dx > 0 ? Math.min(cur_s + 1, dots.length - 1) : Math.max(cur_s - 1, 0));
      startAuto();
    }
  });
}

/* CONTACT FORM
   ─────────────────────────────────────────────────────────────────
   FORM EMAIL SETTINGS HERE
   The form uses mailto: to open the user's email client pre-filled.
   To change the destination email, update the FORM_EMAIL value below.
   ───────────────────────────────────────────────────────────────── */
function submitForm() {
  /* CHANGE FORM EMAIL HERE — update this address to change where
     form submissions are directed.                                  */
  const FORM_EMAIL = 'info@skylinkinnovations.co.za';

  const form     = document.getElementById('cForm');
  const ok       = document.getElementById('fOk');
  if (!form || !ok) return;
  const btn      = form.querySelector('.btn-sub');

  /* Collect field values */
  const inputs   = form.querySelectorAll('.fi');
  const firstName  = inputs[0] ? inputs[0].value.trim() : '';
  const lastName   = inputs[1] ? inputs[1].value.trim() : '';
  const email      = inputs[2] ? inputs[2].value.trim() : '';
  const propType   = form.querySelector('.fsel') ? form.querySelector('.fsel').value : '';
  const message    = form.querySelector('.fta')  ? form.querySelector('.fta').value.trim() : '';

  /* Build mailto body */
  const subject = encodeURIComponent('Skylink Website Enquiry');
  const body    = encodeURIComponent(
    'Name: ' + firstName + ' ' + lastName + '\n' +
    'Email: ' + email + '\n' +
    'Property Type: ' + propType + '\n\n' +
    'Message:\n' + message
  );

  /* Open mail client pre-addressed and pre-filled */
  window.location.href = 'mailto:' + FORM_EMAIL + '?subject=' + subject + '&body=' + body;

  /* Show sending state, then success message */
  if (btn) {
    btn.textContent = 'Sending...';
    btn.style.opacity = '.5';
  }
  setTimeout(() => {
    form.querySelectorAll('.fg,.frow,.btn-sub').forEach(el => el.style.display = 'none');
    ok.style.display = 'block';
  }, 1200);
}

/* SMOOTH SCROLL — only intercept in-page anchors that exist on the page.
   Cross-page links (e.g. "services.html#services") fall through to normal
   browser navigation. */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const t = document.querySelector(href);
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* HERO GRID PARALLAX */
const hgrid = document.querySelector('.h-grid');
if (hgrid) {
  window.addEventListener('scroll', () => {
    hgrid.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}
