/**
 * SMILE LUXURY STUDIO - JAVASCRIPT PRINCIPAL
 * ==========================================
 */

// Configuración global
const SmileLuxuryStudio = {
    config: {
        animationDuration: 300,
        scrollOffset: 100,
        testimonialInterval: 5000
    },
    
    // Estado de la aplicación
    state: {
        currentTestimonial: 0,
        isMenuOpen: false,
        isLoading: false
    },
    
    // Elementos del DOM
    elements: {},
    
    // Inicialización
    init() {
        console.log('🦷 Iniciando Smile Luxury Studio...');
        this.cacheElements();
        this.bindEvents();
        this.initComponents();
        console.log('✅ Sistema inicializado correctamente');
    },
    
    // Cache de elementos del DOM
    cacheElements() {
        this.elements = {
            header: document.querySelector('.header'),
            mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
            navMenu: document.querySelector('.nav-menu'),
            heroScrollIndicator: document.querySelector('.hero-scroll-indicator'),
            testimonialCards: document.querySelectorAll('.testimonial-card'),
            testimonialDots: document.querySelectorAll('.dot'),
            prevBtn: document.querySelector('.prev-btn'),
            nextBtn: document.querySelector('.next-btn'),
            forms: document.querySelectorAll('form'),
            scrollLinks: document.querySelectorAll('a[href^="#"]'),
            statNumbers: document.querySelectorAll('.stat-number'),
            serviceCards: document.querySelectorAll('.service-card'),
            placeholders: document.querySelectorAll('[class*="placeholder"]')
        };
    },
    
    // Bind de eventos
    bindEvents() {
        // Scroll events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 100));
        
        // Resize events
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
        
        // Navigation events
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Scroll indicator
        if (this.elements.heroScrollIndicator) {
            this.elements.heroScrollIndicator.addEventListener('click', this.scrollToNextSection.bind(this));
        }
        
        // Smooth scroll links
        this.elements.scrollLinks.forEach(link => {
            link.addEventListener('click', this.handleSmoothScroll.bind(this));
        });
        
        // Testimonial controls
        if (this.elements.prevBtn) {
            this.elements.prevBtn.addEventListener('click', this.prevTestimonial.bind(this));
        }
        
        if (this.elements.nextBtn) {
            this.elements.nextBtn.addEventListener('click', this.nextTestimonial.bind(this));
        }
        
        // Testimonial dots
        this.elements.testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToTestimonial(index));
        });
        
        // Form handling
        this.elements.forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
        
        // Service card hover effects
        this.elements.serviceCards.forEach(card => {
            card.addEventListener('mouseenter', this.handleServiceCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleServiceCardLeave.bind(this));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    },
    
    // Inicialización de componentes
    initComponents() {
        this.initTestimonialSlider();
        this.initScrollObserver();
        this.initCounterAnimation();
        this.initPlaceholderAnimations();
        this.initLazyLoading();
    },
    
    // ===============================
    // NAVEGACIÓN Y HEADER
    // ===============================
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Header background change
        if (this.elements.header) {
            if (scrollY > this.config.scrollOffset) {
                this.elements.header.style.background = 'rgba(255, 255, 255, 0.98)';
                this.elements.header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
            } else {
                this.elements.header.style.background = 'rgba(255, 255, 255, 0.95)';
                this.elements.header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            }
        }
        
        // Hide scroll indicator after scrolling
        if (this.elements.heroScrollIndicator && scrollY > 200) {
            this.elements.heroScrollIndicator.style.opacity = '0';
        } else if (this.elements.heroScrollIndicator) {
            this.elements.heroScrollIndicator.style.opacity = '1';
        }
    },
    
    toggleMobileMenu() {
        this.state.isMenuOpen = !this.state.isMenuOpen;
        
        if (this.elements.navMenu) {
            this.elements.navMenu.classList.toggle('mobile-active', this.state.isMenuOpen);
        }
        
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.classList.toggle('active', this.state.isMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.state.isMenuOpen ? 'hidden' : '';
    },
    
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = this.elements.header ? this.elements.header.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (this.state.isMenuOpen) {
                    this.toggleMobileMenu();
                }
            }
        }
    },
    
    scrollToNextSection() {
        const viewportHeight = window.innerHeight;
        const currentScroll = window.scrollY;
        const targetScroll = currentScroll + viewportHeight;
        
        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    },
    
    // ===============================
    // SLIDER DE TESTIMONIOS
    // ===============================
    
    initTestimonialSlider() {
        if (this.elements.testimonialCards.length === 0) return;
        
        // Auto-advance testimonials
        this.testimonialInterval = setInterval(() => {
            this.nextTestimonial();
        }, this.config.testimonialInterval);
        
        // Pause on hover
        const testimonialContainer = document.querySelector('.testimonials-slider');
        if (testimonialContainer) {
            testimonialContainer.addEventListener('mouseenter', () => {
                clearInterval(this.testimonialInterval);
            });
            
            testimonialContainer.addEventListener('mouseleave', () => {
                this.testimonialInterval = setInterval(() => {
                    this.nextTestimonial();
                }, this.config.testimonialInterval);
            });
        }
    },
    
    nextTestimonial() {
        this.state.currentTestimonial = (this.state.currentTestimonial + 1) % this.elements.testimonialCards.length;
        this.updateTestimonialDisplay();
    },
    
    prevTestimonial() {
        this.state.currentTestimonial = this.state.currentTestimonial === 0 
            ? this.elements.testimonialCards.length - 1 
            : this.state.currentTestimonial - 1;
        this.updateTestimonialDisplay();
    },
    
    goToTestimonial(index) {
        this.state.currentTestimonial = index;
        this.updateTestimonialDisplay();
    },
    
    updateTestimonialDisplay() {
        // Update cards
        this.elements.testimonialCards.forEach((card, index) => {
            card.classList.toggle('active', index === this.state.currentTestimonial);
        });
        
        // Update dots
        this.elements.testimonialDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.state.currentTestimonial);
        });
    },
    
    // ===============================
    // ANIMACIONES Y OBSERVADORES
    // ===============================
    
    initScrollObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe animated elements
        const animatedElements = document.querySelectorAll('.service-card, .team-card, .feature, .about-content');
        animatedElements.forEach(el => observer.observe(el));
    },
    
    animateElement(element) {
        if (element.classList.contains('service-card')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        } else if (element.classList.contains('team-card')) {
            element.style.animation = 'slideInLeft 0.8s ease-out forwards';
        } else if (element.classList.contains('about-content')) {
            element.style.animation = 'slideInRight 0.8s ease-out forwards';
        } else {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    },
    
    initCounterAnimation() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.textContent);
                    this.animateCounter(target, finalValue);
                    counterObserver.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        this.elements.statNumbers.forEach(stat => {
            counterObserver.observe(stat);
        });
    },
    
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
            start += increment;
            if (start < target) {
                const current = Math.floor(start);
                if (target >= 100) {
                    element.textContent = current + '%';
                } else {
                    element.textContent = current + '+';
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (target >= 100) {
                    element.textContent = target + '%';
                } else {
                    element.textContent = target + '+';
                }
            }
        };
        
        updateCounter();
    },
    
    // ===============================
    // FORMULARIOS
    // ===============================
    
    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        
        // Basic form validation
        if (!this.validateForm(form)) {
            return;
        }
        
        // Show loading state
        this.showLoading(form);
        
        // Simulate form submission
        setTimeout(() => {
            this.hideLoading(form);
            this.showSuccessMessage('¡Gracias por tu mensaje! Te contactaremos pronto.');
            form.reset();
        }, 2000);
    },
    
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const errorElement = field.parentNode.querySelector('.form-error');
            
            if (!field.value.trim()) {
                this.showFieldError(field, 'Este campo es obligatorio');
                isValid = false;
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Por favor ingresa un email válido');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    },
    
    showFieldError(field, message) {
        field.style.borderColor = '#e53e3e';
        
        let errorElement = field.parentNode.querySelector('.form-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'form-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    },
    
    clearFieldError(field) {
        field.style.borderColor = '#e2e8f0';
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    },
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // ===============================
    // UTILIDADES
    // ===============================
    
    showLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading"></span> Enviando...';
        }
    },
    
    hideLoading(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Enviar Solicitud';
        }
    },
    
    showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = message;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.right = '20px';
        alert.style.zIndex = '9999';
        alert.style.maxWidth = '400px';
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, 5000);
    },
    
    handleServiceCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon');
        
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    },
    
    handleServiceCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon');
        
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    },
    
    initPlaceholderAnimations() {
        this.elements.placeholders.forEach(placeholder => {
            placeholder.style.background = `
                linear-gradient(135deg, #e2e8f0, #cbd5e0, #e2e8f0)
            `;
            placeholder.style.backgroundSize = '400% 400%';
            placeholder.style.animation = 'placeholderPulse 3s ease-in-out infinite';
        });
    },
    
    initLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },
    
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.state.isMenuOpen) {
            this.toggleMobileMenu();
        }
    },
    
    handleKeyboard(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && this.state.isMenuOpen) {
            this.toggleMobileMenu();
        }
        
        // Arrow keys for testimonial navigation
        if (e.key === 'ArrowLeft') {
            this.prevTestimonial();
        } else if (e.key === 'ArrowRight') {
            this.nextTestimonial();
        }
    },
    
    // Throttle function for performance
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },
    
    // Debug helper
    debug(message, data = null) {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`🦷 ${message}`, data || '');
        }
    }
};

