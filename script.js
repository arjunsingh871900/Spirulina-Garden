// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (mobileNav && menuBtn) {
        mobileNav.classList.toggle('active');
        menuBtn.classList.toggle('active');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('.header');
    
    if (mobileNav && menuBtn && header) {
        if (!header.contains(event.target) && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    }
});

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                const mobileNav = document.getElementById('mobileNav');
                const menuBtn = document.querySelector('.mobile-menu-btn');
                if (mobileNav && menuBtn) {
                    mobileNav.classList.remove('active');
                    menuBtn.classList.remove('active');
                }
            }
        });
    });
});

// Header Scroll Effect
let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (header) {
        if (scrollTop > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollTop = scrollTop;
    }
});

// Animation on Scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .product-card, .study-card, .nutrition-card, .category-card, .article-card, .highlight-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.feature-card, .product-card, .study-card, .nutrition-card, .category-card, .article-card, .highlight-card');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Initial check
    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', throttle(animateOnScroll, 100));

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Form Validation (for contact forms)
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const value = field.value.trim();
        
        if (!value) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
            
            // Specific validations
            if (field.type === 'email' && !validateEmail(value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else if (field.type === 'tel' && !validatePhone(value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Email validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Real-time form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required')) {
                    const value = this.value.trim();
                    
                    if (!value) {
                        showFieldError(this, 'This field is required');
                    } else {
                        clearFieldError(this);
                        
                        // Specific validations
                        if (this.type === 'email' && !validateEmail(value)) {
                            showFieldError(this, 'Please enter a valid email address');
                        } else if (this.type === 'tel' && !validatePhone(value)) {
                            showFieldError(this, 'Please enter a valid phone number');
                        }
                    }
                }
            });
            
            input.addEventListener('focus', function() {
                this.classList.remove('error');
                this.style.borderColor = '#2563eb';
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearFieldError(this);
                }
            });
        });
    });
});

// Lazy Loading for Images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
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
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
});

// Back to Top Button
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(button);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    button.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Keyboard Navigation Support
document.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileNav = document.getElementById('mobileNav');
        const menuBtn = document.querySelector('.mobile-menu-btn');
        
        if (mobileNav && menuBtn && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    }
});

// Touch Support for Mobile
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(e) {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - could hide mobile menu
            const mobileNav = document.getElementById('mobileNav');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (mobileNav && menuBtn && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        }
    }
}

// Performance Monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
            }, 0);
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error to analytics service
});

