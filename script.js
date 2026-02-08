// ========================================
// MOBILE MENU - OTIMIZADO PARA PERFORMANCE
// ========================================

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
const navOverlay = document.getElementById('navOverlay');
const body = document.body;

let isMenuOpen = false;
let scrollPosition = 0;
let menuAnimationFrame = null;

// Verificar se elementos existem antes de usar
if (!menuToggle || !nav || !navOverlay) {
    console.warn('Elementos do menu não encontrados - página pode não ter menu');
}

function openMenu() {
    if (isMenuOpen || !nav || !menuToggle) return;
    
    // Cancelar qualquer animação pendente
    if (menuAnimationFrame) {
        cancelAnimationFrame(menuAnimationFrame);
    }
    
    // Salvar posição do scroll
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    // Bloquear scroll do body (otimizado para mobile)
    body.classList.add('menu-open');
    body.style.top = `-${scrollPosition}px`;
    body.style.position = 'fixed';
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    
    // Abrir menu com requestAnimationFrame para melhor performance
    menuAnimationFrame = requestAnimationFrame(() => {
        nav.classList.add('active');
        menuToggle.innerHTML = '✕';
        menuToggle.setAttribute('aria-expanded', 'true');
        document.documentElement.style.overflow = 'hidden';
        isMenuOpen = true;
        menuAnimationFrame = null;
    });
}

function closeMenu() {
    if (!isMenuOpen || !nav || !menuToggle) return;
    
    // Cancelar qualquer animação pendente
    if (menuAnimationFrame) {
        cancelAnimationFrame(menuAnimationFrame);
    }
    
    // Fechar menu
    nav.classList.remove('active');
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Restaurar scroll do body
    body.classList.remove('menu-open');
    body.style.top = '';
    body.style.position = '';
    body.style.width = '';
    body.style.overflow = '';
    body.style.touchAction = '';
    document.documentElement.style.overflow = '';
    
    // Restaurar posição do scroll (suave no mobile)
    menuAnimationFrame = requestAnimationFrame(() => {
        window.scrollTo({
            top: scrollPosition,
            behavior: 'auto' // Instantâneo para melhor UX
        });
        isMenuOpen = false;
        menuAnimationFrame = null;
    });
}

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

// Fechar menu ao clicar no overlay
if (navOverlay) {
    navOverlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
    });
    
    // Prevenir propagação de eventos
    navOverlay.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
}

// Dropdown Menu Toggle (Mobile)
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = toggle.closest('.nav-dropdown');
            dropdown.classList.toggle('active');
        }
    });
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.stopPropagation();
        // Pequeno delay para permitir navegação
        setTimeout(() => {
            closeMenu();
        }, 100);
    });
    
    // Prevenir múltiplos cliques
    link.addEventListener('touchstart', (e) => {
        e.stopPropagation();
    });
});

// Fechar dropdowns ao clicar em item do dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            const dropdown = item.closest('.nav-dropdown');
            dropdown.classList.remove('active');
            closeMenu();
        }
    });
});

// Fechar menu com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        e.preventDefault();
        closeMenu();
    }
});

// Prevenir scroll quando menu está aberto
document.addEventListener('touchmove', (e) => {
    if (isMenuOpen) {
        // Permitir scroll apenas dentro do menu
        if (nav.contains(e.target) || nav === e.target) {
            return;
        }
        // Bloquear scroll no resto da página
        e.preventDefault();
    }
}, { passive: false });

// Prevenir scroll com wheel quando menu está aberto
document.addEventListener('wheel', (e) => {
    if (isMenuOpen && !nav.contains(e.target)) {
        e.preventDefault();
    }
}, { passive: false });

// Fechar menu ao redimensionar para desktop
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768 && isMenuOpen) {
            closeMenu();
        }
    }, 250);
});

// Header scroll effect - optimized
let lastScroll = 0;
let headerScrollTimeout;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (headerScrollTimeout) {
        cancelAnimationFrame(headerScrollTimeout);
    }
    
    headerScrollTimeout = requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
});

