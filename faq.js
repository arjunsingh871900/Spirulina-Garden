// FAQ Functionality
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = element.querySelector('.faq-icon');
    
    // Check if this FAQ is currently active
    const isActive = faqItem.classList.contains('active');
    
    // Close all other FAQs
    const allFAQs = document.querySelectorAll('.faq-item');
    allFAQs.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-icon');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current FAQ
    if (isActive) {
        // Close if already active
        faqItem.classList.remove('active');
        answer.style.maxHeight = null;
        icon.style.transform = 'rotate(0deg)';
    } else {
        // Open if not active
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
        
        // Scroll to FAQ item on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                faqItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 300);
        }
    }
    
    // Track FAQ interaction
    trackFAQInteraction(faqItem.querySelector('h3').textContent, !isActive);
}

// FAQ Category Filter
function showFAQCategory(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    const tabs = document.querySelectorAll('.faq-tab');
    
    // Update active tab
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide FAQ items with animation
    faqItems.forEach((item, index) => {
        const shouldShow = category === 'all' || item.dataset.category === category;
        
        if (shouldShow) {
            item.style.display = 'block';
            // Stagger animation
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
        
        // Close all FAQs when switching categories
        item.classList.remove('active');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        if (answer) answer.style.maxHeight = null;
        if (icon) icon.style.transform = 'rotate(0deg)';
    });
    
    // Track category selection
    trackFAQInteraction('category_filter', category);
    
    // Scroll to FAQ content
    const faqContent = document.querySelector('.faq-content');
    if (faqContent && window.innerWidth < 768) {
        faqContent.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// FAQ Search Functionality
let searchTimeout;
function searchFAQ() {
    const searchTerm = document.getElementById('faqSearch').value.toLowerCase().trim();
    const faqItems = document.querySelectorAll('.faq-item');
    const noResultsMessage = document.querySelector('.no-results-message');
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Debounce search
    searchTimeout = setTimeout(() => {
        let visibleCount = 0;
        
        faqItems.forEach((item, index) => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            const matches = !searchTerm || question.includes(searchTerm) || answer.includes(searchTerm);
            
            if (matches) {
                item.style.display = 'block';
                visibleCount++;
                
                // Highlight search terms
                if (searchTerm) {
                    highlightSearchTerm(item, searchTerm);
                } else {
                    removeHighlight(item);
                }
                
                // Stagger animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 30);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 200);
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0 && searchTerm) {
            showNoResultsMessage(searchTerm);
        } else {
            hideNoResultsMessage();
        }
        
        // Reset category filter when searching
        if (searchTerm) {
            const tabs = document.querySelectorAll('.faq-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            tabs[0].classList.add('active'); // Activate "All Questions" tab
        }
        
        // Track search
        if (searchTerm) {
            trackFAQInteraction('search', searchTerm);
        }
        
    }, 300);
}

function highlightSearchTerm(item, searchTerm) {
    const question = item.querySelector('.faq-question h3');
    const answer = item.querySelector('.faq-answer p');
    
    [question, answer].forEach(element => {
        if (element) {
            const text = element.textContent;
            const regex = new RegExp(`(${searchTerm})`, 'gi');
            const highlightedText = text.replace(regex, '<mark>$1</mark>');
            element.innerHTML = highlightedText;
        }
    });
}

function removeHighlight(item) {
    const question = item.querySelector('.faq-question h3');
    const answer = item.querySelector('.faq-answer p');
    
    [question, answer].forEach(element => {
        if (element) {
            element.innerHTML = element.textContent;
        }
    });
}

function showNoResultsMessage(searchTerm) {
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (!noResultsMessage) {
        noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.style.cssText = `
            text-align: center;
            padding: 3rem 2rem;
            color: #6b7280;
            background: white;
            border-radius: 1rem;
            margin: 2rem auto;
            max-width: 600px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        `;
        
        const faqGrid = document.querySelector('.faq-grid');
        faqGrid.appendChild(noResultsMessage);
    }
    
    noResultsMessage.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
        <h3 style="margin-bottom: 1rem; color: #374151;">No results found for "${searchTerm}"</h3>
        <p style="margin-bottom: 2rem;">Try different keywords or browse our categories above.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="document.getElementById('faqSearch').value=''; searchFAQ();" 
                    style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">
                Clear Search
            </button>
            <a href="contact.html" style="background: #059669; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none;">
                Contact Us
            </a>
        </div>
    `;
    
    noResultsMessage.style.display = 'block';
}

function hideNoResultsMessage() {
    const noResultsMessage = document.querySelector('.no-results-message');
    if (noResultsMessage) {
        noResultsMessage.style.display = 'none';
    }
}

// Initialize FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up search functionality
    const searchInput = document.getElementById('faqSearch');
    if (searchInput) {
        searchInput.addEventListener('input', searchFAQ);
        
        // Clear search on escape
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                searchFAQ();
                this.blur();
            }
        });
        
        // Search on enter
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchFAQ();
            }
        });
    }
    
    // Add smooth scrolling for FAQ links
    const faqLinks = document.querySelectorAll('a[href^="#"]');
    faqLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Open the FAQ if it's a FAQ item
                if (targetElement.classList.contains('faq-item')) {
                    const question = targetElement.querySelector('.faq-question');
                    if (question && !targetElement.classList.contains('active')) {
                        setTimeout(() => {
                            toggleFAQ(question);
                        }, 500);
                    }
                }
            }
        });
    });
    
    // Initialize FAQ animations
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Keyboard navigation for FAQ items
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((question, index) => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextQuestion = faqQuestions[index + 1];
                if (nextQuestion) nextQuestion.focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevQuestion = faqQuestions[index - 1];
                if (prevQuestion) prevQuestion.focus();
            }
        });
        
        // Update aria-expanded when FAQ is toggled
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = question.parentElement.classList.contains('active');
                    question.setAttribute('aria-expanded', isActive.toString());
                }
            });
        });
        
        observer.observe(question.parentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
    
    // Auto-expand FAQ from URL hash
    if (window.location.hash) {
        const targetFAQ = document.querySelector(window.location.hash);
        if (targetFAQ && targetFAQ.classList.contains('faq-item')) {
            setTimeout(() => {
                const question = targetFAQ.querySelector('.faq-question');
                if (question) {
                    toggleFAQ(question);
                    targetFAQ.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
            }, 500);
        }
    }
});

// Analytics tracking for FAQ interactions
function trackFAQInteraction(action, label = null) {
    // This would integrate with your analytics service
    console.log('FAQ interaction:', action, label);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'FAQ',
            event_label: label
        });
    }
}

// FAQ sharing functionality
function shareFAQ(faqElement) {
    const question = faqElement.querySelector('h3').textContent;
    const url = window.location.origin + window.location.pathname + '#' + faqElement.id;
    
    if (navigator.share) {
        navigator.share({
            title: question,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            showNotification('FAQ link copied to clipboard!', 'success');
        });
    }
    
    trackFAQInteraction('share', question);
}

// Add share buttons to FAQ items (optional)
function addShareButtons() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        if (!item.id) {
            item.id = `faq-${index + 1}`;
        }
        
        const shareBtn = document.createElement('button');
        shareBtn.innerHTML = '🔗';
        shareBtn.className = 'faq-share-btn';
        shareBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 3rem;
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s ease;
            padding: 0.5rem;
            border-radius: 0.25rem;
        `;
        shareBtn.title = 'Share this FAQ';
        
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareFAQ(item);
        });
        
        const question = item.querySelector('.faq-question');
        question.style.position = 'relative';
        question.appendChild(shareBtn);
        
        // Show share button on hover
        item.addEventListener('mouseenter', () => {
            shareBtn.style.opacity = '0.7';
        });
        
        item.addEventListener('mouseleave', () => {
            shareBtn.style.opacity = '0';
        });
        
        shareBtn.addEventListener('mouseenter', () => {
            shareBtn.style.opacity = '1';
        });
    });
}

// Initialize share buttons (uncomment if needed)
// document.addEventListener('DOMContentLoaded', addShareButtons);

// FAQ feedback system
function addFeedbackButtons() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const answer = item.querySelector('.faq-answer');
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'faq-feedback';
        feedbackDiv.style.cssText = `
            padding: 1rem 1.5rem;
            border-top: 1px solid #e5e7eb;
            background: #f9fafb;
            text-align: center;
        `;
        
        feedbackDiv.innerHTML = `
            <p style="margin: 0 0 1rem 0; font-size: 0.9rem; color: #6b7280;">Was this helpful?</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="feedback-btn" data-feedback="yes" style="background: #10b981; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem;">
                    👍 Yes
                </button>
                <button class="feedback-btn" data-feedback="no" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 0.25rem; cursor: pointer; font-size: 0.875rem;">
                    👎 No
                </button>
            </div>
        `;
        
        answer.appendChild(feedbackDiv);
        
        // Handle feedback
        feedbackDiv.addEventListener('click', function(e) {
            if (e.target.classList.contains('feedback-btn')) {
                const feedback = e.target.dataset.feedback;
                const question = item.querySelector('h3').textContent;
                
                trackFAQInteraction('feedback', `${question}: ${feedback}`);
                
                // Show thank you message
                feedbackDiv.innerHTML = `
                    <p style="margin: 0; color: #059669; font-weight: 600;">
                        Thank you for your feedback! 
                        ${feedback === 'no' ? '<a href="contact.html" style="color: #2563eb;">Contact us</a> if you need more help.' : ''}
                    </p>
                `;
            }
        });
    });
}

// Initialize feedback system (uncomment if needed)
// document.addEventListener('DOMContentLoaded', addFeedbackButtons);

// Notification system for FAQ page
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
        max-width: 300px;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}