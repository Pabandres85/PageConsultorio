/**
 * Diamonds Smile - JAVASCRIPT PRINCIPAL
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
        console.log('🦷 Iniciando Diamonds Smile...');
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
// VIDEO DE FONDO - JAVASCRIPT CORREGIDO SIN OPACIDAD
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
            
            console.log('✅ Video de fondo inicializado sin opacidad');
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
            
            // Forzar estilos - OPACIDAD CORREGIDA
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
                opacity: 0.8 !important;
                z-index: -1 !important;
                display: block !important;
                visibility: visible !important;
            `;
            
            // Eventos del video
            this.video.addEventListener('loadeddata', () => {
                console.log('📹 Video cargado completamente visible');
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
                    console.log('▶️ Video reproduciéndose completamente visible');
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
            console.log('Video opacity:', this.video?.style.opacity);
            console.log('Video source:', this.video?.src);
            console.log('Is mobile:', window.innerWidth <= 768);
            console.log('Video visible:', this.isVisible);
        }
    };
    
    // Inicializar video
    videoController.init();
    
    // Hacer accesible globalmente
    window.videoController = videoController;
    
    // Función de corrección manual - CORREGIDA
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
        
        // Forzar estilos del video - SIN OPACIDAD
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
            opacity: 0.8 !important;
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
            console.log('✅ Video corregido y reproduciéndose SIN opacidad');
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

// ================================================
// ================================================
// VIDEO REEL - JAVASCRIPT COMPLETO
// ================================================

document.addEventListener('DOMContentLoaded', () => {
    
    const promoVideoController = {
        video: null,
        playButton: null,
        soundHint: null,
        container: null,
        overlay: null,
        isPlaying: false,
        isMuted: true,
        
        // Inicializar
        init() {
            this.video = document.querySelector('#promoVideo');
            this.container = document.querySelector('.about-video-container');
            
            if (!this.video || !this.container) {
                console.log('⚠️ Video reel no encontrado - creando elementos');
                this.createVideoElements();
                return;
            }
            
            this.createControls();
            this.setupVideo();
            this.setupEventListeners();
            this.setupIntersectionObserver();
            
            console.log('✅ Video reel inicializado con controles');
        },
        
        // Crear elementos si no existen
        createVideoElements() {
            const video = document.querySelector('.about-video-container video');
            if (video) {
                this.video = video;
                this.container = document.querySelector('.about-video-container');
                this.createControls();
                this.setupVideo();
                this.setupEventListeners();
                console.log('✅ Elementos encontrados y configurados');
            }
        },
        
        // Crear controles
        createControls() {
            if (!this.container) return;
            
            // Crear overlay si no existe
            this.overlay = this.container.querySelector('.video-overlay');
            if (!this.overlay) {
                this.overlay = document.createElement('div');
                this.overlay.className = 'video-overlay';
                this.container.appendChild(this.overlay);
            }
            
            // Crear botón play/pause si no existe
            this.playButton = this.overlay.querySelector('.video-play-pause');
            if (!this.playButton) {
                this.playButton = document.createElement('button');
                this.playButton.className = 'video-play-pause';
                this.playButton.innerHTML = '<i class="fas fa-pause"></i>';
                this.playButton.setAttribute('aria-label', 'Reproducir/Pausar video');
                this.overlay.appendChild(this.playButton);
            }
            
            // Crear hint de sonido si no existe
            this.soundHint = this.container.querySelector('.video-sound-hint');
            if (!this.soundHint) {
                this.soundHint = document.createElement('div');
                this.soundHint.className = 'video-sound-hint show';
                this.soundHint.innerHTML = '<i class="fas fa-volume-up"></i><span>Toca para activar sonido</span>';
                this.container.appendChild(this.soundHint);
            }
        },
        
        // Configurar video
        setupVideo() {
            if (!this.video) return;
            
            // Atributos para móvil
            this.video.setAttribute('playsinline', 'true');
            this.video.setAttribute('webkit-playsinline', 'true');
            this.video.setAttribute('muted', 'true');
            this.video.muted = true;
            this.isMuted = true;
            
            // Intentar autoplay después de un momento
            setTimeout(() => {
                this.playVideo();
            }, 1000);
            
            // Mostrar hint de sonido después de 3 segundos
            setTimeout(() => {
                this.showSoundHint();
            }, 3000);
        },
        
        // Event listeners
        setupEventListeners() {
            if (!this.video || !this.container) return;
            
            // Click en botón play/pause
            if (this.playButton) {
                this.playButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePlayPause();
                });
            }
            
            // Click en video para play/pause
            this.video.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlayPause();
            });
            
            // Click en container para activar sonido
            this.container.addEventListener('click', (e) => {
                if (this.isMuted && (e.target === this.container || e.target === this.video)) {
                    this.toggleSound();
                }
            });
            
            // Doble click para toggle sonido
            this.container.addEventListener('dblclick', (e) => {
                e.preventDefault();
                this.toggleSound();
            });
            
            // Eventos del video
            this.video.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayButton();
            });
            
            this.video.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayButton();
            });
            
            this.video.addEventListener('loadeddata', () => {
                console.log('📹 Video reel cargado');
            });
            
            this.video.addEventListener('error', (e) => {
                console.log('❌ Error cargando video reel:', e);
            });
            
            // Touch events para móvil
            let touchStartTime = 0;
            this.container.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
            });
            
            this.container.addEventListener('touchend', (e) => {
                const touchDuration = Date.now() - touchStartTime;
                if (touchDuration < 300) { // Tap rápido
                    if (this.isMuted) {
                        this.toggleSound();
                    } else {
                        this.togglePlayPause();
                    }
                }
            });
        },
        
        // Observer para reproducir cuando está visible
        setupIntersectionObserver() {
            if (!this.container) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                        this.playVideo();
                    } else if (entry.intersectionRatio < 0.1) {
                        this.pauseVideo();
                    }
                });
            }, {
                threshold: [0, 0.1, 0.3, 0.7],
                rootMargin: '50px'
            });
            
            observer.observe(this.container);
        },
        
        // Reproducir video
        async playVideo() {
            if (!this.video) return;
            
            try {
                this.video.muted = this.isMuted;
                const playPromise = this.video.play();
                
                if (playPromise !== undefined) {
                    await playPromise;
                    console.log('▶️ Video reel reproduciéndose');
                    this.isPlaying = true;
                    this.updatePlayButton();
                }
            } catch (error) {
                console.log('⚠️ Error reproduciendo video reel:', error.message);
            }
        },
        
        // Pausar video
        pauseVideo() {
            if (this.video && !this.video.paused) {
                this.video.pause();
                console.log('⏸️ Video reel pausado');
                this.isPlaying = false;
                this.updatePlayButton();
            }
        },
        
        // Toggle play/pause
        togglePlayPause() {
            if (!this.video) return;
            
            if (this.video.paused) {
                this.playVideo();
            } else {
                this.pauseVideo();
            }
        },
        
        // Toggle sonido
        toggleSound() {
            if (!this.video) return;
            
            this.isMuted = !this.isMuted;
            this.video.muted = this.isMuted;
            
            if (!this.isMuted) {
                this.video.volume = 0.7; // Volumen al 70%
                this.hideSoundHint();
                this.showTemporaryMessage('🔊 Sonido activado');
                console.log('🔊 Sonido activado');
            } else {
                this.showSoundHint();
                this.showTemporaryMessage('🔇 Sonido desactivado');
                console.log('🔇 Sonido desactivado');
            }
        },
        
        // Actualizar icono del botón
        updatePlayButton() {
            if (!this.playButton) return;
            
            const icon = this.playButton.querySelector('i');
            if (icon) {
                if (this.isPlaying) {
                    icon.className = 'fas fa-pause';
                } else {
                    icon.className = 'fas fa-play';
                }
            }
        },
        
        // Mostrar hint de sonido
        showSoundHint() {
            if (this.soundHint && this.isMuted) {
                this.soundHint.classList.add('show');
                this.soundHint.innerHTML = '<i class="fas fa-volume-up"></i><span>Toca para activar sonido</span>';
            }
        },
        
        // Ocultar hint de sonido
        hideSoundHint() {
            if (this.soundHint) {
                this.soundHint.classList.remove('show');
            }
        },
        
        // Mostrar mensaje temporal
        showTemporaryMessage(message) {
            if (!this.soundHint) return;
            
            const originalContent = this.soundHint.innerHTML;
            this.soundHint.innerHTML = `<span>${message}</span>`;
            this.soundHint.classList.add('show');
            
            setTimeout(() => {
                if (this.isMuted) {
                    this.soundHint.innerHTML = originalContent;
                } else {
                    this.soundHint.classList.remove('show');
                }
            }, 2000);
        },
        
        // Debug
        debug() {
            console.log('=== DEBUG VIDEO REEL ===');
            console.log('Video:', !!this.video);
            console.log('Container:', !!this.container);
            console.log('Playing:', this.isPlaying);
            console.log('Muted:', this.isMuted);
            console.log('Video src:', this.video?.src);
            console.log('Video duration:', this.video?.duration);
            console.log('Controls:', {
                overlay: !!this.overlay,
                playButton: !!this.playButton,
                soundHint: !!this.soundHint
            });
        }
    };
    
    // Inicializar
    promoVideoController.init();
    
    // Hacer accesible globalmente
    window.promoVideoController = promoVideoController;
    
    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (!promoVideoController.video) return;
        
        // Solo si no hay un input activo
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key.toLowerCase()) {
            case ' ': // Barra espaciadora
            case 'k': // Tecla K
                e.preventDefault();
                promoVideoController.togglePlayPause();
                break;
                
            case 'm': // Tecla M para mute/unmute
                e.preventDefault();
                promoVideoController.toggleSound();
                break;
        }
    });
    
    // Pausar cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            promoVideoController.pauseVideo();
        } else {
            setTimeout(() => {
                promoVideoController.playVideo();
            }, 500);
        }
    });
    
    console.log(' Video reel completamente inicializado');
    console.log(' Controles disponibles:');
    console.log('   - Click/Tap: Play/Pause');
    console.log('   - Doble click/tap: Toggle sonido');
    console.log('   - Hover: Ver controles');
    console.log('   - Espacio/K: Play/Pause');
    console.log('   - M: Toggle sonido');
});

 /*CHATBOT COMPLETO  */