// Scroll progress bar - debounced
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = requestAnimationFrame(() => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        document.body.style.setProperty('--scroll-width', scrolled + '%');
    });
});

// Add scroll progress bar style
const style = document.createElement('style');
style.textContent = `
    body::before {
        width: var(--scroll-width, 0%);
    }
`;
document.head.appendChild(style);

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const sectionTop = section.offsetTop - headerHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
}

// Active navigation link on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinksArray = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinksArray.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ========================================
// INTERSECTION OBSERVER - MOBILE OPTIMIZED
// ========================================

// Detectar se é mobile para otimizar animações
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

const observerOptions = {
    threshold: isMobileDevice ? 0.01 : 0.05, // Menor threshold no mobile
    rootMargin: isMobileDevice ? '0px' : '0px 0px -50px 0px' // Sem margem no mobile
};

const observer = new IntersectionObserver((entries) => {
    // Usar requestAnimationFrame para melhor performance
    requestAnimationFrame(() => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // No mobile, mostrar imediatamente sem animação
                if (isMobileDevice) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'none';
                } else {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                
                // Add visible class for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('visible');
                }
                
                // Parar de observar após aparecer (melhor performance)
                observer.unobserve(entry.target);
            }
        });
    });
}, observerOptions);

// ========================================
// INITIALIZE ANIMATIONS - MOBILE FIRST
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    const initAnimations = () => {
        const animatedElements = document.querySelectorAll(
            '.checklist-item, .arrival-card, .cost-card, .timeline-item, .tip-card, .family-tip-card, .family-transport-card, .emergency-card, .hotel-info-card, .flight-card, .first-flight-tip, .layover-card'
        );
        
        if (isMobileDevice) {
            // Mobile: mostrar imediatamente sem animação (melhor performance)
            animatedElements.forEach((el) => {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.style.transition = 'none';
            });
            
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'none';
                item.classList.add('visible');
            });
        } else {
            // Desktop: usar animações suaves
            animatedElements.forEach((el) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                observer.observe(el);
            });
            
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';
                observer.observe(item);
            });
        }
    };
    
    // Usar requestIdleCallback se disponível, senão setTimeout
    if ('requestIdleCallback' in window) {
        requestIdleCallback(initAnimations, { timeout: 1000 });
    } else {
        // No mobile, executar imediatamente
        setTimeout(initAnimations, isMobileDevice ? 0 : 100);
    }
});

// Add click handlers for CTA buttons
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', (e) => {
        // Ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        const target = e.target.getAttribute('onclick');
        if (target) {
            const sectionId = target.match(/'([^']+)'/)[1];
            scrollToSection(sectionId);
        }
    });
});

// Enhanced hover effects for cards
document.querySelectorAll('.cost-card, .tip-card, .arrival-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < hero.offsetHeight) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.5;
    }
});

// Switch between roteiros with animation
function switchRoteiro(roteiroId) {
    // Hide all roteiro contents with fade out
    const roteiroContents = document.querySelectorAll('.roteiro-content');
    roteiroContents.forEach(content => {
        if (content.classList.contains('active')) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            setTimeout(() => {
                content.classList.remove('active');
            }, 300);
        }
    });

    // Remove active class from all tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });

    // Show selected roteiro with fade in
    setTimeout(() => {
        const selectedRoteiro = document.getElementById(roteiroId);
        if (selectedRoteiro) {
            selectedRoteiro.classList.add('active');
            selectedRoteiro.style.opacity = '0';
            selectedRoteiro.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                selectedRoteiro.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                selectedRoteiro.style.opacity = '1';
                selectedRoteiro.style.transform = 'translateY(0)';
            }, 50);
        }

        // Activate corresponding tab
        const tabId = roteiroId === 'roteiro1' ? 'tab1' : 'tab2';
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }

        // Scroll to roteiro section smoothly
        setTimeout(() => {
            scrollToSection('roteiro');
        }, 100);
    }, 300);
}

