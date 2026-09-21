document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CURSOR GLOW EFFECT
     ========================================================================== */
  const cursorGlow = id('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  });

  /* ==========================================================================
     2. BACKGROUND PARTICLES & CONFETTI ENGINE (CANVAS)
     ========================================================================== */
  const canvas = id('particleCanvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 40;

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 3 + 1;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = '#ffe600';
    }
    update() {
      this.y -= this.speedY;
      if (this.y < 0) this.y = height;
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Active Confetti & Explosions Array
  let fxParticles = [];

  function spawnConfetti() {
    for (let i = 0; i < 100; i++) {
      fxParticles.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12 - 4,
        size: Math.random() * 8 + 4,
        color: ['#ffe600', '#ffffff', '#d4af37', '#ff4081'][Math.floor(Math.random() * 4)],
        life: 100
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Render static floating stars
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Render active FX particles (Confetti/Fireworks)
    for (let i = fxParticles.length - 1; i >= 0; i--) {
      let p = fxParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // Gravity
      p.life--;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 100;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      if (p.life <= 0) fxParticles.splice(i, 1);
    }

    requestAnimationFrame(render);
  }
  render();

  /* ==========================================================================
     3. AUDIO CONTROLS
     ========================================================================== */
  const bgMusic = id('bgMusic');
  const musicToggle = id('musicToggle');
  const musicIcon = id('musicIcon');
  const musicText = id('musicText');
  let isPlaying = false;

  function toggleMusic(play) {
    if (play && !isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicIcon.textContent = '🎵';
        musicText.textContent = 'Playing';
      }).catch(() => {
        // Autoplay blocked by browser policy
      });
    } else if (!play && isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicIcon.textContent = '🔇';
      musicText.textContent = 'Muted';
    }
  }

  musicToggle.addEventListener('click', () => {
    toggleMusic(!isPlaying);
  });

  /* ==========================================================================
     4. SECTION 1: CINEMATIC INTRO SEQUENCER
     ========================================================================== */
  const introDot = id('introDot');
  const line1 = id('line1');
  const line2 = id('line2');
  const line3 = id('line3');
  const line4 = id('line4');
  const startBtn = id('startBtn');

  // Timeline execution
  setTimeout(() => { introDot.classList.add('heart-mode'); }, 1000);
  
  setTimeout(() => {
    line1.classList.add('hidden');
    setTimeout(() => {
      line1.style.display = 'none';
      line2.classList.remove('hidden');
      line2.classList.add('visible');
    }, 800);
  }, 2500);

  setTimeout(() => {
    line2.classList.remove('visible');
    line2.classList.add('hidden');
    setTimeout(() => {
      line2.style.display = 'none';
      line3.classList.remove('hidden');
      line3.classList.add('visible');
      line4.classList.remove('hidden');
      line4.classList.add('visible');
      startBtn.classList.remove('hidden');
      startBtn.classList.add('visible');
    }, 800);
  }, 5000);

  startBtn.addEventListener('click', () => {
    toggleMusic(true);
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
  });

  /* ==========================================================================
     5. SCROLL REVEAL OBSERVER
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Trigger specific section animations
        if (entry.target.id === 'pookie-meter') animateMeter();
      }
    });
  }, { threshold: 0.2 });

  revealElements.forEach(el => observer.observe(el));

  /* ==========================================================================
     6. SECTION 4: POOKIE METER ANIMATION
     ========================================================================== */
  let meterAnimated = false;
  function animateMeter() {
    if (meterAnimated) return;
    meterAnimated = true;
    
    const meterValue = id('meterValue');
    const meterBar = id('meterBar');
    const meterStatus = id('meterStatus');
    const radius = meterBar.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    let targetProgress = 100;
    let current = 0;

    let interval = setInterval(() => {
      current += 1;
      meterValue.textContent = current;
      let offset = circumference - (current / 100) * circumference;
      meterBar.style.strokeDashoffset = offset;

      if (current >= targetProgress) {
        clearInterval(interval);
        meterStatus.textContent = "100% CERTIFIED POOKIE 🐣💛";
        spawnConfetti();
      }
    }, 25);
  }

  /* ==========================================================================
     7. SECTION 9: ENVELOPE & TYPEWRITER LETTER
     ========================================================================== */
  const openLetterBtn = id('openLetterBtn');
  const closeLetterBtn = id('closeLetterBtn');
  const letterModal = id('letterModal');
  const typewriterText = id('typewriterText');

  const letterBody = `Dear Miss Novia,

Happy Birthday to the most adorable Pookie ever. 💛

Today is all about celebrating you, your smile, your personality, your craziness, and all the little things that make you special.

I hope this new year of your life brings you happiness, success, beautiful memories, and everything you've wished for.

Never stop being the crazy, cute, and amazing person you are.

Happy Birthday, Pookie. 🐣💛`;

  let typeIndex = 0;
  function typeWriter() {
    if (typeIndex < letterBody.length) {
      typewriterText.textContent += letterBody.charAt(typeIndex);
      typeIndex++;
      setTimeout(typeWriter, 35);
    }
  }

  openLetterBtn.addEventListener('click', () => {
    letterModal.classList.add('active');
    if (typeIndex === 0) typeWriter();
  });

  closeLetterBtn.addEventListener('click', () => {
    letterModal.classList.remove('active');
  });

  /* ==========================================================================
     8. SECTION 10: INTERACTIVE CAKE
     ========================================================================== */
  const wishBtn = id('wishBtn');
  const flames = document.querySelectorAll('.flame');
  const wishMessage = id('wishMessage');

  wishBtn.addEventListener('click', () => {
    flames.forEach(f => f.classList.add('out'));
    spawnConfetti();
    wishBtn.style.display = 'none';
    wishMessage.classList.remove('hidden');
    wishMessage.classList.add('visible');
  });

  /* ==========================================================================
     9. SECTION 11: MYSTERY GIFT
     ========================================================================== */
  const openGiftBtn = id('openGiftBtn');
  const giftBox = id('giftBox');
  const giftReveal = id('giftReveal');

  openGiftBtn.addEventListener('click', () => {
    giftBox.classList.add('open');
    spawnConfetti();
    openGiftBtn.style.display = 'none';
    setTimeout(() => {
      giftReveal.classList.remove('hidden');
      giftReveal.classList.add('visible');
    }, 400);
  });

  /* ==========================================================================
     10. SECTION 13: VIDEO SURPRISE MODAL
     ========================================================================== */
  const playVideoBtn = id('playVideoBtn');
  const videoModal = id('videoModal');
  const closeVideoBtn = id('closeVideoBtn');
  const birthdayVideo = id('birthdayVideo');

  playVideoBtn.addEventListener('click', () => {
    videoModal.classList.remove('hidden');
    birthdayVideo.play();
    toggleMusic(false); // Pause background audio during video playback
  });

  closeVideoBtn.addEventListener('click', () => {
    videoModal.classList.add('hidden');
    birthdayVideo.pause();
  });

  // Automatically scroll to Section 14 when video ends
  birthdayVideo.addEventListener('ended', () => {
    videoModal.classList.add('hidden');
    id('ending-section').scrollIntoView({ behavior: 'smooth' });
    spawnConfetti();
  });

  /* ==========================================================================
     11. GALLERY LIGHTBOX & BACK TO TOP UTILITIES
     ========================================================================== */
  const backToTopBtn = id('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Helper function for quick DOM selection
  function id(elementId) {
    return document.getElementById(elementId);
  }
});

/* Global Lightbox Handlers */
function openLightbox(element) {
  const img = element.querySelector('img');
  const caption = element.querySelector('.caption');
  const lightbox = document.getElementById('lightbox');
  
  document.getElementById('lightboxImg').src = img.src;
  document.getElementById('lightboxCaption').textContent = caption.textContent;
  lightbox.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}