// CSS adicional para animaciones (se puede mover al CSS)
const additionalStyles = `
    @keyframes placeholderPulse {
        0%, 100% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    .nav-menu.mobile-active {
        position: fixed;
        top: 100%;
        left: 0;
        width: 100%;
        background: white;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        flex-direction: column;
        padding: 2rem 0;
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
        z-index: 999;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            flex-direction: column;
            padding: 2rem 0;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .nav-menu li {
            margin: 0.5rem 0;
            text-align: center;
        }
    }
`;

// Inyectar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => SmileLuxuryStudio.init());
} else {
    SmileLuxuryStudio.init();
}

document.addEventListener('DOMContentLoaded', function() {
    
    // Header scroll effect
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        let ticking = false;
        
        function updateHeader() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Mobile menu toggle
    function initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (mobileToggle && nav) {
            mobileToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                
                // Animate hamburger
                const spans = mobileToggle.querySelectorAll('span');
                if (nav.classList.contains('active')) {
                    spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!header.contains(e.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    const spans = mobileToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
            
            // Close menu when clicking on nav links
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('active');
                    const spans = mobileToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                });
            });
        }
    }
    
    // Smooth scroll for navigation links
    function initSmoothScroll() {
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Active section highlighting
    function initActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
        
        function updateActiveSection() {
            const scrollTop = window.pageYOffset;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight - 50;
                const sectionBottom = sectionTop + section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateActiveSection);
                ticking = true;
                setTimeout(() => { ticking = false; }, 16);
            }
        });
    }
    
    // Initialize all header functions
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initActiveSection();
    
    console.log('✅ Header funcionalidad iniciada');
    
});

