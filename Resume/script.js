// Mobile nav toggle
(function() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function() {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.classList.toggle('active', isOpen);
  });
})();

  // Smooth scroll for internal links
(function() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function(link) {
    link.addEventListener('click', function(e) {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
})();

  // Magnetic hover for buttons/links
  (function() {
    var items = document.querySelectorAll('.magnetic');
    if (!items.length) return;
    items.forEach(function(item){
      var strength = 12;
      item.addEventListener('mousemove', function(e){
        var rect = item.getBoundingClientRect();
        var relX = e.clientX - rect.left - rect.width / 2;
        var relY = e.clientY - rect.top - rect.height / 2;
        item.style.transform = 'translate(' + (relX/rect.width*strength) + 'px,' + (relY/rect.height*strength) + 'px)';
      });
      item.addEventListener('mouseleave', function(){
        item.style.transform = 'translate(0,0)';
      });
    });
  })();

  // Intercept contact form submit -> send via fetch to FormSubmit, no redirect
  (function(){
    var form = document.querySelector('form.contact-form');
    if (!form) return;
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var data = new FormData(form);
      var action = form.getAttribute('action');
      if (!action) return form.submit();
      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function(res){
        // Regardless of status, show toast success if 2xx
        if (res.ok) {
          showToast('Message sent successfully!');
          form.reset();
        } else {
          return res.json().then(function(){ throw new Error('Submit failed'); }).catch(function(){ throw new Error('Submit failed'); });
        }
      }).catch(function(){
        showToast('There was a problem sending your message.');
      });
    });

    var toast = document.getElementById('toast');
    var toastTimer;
    function showToast(msg){
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 2800);
    }
  })();

  // Button ripple on click
  (function(){
    var btns = document.querySelectorAll('.btn');
    btns.forEach(function(btn){
      btn.addEventListener('click', function(e){
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        var rect = btn.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        btn.appendChild(ripple);
        setTimeout(function(){ ripple.remove(); }, 650);
      });
    });
  })();

  // Generate hero particles
  (function(){
    var container = document.querySelector('.particles');
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var count = 24;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = Math.random() * 6 + 4;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.left = Math.random() * 100 + '%';
      p.style.bottom = Math.random() * 60 + 'px';
      var dur = 4000 + Math.random() * 4000;
      p.style.animationDuration = dur + 'ms';
      p.style.animationDelay = (Math.random() * 2000) + 'ms';
      container.appendChild(p);
    }
  })();

