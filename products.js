// Product Tab Functionality
function showProduct(productType) {
    // Hide all product contents with animation
    const contents = document.querySelectorAll('.product-content');
    contents.forEach(content => {
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        setTimeout(() => {
            content.classList.remove('active');
        }, 200);
    });
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Add active class to clicked tab
    event.target.classList.add('active');
    
    // Show selected product content with animation
    setTimeout(() => {
        const selectedContent = document.getElementById(productType);
        selectedContent.classList.add('active');
        
        // Animate in
        setTimeout(() => {
            selectedContent.style.opacity = '1';
            selectedContent.style.transform = 'translateY(0)';
        }, 50);
        
        // Scroll to product content on mobile
        if (window.innerWidth < 768) {
            selectedContent.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 200);
    
    // Track product tab interaction
    trackProductInteraction('tab_switch', productType);
}

// Enhanced product image gallery
function initializeProductGallery() {
    const productImages = document.querySelectorAll('.product-image-large img');
    
    productImages.forEach(img => {
        // Add click to zoom functionality
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
        
        // Add loading state
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Add error handling
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzEyNy45IDEwMCAxMTAgMTE3LjkgMTEwIDE0MFMxMjcuOSAxODAgMTUwIDE4MFMxOTAgMTYyLjEgMTkwIDE0MFMxNzIuMSAxMDAgMTUwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEzNSAxMjVIMTY1VjE1NUgxMzVWMTI1WiIgZmlsbD0iI0Y5RkFGQiIvPgo8L3N2Zz4K';
            this.alt = 'Product image not available';
        });
    });
}

// Image modal for product zoom
function openImageModal(src, alt) {
    // Remove existing modal
    const existingModal = document.querySelector('.image-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: zoom-out;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 0.5rem;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s ease;
    `;
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        img.style.transform = 'scale(1)';
    }, 10);
    
    // Close modal
    function closeModal() {
        modal.style.opacity = '0';
        img.style.transform = 'scale(0.8)';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    modal.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Keyboard support
    document.addEventListener('keydown', function escapeHandler(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    });
    
    trackProductInteraction('image_zoom', alt);
}

// Product comparison functionality
function initializeProductComparison() {
    const compareButtons = document.querySelectorAll('.compare-btn');
    let comparisonItems = JSON.parse(localStorage.getItem('productComparison') || '[]');
    
    compareButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const productName = this.dataset.productName;
            
            if (comparisonItems.includes(productId)) {
                // Remove from comparison
                comparisonItems = comparisonItems.filter(id => id !== productId);
                this.textContent = 'Add to Compare';
                this.classList.remove('active');
            } else {
                // Add to comparison (max 3 items)
                if (comparisonItems.length < 3) {
                    comparisonItems.push(productId);
                    this.textContent = 'Remove from Compare';
                    this.classList.add('active');
                } else {
                    showNotification('You can compare up to 3 products at a time', 'warning');
                    return;
                }
            }
            
            localStorage.setItem('productComparison', JSON.stringify(comparisonItems));
            updateComparisonCounter();
            trackProductInteraction('comparison_toggle', productName);
        });
    });
    
    updateComparisonCounter();
}

function updateComparisonCounter() {
    const comparisonItems = JSON.parse(localStorage.getItem('productComparison') || '[]');
    let counter = document.querySelector('.comparison-counter');
    
    if (comparisonItems.length > 0) {
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'comparison-counter';
            counter.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #2563eb;
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                cursor: pointer;
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(counter);
            
            counter.addEventListener('click', showComparisonModal);
        }
        
        counter.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 0.5rem;">Compare Products</div>
            <div style="font-size: 0.875rem;">${comparisonItems.length} item${comparisonItems.length > 1 ? 's' : ''} selected</div>
        `;
        
        counter.style.transform = 'translateY(0)';
    } else if (counter) {
        counter.style.transform = 'translateY(100px)';
        setTimeout(() => counter.remove(), 300);
    }
}

// Product quick view functionality
function initializeQuickView() {
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    quickViewButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            openQuickViewModal(productId);
        });
    });
}