// Función para corregir problemas inmediatos
window.fixHeader = function() {
    const header = document.querySelector('.header');
    const body = document.body;
    
    // Asegurar que el header esté fijo
    header.style.position = 'fixed';
    header.style.top = '0';
    header.style.left = '0';
    header.style.right = '0';
    header.style.zIndex = '1000';
    header.style.height = '90px';
    
    // Asegurar padding en body
    body.style.paddingTop = '90px';
    
    console.log('✅ Header corregido manualmente');
};

// ================================================
// SLIDER DE TESTIMONIOS - FUNCIONALIDAD COMPLETA
// ================================================

document.addEventListener('DOMContentLoaded', () => {
  
   const testimonialSlider = {
    currentSlide: 0,
    totalSlides: 0,
    autoplayInterval: null,
    autoplayDelay: 5000, // 5 segundos
    
    // Elementos del DOM
    track: null,
    slides: [],
    prevBtn: null,
    nextBtn: null,
    dots: [],
    container: null,
    
    // Inicializar slider
    init() {
      this.container = document.querySelector('.testimonials-slider');
      this.track = document.querySelector('.testimonials-track');
      this.slides = document.querySelectorAll('.testimonial-slide');
      this.prevBtn = document.querySelector('.testimonials-controls .prev-btn');
      this.nextBtn = document.querySelector('.testimonials-controls .next-btn');
      this.dots = document.querySelectorAll('.testimonial-dots .dot');
      
      if (!this.track || this.slides.length === 0) {
        console.log('❌ Slider de testimonios: elementos no encontrados');
        return;
      }
      
      this.totalSlides = this.slides.length;
      this.setupSlider();
      this.setupEventListeners();
      this.updateSlider();
      this.startAutoplay();
      
      console.log(`✅ Slider de testimonios iniciado con ${this.totalSlides} slides`);
    },
    
    // Configurar estructura del slider
    setupSlider() {
      // Asegurar que el track tenga el ancho correcto
      this.track.style.width = `${this.totalSlides * 100}%`;
      
      // Configurar cada slide
      this.slides.forEach((slide, index) => {
        slide.style.width = `${100 / this.totalSlides}%`;
        slide.style.flexShrink = '0';
        slide.dataset.slideIndex = index;
      });
      
      // Asegurar overflow hidden en el container
      if (this.container) {
        this.container.style.overflow = 'hidden';
      }
    },
    
    // Configurar event listeners
    setupEventListeners() {
      // Botones de navegación
      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.prevSlide();
        });
      }
      
      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.nextSlide();
        });
      }
      
      // Dots de navegación
      this.dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
          e.preventDefault();
          this.goToSlide(index);
        });
      });
      
      // Pausar autoplay al hover
      if (this.container) {
        this.container.addEventListener('mouseenter', () => {
          this.stopAutoplay();
        });
        
        this.container.addEventListener('mouseleave', () => {
          this.startAutoplay();
        });
      }
      
      // Navegación con teclado
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          this.prevSlide();
        } else if (e.key === 'ArrowRight') {
          this.nextSlide();
        }
      });
      
      // Touch/Swipe para móviles
      this.setupTouchEvents();
    },
    
    // Configurar eventos táctiles
    setupTouchEvents() {
      let touchStartX = 0;
      let touchEndX = 0;
      const minSwipeDistance = 50;
      
      if (this.container) {
        this.container.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        });
        
        this.container.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const swipeDistance = touchStartX - touchEndX;
          
          if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
              // Swipe left - siguiente slide
              this.nextSlide();
            } else {
              // Swipe right - slide anterior
              this.prevSlide();
            }
          }
        });
      }
    },
    
    // Ir a slide anterior
    prevSlide() {
      this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.totalSlides - 1;
      this.updateSlider();
      this.resetAutoplay();
    },
    
    // Ir a slide siguiente
    nextSlide() {
      this.currentSlide = this.currentSlide < this.totalSlides - 1 ? this.currentSlide + 1 : 0;
      this.updateSlider();
      this.resetAutoplay();
    },
    
    // Ir a slide específico
    goToSlide(index) {
      if (index >= 0 && index < this.totalSlides) {
        this.currentSlide = index;
        this.updateSlider();
        this.resetAutoplay();
      }
    },
    
    // Actualizar posición del slider
    updateSlider() {
      if (!this.track) return;
      
      // Calcular posición exacta
      const translateXPercent = -(this.currentSlide * (100 / this.totalSlides));
      
      // Aplicar transformación
      this.track.style.transform = `translateX(${translateXPercent}%)`;
      
      // Actualizar clases para CSS (opcional - como respaldo)
      this.track.className = `testimonials-track slide-${this.currentSlide}`;
      
      // Actualizar dots
      this.dots.forEach((dot, index) => {
        if (dot) {
          dot.classList.toggle('active', index === this.currentSlide);
        }
      });
      
      // Actualizar estado de botones
      this.updateButtonStates();
      
      // Log para debugging
      console.log(`Slider actualizado - Slide ${this.currentSlide + 1}/${this.totalSlides}`);
    },
    
    // Actualizar estado de botones
    updateButtonStates() {
      // En un slider circular, siempre están activos
      if (this.prevBtn) {
        this.prevBtn.style.opacity = '1';
        this.prevBtn.style.pointerEvents = 'auto';
        this.prevBtn.disabled = false;
      }
      
      if (this.nextBtn) {
        this.nextBtn.style.opacity = '1';
        this.nextBtn.style.pointerEvents = 'auto';
        this.nextBtn.disabled = false;
      }
    },
    
    // Iniciar autoplay
    startAutoplay() {
      this.stopAutoplay(); // Limpiar cualquier autoplay existente
      this.autoplayInterval = setInterval(() => {
        this.nextSlide();
      }, this.autoplayDelay);
    },
    
    // Detener autoplay
    stopAutoplay() {
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
      }
    },
    
    // Reiniciar autoplay
    resetAutoplay() {
      this.stopAutoplay();
      setTimeout(() => {
        this.startAutoplay();
      }, 1000); // Esperar 1 segundo antes de reiniciar
    },
    
    // Función para debugging
    debug() {
      console.log('=== DEBUG SLIDER ===');
      console.log('Current slide:', this.currentSlide);
      console.log('Total slides:', this.totalSlides);
      console.log('Track element:', this.track);
      console.log('Slides found:', this.slides.length);
      console.log('Dots found:', this.dots.length);
      console.log('Container:', this.container);
      console.log('Track width:', this.track?.style.width);
      console.log('Track transform:', this.track?.style.transform);
    }
  };
  
  // Inicializar el slider
  testimonialSlider.init();
  
  // Hacer el slider accesible globalmente
  window.testimonialSlider = testimonialSlider;
  
  // Función de corrección inmediata
  window.fixTestimonialSlider = function() {
    const slider = window.testimonialSlider;
    if (!slider) {
      console.log('❌ Slider no encontrado');
      return;
    }
    
    // Forzar reinicialización
    slider.setupSlider();
    slider.updateSlider();
    
    console.log('✅ Slider corregido manualmente');
    slider.debug();
  };
  
  // Auto-corrección después de 2 segundos (por si hay problemas de timing)
  setTimeout(() => {
    if (window.testimonialSlider && window.testimonialSlider.track) {
      window.testimonialSlider.updateSlider();
      console.log('✅ Auto-corrección aplicada');
    }
  }, 2000);
});

