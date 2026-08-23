// Contact Form Handling - Sends directly to WhatsApp
function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Sending to WhatsApp...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Validate form
    if (!validateForm(form)) {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Create WhatsApp message
    const whatsappMessage = createWhatsAppMessage(formData);
    const whatsappNumber = '918470905599';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    form.reset();
    
    // Show success message
    showNotification('Opening WhatsApp with your inquiry! Please send the message to complete your submission.', 'success');
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    
    // Clear any field errors
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        clearFieldError(field);
    });
    
    // Clear localStorage saved form data
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        localStorage.removeItem(`contact_form_${input.name}`);
    });
}

// Create WhatsApp message from form data
function createWhatsAppMessage(formData) {
    const name = formData.get('name') || 'Not provided';
    const email = formData.get('email') || 'Not provided';
    const company = formData.get('company') || 'Not specified';
    const phone = formData.get('phone') || 'Not provided';
    const country = formData.get('country') || 'Not specified';
    const productInterest = formData.get('productInterest') || 'Not specified';
    const quantity = formData.get('quantity') || 'Not specified';
    const shipping = formData.get('shipping') || 'Not specified';
    const message = formData.get('message') || 'No additional message';
    
    return `*SPIRULINA GARDEN - BULK INQUIRY*
━━━━━━━━━━━━━━━━━━━━

*CONTACT INFORMATION:*
👤 Name: ${name}
📧 Email: ${email}
🏢 Company: ${company}
📱 Phone: ${phone}
📍 Location: ${country}

*PRODUCT REQUIREMENTS:*
🛒 Product Interest: ${productInterest}
📦 Quantity Required: ${quantity}
🚚 Shipping Preference: ${shipping}

*MESSAGE:*
${message}

━━━━━━━━━━━━━━━━━━━━
📅 Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
🌐 Via: spirulinagarden.com`;
}

// WhatsApp message format is created in createWhatsAppMessage function above

// Enhanced form validation
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
            } else if (field.name === 'name' && value.length < 2) {
                showFieldError(field, 'Name must be at least 2 characters long');
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
    
    // Focus on first error field
    if (document.querySelectorAll('.error').length === 1) {
        field.focus();
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Enhanced email validation
function validateEmail(email) {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email);
}

// Enhanced phone validation
function validatePhone(phone) {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // Check if it's a valid international format
    const re = /^[\+]?[1-9][\d]{7,14}$/;
    return re.test(cleaned);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 400px;
        font-size: 0.9rem;
        line-height: 1.4;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Add click to dismiss
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    
    .notification:hover {
        transform: scale(1.02);
    }
`;
document.head.appendChild(style);

// Real-time validation and UX improvements
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation on blur
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
                    } else if (this.name === 'name' && value.length < 2) {
                        showFieldError(this, 'Name must be at least 2 characters long');
                    } else {
                        // Show success state
                        this.classList.add('success');
                        setTimeout(() => this.classList.remove('success'), 2000);
                    }
                }
            }
        });
        
        // Focus styling
        input.addEventListener('focus', function() {
            this.style.borderColor = '#2563eb';
            this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        });
        
        // Clear error on input
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
            this.style.borderColor = '#d1d5db';
            this.style.boxShadow = 'none';
        });
        
        // Auto-format phone numbers
        if (input.type === 'tel') {
            input.addEventListener('input', function() {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 0) {
                    if (value.startsWith('91') && value.length > 2) {
                        value = '+91 ' + value.substring(2);
                    } else if (!value.startsWith('+')) {
                        value = '+' + value;
                    }
                }
                this.value = value;
            });
        }
        
        // Auto-capitalize names
        if (input.name === 'name' || input.name === 'company') {
            input.addEventListener('input', function() {
                this.value = this.value.replace(/\b\w/g, l => l.toUpperCase());
            });
        }
    });
    
    // Form submission
    form.addEventListener('submit', handleFormSubmit);
    
    // Prevent double submission
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        setTimeout(() => {
            submitBtn.disabled = false;
        }, 3000);
    });
});

// Auto-save form data to localStorage
function autoSaveForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Load saved data
    inputs.forEach(input => {
        const savedValue = localStorage.getItem(`contact_form_${input.name}`);
        if (savedValue && !input.value) {
            input.value = savedValue;
        }
    });
    
    // Save data on input
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            localStorage.setItem(`contact_form_${this.name}`, this.value);
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        setTimeout(() => {
            inputs.forEach(input => {
                localStorage.removeItem(`contact_form_${input.name}`);
            });
        }, 2000);
    });
}

// Initialize auto-save
document.addEventListener('DOMContentLoaded', autoSaveForm);

// Analytics tracking (placeholder)
function trackFormInteraction(action, field = null) {
    // This would integrate with your analytics service
    console.log('Form interaction:', action, field);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'Contact Form',
            event_label: field
        });
    }
}

// Track form interactions
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    // Track form start
    const inputs = form.querySelectorAll('input, select, textarea');
    let formStarted = false;
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (!formStarted) {
                trackFormInteraction('form_start');
                formStarted = true;
            }
            trackFormInteraction('field_focus', this.name);
        });
    });
    
    // Track form submission
    form.addEventListener('submit', function() {
        trackFormInteraction('form_submit');
    });
});