function openQuickViewModal(productId) {
    // This would fetch product data in a real application
    const productData = getProductData(productId);
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 2rem;
        box-sizing: border-box;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 1rem;
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        transform: scale(0.8);
        transition: transform 0.3s ease;
    `;
    
    content.innerHTML = `
        <div style="padding: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="margin: 0; color: #374151;">${productData.name}</h2>
                <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280;">×</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <img src="${productData.image}" alt="${productData.name}" style="width: 100%; border-radius: 0.5rem;">
                <div>
                    <div style="font-size: 2rem; font-weight: 700; color: #2563eb; margin-bottom: 1rem;">${productData.price}</div>
                    <p style="color: #6b7280; margin-bottom: 1.5rem;">${productData.description}</p>
                    <div style="display: flex; gap: 1rem;">
                        <a href="contact.html" style="background: #2563eb; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none;">Get Quote</a>
                        <button onclick="addToWishlist('${productId}')" style="border: 2px solid #2563eb; color: #2563eb; background: transparent; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;">Add to Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    
    // Close functionality
    function closeModal() {
        modal.style.opacity = '0';
        content.style.transform = 'scale(0.8)';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });
    
    content.querySelector('.close-modal').addEventListener('click', closeModal);
    
    document.body.style.overflow = 'hidden';
    
    trackProductInteraction('quick_view', productData.name);
}

// Mock product data (in real app, this would come from API)
function getProductData(productId) {
    const products = {
        'powder': {
            name: 'Premium Spirulina Powder',
            price: '₹350-600 per kg',
            image: 'images/spirulina powder in bulk.jpg',
            description: 'Finest grade spirulina powder with 65% protein content and maximum nutritional density.'
        },
        'tablets': {
            name: 'Spirulina Tablets (60 pieces)',
            price: '₹95-150 per bottle',
            image: 'images/spirulina tablets.jpg',
            description: 'Convenient tablet form with 500mg per tablet, perfect for retail distribution.'
        },
        'capsules': {
            name: 'Spirulina Capsules (60 pieces)',
            price: '₹95-150 per bottle',
            image: 'images/spirulina capsules (1).jpg',
            description: 'Vegetarian capsules with 400mg spirulina powder, ideal for health-conscious consumers.'
        }
    };
    
    return products[productId] || products['powder'];
}

// Wishlist functionality
function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Added to wishlist!', 'success');
        updateWishlistCounter();
    } else {
        showNotification('Already in wishlist', 'info');
    }
    
    trackProductInteraction('wishlist_add', productId);
}

function updateWishlistCounter() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let counter = document.querySelector('.wishlist-counter');
    
    if (wishlist.length > 0) {
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'wishlist-counter';
            counter.style.cssText = `
                position: fixed;
                top: 50%;
                right: 20px;
                background: #ef4444;
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                z-index: 1000;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            `;
            document.body.appendChild(counter);
        }
        
        counter.textContent = wishlist.length;
        counter.title = `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} in wishlist`;
    } else if (counter) {
        counter.remove();
    }
}

// Initialize product tabs
document.addEventListener('DOMContentLoaded', function() {
    // Set default active tab and content
    const defaultTab = document.querySelector('.tab-btn');
    const defaultContent = document.querySelector('.product-content');
    
    if (defaultTab && defaultContent) {
        defaultTab.classList.add('active');
        defaultContent.classList.add('active');
        defaultContent.style.opacity = '1';
        defaultContent.style.transform = 'translateY(0)';
        defaultContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    }
    
    // Initialize all product content with transitions
    const allContent = document.querySelectorAll('.product-content');
    allContent.forEach(content => {
        content.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Initialize other features
    initializeProductGallery();
    initializeProductComparison();
    initializeQuickView();
    updateWishlistCounter();
    
    // Add keyboard navigation for tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, index) => {
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                const nextIndex = (index + direction + tabs.length) % tabs.length;
                tabs[nextIndex].focus();
                tabs[nextIndex].click();
            }
        });
    });
});

// Analytics tracking for product interactions
function trackProductInteraction(action, label = null) {
    console.log('Product interaction:', action, label);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: 'Product',
            event_label: label
        });
    }
}

// Product filtering and sorting (for future enhancement)
function initializeProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortSelect = document.querySelector('.sort-select');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterProducts(filter);
            
            // Update active filter button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

function filterProducts(filter) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const category = product.dataset.category;
        
        if (filter === 'all' || category === filter) {
            product.style.display = 'block';
            setTimeout(() => {
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, 100);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => {
                product.style.display = 'none';
            }, 300);
        }
    });
    
    trackProductInteraction('filter', filter);
}

function sortProducts(sortBy) {
    const container = document.querySelector('.products-grid');
    const products = Array.from(container.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'price-high':
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            case 'name':
                return a.dataset.name.localeCompare(b.dataset.name);
            default:
                return 0;
        }
    });
    
    // Re-append sorted products
    products.forEach(product => {
        container.appendChild(product);
    });
    
    trackProductInteraction('sort', sortBy);
}

// Notification system for products page
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
        max-width: 300px;
        font-size: 0.9rem;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    notification.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}