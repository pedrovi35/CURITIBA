// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Scroll progress bar
window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    document.body.style.setProperty('--scroll-progress', scrolled + '%');
    
    // Update progress bar
    const progressBar = document.querySelector('body::before');
    if (progressBar) {
        document.body.style.setProperty('--scroll-width', scrolled + '%');
    }
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

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add visible class for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                entry.target.classList.add('visible');
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.checklist-item, .arrival-card, .cost-card, .timeline-item, .tip-card, .family-tip-card, .family-transport-card, .emergency-card, .hotel-info-card, .flight-card, .first-flight-tip, .layover-card'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Initialize timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
    });
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

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-badges, .cta-button');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.animation = `fadeInUp 0.8s ease ${index * 0.2}s both`;
        }, 200);
    });
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
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// PDF Download Function
const downloadPdfBtn = document.getElementById('downloadPdf');

downloadPdfBtn.addEventListener('click', async () => {
    try {
        // Show loading state
        downloadPdfBtn.disabled = true;
        downloadPdfBtn.style.opacity = '0.6';
        const originalText = downloadPdfBtn.innerHTML;
        downloadPdfBtn.innerHTML = '<span class="pdf-icon">⏳</span><span class="pdf-text">Gerando...</span>';
        
        // Hide elements that shouldn't be in PDF
        const elementsToHide = document.querySelectorAll('.header-actions, .menu-toggle, .cta-button, .tab-button');
        const originalDisplay = [];
        elementsToHide.forEach((el, index) => {
            originalDisplay[index] = el.style.display;
            el.style.display = 'none';
        });
        
        // Get the main content
        const element = document.body;
        const opt = {
            margin: [10, 10, 10, 10],
            filename: 'Guia-Curitiba-Carnaval-2026.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate PDF
        await html2pdf().set(opt).from(element).save();
        
        // Restore elements
        elementsToHide.forEach((el, index) => {
            el.style.display = originalDisplay[index];
        });
        
        // Restore button
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.style.opacity = '1';
        downloadPdfBtn.innerHTML = originalText;
        
        // Show success message
        showNotification('PDF gerado com sucesso! 📥', 'success');
        
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        downloadPdfBtn.disabled = false;
        downloadPdfBtn.style.opacity = '1';
        downloadPdfBtn.innerHTML = '<span class="pdf-icon">📥</span><span class="pdf-text">PDF</span>';
        showNotification('Erro ao gerar PDF. Tente novamente.', 'error');
    }
});

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