// ================================================
// FUNCIONES ADICIONALES PARA CONTROL MANUAL
// ================================================

// Control manual del slider
function controlTestimonialSlider(action, slideIndex = null) {
  const slider = window.testimonialSlider;
  if (!slider) {
    console.log('❌ Slider no disponible');
    return;
  }
  
  switch(action) {
    case 'next':
      slider.nextSlide();
      break;
    case 'prev':
      slider.prevSlide();
      break;
    case 'goto':
      if (slideIndex !== null && slideIndex >= 0 && slideIndex < slider.totalSlides) {
        slider.goToSlide(slideIndex);
      } else {
        console.log('❌ Índice de slide inválido');
      }
      break;
    case 'play':
      slider.startAutoplay();
      console.log('▶️ Autoplay iniciado');
      break;
    case 'pause':
      slider.stopAutoplay();
      console.log('⏸️ Autoplay pausado');
      break;
    case 'debug':
      slider.debug();
      break;
    default:
      console.log('Acciones disponibles: next, prev, goto, play, pause, debug');
  }
}

// Funciones de utilidad
function goToTestimonial(index) {
  controlTestimonialSlider('goto', index);
}

function nextTestimonial() {
  controlTestimonialSlider('next');
}

function prevTestimonial() {
  controlTestimonialSlider('prev');
}

