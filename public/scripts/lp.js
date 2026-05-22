//FEATURE DETECTION
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isTouch = 'ontouchstart' in window;

    // COURSE CATALOG
    const COURSE_CATALOG = [
      { id: 'formacao-completa', title: 'Formação em Gestalt-Terapia', tag: 'Formação', file: 'formacao-gestalt-terapia-instituto-mineiro-imgt.html', accent: '#00C3FF' },
      { id: 'curso-gratuito', title: 'Por dentro da Gestalt-Terapia', tag: 'Gratuito', file: 'curso-gratuito-gestalt-terapia.html', accent: '#00C3FF' },
      { id: 'ansiedade', title: 'Compreensão e Manejo Clínico da Ansiedade', tag: 'Minicurso', file: 'minicurso-ansiedade-manejo-clinico.html', accent: '#FF6D00' },
      { id: 'depressao', title: 'Compreensão e Manejo Clínico da Depressão', tag: 'Minicurso', file: 'minicurso-depressao-manejo-clinico.html', accent: '#07D62D' },
      { id: 'ciclo-de-contato', title: 'O Ciclo do Contato na Clínica', tag: 'Minicurso', file: 'minicurso-ciclo-contato-gestalt-terapia.html', accent: '#D31160' },
      { id: 'teoria-do-self', title: 'Teoria do Self na Gestalt-Terapia', tag: 'Minicurso', file: 'minicurso-teoria-do-self-gestalt-terapia.html', accent: '#D31160' },
      { id: 'fenomenologia', title: 'Fenomenologia e Psicoterapia', tag: 'Minicurso', file: 'minicurso-fenomenologia-psicoterapia.html', accent: '#6633FF' },
      { id: 'vicios', title: 'Vícios Contemporâneos', tag: 'Minicurso', file: 'minicurso-vicios-contemporaneos-psicoterapia.html', accent: '#ED1C24' },
      { id: 'tdah', title: 'TDAH na Clínica Psicoterapêutica', tag: 'Minicurso', file: 'minicurso-tdah-clinica-psicoterapeutica.html', accent: '#FFB600' },
    ];

    // OUTROS CURSOS — carousel
    (function initOutrosCursos() {
      const section = document.querySelector('.outros-cursos');
      if (!section) return;
      const currentId = section.dataset.currentCourse;
      const track = section.querySelector('.outros-cursos-track');
      const dotsContainer = section.querySelector('.carousel-dots');
      const prevBtn = section.querySelector('.carousel-prev');
      const nextBtn = section.querySelector('.carousel-next');
      if (!track) return;

      const courses = COURSE_CATALOG.filter(c => c.id !== currentId);

      courses.forEach((course, i) => {
        const card = document.createElement('a');
        card.href = course.file;
        card.className = 'curso-card';
        card.style.setProperty('--card-accent', course.accent);
        card.setAttribute('data-anim', 'scale-up');
        card.setAttribute('data-delay', String(Math.min(i + 1, 4)));

        card.innerHTML = `
          <div class="curso-card-image"><span>3:4</span></div>
          <div class="curso-card-body">
            <span class="curso-card-tag">${course.tag}</span>
            <h3 class="curso-card-title">${course.title}</h3>
            <span class="curso-card-cta">Ver mais <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
          </div>
        `;
        track.appendChild(card);
      });

      // Carousel logic — infinite + autoplay
      let currentPage = 0;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      const AUTOPLAY_MS = 4000;
      let autoplayId = null;
      let isPaused = false;

      function getPerPage() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 3;
        return 4;
      }

      function getTotalPages() {
        return Math.max(1, Math.ceil(courses.length / getPerPage()));
      }

      function buildDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const total = getTotalPages();
        for (let i = 0; i < total; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
          dot.setAttribute('aria-label', `Página ${i + 1}`);
          dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
          dotsContainer.appendChild(dot);
        }
      }

      function goTo(page) {
        const total = getTotalPages();
        const perPage = getPerPage();
        currentPage = ((page % total) + total) % total;

        const cardWidth = track.children[0]?.offsetWidth || 0;
        const step = (cardWidth + gap) * perPage;
        const maxOffset = track.scrollWidth - track.parentElement.offsetWidth;
        const offset = Math.min(currentPage * step, Math.max(0, maxOffset));

        track.style.transform = `translateX(-${offset}px)`;

        dotsContainer?.querySelectorAll('.carousel-dot').forEach((d, i) => {
          d.classList.toggle('active', i === currentPage);
        });
      }

      function startAutoplay() {
        stopAutoplay();
        autoplayId = setInterval(() => {
          if (!isPaused) goTo(currentPage + 1);
        }, AUTOPLAY_MS);
      }

      function stopAutoplay() {
        if (autoplayId) { clearInterval(autoplayId); autoplayId = null; }
      }

      function resetAutoplay() {
        startAutoplay();
      }

      buildDots();
      goTo(0);

      if (prevBtn) prevBtn.addEventListener('click', () => { goTo(currentPage - 1); resetAutoplay(); });
      if (nextBtn) nextBtn.addEventListener('click', () => { goTo(currentPage + 1); resetAutoplay(); });

      // Pause on hover, resume on leave
      section.addEventListener('mouseenter', () => { isPaused = true; });
      section.addEventListener('mouseleave', () => { isPaused = false; });

      // Start autoplay when section is visible
      const autoplayObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) startAutoplay();
          else stopAutoplay();
        });
      }, { threshold: 0.2 });
      autoplayObserver.observe(section);

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          const total = getTotalPages();
          if (currentPage >= total) currentPage = total - 1;
          buildDots();
          goTo(currentPage);
        }, 150);
      }, { passive: true });
    })();

    //CUSTOM CURSOR + MAGNETIC BUTTONS + GRADIENT MESH
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let mouseMoving = false;
    let mouseIdleTimer = null;

    const glows = document.querySelectorAll('.gradient-mesh .glow');
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    const glowPositions = [
      { x: 0, y: 0, speed: 0.06, offsetX: 0, offsetY: 0 },
      { x: 0, y: 0, speed: 0.03, offsetX: -200, offsetY: 100 },
      { x: 0, y: 0, speed: 0.02, offsetX: 150, offsetY: -150 },
    ];

    if (!isMobile && !isTouch && !prefersReducedMotion) {
      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        targetX = e.clientX;
        targetY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';

        if (!mouseMoving) {
          mouseMoving = true;
          animateLoop();
        }
        clearTimeout(mouseIdleTimer);
        mouseIdleTimer = setTimeout(() => { mouseMoving = false; }, 3000);
      }, { passive: true });

      function animateLoop() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        if (glows.length) {
          glows.forEach((glow, i) => {
            const pos = glowPositions[i];
            const tx = targetX + pos.offsetX;
            const ty = targetY + pos.offsetY;
            pos.x += (tx - pos.x) * pos.speed;
            pos.y += (ty - pos.y) * pos.speed;
            glow.style.transform = `translate3d(${pos.x - 300}px, ${pos.y - 300}px, 0)`;
          });
        }

        if (mouseMoving) requestAnimationFrame(animateLoop);
      }
      animateLoop();

      const hoverTargets = 'a, button, .btn-primary, .btn-secondary, .destaque-card, .modulo-card, .etapa-card, .depoimento-card, .faq-question, .curso-card';
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest(hoverTargets)) {
          cursorDot.classList.add('hovering');
          cursorRing.classList.add('hovering');
        }
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest(hoverTargets)) {
          cursorDot.classList.remove('hovering');
          cursorRing.classList.remove('hovering');
        }
      });

      document.querySelectorAll('.magnetic').forEach(btn => {
        const strength = parseFloat(btn.dataset.strength) || 0.3;

        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * strength;
          const dy = (e.clientY - cy) * strength;
          btn.style.transform = `translate(${dx}px, ${dy}px)`;
        }, { passive: true });

        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
          btn.style.transition = 'transform 0.5s var(--ease-spring)';
          setTimeout(() => { btn.style.transition = ''; }, 500);
        });
      });
    }

    //HERO WORD SPLIT + ENTRANCE
    function splitHeroWords() {
      const h1 = document.querySelector('.hero-content h1');
      if (!h1) return;
      let wordIndex = 0;

      function processNodeInto(node, target) {
        if (node.nodeType === Node.TEXT_NODE) {
          const words = node.textContent.split(/(\s+)/);
          words.forEach(word => {
            if (word.match(/^\s+$/)) {
              target.appendChild(document.createTextNode(word));
            } else if (word.length > 0) {
              const mask = document.createElement('span');
              mask.className = 'hero-word-mask';
              const inner = document.createElement('span');
              inner.className = 'hero-word';
              inner.style.animationDelay = (0.25 + wordIndex * 0.1) + 's';
              inner.textContent = word;
              mask.appendChild(inner);
              target.appendChild(mask);
              wordIndex++;
            }
          });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const clone = node.cloneNode(false);
          node.childNodes.forEach(child => processNodeInto(child, clone));
          target.appendChild(clone);
        }
      }

      const result = document.createDocumentFragment();
      h1.childNodes.forEach(child => processNodeInto(child, result));
      h1.innerHTML = '';
      h1.appendChild(result);
      h1.classList.add('hero-words-split');
    }

    //H2 LETTER STAGGER
    function setupLetterStagger() {
      document.querySelectorAll('[data-letter-stagger]').forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        el.classList.add('letter-stagger');

        const words = text.split(' ');
        words.forEach((word, wi) => {
          const mask = document.createElement('span');
          mask.className = 'word-mask';
          const inner = document.createElement('span');
          inner.className = 'word-inner';
          inner.textContent = word;
          inner.style.transitionDelay = (wi * 0.08) + 's';
          mask.appendChild(inner);
          el.appendChild(mask);
          if (wi < words.length - 1) {
            const space = document.createElement('span');
            space.className = 'word-space';
            el.appendChild(space);
          }
        });
      });
    }

    //TEXT SCRAMBLE
    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    function scrambleText(el) {
      const original = el.textContent;
      let iteration = 0;
      const totalFrames = 15;

      const interval = setInterval(() => {
        el.textContent = original.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return original[i];
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }).join('');

        iteration += original.length / totalFrames;
        if (iteration >= original.length) {
          el.textContent = original;
          clearInterval(interval);
        }
      }, 35);
    }

    //3D TILT CARDS
    if (!isMobile && !isTouch && !prefersReducedMotion) {
      document.querySelectorAll('.tilt-card').forEach(card => {
        const shine = card.querySelector('.card-shine');

        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width;
          const y = (e.clientY - rect.top) / rect.height;

          const tiltX = (y - 0.5) * -10;
          const tiltY = (x - 0.5) * 10;

          card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02,1.02,1)`;

          if (shine) {
            shine.style.setProperty('--shine-x', (x * 100) + '%');
            shine.style.setProperty('--shine-y', (y * 100) + '%');
          }
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.transition = 'transform 0.6s var(--ease-out-expo)';
          setTimeout(() => { card.style.transition = ''; }, 600);
        });

        card.addEventListener('mouseenter', () => {
          card.style.transition = '';
        });
      });
    }

    //CANVAS PARTICLES
    function initParticles(canvas) {
      if (isMobile || prefersReducedMotion || !canvas) return;

      const ctx = canvas.getContext('2d', { alpha: true });
      const parent = canvas.parentElement;
      let particles = [];
      let animId;
      const LINK_DIST = 180;
      const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

      function resize() {
        const rect = parent.getBoundingClientRect();
        canvas.width = rect.width || parent.offsetWidth || 1200;
        canvas.height = rect.height || parent.offsetHeight || 300;
      }

      const count = Math.floor((canvas.width * canvas.height) / 22000);
      for (let i = 0; i < Math.min(count, 35); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 2.5 + 1.5,
          alpha: Math.random() * 0.25 + 0.1,
        });
      }

      function draw() {
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h;
          if (p.y > h) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 195, 255, ${p.alpha})`;
          ctx.fill();
        }

        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
          const pi = particles[i];
          for (let j = i + 1; j < particles.length; j++) {
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < LINK_DIST_SQ) {
              const ratio = 1 - Math.sqrt(distSq) / LINK_DIST;
              ctx.beginPath();
              ctx.moveTo(pi.x, pi.y);
              ctx.lineTo(pj.x, pj.y);
              ctx.strokeStyle = `rgba(0, 195, 255, ${0.12 * ratio})`;
              ctx.stroke();
            }
          }
        }

        animId = requestAnimationFrame(draw);
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            resize();
            draw();
          } else {
            cancelAnimationFrame(animId);
          }
        });
      }, { threshold: 0.1 });

      observer.observe(parent);
      window.addEventListener('resize', resize, { passive: true });
    }

    //MORPHING BLOBS
    function initMorphBlobs() {
      if (prefersReducedMotion || isMobile) return;

      document.querySelectorAll('.morph-blob path[data-morph]').forEach(path => {
        const original = path.getAttribute('d');
        const morph = path.dataset.morph;
        let forward = true;

        setInterval(() => {
          path.setAttribute('d', forward ? morph : original);
          forward = !forward;
        }, 3000);
      });
    }

    //FAQ ACCORDION
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    //HERO ENTRANCE
    setupLetterStagger();

    window.addEventListener('load', () => {
      splitHeroWords();
      document.querySelector('.hero').classList.add('hero-loaded');
    });

    //SCROLL REVEAL — IntersectionObserver
    requestAnimationFrame(() => {
    requestAnimationFrame(() => {

      const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            if (entry.target.hasAttribute('data-scramble')) {
              entry.target.classList.add('revealed');
              scrambleText(entry.target);
            }

            if (entry.target.classList.contains('letter-stagger')) {
              const el = entry.target;
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  el.classList.add('revealed');
                });
              });
            }

            animObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -80px 0px'
      });

      document.querySelectorAll('[data-anim]').forEach(el => animObserver.observe(el));
      document.querySelectorAll('[data-scramble]').forEach(el => animObserver.observe(el));
      document.querySelectorAll('.letter-stagger').forEach(el => animObserver.observe(el));

    });
    });

    //COUNTER ANIMATION
    function animateCounter(el) {
      const span = el.querySelector('[data-target]');
      if (!span) return;
      const target = parseInt(span.dataset.target, 10);
      const suffix = span.dataset.suffix || '';
      const prefix = span.dataset.prefix || '';
      const duration = 2200;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        span.textContent = prefix + Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

    let ticking = false;

    //STATS PROGRESS
    const statsBar = document.querySelector('.stats-bar');
    const statsProgress = document.querySelector('.stats-progress');

    function updateStatsProgress() {
      if (!statsBar || !statsProgress) return;
      const rect = statsBar.getBoundingClientRect();
      const vh = window.innerHeight;
      const totalTravel = vh + rect.height;
      const traveled = vh - rect.top;
      const progress = Math.max(0, Math.min(1, traveled / totalTravel));
      statsProgress.style.width = (progress * 100) + '%';
    }

    //MARQUEE SCROLL ACCELERATION
    const marqueeTrack = document.querySelector('.marquee-track');
    let marqueeAnim = null;
    let scrollTimeout = null;

    function setupMarqueeAcceleration() {
      if (!marqueeTrack || prefersReducedMotion) return;
      const anims = marqueeTrack.getAnimations();
      if (anims.length > 0) marqueeAnim = anims[0];
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setupMarqueeAcceleration();
      });
    });

    //UNIFIED SCROLL HANDLER
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateStatsProgress();
          ticking = false;
        });
        ticking = true;
      }

      if (marqueeAnim) {
        marqueeAnim.playbackRate = 2;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          function easeBack() {
            if (!marqueeAnim) return;
            const current = marqueeAnim.playbackRate;
            if (current > 1.05) {
              marqueeAnim.playbackRate = current * 0.9;
              requestAnimationFrame(easeBack);
            } else {
              marqueeAnim.playbackRate = 1;
            }
          }
          easeBack();
        }, 150);
      }
    }, { passive: true });

    // Initial calls
    updateStatsProgress();

    //INIT
    document.querySelectorAll('.particle-canvas').forEach(initParticles);
    initMorphBlobs();
