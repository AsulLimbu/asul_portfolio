// Transpiled runtime JS (from script.ts)
document.addEventListener('DOMContentLoaded', function () {
		var navLinks = document.querySelectorAll('.nav-link');
		var sections = Array.from(document.querySelectorAll('main .section'));
		var nav = document.getElementById('site-nav');
		var toggle = document.getElementById('nav-toggle');
		var yearEl = document.getElementById('year');
		if (yearEl)
				yearEl.textContent = new Date().getFullYear();
		if (toggle && nav) {
				toggle.addEventListener('click', function () {
						var showing = getComputedStyle(nav).display === 'flex';
						nav.style.display = showing ? 'none' : 'flex';
				});
		}
		navLinks.forEach(function (link) {
				link.addEventListener('click', function (e) {
						e.preventDefault();
						var id = this.getAttribute('href').slice(1);
						if (!id)
								return;
						var target = document.getElementById(id);
						if (target) {
								target.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}
						if (window.innerWidth <= 900 && nav)
								nav.style.display = 'none';
				});
		});
		var io = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
						var el = entry.target;
						if (entry.isIntersecting) {
								el.classList.add('in-view', 'active-section');
								var id = el.id;
								navLinks.forEach(function (a) { return a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
						}
						else {
								el.classList.remove('in-view', 'active-section');
						}
				});
		}, { threshold: 0.28 });
		sections.forEach(function (s) { return io.observe(s); });
		var contactLink = Array.from(navLinks).find(function (a) { return a.getAttribute('href') === '#contact'; });
		if (contactLink) {
				contactLink.addEventListener('keydown', function (e) {
						if (e.key === 'Enter') {
								var firstInput = document.querySelector('.contact-form input');
								if (firstInput)
										firstInput.focus();
						}
				});
		}
		// animate radial skill circles when skills section is visible
		var skillEls = Array.from(document.querySelectorAll('.skill'));
		function animateRadials() {
			skillEls.forEach(function (el) {
				var percent = Number(el.dataset.percent || 0);
				var progress = el.querySelector('.progress');
				if (!progress)
					return;
				var dash = Math.round(percent / 100 * 100);
				progress.style.strokeDasharray = dash + " " + (100 - dash);
				progress.style.transition = 'stroke-dasharray 900ms cubic-bezier(.2,.9,.2,1)';
			});
		}
		var skillsSection = document.getElementById('skills');
		if (skillsSection) {
			var skillsIO = new IntersectionObserver(function (entries) {
				entries.forEach(function (en) { if (en.isIntersecting)
					animateRadials(); });
			}, { threshold: 0.3 });
			skillsIO.observe(skillsSection);
		}

		// Contact form handling: validation + demo send
		var contactForm = document.querySelector('.contact-form');
		if (contactForm) {
			var inputs = Array.from(contactForm.querySelectorAll('input,textarea'));
			var submit_1 = contactForm.querySelector('button[type="submit"]');
			function validEmail(e) { return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(e); }
			function formValid() {
				var name = inputs[0].value.trim();
				var email = inputs[1].value.trim();
				var message = inputs[3].value.trim();
				return name.length > 1 && validEmail(email) && message.length > 5;
			}
			inputs.forEach(function (i) { return i.addEventListener('input', function () {
				if (submit_1)
					submit_1.disabled = !formValid();
			}); });
			if (submit_1)
				submit_1.disabled = true;
			contactForm.addEventListener('submit', function (e) {
				e.preventDefault();
				if (!formValid())
					return;
				if (submit_1) {
					submit_1.textContent = 'Sending...';
					submit_1.disabled = true;
				}
				setTimeout(function () {
					var msg = document.createElement('div');
					msg.className = 'form-toast success';
					msg.textContent = 'Message sent — I will get back to you soon!';
					document.body.appendChild(msg);
					setTimeout(function () { return msg.classList.add('visible'); }, 20);
					setTimeout(function () { msg.classList.remove('visible'); setTimeout(function () { return msg.remove(); }, 300); }, 4000);
					contactForm.reset();
					if (submit_1)
						submit_1.textContent = 'Send Message';
				}, 900);
			});
		}
});