function pauseTestimonials() {
  controlTestimonialSlider('pause');
}

function playTestimonials() {
  controlTestimonialSlider('play');
}

// ================================================
// INTERSECTION OBSERVER PARA PERFORMANCE
// ================================================

// Pausar autoplay cuando no esté visible
const testimonialObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const slider = window.testimonialSlider;
    if (!slider) return;
    
    if (entry.isIntersecting) {
      // Está visible - iniciar autoplay
      slider.startAutoplay();
      console.log('👁️ Testimonios visibles - autoplay iniciado');
    } else {
      // No está visible - pausar autoplay
      slider.stopAutoplay();
      console.log('👁️ Testimonios no visibles - autoplay pausado');
    }
  });
}, { 
  threshold: 0.3,
  rootMargin: '0px 0px -100px 0px'
});

// Observar la sección de testimonios
setTimeout(() => {
  const testimonialsSection = document.querySelector('.testimonials');
  if (testimonialsSection) {
    testimonialObserver.observe(testimonialsSection);
    console.log('👁️ Observer de testimonios activado');
  }
}, 1000);

// ================================================
// MENÚ MÓVIL - JAVASCRIPT COMPLETO
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Configuración del menú móvil
    const mobileMenu = {
        isOpen: false,
        elements: {},
        
        // Inicializar
        init() {
            this.cacheElements();
            this.bindEvents();
            this.handleResize();
            console.log('✅ Menú móvil inicializado');
        },
        
        // Cache de elementos
        cacheElements() {
            this.elements = {
                header: document.querySelector('.header'),
                mobileToggle: document.querySelector('.mobile-menu-toggle'),
                nav: document.querySelector('.nav'),
                navLinks: document.querySelectorAll('.nav-links a'),
                body: document.body,
                overlay: null // Se creará dinámicamente
            };
            
            // Crear overlay si no existe
            this.createOverlay();
        },
        
        // Crear overlay para móvil
        createOverlay() {
            if (!document.querySelector('.mobile-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'mobile-overlay';
                document.body.appendChild(overlay);
                this.elements.overlay = overlay;
            }
        },
        
        // Bind de eventos
        bindEvents() {
            // Click en botón hamburguesa
            if (this.elements.mobileToggle) {
                this.elements.mobileToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            }
            
            // Click en enlaces del menú (cerrar menú)
            this.elements.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isOpen) {
                        this.close();
                    }
                });
            });
            
            // Click en overlay (cerrar menú)
            if (this.elements.overlay) {
                this.elements.overlay.addEventListener('click', () => {
                    this.close();
                });
            }
            
            // Click fuera del menú
            document.addEventListener('click', (e) => {
                if (this.isOpen && 
                    !this.elements.nav.contains(e.target) && 
                    !this.elements.mobileToggle.contains(e.target)) {
                    this.close();
                }
            });
            
            // Tecla ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
            
            // Resize de ventana
            window.addEventListener('resize', () => {
                this.handleResize();
            });
        },
        
        // Alternar menú
        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },
        
        // Abrir menú
        open() {
            this.isOpen = true;
            
            // Agregar clases
            this.elements.nav.classList.add('mobile-active');
            this.elements.mobileToggle.classList.add('active');
            this.elements.body.classList.add('menu-open');
            
            if (this.elements.overlay) {
                this.elements.overlay.classList.add('active');
            }
            
            // Prevenir scroll
            this.elements.body.style.overflow = 'hidden';
            
            // Aria para accesibilidad
            this.elements.mobileToggle.setAttribute('aria-expanded', 'true');
            this.elements.mobileToggle.setAttribute('aria-label', 'Cerrar menú');
            
            console.log('📱 Menú móvil abierto');
        },
        
        // Cerrar menú
        close() {
            this.isOpen = false;
            
            // Remover clases
            this.elements.nav.classList.remove('mobile-active');
            this.elements.mobileToggle.classList.remove('active');
            this.elements.body.classList.remove('menu-open');
            
            if (this.elements.overlay) {
                this.elements.overlay.classList.remove('active');
            }
            
            // Restaurar scroll
            this.elements.body.style.overflow = '';
            
            // Aria para accesibilidad
            this.elements.mobileToggle.setAttribute('aria-expanded', 'false');
            this.elements.mobileToggle.setAttribute('aria-label', 'Abrir menú');
            
            console.log('📱 Menú móvil cerrado');
        },
        
        // Manejar redimensionamiento
        handleResize() {
            const isMobile = window.innerWidth <= 768;
            
            if (!isMobile && this.isOpen) {
                // Si cambia a desktop y el menú está abierto, cerrarlo
                this.close();
            }
        },
        
        // Función para debugging
        debug() {
            console.log('=== DEBUG MENÚ MÓVIL ===');
            console.log('Estado:', this.isOpen ? 'Abierto' : 'Cerrado');
            console.log('Ancho ventana:', window.innerWidth);
            console.log('Es móvil:', window.innerWidth <= 768);
            console.log('Elementos encontrados:');
            console.log('- Toggle:', !!this.elements.mobileToggle);
            console.log('- Nav:', !!this.elements.nav);
            console.log('- Links:', this.elements.navLinks.length);
            console.log('- Overlay:', !!this.elements.overlay);
        }
    };
    
    // Inicializar menú móvil
    mobileMenu.init();
    
    // Hacer accesible globalmente
    window.mobileMenu = mobileMenu;
    
    // Función de corrección manual
    window.fixMobileMenu = function() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.nav');
        
        if (!toggle || !nav) {
            console.log('❌ Elementos del menú no encontrados');
            return;
        }
        
        // Forzar estilos correctos
        if (window.innerWidth <= 768) {
            toggle.style.display = 'flex';
            nav.style.position = 'fixed';
            nav.style.top = '80px';
            nav.style.left = '0';
            nav.style.right = '0';
            nav.style.transform = 'translateY(-100%)';
            nav.style.opacity = '0';
            nav.style.visibility = 'hidden';
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.backdropFilter = 'blur(20px)';
            nav.style.zIndex = '999';
            nav.style.transition = 'all 0.3s ease';
        } else {
            toggle.style.display = 'none';
            nav.style.position = 'static';
            nav.style.transform = 'none';
            nav.style.opacity = '1';
            nav.style.visibility = 'visible';
        }
        
        console.log('✅ Menú móvil corregido manualmente');
    };
});