// Add ripple effect style
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Add smooth transitions
document.documentElement.style.scrollBehavior = 'smooth';

// Loading screen - hide quickly
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Hide loading screen after minimal delay
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.remove(), 500);
        }, 300);
    }
});

// Loading animation - optimized
window.addEventListener('load', () => {
    // Hide loading screen if still visible
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 500);
    }
    
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    // Animate hero elements with reduced delay (or skip on mobile)
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-badges, .cta-button');
    if (isMobile) {
        heroElements.forEach((el) => {
            el.style.opacity = '1';
            el.style.transform = 'none';
        });
    } else {
        heroElements.forEach((el, index) => {
            el.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
        });
    }
});

// Add counter animation for numbers
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

// Add typing effect for hero title (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add smooth scroll on page load if hash exists
window.addEventListener('load', () => {
    if (window.location.hash) {
        setTimeout(() => {
            const hash = window.location.hash.substring(1);
            scrollToSection(hash);
        }, 500);
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - could switch to next roteiro
        } else {
            // Swipe right - could switch to previous roteiro
        }
    }
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
const debouncedScroll = debounce(() => {
    // Scroll-based animations
}, 10);

window.addEventListener('scroll', debouncedScroll);

// Add lazy loading for images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth reveal animation for sections
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.section').forEach(section => {
    revealObserver.observe(section);
});

// Add CSS for revealed sections
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    .section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section.revealed {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(revealStyle);

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Adiciona uma classe para animação suave
    document.body.classList.add('theme-transitioning');
    
    // Pequeno delay para garantir que a classe seja aplicada
    setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        
        // Remove a classe após a transição
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 400);
    }, 10);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Lazy load html2pdf.js
let html2pdfLoaded = false;

async function loadHtml2Pdf() {
    if (html2pdfLoaded || typeof html2pdf !== 'undefined') {
        html2pdfLoaded = true;
        return;
    }
    
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.async = true;
        script.onload = () => {
            html2pdfLoaded = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// PDF Download Function
const downloadPdfBtn = document.getElementById('downloadPdf');

if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', async () => {
    try {
        // Show loading state
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.style.opacity = '0.6';
        const originalText = downloadPdfBtn.innerHTML;
        downloadPdfBtn.innerHTML = '<span class="pdf-icon">⏳</span><span class="pdf-text">Carregando...</span>';
        
        // Load html2pdf if not loaded
        await loadHtml2Pdf();
        
        downloadPdfBtn.innerHTML = '<span class="pdf-icon">⏳</span><span class="pdf-text">Gerando...</span>';
        
        // Esconder elementos que não devem aparecer no PDF
        const elementsToHide = document.querySelectorAll('.header-actions, .menu-toggle, .cta-button, .tab-button, #loadingScreen, .back-to-top');
        const originalDisplay = [];
        elementsToHide.forEach((el, index) => {
            originalDisplay[index] = el.style.display;
            el.style.display = 'none';
        });
        
        // Esconder navegação mas manter header
        const nav = document.querySelector('.nav');
        const navOriginalDisplay = nav ? nav.style.display : '';
        if (nav) nav.style.display = 'none';
        
        // Garantir que todos os elementos estejam visíveis e sem animações
        const allElements = document.querySelectorAll('*');
        const originalOpacities = [];
        const originalTransforms = [];
        
        allElements.forEach((el, index) => {
            // Salvar estados originais
            originalOpacities[index] = el.style.opacity;
            originalTransforms[index] = el.style.transform;
            
            // Garantir visibilidade
            if (el.style.opacity === '0' || el.classList.contains('hidden')) {
                el.style.opacity = '1';
                el.style.visibility = 'visible';
            }
            
            // Remover transformações que podem esconder conteúdo
            if (el.style.transform && el.style.transform.includes('translateY')) {
                el.style.transform = 'none';
            }
        });
        
        // Adicionar estilos temporários para PDF
        const pdfStyle = document.createElement('style');
        pdfStyle.id = 'pdf-generation-styles';
        pdfStyle.textContent = `
            @media print {
                * {
                    animation: none !important;
                    transition: none !important;
                }
            }
            body {
                background: white !important;
            }
            .header {
                position: relative !important;
            }
        `;
        document.head.appendChild(pdfStyle);
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Aguardar renderização
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Configurações otimizadas do PDF
        const opt = {
            margin: [10, 10, 10, 10],
            filename: 'Guia-Curitiba-Carnaval-2026.pdf',
            image: { 
                type: 'jpeg', 
                quality: 0.98 
            },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: true,
                letterRendering: true,
                backgroundColor: '#ffffff',
                windowWidth: 1200,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { 
                mode: ['avoid-all', 'css', 'legacy']
            }
        };
        
        // Gerar PDF do body
        await html2pdf().set(opt).from(document.body).save();
        
        // Restaurar elementos
        elementsToHide.forEach((el, index) => {
            if (originalDisplay[index] !== undefined) {
                el.style.display = originalDisplay[index];
            }
        });
        
        if (nav) nav.style.display = navOriginalDisplay;
        
        // Restaurar opacidades e transformações
        allElements.forEach((el, index) => {
            if (originalOpacities[index] !== undefined) {
                el.style.opacity = originalOpacities[index];
            }
            if (originalTransforms[index] !== undefined) {
                el.style.transform = originalTransforms[index];
            }
        });
        
        // Remover estilos temporários
        if (pdfStyle.parentNode) {
            document.head.removeChild(pdfStyle);
        }
        
        // Restore button
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.style.opacity = '1';
        downloadPdfBtn.innerHTML = originalText;
        
        // Show success message
        showNotification('PDF gerado com sucesso! 📥', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        
        // Limpar em caso de erro
        const pdfStyle = document.getElementById('pdf-generation-styles');
        if (pdfStyle && pdfStyle.parentNode) {
            document.head.removeChild(pdfStyle);
        }
        
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.style.opacity = '1';
        downloadPdfBtn.innerHTML = '<span class="pdf-icon">📥</span><span class="pdf-text">PDF</span>';
        showNotification('Erro ao gerar PDF: ' + error.message, 'error');
    }
    });
}