// WOW.js init
document.addEventListener('DOMContentLoaded', function() {
  // Intro sequence: fly-in orb then reveal content
  var body = document.body;
  var orb = document.querySelector('.orb');
  var heroCopy = document.querySelector('.hero-copy');
  var trailLayer = document.querySelector('.intro-trail');
  // removed shockwave/bloom
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (orb && !prefersReduced) {
    body.classList.add('intro-active', 'play-intro');
    // delay WOW and other reveals until intro completes
    var introDuration = 2000 + 300; // animation + buffer
    // Spawn comet-like trail during intro
    if (trailLayer) {
      var start = performance.now();
      function emitTrail(ts) {
        var elapsed = ts - start;
        if (elapsed < introDuration - 400) {
          // create a dot near the orb position
          var rect = orb.getBoundingClientRect();
          var x = rect.left + rect.width / 2 + (Math.random()*16 - 8);
          var y = rect.top + rect.height / 2 + (Math.random()*16 - 8);
          var dot = document.createElement('span');
          dot.className = 'trail-dot' + (Math.random() > 0.5 ? ' alt' : '');
          dot.style.left = x + 'px';
          dot.style.top = y + 'px';
          trailLayer.appendChild(dot);
          setTimeout(function(){ dot.remove(); }, 950);
          requestAnimationFrame(emitTrail);
        }
      }
      requestAnimationFrame(emitTrail);
    }
    setTimeout(function(){
      body.classList.remove('intro-active');
      if (trailLayer) trailLayer.innerHTML = '';
      // initialize WOW after intro
      initAnimations();
    }, introDuration);
  } else {
    initAnimations();
  }
  // i18n: translations
  var translations = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About',
      'nav.skills': 'Skills',
      'nav.projects': 'Projects',
      'nav.experience': 'Experience',
      'nav.contact': 'Contact',
      'hero.title': "Hi, I'm <span class=\"accent\">Illia Melnykov</span>",
      'hero.subtitle': 'Front-end Developer crafting delightful, fast, accessible web experiences.',
      'cta.viewProjects': 'View Projects',
      'cta.contactMe': 'Contact Me',
      'about.heading': 'About',
      'about.p1': 'I specialize in building interfaces that are fast, accessible, and beautiful. I enjoy working with modern stacks and bringing ideas to life through motion and micro-interactions.',
      'about.p2': 'When not coding, I like sketching UI ideas, exploring new CSS tricks, and learning about performance.',
      'about.b1': 'Clean, maintainable code',
      'about.b2': 'Attention to detail',
      'about.b3': 'Accessible by default',
      'about.b4': 'Performance focused',
      'skills.heading': 'Skills',
      'skills.html': 'HTML5',
      'skills.css': 'CSS3 / Sass',
      'skills.js': 'JavaScript',
      'skills.react': 'React',
      'skills.a11y': 'Accessibility',
      'skills.perf': 'Performance',
      'projects.heading': 'Projects',
      'projects.p1.title': 'Project One',
      'projects.p1.desc': 'High-performance landing page with SVG animations and responsive layout.',
      'projects.p2.title': 'Project Two',
      'projects.p2.desc': 'Interactive dashboard featuring charts, filters, and delightful microinteractions.',
      'projects.p3.title': 'Project Three',
      'projects.p3.desc': 'Accessible design system with reusable components and documentation.',
      'projects.view': 'View',
      'exp.heading': 'Experience',
      'exp.r1.time': '2023 — Present',
      'exp.r1.title': 'Front-end Engineer, Company',
      'exp.r1.desc': 'Leading front-end architecture, performance improvements, and UI animations.',
      'exp.r2.time': '2021 — 2023',
      'exp.r2.title': 'Web Developer, Studio',
      'exp.r2.desc': 'Built responsive websites and SPAs with focus on accessibility and DX.',
      'contact.heading': 'Contact',
      'contact.desc': "Have a project in mind or want to say hi? Let's talk.",
      'contact.name': 'Name',
      'contact.email': 'Email',
      'contact.message': 'Message',
      'contact.send': 'Send',
      'footer.copy': 'All rights reserved'
    },
    uk: {
      'nav.home': 'Головна',
      'nav.about': 'Про мене',
      'nav.skills': 'Навички',
      'nav.projects': 'Проєкти',
      'nav.experience': 'Досвід',
      'nav.contact': 'Контакти',
      'hero.title': 'Привіт, я <span class=\"accent\">Мельников Ілля</span>',
      'hero.subtitle': 'Фронтенд-розробник, що створює швидкі, доступні та приємні інтерфейси.',
      'cta.viewProjects': 'Переглянути проєкти',
      'cta.contactMe': 'Зв’язатися',
      'about.heading': 'Про мене',
      'about.p1': 'Я спеціалізуюся на створенні інтерфейсів, які є швидкими, доступними й красивими. Люблю сучасні стекі та втілювати ідеї за допомогою анімацій і мікровзаємодій.',
      'about.p2': 'Коли не пишу код, люблю ескізувати ідеї інтерфейсів, досліджувати нові прийоми CSS та вивчати продуктивність.',
      'about.b1': 'Чистий, підтримуваний код',
      'about.b2': 'Увага до деталей',
      'about.b3': 'Доступність за замовчуванням',
      'about.b4': 'Фокус на продуктивність',
      'skills.heading': 'Навички',
      'skills.html': 'HTML5',
      'skills.css': 'CSS3 / Sass',
      'skills.js': 'JavaScript',
      'skills.react': 'React',
      'skills.a11y': 'Доступність',
      'skills.perf': 'Продуктивність',
      'projects.heading': 'Проєкти',
      'projects.p1.title': 'Проєкт 1',
      'projects.p1.desc': 'Високопродуктивна лендинг-сторінка з SVG-анімаціями і адаптивним макетом.',
      'projects.p2.title': 'Проєкт 2',
      'projects.p2.desc': 'Інтерактивна панель з графіками, фільтрами та мікровзаємодіями.',
      'projects.p3.title': 'Проєкт 3',
      'projects.p3.desc': 'Доступна дизайн-система з багаторазовими компонентами та документацією.',
      'projects.view': 'Переглянути',
      'exp.heading': 'Досвід',
      'exp.r1.time': '2023 — дотепер',
      'exp.r1.title': 'Front-end Engineer, Компанія',
      'exp.r1.desc': 'Очолював архітектуру фронтенда, оптимізацію продуктивності та UI-анімації.',
      'exp.r2.time': '2021 — 2023',
      'exp.r2.title': 'Веб-розробник, Студія',
      'exp.r2.desc': 'Створював адаптивні сайти і SPA з акцентом на доступність і зручність розробки.',
      'contact.heading': 'Контакти',
      'contact.desc': 'Є ідея або хочете привітатися? Давайте поспілкуємося.',
      'contact.name': "Ім'я",
      'contact.email': 'Ел. пошта',
      'contact.message': 'Повідомлення',
      'contact.send': 'Надіслати',
      'footer.copy': 'Усі права захищені'
    }
  };

  var currentLang = localStorage.getItem('lang') || 'en';

  function applyTranslations(lang) {
    var dict = translations[lang] || translations.en;
    document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';
    var nodes = document.querySelectorAll('[data-i18n]');
    nodes.forEach(function(node) {
      var key = node.getAttribute('data-i18n');
      var value = dict[key];
      if (typeof value === 'string') {
        // Allow HTML in some translations like hero.title
        node.innerHTML = value;
      }
    });
    // Update pressed state on buttons
    var buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(function(btn){
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
  }

  // Setup switcher
  var switchButtons = document.querySelectorAll('.lang-btn');
  switchButtons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var lang = btn.getAttribute('data-lang');
      if (lang === currentLang) return;
      currentLang = lang;
      localStorage.setItem('lang', lang);
      // Orchestrate animation: fade out, swap, fade in with stagger
      var root = document.body;
      root.classList.add('i18n-out');
      // after out transition
      setTimeout(function(){
        applyTranslations(lang);
        // small stagger: add transition delay per element order
        var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
        nodes.forEach(function(el, idx){
          el.style.transitionDelay = (idx % 12) * 12 + 'ms';
        });
        // allow paint then remove class to animate in
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            root.classList.remove('i18n-out');
            // clear delays after animation
            setTimeout(function(){
              nodes.forEach(function(el){ el.style.transitionDelay = ''; });
            }, 400);
          });
        });
      }, 160);
    });
  });

  // Initial apply
  applyTranslations(currentLang);
  function initAnimations(){
    if (typeof WOW !== 'undefined') {
      new WOW({
        boxClass: 'wow',
        animateClass: 'animate__animated',
        offset: 80,
        mobile: true,
        live: true
      }).init();
    }
    // Re-apply i18n after intro to ensure hero title renders
    if (typeof translations !== 'undefined' && typeof applyTranslations === 'function') {
      // no-op; applyTranslations is scoped; we rely on existing content
    }
  }
  // Stagger project cards' wow delay
  var projectCards = document.querySelectorAll('.projects .card');
  projectCards.forEach(function(card, idx){
    card.setAttribute('data-wow-delay', (0.05 + idx * 0.05) + 's');
  });

  // Set current year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Active nav highlighting on scroll
  var sections = document.querySelectorAll('main section[id]');
  var navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      var id = entry.target.getAttribute('id');
      if (!id) return;
      var link = document.querySelector('.site-nav a[href="#' + id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(function(l) { l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
  sections.forEach(function(sec) { observer.observe(sec); });

  // Animate skill bars when they enter viewport
  var skillBars = document.querySelectorAll('.bar > span[data-progress]');
  var barObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        var el = entry.target;
        var pct = el.getAttribute('data-progress');
        el.style.width = pct + '%';
        barObserver.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -20% 0px', threshold: 0.2 });
  skillBars.forEach(function(el){ barObserver.observe(el); });

  // Parallax effect for hero orb
  if (orb && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function(){
      var y = window.scrollY || window.pageYOffset;
      var translate = Math.min(14, y * 0.03);
      var rotate = Math.min(5, y * 0.01);
      var current = orb.style.transform || '';
      // Preserve intro transform end state by applying only additional translate/rotate
      orb.style.transform = 'translateY(' + (-translate) + 'px) rotate(' + rotate + 'deg)';
    }, { passive: true });
  }

  // 3D tilt on project cards
  var cards = document.querySelectorAll('.projects .card');
  cards.forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width;
      var y = (e.clientY - rect.top) / rect.height;
      var rotateY = (x - 0.5) * 10; // deg
      var rotateX = (0.5 - y) * 10; // deg
      card.style.transform = 'perspective(600px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(0)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });

  // Scroll progress bar and back to top
  var progress = document.querySelector('.progress');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = docHeight ? (scrollTop / docHeight) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    if (toTop) toTop.classList.toggle('show', scrollTop > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Page transition on anchor clicks
  var transition = document.querySelector('.page-transition');
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(){
      if (!transition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      transition.classList.add('active');
      setTimeout(function(){ transition.classList.remove('active'); }, 450);
    });
  });

  // Count-up for skill percents
  var percents = document.querySelectorAll('.percent[data-count]');
  var percentObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var start = 0;
        var duration = 900;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min(1, (ts - startTime) / duration);
          var val = Math.round(start + (target - start) * p);
          el.textContent = val + '%';
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        percentObserver.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -20% 0px', threshold: 0.2 });
  percents.forEach(function(el){ percentObserver.observe(el); });
});