// ================================================
// FUNCIONES ADICIONALES DE NAVEGACIÓN
// ================================================

// Smooth scroll mejorado
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Solo prevenir default para enlaces internos
            if (href.startsWith('#') && href !== '#') {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Cerrar menú móvil si está abierto
                    if (window.mobileMenu && window.mobileMenu.isOpen) {
                        window.mobileMenu.close();
                    }
                    
                    // Actualizar enlace activo
                    updateActiveLink(this);
                }
            }
        });
    });
}

// Actualizar enlace activo
function updateActiveLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Highlighting de sección activa
function initActiveSectionHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    if (sections.length === 0) return;
    
    function updateActiveSection() {
        const scrollTop = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    }
    
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeader();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Inicializar todas las funcionalidades del header
document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initActiveSectionHighlight();
    initHeaderScrollEffect();
    
    console.log('✅ Navegación completa inicializada');
});

// ================================================
// UTILIDADES PARA DEBUGGING
// ================================================

// Función para verificar el estado del menú
function checkMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const isActive = nav.classList.contains('mobile-active');
    
    console.log('=== ESTADO MENÚ MÓVIL ===');
    console.log('Ancho pantalla:', window.innerWidth);
    console.log('Es móvil:', window.innerWidth <= 768);
    console.log('Toggle visible:', toggle ? getComputedStyle(toggle).display : 'No encontrado');
    console.log('Menú activo:', isActive);
    console.log('Nav transform:', nav ? getComputedStyle(nav).transform : 'No encontrado');
    
    if (window.mobileMenu) {
        window.mobileMenu.debug();
    }
}