class DentalChatbotRefined {
    constructor() {
        this.isOpen = false;
        this.hasInteracted = false;
        this.messageCount = 0;
        
        this.elements = {
            chatbot: document.getElementById('dentalChatbot'),
            toggle: document.getElementById('chatbotToggle'),
            window: document.getElementById('chatbotWindow'),
            messages: document.getElementById('chatMessages'),
            notification: document.getElementById('chatNotification'),
            typingIndicator: document.getElementById('typingIndicator')
        };

        // Datos de la clínica
        this.clinicData = {
            name: 'Diamond Smiles',
            phone: '+573168866812',
            email: 'dra.patriciamunozop@gmail.com',
            address: 'Carrera 55 # 9-88 Camino Real, Cali',
            hours: 'Lun-Vie: 8AM-6PM',
            whatsappMessage: 'Hola, me interesa información sobre sus servicios dentales',
            googleMapsUrl: 'https://maps.google.com/?q=Carrera+55+9-88+Camino+Real,+Cali,+Colombia'
        };

        // Base de conocimiento 
        this.knowledge = {
            servicios: {
                trigger: ['servicios', 'tratamientos', 'que hacen', 'especialidades'],
                response: '🦷 Principales servicios:\n\n• Estética Dental\n• Implantología\n• Ortodoncia\n• Odontología General\n\n¿Te interesa alguno?',
                options: ['Estética Dental', 'Implantes', 'Ortodoncia', 'Más info']
            },
            precios: {
                trigger: ['precio', 'costo', 'cuanto cuesta', 'tarifas'],
                response: '💰 Precios personalizados según tratamiento.\n\n✨ ¡Consulta Personalizada!\n\n¿Agendamos una evaluación?',
                options: ['Consulta Personalizada', 'Llamar ahora', 'WhatsApp']
            },
            citas: {
                trigger: ['cita', 'agendar', 'reservar', 'turno'],
                response: '📅 Agenda tu cita:\n\n📱 WhatsApp (más rápido)\n📞 +57 (316) 886-6812\n💻 Formulario web\n\n⏰ Lun-Vie: 8AM-6PM',
                options: ['WhatsApp', 'Llamar', 'Formulario']
            },
            ubicacion: {
                trigger: ['donde', 'ubicacion', 'ubicación', 'direccion', 'dirección', 'donde estan', 'donde están', 'como llegar'],
                response: '📍 Nos encuentras en:\n\n🏥 Carrera 55 # 9-88\nCamino Real, Cali, Colombia\n\n🚗 Fácil acceso\n🕒 Lun-Vie: 8AM-6PM\n\n¿Cómo prefieres llegar?',
                options: ['Ver en Google Maps', 'Página de Contacto', 'Indicaciones WhatsApp', 'Llamar']
            },
            emergencias: {
                trigger: ['urgencia', 'emergencia', 'dolor', 'duele'],
                response: '🚨 Emergencias:\n\n📞 LLAMA: +57 (316) 886-6812\n💬 WhatsApp 24/7\n\n⚡ Atención urgente disponible',
                options: ['Llamar URGENTE', 'WhatsApp', 'Síntomas']
            }
        };

        // Localize knowledge and dynamic strings when translations are available
        this.localizeKnowledge = function(){
            try{
                var t = (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t : function(k, f){ return f || k; };
                // clinic data
                this.clinicData.whatsappMessage = t('chatbot.whatsapp_message', this.clinicData.whatsappMessage);

                // iterate known sections and replace response/options if translations present
                for(var k in this.knowledge){
                    if(!this.knowledge.hasOwnProperty(k)) continue;
                    var baseKey = 'chatbot.knowledge.' + k;
                    var resp = t(baseKey + '.response', this.knowledge[k].response);
                    var opts = t(baseKey + '.options', null);
                    this.knowledge[k].response = resp;
                    if(Array.isArray(opts)) this.knowledge[k].options = opts;
                }

            }catch(e){ console.warn('i18n localizeKnowledge failed', e); }
        };

        // If translations are already loaded, localize now
        try{ if(window.SiteI18n && window.SiteI18n.t){ this.localizeKnowledge(); } }catch(e){}
        // Re-localize when translations become available/loaded
        document.addEventListener('i18n:loaded', function(){ try{ if(window.dentalChatbotRefined) window.dentalChatbotRefined.localizeKnowledge(); }catch(e){} });

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showWelcomeMessage();
        this.startNotificationAnimation();
        console.log('🦷 Chatbot Refinado inicializado');
    }

    setupEventListeners() {
        if (!this.elements.toggle) return;

        // Toggle del chat
        this.elements.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleChat();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChat();
            }
        });

        // Click fuera para cerrar
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.elements.chatbot.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.isOpen = true;
        this.elements.window.classList.add('active');
        this.elements.toggle.classList.add('active');
        
        if (this.elements.notification) {
            this.elements.notification.style.display = 'none';
        }
        
        if (!this.hasInteracted) {
            this.hasInteracted = true;
            setTimeout(() => {
                this.showInitialOptions();
            }, 600);
        }

        this.scrollToBottom();
        console.log('💬 Chat refinado abierto');
    }

    closeChat() {
        this.isOpen = false;
        this.elements.window.classList.remove('active');
        this.elements.toggle.classList.remove('active');
        console.log('❌ Chat cerrado');
    }

    showWelcomeMessage() {
        const welcomeMessage = {
            type: 'bot',
            text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.welcome','¡Hola! 👋 Asistente virtual de Diamond Smiles.\n\n¿En qué puedo ayudarte?') : '¡Hola! 👋 Asistente virtual de Diamond Smiles.\n\n¿En qué puedo ayudarte?',
            time: this.getCurrentTime()
        };

        this.addMessage(welcomeMessage);
    }

    showInitialOptions() {
        const optionsMessage = {
            type: 'bot',
            text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.initial.lead','Pregúntame sobre:') : 'Pregúntame sobre:',
            options: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.initial.options',['Servicios','Agendar cita','Precios','Ubicación']) : ['Servicios','Agendar cita','Precios','Ubicación'],
            time: this.getCurrentTime()
        };

        this.addMessage(optionsMessage);
    }

    addMessage(message) {
        if (!this.elements.messages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.type}`;
        
        const avatar = message.type === 'bot' ? 
            '<i class="fas fa-tooth"></i>' : 
            '<i class="fas fa-user"></i>';

        messageEl.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <div class="message-text">${message.text.replace(/\n/g, '<br>')}</div>
                <div class="message-time">${message.time}</div>
                ${message.options ? this.createQuickOptions(message.options) : ''}
            </div>
        `;

        this.elements.messages.appendChild(messageEl);
        this.scrollToBottom();
        this.messageCount++;
    }

    createQuickOptions(options) {
        const optionsHtml = options.map(option => 
            `<div class="quick-option" onclick="window.dentalChatbotRefined.handleOptionClick('${option}')">${option}</div>`
        ).join('');

        return `<div class="quick-options">${optionsHtml}</div>`;
    }

    handleOptionClick(option) {
        // Agregar mensaje del usuario
        this.addMessage({
            type: 'user',
            text: option,
            time: this.getCurrentTime()
        });

        // NUEVO: Manejar opciones especiales primero
        if (this.handleSpecialOptions(option)) {
            return;
        }

        // Mostrar indicador de escritura
        this.showTypingIndicator();

        // Procesar respuesta
        setTimeout(() => {
            this.processUserInput(option);
        }, 800);
    }

    // FUNCIÓN COMPLETA: Manejar opciones especiales
    handleSpecialOptions(option) {
        switch(option.toLowerCase()) {
            case 'ver en google maps':
            case 'google maps':
                window.open(this.clinicData.googleMapsUrl, '_blank');
                this.addMessage({
                    type: 'bot',
                    text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.maps.opening','🗺️ Abriendo Google Maps...') : '🗺️ Abriendo Google Maps...',
                    options: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.knowledge.ubicacion.options',['Ver en Google Maps','Página de Contacto','Indicaciones WhatsApp','Llamar']) : ['WhatsApp','Llamar','Página de Contacto','Más servicios'],
                    time: this.getCurrentTime()
                });
                console.log('🗺️ Google Maps abierto');
                return true;

            case 'página de contacto':
            case 'pagina de contacto':
                const currentPath = window.location.pathname;
                if (currentPath.includes('/pages/')) {
                    window.location.href = 'contacto.html';
                } else {
                    window.location.href = 'pages/contacto.html';
                }
                this.addMessage({
                    type: 'bot',
                    text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.contact.opening','📋 Abriendo página de contacto con mapa interactivo...\n\n¿Te ayudo con algo más?') : '📋 Abriendo página de contacto con mapa interactivo...\n\n¿Te ayudo con algo más?',
                    options: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.default.options',['WhatsApp','Llamar','Más servicios']) : ['WhatsApp','Llamar','Más servicios'],
                    time: this.getCurrentTime()
                });
                console.log('📋 Página de contacto abierta');
                return true;

            case 'indicaciones whatsapp':
                const locationMessage = `Hola! Me puedes enviar la ubicación exacta de Diamond Smiles? Necesito indicaciones para llegar a ${this.clinicData.address}`;
                const message = encodeURIComponent(locationMessage);
                const whatsappUrl = `https://wa.me/${this.clinicData.phone.replace(/\D/g, '')}?text=${message}`;
                window.open(whatsappUrl, '_blank');
                this.addMessage({
                    type: 'bot',
                    text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.location.sent','📱 Enviando ubicación por WhatsApp...\n\n¿Algo más en lo que pueda ayudarte?') : '📱 Enviando ubicación por WhatsApp...\n\n¿Algo más en lo que pueda ayudarte?',
                    options: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.default.options',['WhatsApp','Llamar','Más servicios']) : ['Agendar cita','Más servicios'],
                    time: this.getCurrentTime()
                });
                console.log('📍 Ubicación solicitada por WhatsApp');
                return true;

            case 'whatsapp':
                const msg = encodeURIComponent(this.clinicData.whatsappMessage);
                const wUrl = `https://wa.me/${this.clinicData.phone.replace(/\D/g, '')}?text=${msg}`;
                window.open(wUrl, '_blank');
                this.addMessage({
                    type: 'bot',
                    text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.whatsapp.opening','💬 Abriendo WhatsApp...\n\nTe atenderemos enseguida!') : '💬 Abriendo WhatsApp...\n\nTe atenderemos enseguida!',
                    time: this.getCurrentTime()
                });
                console.log('📱 WhatsApp abierto');
                return true;

            case 'llamar':
            case 'llamar ahora':
            case 'llamar urgente':
                window.location.href = `tel:${this.clinicData.phone}`;
                this.addMessage({
                    type: 'bot',
                    text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.call.opening','📞 Iniciando llamada...\n\nTe esperamos!') : '📞 Iniciando llamada...\n\nTe esperamos!',
                    time: this.getCurrentTime()
                });
                console.log('📞 Iniciando llamada');
                return true;

            case 'formulario':
                const cPath = window.location.pathname;
                if (cPath.includes('/pages/')) {
                    window.location.href = 'contacto.html';
                } else {
                    window.location.href = 'pages/contacto.html';
                }
                this.addMessage({
                    type: 'bot',
                    text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.form.opening','📝 Abriendo formulario de contacto...') : '📝 Abriendo formulario de contacto...',
                    time: this.getCurrentTime()
                });
                console.log('📝 Formulario abierto');
                return true;

            case 'estética dental':
            case 'estetica dental':
                this.addMessage({
                    type: 'bot',
                    text: '✨ Estética Dental:\n\n• Blanqueamiento profesional\n• Carillas de porcelana\n• Diseño de sonrisa\n• Resinas estéticas\n\n¿Te interesa algún tratamiento específico?',
                    options: ['Blanqueamiento', 'Carillas', 'Diseño de sonrisa', 'Agendar consulta'],
                    time: this.getCurrentTime()
                });
                return true;

            case 'implantes':
            case 'implantología':
                this.addMessage({
                    type: 'bot',
                    text: '🦷 Implantología:\n\n• Implantes unitarios\n• Prótesis sobre implantes\n• All-on-4\n• Carga inmediata\n\n¿Necesitas reemplazar alguna pieza dental?',
                    options: ['Una pieza', 'Varias piezas', 'All-on-4', 'Consulta evaluación'],
                    time: this.getCurrentTime()
                });
                return true;

            case 'ortodoncia':
                this.addMessage({
                    type: 'bot',
                    text: '🦷 Ortodoncia:\n\n• Brackets metálicos\n• Brackets estéticos\n• Invisalign\n• Ortodoncia interceptiva\n\n¿Qué tipo de tratamiento te interesa?',
                    options: ['Brackets invisibles', 'Invisalign', 'Para niños', 'Consulta evaluación'],
                    time: this.getCurrentTime()
                });
                return true;

            case 'más info':
            case 'mas info':
            case 'más servicios':
            case 'mas servicios':
                this.addMessage({
                    type: 'bot',
                    text: '🦷 Otros servicios:\n\n• Endodoncia\n• Cirugía oral\n• Periodoncia\n• Odontopediatría\n• Profilaxis\n\n¿Te interesa alguno?',
                    options: ['Endodoncia', 'Cirugía oral', 'Limpieza dental', 'Niños'],
                    time: this.getCurrentTime()
                });
                return true;

            case 'consulta personalizada':
            case 'consulta evaluación':
            case 'agendar consulta':
                this.addMessage({
                    type: 'bot',
                    text: '📅 ¡Perfecto! Agenda tu consulta personalizada:\n\n✨ Primera consulta SIN COSTO\n📋 Evaluación completa\n💡 Plan de tratamiento\n\n¿Cómo prefieres agendar?',
                    options: ['WhatsApp', 'Llamar', 'Formulario web'],
                    time: this.getCurrentTime()
                });
                return true;

            case 'síntomas':
            case 'sintomas':
                this.addMessage({
                    type: 'bot',
                    text: '🚨 Síntomas de emergencia dental:\n\n• Dolor intenso\n• Hinchazón facial\n• Sangrado abundante\n• Trauma dental\n• Diente fracturado\n\n¿Presentas alguno de estos?',
                    options: ['Sí, es urgente', 'No es urgente', 'Llamar ahora', 'WhatsApp'],
                    time: this.getCurrentTime()
                });
                return true;

            default:
                return false;
        }
    }

    processUserInput(input) {
        this.hideTypingIndicator();
        
        const normalizedInput = input.toLowerCase();
        let response = null;

        // Buscar en la base de conocimiento
        for (const [key, data] of Object.entries(this.knowledge)) {
            if (data.trigger.some(trigger => normalizedInput.includes(trigger))) {
                response = {
                    type: 'bot',
                    text: data.response,
                    options: data.options,
                    time: this.getCurrentTime()
                };
                break;
            }
        }

        // Respuesta por defecto
        if (!response) {
            response = {
                type: 'bot',
                text: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.default.response','🤔 Te conecto con nuestro equipo para mejor información.\n\n¿Prefieres WhatsApp o llamada?') : '🤔 Te conecto con nuestro equipo para mejor información.\n\n¿Prefieres WhatsApp o llamada?',
                options: (window.SiteI18n && window.SiteI18n.t) ? window.SiteI18n.t('chatbot.default.options',['WhatsApp','Llamar','Más servicios']) : ['WhatsApp','Llamar','Más servicios'],
                time: this.getCurrentTime()
            };
        }

        this.addMessage(response);
    }

    showTypingIndicator() {
        if (this.elements.typingIndicator) {
            this.elements.typingIndicator.classList.add('active');
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        if (this.elements.typingIndicator) {
            this.elements.typingIndicator.classList.remove('active');
        }
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    scrollToBottom() {
        if (this.elements.messages) {
            setTimeout(() => {
                this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
            }, 50);
        }
    }

    startNotificationAnimation() {
        if (!this.hasInteracted && !this.isOpen) {
            setTimeout(() => {
                if (!this.hasInteracted && !this.isOpen && this.elements.notification) {
                    this.elements.notification.style.display = 'flex';
                    this.startNotificationAnimation();
                }
            }, 25000);
        }
    }
}

// Funciones globales optimizadas
function openWhatsApp() {
    const chatbot = window.dentalChatbotRefined;
    if (!chatbot) return;
    
    const message = encodeURIComponent(chatbot.clinicData.whatsappMessage);
    const whatsappUrl = `https://wa.me/${chatbot.clinicData.phone.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    console.log('📱 WhatsApp abierto');
}

function openContactForm() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/pages/')) {
        window.location.href = 'contacto.html';
    } else {
        window.location.href = 'pages/contacto.html';
    }
    
    console.log('📋 Formulario de contacto abierto');
}

// Inicializar chatbot refinado
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('dentalChatbot')) {
            window.dentalChatbotRefined = new DentalChatbotRefined();
            console.log('🚀 Chatbot Dental Refinado completamente funcional');
        }
    }, 800);
});

// Función de personalización
function customizeChatbotRefined(config) {
    if (window.dentalChatbotRefined && config) {
        Object.assign(window.dentalChatbotRefined.clinicData, config);
        console.log('⚙️ Chatbot personalizado');
    }
}

// Función de debug
function debugChatbot() {
    const chatbot = window.dentalChatbotRefined;
    
    if (!chatbot) {
        console.log('❌ Chatbot no encontrado');
        return;
    }
    
    console.log('=== DEBUG CHATBOT ===');
    console.log('✅ Chatbot inicializado:', !!chatbot);
    console.log('✅ Elementos encontrados:', Object.keys(chatbot.elements).filter(key => chatbot.elements[key]));
    console.log('✅ Base de conocimiento:', Object.keys(chatbot.knowledge));
    console.log('✅ Datos clínica:', chatbot.clinicData);
    console.log('✅ Google Maps URL:', chatbot.clinicData.googleMapsUrl);
    console.log('✅ Función especial:', typeof chatbot.handleSpecialOptions);
    
    // Test específico de ubicación
    console.log('🧪 Test ubicación:');
    console.log('- Triggers:', chatbot.knowledge.ubicacion?.trigger);
    console.log('- Response:', !!chatbot.knowledge.ubicacion?.response);
    console.log('- Options:', chatbot.knowledge.ubicacion?.options);
}