// Notification function
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#2d8659' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// Improved mobile responsiveness
function handleResize() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
    
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-tablet', isTablet);
}

window.addEventListener('resize', handleResize);
handleResize();

// Touch optimizations for mobile
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Increase tap target sizes on mobile
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .nav-link, .tab-button, .cta-button {
                min-height: 44px;
                min-width: 44px;
            }
        }
    `;
    document.head.appendChild(style);
}

// Console message for developers
console.log('%c🗺️ Guia de Viagem: Curitiba 2026', 'font-size: 20px; font-weight: bold; color: #2d8659;');
console.log('%cDesenvolvido com ❤️ para uma experiência incrível!', 'font-size: 12px; color: #4a9d73;');

// ========== BOTÃO VOLTAR AO TOPO ==========
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== CHECKLIST INTERATIVO ==========
// Carregar checklist salvo do localStorage
function loadChecklist() {
    const saved = localStorage.getItem('checklist-mala');
    if (saved) {
        const items = JSON.parse(saved);
        document.querySelectorAll('.checklist-checkbox').forEach((checkbox, index) => {
            if (items[index]) {
                checkbox.checked = true;
            }
        });
    }
}

// Salvar checklist no localStorage
function saveChecklist() {
    const checkboxes = document.querySelectorAll('.checklist-checkbox');
    const items = Array.from(checkboxes).map(cb => cb.checked);
    localStorage.setItem('checklist-mala', JSON.stringify(items));
}

// Adicionar event listeners aos checkboxes
document.addEventListener('DOMContentLoaded', () => {
    loadChecklist();
    
    document.querySelectorAll('.checklist-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', saveChecklist);
    });
    
    // Botão reset
    const resetBtn = document.getElementById('resetChecklist');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('Deseja realmente limpar todo o checklist?')) {
                document.querySelectorAll('.checklist-checkbox').forEach(cb => {
                    cb.checked = false;
                });
                localStorage.removeItem('checklist-mala');
                showNotification('Checklist limpo! ✅', 'success');
            }
        });
    }
});

// ========== ÍNDICE RÁPIDO MOBILE ==========
const quickIndex = document.getElementById('quickIndex');
const quickIndexBtn = document.getElementById('quickIndexBtn');

if (quickIndexBtn && quickIndex) {
    quickIndexBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        quickIndex.classList.toggle('active');
    });
    
    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!quickIndex.contains(e.target)) {
            quickIndex.classList.remove('active');
        }
    });
    
    // Fechar ao clicar em um item
    const quickIndexItems = quickIndex.querySelectorAll('.quick-index-item');
    quickIndexItems.forEach(item => {
        item.addEventListener('click', () => {
            quickIndex.classList.remove('active');
            // Pequeno delay para permitir navegação
            setTimeout(() => {
                const hash = item.getAttribute('href');
                if (hash.startsWith('#')) {
                    const section = document.querySelector(hash);
                    if (section) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const sectionTop = section.offsetTop - headerHeight - 20;
                        window.scrollTo({
                            top: sectionTop,
                            behavior: 'smooth'
                        });
                    }
                }
            }, 100);
        });
    });
}

// ========== ACCORDIONS PARA MOBILE ==========
// Adicionar accordions nas seções longas para reduzir scroll no mobile
function initMobileAccordions() {
    const isMobile = window.innerWidth <= 768;
    const accordionSections = [
        'voos',
        'transporte-publico',
        'comidas-tipicas',
        'horarios',
        'cultura-local',
        'economia',
        'seguranca-detalhada',
        'links-uteis',
        'internet',
        'moeda-pagamentos'
    ];
    
    accordionSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Adicionar ou remover classe accordion baseado no tamanho da tela
        if (isMobile) {
            section.classList.add('section-accordion');
            section.classList.remove('accordion-open');
        } else {
            section.classList.remove('section-accordion');
            section.classList.add('accordion-open'); // Sempre aberto no desktop
        }
        
        const title = section.querySelector('.section-title');
        if (!title) return;
        
        // Remover listeners antigos
        const newTitle = title.cloneNode(true);
        title.parentNode.replaceChild(newTitle, title);
        
        // Adicionar evento de clique no título apenas no mobile
        if (isMobile) {
            newTitle.addEventListener('click', () => {
                section.classList.toggle('accordion-open');
                
                // Scroll suave para a seção quando abrir
                if (section.classList.contains('accordion-open')) {
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const sectionTop = section.offsetTop - headerHeight - 20;
                        window.scrollTo({
                            top: sectionTop,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            });
        }
    });
}

// Inicializar accordions ao carregar e ao redimensionar
document.addEventListener('DOMContentLoaded', initMobileAccordions);
let accordionResizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(accordionResizeTimeout);
    accordionResizeTimeout = setTimeout(initMobileAccordions, 250);
});

// ========== CONTADOR REGRESSIVO ==========
function updateCountdown() {
    // Data de chegada: 13 de fevereiro de 2026, 08:50
    const targetDate = new Date('2026-02-13T08:50:00').getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
        // Se já passou, mostra contador para o voo de volta
        const returnDate = new Date('2026-02-18T05:00:00').getTime();
        const returnDistance = returnDate - now;
        
        if (returnDistance < 0) {
            document.getElementById('countdown-message').textContent = 'A viagem já terminou! Esperamos que tenha sido incrível! 🎉';
            document.querySelectorAll('.countdown-number').forEach(el => el.textContent = '0');
            return;
        }
        
        const days = Math.floor(returnDistance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((returnDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((returnDistance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((returnDistance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
        document.getElementById('countdown-message').textContent = 'Faltam para o voo de volta! ✈️';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// Atualizar contador a cada segundo
setInterval(updateCountdown, 1000);
updateCountdown(); // Chamar imediatamente
