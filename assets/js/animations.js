/**
 * SMILE LUXURY STUDIO - ANIMACIONES AVANZADAS
 * ================================================
 * Versión Final Integrada con todas las correcciones
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ================================================
  // CONFIGURACIÓN Y VARIABLES GLOBALES
  // ================================================
  const config = {
    animationDuration: 300,
    scrollOffset: 100,
    testimonialInterval: 5000,
    parallaxStrength: 0.3,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  };

  // ================================================
  // INTERSECTION OBSERVER PARA ANIMACIONES ON SCROLL
  // ================================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observar elementos para animaciones
  const animateElements = document.querySelectorAll('.service-card, .stat, .feature, .testimonial-card');
  animateElements.forEach(el => observer.observe(el));

  // ================================================
  // CONTADOR ANIMADO PARA ESTADÍSTICAS
  // ================================================
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/\D/g, ''));
      const suffix = counter.textContent.replace(/\d/g, '');
      let current = 0;
      const increment = target / 60; // 60 frames para 1 segundo
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.floor(current) + suffix;
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + suffix;
        }
      };
      
      // Observer para iniciar contador cuando sea visible
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !counter.classList.contains('counted')) {
            counter.classList.add('counted');
            updateCounter();
          }
        });
      }, { threshold: 0.5 });
      
      counterObserver.observe(counter.closest('.stat'));
    });
  }

  // ================================================
  // EFECTO PARALLAX SUTIL (SOLO PARA DESKTOP)
  // ================================================
  function initParallax() {
    if (window.innerWidth <= 768) return; // Solo desktop
    
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      // Parallax para scroll indicator
      if (scrollIndicator) {
        const rate = scrolled * -0.1;
        scrollIndicator.style.transform = `translateX(-50%) translateY(${rate}px)`;
      }
    });
  }

  // ================================================
  // MEJORAS PARA PLACEHOLDERS DE VIDEO/IMAGEN
  // ================================================
  function enhancePlaceholders() {
    const placeholders = document.querySelectorAll('.hero-image-placeholder, .about-image-placeholder');
    
    placeholders.forEach(placeholder => {
      // Efecto de hover mejorado
      placeholder.addEventListener('mouseenter', () => {
        const playIcon = placeholder.querySelector('i');
        if (playIcon) {
          playIcon.style.animation = 'pulse 1.5s infinite';
        }
      });
      
      placeholder.addEventListener('mouseleave', () => {
        const playIcon = placeholder.querySelector('i');
        if (playIcon) {
          playIcon.style.animation = '';
        }
      });
      
      // Efecto de click con feedback visual
      placeholder.addEventListener('click', () => {
        placeholder.style.transform = 'scale(0.98)';
        setTimeout(() => {
          placeholder.style.transform = '';
        }, 150);
        
        // Aquí podrías agregar lógica para mostrar un modal con video
        console.log('Video placeholder clicked:', placeholder);
        
        // Ejemplo de feedback visual
        const feedback = document.createElement('div');
        feedback.style.cssText = `
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(201, 170, 113, 0.9);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          font-weight: 600;
          pointer-events: none;
          z-index: 1000;
          animation: fadeOut 2s ease-out forwards;
        `;
        feedback.textContent = '¡Video próximamente!';
        placeholder.appendChild(feedback);
        
        setTimeout(() => {
          if (feedback.parentNode) {
            feedback.parentNode.removeChild(feedback);
          }
        }, 2000);
      });
    });
  }

  // ================================================
  // OPTIMIZACIÓN DEL VIDEO DE FONDO
  // ================================================
  function optimizeBackgroundVideo() {
    const video = document.getElementById('bgVideo');
    if (!video) return;

    // Pausar video en dispositivos móviles para ahorrar batería
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      video.pause();
      video.style.display = 'none';
      // Mostrar imagen estática en su lugar
      const bgDiv = document.querySelector('.bg-video');
      if (bgDiv) {
        bgDiv.classList.add('video-fallback');
      }
    }

    // Ajustar calidad según conexión
    if ('connection' in navigator) {
      const connection = navigator.connection;
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        video.pause();
        video.style.display = 'none';
        const bgDiv = document.querySelector('.bg-video');
        if (bgDiv) {
          bgDiv.classList.add('video-fallback');
        }
      }
    }

    // Pausar video cuando no está visible (performance)
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            // Silently handle autoplay restrictions
          });
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.1 });

    videoObserver.observe(video);

    // Manejo de errores del video
    video.addEventListener('error', () => {
      console.log('Video error - switching to fallback');
      const bgDiv = document.querySelector('.bg-video');
      if (bgDiv) {
        bgDiv.classList.add('video-fallback');
      }
    });
  }

  // ================================================
  // SCROLL SUAVE MEJORADO
  // ================================================
  function enhancedSmoothScroll() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const servicesSection = document.querySelector('.services-preview');
        if (servicesSection) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = servicesSection.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    }

    // Navegación suave para todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ================================================
  // EFECTO DE ESCRITURA PARA EL TÍTULO PRINCIPAL
  // ================================================
  function typewriterEffect() {
    const highlight = document.querySelector('.hero h1 .highlight');
    if (!highlight) return;

    const text = highlight.textContent;
    const originalText = text;
    highlight.textContent = '';
    highlight.style.borderRight = '2px solid var(--primary-color)';
    
    let i = 0;
    const timer = setInterval(() => {
      highlight.textContent += text.charAt(i);
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setTimeout(() => {
          highlight.style.borderRight = 'none';
        }, 1000);
      }
    }, 100);

    // Guardar texto original para eventos hover
    highlight.dataset.originalText = originalText;
  }

  // ================================================
  // NAVEGACIÓN MÓVIL MEJORADA
  // ================================================
  function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileToggle && nav) {
      mobileToggle.addEventListener('click', () => {
        const isActive = nav.classList.contains('active');
        
        if (isActive) {
          nav.classList.remove('active');
          mobileToggle.classList.remove('active');
          document.body.style.overflow = '';
        } else {
          nav.classList.add('active');
          mobileToggle.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });

      // Cerrar menú al hacer click en un enlace
      const navLinks = nav.querySelectorAll('a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          nav.classList.remove('active');
          mobileToggle.classList.remove('active');
          document.body.style.overflow = '';
        });
      });

      // Cerrar menú al hacer click fuera
      document.addEventListener('click', (e) => {
        if (!mobileToggle.contains(e.target) && !nav.contains(e.target)) {
          nav.classList.remove('active');
          mobileToggle.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // ================================================
  // HEADER SCROLL EFFECTS
  // ================================================
  function initHeaderEffects() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Agregar clase scrolled cuando se hace scroll
      if (currentScrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScrollY = currentScrollY;
    });
  }

  // ================================================
  // SLIDER DE TESTIMONIOS
  // ================================================
  function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    
    if (!slider || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    const totalSlides = dots.length;

    function updateSlider() {
      // Actualizar dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
      
      // Aquí iría la lógica para cambiar la slide visible
      console.log('Showing slide:', currentSlide);
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlide = index;
        updateSlider();
      });
    });

    // Auto-slide
    setInterval(nextSlide, config.testimonialInterval);
    
    // Inicializar
    updateSlider();
  }

  // ================================================
  // EFECTO DE PARTÍCULAS SUTIL (OPCIONAL - SOLO DESKTOP)
  // ================================================
  function createParticles() {
    if (window.innerWidth <= 768) return; // Solo desktop
    
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(201, 170, 113, 0.3);
        border-radius: 50%;
        pointer-events: none;
        animation: float ${8 + Math.random() * 4}s infinite ease-in-out;
        left: ${Math.random() * 100}%;
        top: ${50 + Math.random() * 50}%;
        z-index: 1;
      `;
      hero.appendChild(particle);
    }
  }

  // ================================================
  // CORREGIR ELEMENTOS PROBLEMÁTICOS
  // ================================================
  function fixProblematicElements() {
    // Deshabilitar parallax en elementos de contenido que causaban problemas
    const problematicElements = document.querySelectorAll('.about-image-placeholder');
    
    problematicElements.forEach(element => {
      element.style.transform = 'none !important';
      
      // Observer para mantener posición fija
      const maintainPosition = new MutationObserver(() => {
        if (element.style.transform !== 'none' && !element.style.transform.includes('scale') && !element.style.transform.includes('translateY')) {
          element.style.transform = 'none';
        }
      });
      
      maintainPosition.observe(element, {
        attributes: true,
        attributeFilter: ['style']
      });
    });
  }

  // ================================================
  // FUNCIÓN DE EMERGENCIA PARA CORREGIR ANIMACIONES
  // ================================================
  window.fixAnimations = function() {
    console.log('🔧 Ejecutando corrección de emergencia...');
    
    // Deshabilitar parallax problemático
    document.querySelectorAll('.about-image-placeholder, .hero-image-placeholder').forEach(el => {
      el.style.transform = 'none !important';
      el.style.position = 'relative !important';
    });

    // Corregir navigation spacing
    document.querySelectorAll('.nav-links').forEach(nav => {
      nav.style.gap = '32px';
      nav.style.display = 'flex';
      nav.style.alignItems = 'center';
    });

    console.log('✅ Correcciones aplicadas');
  };

  // ================================================
  // CSS ADICIONAL PARA ANIMACIONES
  // ================================================
  const additionalStyles = document.createElement('style');
  additionalStyles.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
      25% { transform: translateY(-20px) rotate(90deg); opacity: 0.6; }
      50% { transform: translateY(-10px) rotate(180deg); opacity: 0.3; }
      75% { transform: translateY(-30px) rotate(270deg); opacity: 0.6; }
    }
    
    @keyframes fadeOut {
      to {
        opacity: 0;
        visibility: hidden;
      }
    }
    
    .animate-in {
      animation: fadeInUp 0.8s ease-out;
    }
    
    /* Smooth transitions for all interactive elements */
    .hero-image-placeholder,
    .about-image-placeholder,
    .stat,
    .feature,
    .service-card {
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
  `;
  document.head.appendChild(additionalStyles);

  // ================================================
  // INICIALIZACIÓN DE TODAS LAS FUNCIONES
  // ================================================
  
  // Funciones principales
  animateCounters();
  enhancePlaceholders();
  optimizeBackgroundVideo();
  enhancedSmoothScroll();
  initMobileNavigation();
  initHeaderEffects();
  initTestimonialSlider();
  fixProblematicElements();
  
  // Funciones condicionales (solo desktop)
  if (window.innerWidth > 768) {
    initParallax();
    createParticles();
  }
  
  // Typewriter effect con delay
  setTimeout(() => {
    typewriterEffect();
  }, 1000);

  // ================================================
  // MANEJO DE RESIZE Y OPTIMIZACIONES
  // ================================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Reinicializar efectos responsive
      if (window.innerWidth <= 768) {
        optimizeBackgroundVideo();
      }
      
      // Limpiar partículas en móvil
      if (window.innerWidth <= 768) {
        document.querySelectorAll('.hero div[style*="position: absolute"]').forEach(particle => {
          if (particle.style.width === '4px') {
            particle.remove();
          }
        });
      }
    }, 250);
  });

  // ================================================
  // LOGGING Y DEBUGGING
  // ================================================
  console.log('✅ Smile Luxury Studio - Animaciones iniciadas');
  console.log('🎯 Funciones disponibles: window.fixAnimations()');
  
  // Debug info
  if (window.location.search.includes('debug=true')) {
    console.log('🔍 Modo debug activado');
    console.log('📊 Elementos animados:', animateElements.length);
    console.log('📱 Es móvil:', window.innerWidth <= 768);
    console.log('🎥 Video encontrado:', !!document.getElementById('bgVideo'));
  }
});