// Función para forzar mostrar/ocultar menú
function toggleMobileMenuManual() {
    if (window.mobileMenu) {
        window.mobileMenu.toggle();
    } else {
        console.log('❌ Menú móvil no inicializado');
    }
}

// ================================================
// VIDEO DE FONDO - JAVASCRIPT PARA MÓVILES
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Configuración del video de fondo
    const videoController = {
        video: null,
        container: null,
        isVisible: false,
        
        // Inicializar
        init() {
            this.video = document.querySelector('.bg-video video');
            this.container = document.querySelector('.bg-video');
            
            if (!this.video || !this.container) {
                console.log('⚠️ Video de fondo no encontrado');
                this.createFallbackBackground();
                return;
            }
            
            this.setupVideo();
            this.setupIntersectionObserver();
            this.handleVisibilityChange();
            
            console.log('✅ Video de fondo inicializado para móvil');
        },
        
        // Configurar video para móviles
        setupVideo() {
            // Atributos necesarios para móviles
            this.video.setAttribute('playsinline', 'true');
            this.video.setAttribute('webkit-playsinline', 'true');
            this.video.setAttribute('muted', 'true');
            this.video.setAttribute('autoplay', 'true');
            this.video.setAttribute('loop', 'true');
            this.video.muted = true; // Forzar mudo
            
            // Forzar estilos
            this.video.style.cssText = `
                position: absolute !important;
                top: 50% !important;
                left: 50% !important;
                min-width: 100vw !important;
                min-height: 100vh !important;
                width: auto !important;
                height: auto !important;
                transform: translate(-50%, -50%) scale(1.1) !important;
                object-fit: cover !important;
                object-position: center center !important;
                opacity: 0.3 !important;
                z-index: -1 !important;
                display: block !important;
                visibility: visible !important;
            `;
            
            // Eventos del video
            this.video.addEventListener('loadeddata', () => {
                console.log('📹 Video cargado');
                this.playVideo();
            });
            
            this.video.addEventListener('canplay', () => {
                this.playVideo();
            });
            
            this.video.addEventListener('ended', () => {
                this.video.currentTime = 0;
                this.playVideo();
            });
            
            // Forzar reproducción inicial
            setTimeout(() => {
                this.playVideo();
            }, 1000);
        },
        
        // Reproducir video
        async playVideo() {
            if (!this.video) return;
            
            try {
                // Asegurar que esté mudo antes de reproducir
                this.video.muted = true;
                this.video.volume = 0;
                
                // Intentar reproducir
                const playPromise = this.video.play();
                
                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('▶️ Video reproduciéndose');
                    this.isVisible = true;
                }
            } catch (error) {
                console.log('⚠️ Error reproduciendo video:', error.message);
                // Si falla, mostrar background alternativo
                this.showFallbackBackground();
            }
        },
        
        // Pausar video cuando no está visible
        pauseVideo() {
            if (this.video && !this.video.paused) {
                this.video.pause();
                console.log('⏸️ Video pausado');
            }
        },
        
        // Observer para optimizar performance
        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.playVideo();
                    } else {
                        // Solo pausar si está muy fuera de vista
                        if (entry.intersectionRatio < 0.1) {
                            this.pauseVideo();
                        }
                    }
                });
            }, {
                threshold: [0, 0.1, 0.5],
                rootMargin: '100px'
            });
            
            if (this.container) {
                observer.observe(this.container);
            }
        },
        
        // Manejar cambios de visibilidad de la página
        handleVisibilityChange() {
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseVideo();
                } else {
                    setTimeout(() => {
                        this.playVideo();
                    }, 500);
                }
            });
        },
        
        // Background de respaldo si no hay video
        createFallbackBackground() {
            if (!document.querySelector('.bg-video')) {
                const bgDiv = document.createElement('div');
                bgDiv.className = 'bg-video';
                bgDiv.style.cssText = `
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background: linear-gradient(135deg, 
                        rgba(201, 170, 113, 0.1) 0%, 
                        rgba(44, 90, 160, 0.05) 25%,
                        rgba(255, 255, 255, 0.05) 50%,
                        rgba(201, 170, 113, 0.08) 75%,
                        rgba(44, 90, 160, 0.03) 100%) !important;
                    z-index: -1 !important;
                `;
                document.body.insertBefore(bgDiv, document.body.firstChild);
                console.log('🎨 Background de respaldo creado');
            }
        },
        
        // Mostrar background alternativo si video falla
        showFallbackBackground() {
            if (this.container) {
                this.container.style.background = `
                    linear-gradient(135deg, 
                        rgba(201, 170, 113, 0.1) 0%, 
                        rgba(44, 90, 160, 0.05) 25%,
                        rgba(255, 255, 255, 0.05) 50%,
                        rgba(201, 170, 113, 0.08) 75%,
                        rgba(44, 90, 160, 0.03) 100%)
                `;
                console.log('🎨 Background alternativo activado');
            }
        },
        
        // Función para debugging
        debug() {
            console.log('=== DEBUG VIDEO ===');
            console.log('Video element:', !!this.video);
            console.log('Container:', !!this.container);
            console.log('Video paused:', this.video?.paused);
            console.log('Video muted:', this.video?.muted);
            console.log('Video source:', this.video?.src);
            console.log('Is mobile:', window.innerWidth <= 768);
            console.log('Video visible:', this.isVisible);
        }
    };
    
    // Inicializar video
    videoController.init();
    
    // Hacer accesible globalmente
    window.videoController = videoController;
    
    // Función de corrección manual
    window.fixVideoBackground = function() {
        const video = document.querySelector('.bg-video video');
        const container = document.querySelector('.bg-video');
        
        if (!video || !container) {
            console.log('❌ Video no encontrado, creando background alternativo');
            videoController.createFallbackBackground();
            return;
        }
        
        // Forzar estilos del container
        container.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            z-index: -1 !important;
            overflow: hidden !important;
            background: linear-gradient(135deg, #f7f8fb 0%, #f5f6f8 50%, #eef1f5 100%) !important;
        `;
        
        // Forzar estilos del video
        video.style.cssText = `
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            min-width: 100vw !important;
            min-height: 100vh !important;
            width: auto !important;
            height: auto !important;
            transform: translate(-50%, -50%) scale(1.1) !important;
            object-fit: cover !important;
            object-position: center center !important;
            opacity: 0.3 !important;
            z-index: -1 !important;
            display: block !important;
            visibility: visible !important;
        `;
        
        // Configurar atributos
        video.setAttribute('playsinline', 'true');
        video.setAttribute('muted', 'true');
        video.setAttribute('autoplay', 'true');
        video.setAttribute('loop', 'true');
        video.muted = true;
        
        // Intentar reproducir
        video.play().then(() => {
            console.log('✅ Video corregido y reproduciéndose');
        }).catch(error => {
            console.log('⚠️ Video no se puede reproducir:', error.message);
            videoController.showFallbackBackground();
        });
    };
    
    // Auto-corrección después de 3 segundos
    setTimeout(() => {
        if (!videoController.isVisible) {
            console.log('🔄 Auto-corrección del video...');
            window.fixVideoBackground();
        }
    }, 3000);
});

// ================================================
// OPTIMIZACIONES ADICIONALES PARA MÓVIL
// ================================================

// Ajustar video en resize
window.addEventListener('resize', () => {
    const video = document.querySelector('.bg-video video');
    if (video && window.innerWidth <= 768) {
        // Reajustar escala en móvil según orientación
        const isPortrait = window.innerHeight > window.innerWidth;
        const scale = isPortrait ? '1.2' : '1.05';
        
        video.style.transform = `translate(-50%, -50%) scale(${scale})`;
        console.log(`📱 Video reajustado para móvil (escala: ${scale})`);
    }
});

// Reanudar video cuando la página se vuelve visible
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.videoController) {
        setTimeout(() => {
            window.videoController.playVideo();
        }, 500);
    }
});

console.log('✅ JavaScript del video de fondo cargado');

window.SmileLuxuryStudio = SmileLuxuryStudio;