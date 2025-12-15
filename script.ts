// TypeScript source for portfolio interactions

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  const sections = Array.from(document.querySelectorAll<HTMLElement>('main .section'));
  const nav = document.getElementById('site-nav') as HTMLElement | null;
  const toggle = document.getElementById('nav-toggle') as HTMLButtonElement | null;

  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav toggle
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const showing = getComputedStyle(nav).display === 'flex';
      nav.style.display = showing ? 'none' : 'flex';
    });
  }

  // Smooth scroll
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href')?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      if (window.innerWidth <= 900 && nav) nav.style.display = 'none';
    });
  });

  // IntersectionObserver to highlight sections and animate them
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        el.classList.add('in-view', 'active-section');
        // set active nav link
        const id = el.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+id));
      } else {
        el.classList.remove('in-view', 'active-section');
      }
    });
  }, { threshold: 0.28 });

  sections.forEach(s => io.observe(s));

  // small keyboard accessibility: focus first input in contact on Enter from contact nav
  const contactLink = Array.from(navLinks).find(a => a.getAttribute('href') === '#contact');
  if (contactLink) {
    contactLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const firstInput = document.querySelector('.contact-form input') as HTMLInputElement | null;
        firstInput?.focus();
      }
    });
  }

  // animate radial skill circles when skills section is visible
  const skillEls = Array.from(document.querySelectorAll<HTMLElement>('.skill'));
  function animateRadials() {
    skillEls.forEach(el => {
      const percent = Number(el.dataset.percent || 0);
      const progress = el.querySelector<SVGPathElement>('.progress');
      if (!progress) return;
      const dash = Math.round((percent / 100) * 100);
      // stroke-dasharray accepts two values: filled, remainder (we use 100 base)
      progress.style.strokeDasharray = `${dash} ${100 - dash}`;
      // add a small transition class
      progress.style.transition = 'stroke-dasharray 900ms cubic-bezier(.2,.9,.2,1)';
    });
  }

  // trigger animation when skills section intersects
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsIO = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) animateRadials(); });
    }, { threshold: 0.3 });
    skillsIO.observe(skillsSection);
  }

  // Contact form handling: validation + demo send
  const contactForm = document.querySelector<HTMLFormElement>('.contact-form');
  if (contactForm) {
    const inputs = Array.from(contactForm.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input,textarea'));
    const submit = contactForm.querySelector<HTMLButtonElement>('button[type="submit"]');
    function validEmail(e:string){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}

    function formValid(){
      const name = (inputs[0] as HTMLInputElement).value.trim();
      const email = (inputs[1] as HTMLInputElement).value.trim();
      const message = (inputs[3] as HTMLTextAreaElement).value.trim();
      return name.length>1 && validEmail(email) && message.length>5;
    }

    // live enable/disable submit
    inputs.forEach(i => i.addEventListener('input', ()=>{
      if (submit) submit.disabled = !formValid();
    }));

    // start with disabled
    if (submit) submit.disabled = true;

    contactForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      if (!formValid()) return;
      // demo success feedback
      if (submit) {
        submit.textContent = 'Sending...';
        submit.disabled = true;
      }
      setTimeout(()=>{
        // show success toast
        const msg = document.createElement('div');
        msg.className = 'form-toast success';
        msg.textContent = 'Message sent — I will get back to you soon!';
        document.body.appendChild(msg);
        setTimeout(()=>msg.classList.add('visible'),20);
        setTimeout(()=>{ msg.classList.remove('visible'); setTimeout(()=>msg.remove(),300); },4000);
        // reset
        contactForm.reset();
        if (submit) submit.textContent = 'Send Message';
      }, 900);
    });
  }
});