// Unhandled Promise Rejection
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled Promise Rejection:', e.reason);
    // Could send error to analytics service
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Preload Critical Resources
function preloadCriticalResources() {
    const criticalImages = [
        'images/spirulina powder in bulk.jpg',
        'images/spirulina tablets.jpg',
        'images/spirulina capsules (1).jpg'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
document.addEventListener('DOMContentLoaded', preloadCriticalResources);

// Accessibility Improvements
function improveAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #2563eb;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark
    const main = document.querySelector('main');
    if (main) {
        main.id = 'main';
    }
    
    // Improve button accessibility
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
        if (!button.textContent.trim()) {
            button.setAttribute('aria-label', 'Button');
        }
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Floating WhatsApp Button - Added for all pages
function addFloatingWhatsAppButton() {
    // Don't add if already exists
    if (document.querySelector('.floating-whatsapp')) return;
    
    const whatsappBtn = document.createElement('a');
    whatsappBtn.href = 'https://wa.me/918470905599?text=Hi! I\'m interested in importing bulk spirulina from India. Please share export details and pricing.';
    whatsappBtn.target = '_blank';
    whatsappBtn.rel = 'noopener noreferrer';
    whatsappBtn.className = 'floating-whatsapp';
    whatsappBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    whatsappBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    `;
    
    document.body.appendChild(whatsappBtn);
}

// Initialize floating WhatsApp button
document.addEventListener('DOMContentLoaded', addFloatingWhatsAppButton);

// Exit Intent Detection - Only on actual exit attempts (mouse leaving window top)
let exitIntentShown = false;
let mouseLeaveTimer;
let hasEngaged = false; // Track if user has engaged with the site

// Track user engagement
document.addEventListener('click', function() {
    hasEngaged = true;
});

document.addEventListener('scroll', function() {
    if (window.scrollY > 500) {
        hasEngaged = true;
    }
});

function showExitIntentPopup() {
    if (exitIntentShown) return;
    
    exitIntentShown = true;
    
    const popup = document.createElement('div');
    popup.className = 'exit-intent-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <button class="popup-close" onclick="closeExitPopup()">&times;</button>
                <h2>🛑 Wait! Don't Miss Out!</h2>
                <p>You're about to leave India's #1 spirulina manufacturer</p>
            </div>
            <div class="popup-body">
                <div class="retention-message">
                    <h3>Give Us Just 30 Seconds to Show You Why 1000+ Businesses Choose Us</h3>
                    <p>We understand you're comparing suppliers. Here's what makes us different from the rest:</p>
                </div>
                
                <div class="offer-highlights">
                    <h4>🎯 Exclusive Benefits You Won't Find Elsewhere:</h4>
                    <ul>
                        <li>Direct manufacturer pricing - Save 40-60% vs distributors</li>
                        <li>NABL lab-tested quality with certificates provided</li>
                        <li>Bulk discounts starting from just 1kg orders</li>
                        <li>Free samples for quality verification</li>
                        <li>Pan-India delivery in 1-7 days guaranteed</li>
                        <li>Private labeling with your brand name</li>
                        <li>24/7 WhatsApp support for urgent requirements</li>
                        <li>5+ years trusted by health stores across India</li>
                    </ul>
                </div>
                
                <div class="popup-newsletter">
                    <h4>📧 Get Instant Price Updates (Free)</h4>
                    <form class="popup-newsletter-form" onsubmit="handlePopupNewsletter(event)">
                        <input type="email" placeholder="Your business email" required>
                        <button type="submit">Get Prices</button>
                    </form>
                </div>
                
                <div class="popup-actions">
                    <div class="popup-contact-buttons">
                        <a href="https://wa.me/918470905599?text=Hi! I was about to leave your website but saw your offer. Can you send me bulk spirulina prices?" target="_blank" rel="noopener noreferrer" class="popup-btn popup-btn-whatsapp">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                            </svg>
                            WhatsApp - Get Instant Quote
                        </a>
                        <a href="tel:+918470905599" class="popup-btn popup-btn-call">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Call Now - Direct Line
                        </a>
                    </div>
                    <button class="popup-btn popup-btn-secondary" onclick="closeExitPopup()">
                        Maybe Later - Continue Browsing
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Show popup with animation
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Track exit intent
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exit_intent_popup_shown', {
            event_category: 'User Behavior',
            event_label: 'Exit Intent Detected'
        });
    }
}

function closeExitPopup() {
    const popup = document.querySelector('.exit-intent-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

function handlePopupNewsletter(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const button = event.target.querySelector('button');
    
    button.textContent = '✅ Subscribed!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        closeExitPopup();
        showNotification('Thank you! You\'ll receive price updates soon.', 'success');
    }, 1500);
    
    // Track newsletter signup
    if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
            event_category: 'Lead Generation',
            event_label: 'Exit Intent Popup'
        });
    }
}

// Exit intent detection - Only trigger for users who have engaged
document.addEventListener('mouseleave', function(e) {
    // Only show if mouse leaves through top of viewport, user has engaged, and popup not shown yet
    if (e.clientY <= 0 && !exitIntentShown && hasEngaged) {
        clearTimeout(mouseLeaveTimer);
        mouseLeaveTimer = setTimeout(() => {
            showExitIntentPopup();
        }, 500);
    }
});

document.addEventListener('mouseenter', function() {
    clearTimeout(mouseLeaveTimer);
});

// REMOVED: beforeunload event that was causing "leave site" popup
// This was causing users to see confirmation dialog when navigating between pages

// Newsletter popup (appears after 30 seconds)
function showNewsletterPopup() {
    // Don't show if exit intent was already shown
    if (exitIntentShown) return;
    
    const popup = document.createElement('div');
    popup.className = 'newsletter-popup';
    popup.innerHTML = `
        <button class="newsletter-popup-close" onclick="closeNewsletterPopup()">&times;</button>
        <h4>📈 Get Bulk Spirulina Prices</h4>
        <p>Join 2,500+ businesses getting weekly price updates</p>
        <form class="newsletter-popup-form" onsubmit="handleNewsletterPopup(event)">
            <input type="email" placeholder="Business email" required>
            <button type="submit">Subscribe</button>
        </form>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);
    
    // Auto-hide after 15 seconds
    setTimeout(() => {
        closeNewsletterPopup();
    }, 15000);
}

function closeNewsletterPopup() {
    const popup = document.querySelector('.newsletter-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

function handleNewsletterPopup(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const button = event.target.querySelector('button');
    
    button.textContent = '✅ Done!';
    button.style.background = '#10b981';
    
    setTimeout(() => {
        closeNewsletterPopup();
        showNotification('Subscribed! Check your email for price updates.', 'success');
    }, 1500);
}

// Show newsletter popup after 45 seconds (increased from 30 for less annoyance)
setTimeout(showNewsletterPopup, 45000);

// Lead capture popup (shows when user submits any form)
function showThankYouPopup() {
    const popup = document.createElement('div');
    popup.className = 'exit-intent-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-header">
                <button class="popup-close" onclick="closeThankYouPopup()">&times;</button>
                <h2>🎉 Thank You!</h2>
                <p>Your inquiry has been received successfully</p>
            </div>
            <div class="popup-body">
                <div class="retention-message">
                    <h3>Get Instant Response - Contact Us Right Now!</h3>
                    <p>Don't wait for email! Get your bulk spirulina quote immediately:</p>
                </div>
                
                <div class="popup-actions">
                    <div class="popup-contact-buttons">
                        <a href="https://wa.me/918470905599?text=Hi! I just submitted an inquiry on your website. I need bulk spirulina quotes urgently." target="_blank" rel="noopener noreferrer" class="popup-btn popup-btn-whatsapp">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                            </svg>
                            WhatsApp Now - Instant Reply
                        </a>
                        <a href="https://t.me/+918470905599" target="_blank" rel="noopener noreferrer" class="popup-btn popup-btn-call">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                            </svg>
                            Telegram Chat
                        </a>
                        <a href="tel:+918470905599" class="popup-btn popup-btn-call">
                            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                            </svg>
                            Call Direct Line
                        </a>
                    </div>
                    <button class="popup-btn popup-btn-secondary" onclick="closeThankYouPopup()">
                        Continue Browsing
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    setTimeout(() => {
        popup.classList.add('show');
    }, 100);
    
    document.body.style.overflow = 'hidden';
}

function closeThankYouPopup() {
    const popup = document.querySelector('.exit-intent-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 400px;
        font-size: 0.9rem;
        line-height: 1.4;
        animation: slideIn 0.3s ease;
        cursor: pointer;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}