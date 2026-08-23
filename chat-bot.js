// Spirulina Garden - Professional Chat Bot with Lead Capture
// Optimized for conversion: progressive disclosure, professional tone, exit-intent, geo-prefill, sample requests

(function() {
    'use strict';

    // ==================== CONFIGURATION ====================
    const CONFIG = {
        whatsappNumber: '918470905599',
        botName: 'Priya',
        companyName: 'Spirulina Garden',
        
        // Professional welcome - no emojis, clear value prop
        welcomeMessage: 'Welcome to Spirulina Garden. I\'m Priya, your export specialist. We supply premium organic spirulina to 1,000+ businesses across 50+ countries. How can I help you today?',
        
        // Optimized flow: Easy → Medium → Hard (reduces bounce)
        // Step 1: Micro-commitment (interest level)
        // Step 2: Contact basics (name, email)
        // Step 3: Business context (company, country)
        // Step 4: Requirements (product, volume, timeline)
        // Step 5: Optional deep-dive (sample request, certifications)
        
        steps: [
            // STEP 1: Interest Qualification (micro-commitment, single click)
            {
                id: 'interest',
                type: 'choice',
                label: 'What brings you here today?',
                required: true,
                options: [
                    { value: 'bulk_powder', label: 'Bulk Spirulina Powder (1kg–20MT+)' },
                    { value: 'tablets', label: 'Spirulina Tablets 500mg (60-count bottles)' },
                    { value: 'capsules', label: 'Spirulina Capsules 400mg (60-count bottles)' },
                    { value: 'private_label', label: 'Private Label / Custom Branding' },
                    { value: 'distribution', label: 'Distribution Partnership' },
                    { value: 'sample', label: 'Request Free Sample First' },
                    { value: 'information', label: 'Just Gathering Information' }
                ],
                hint: 'Select one to continue'
            },
            // STEP 2: Contact Basics (low friction)
            {
                id: 'name',
                type: 'text',
                label: 'Your Name',
                placeholder: 'e.g., Rajesh Kumar',
                required: true,
                validate: (v) => v.length >= 2 || 'Please enter your full name'
            },
            {
                id: 'email',
                type: 'email',
                label: 'Business Email',
                placeholder: 'e.g., procurement@company.com',
                required: true,
                validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid business email'
            },
            // STEP 3: Business Context (auto-filled where possible)
            {
                id: 'company',
                type: 'text',
                label: 'Company Name (Optional)',
                placeholder: 'e.g., Green Health Imports Pvt Ltd',
                required: false
            },
            {
                id: 'country',
                type: 'select',
                label: 'Destination Country',
                required: true,
                options: [
                    { value: '', label: 'Select Country' },
                    { value: 'United States', label: 'United States' },
                    { value: 'Canada', label: 'Canada' },
                    { value: 'United Kingdom', label: 'United Kingdom' },
                    { value: 'Germany', label: 'Germany' },
                    { value: 'France', label: 'France' },
                    { value: 'Netherlands', label: 'Netherlands' },
                    { value: 'United Arab Emirates', label: 'United Arab Emirates' },
                    { value: 'Saudi Arabia', label: 'Saudi Arabia' },
                    { value: 'Japan', label: 'Japan' },
                    { value: 'Singapore', label: 'Singapore' },
                    { value: 'Australia', label: 'Australia' },
                    { value: 'India', label: 'India' },
                    { value: 'Other', label: 'Other Country' }
                ],
                hint: 'Used for shipping estimates and compliance'
            },
            // STEP 4: Requirements (core qualification)
            {
                id: 'product',
                type: 'select',
                label: 'Primary Product Interest',
                required: true,
                options: [
                    { value: '', label: 'Select Product' },
                    { value: 'Organic Spirulina Powder', label: 'Organic Spirulina Powder (Bulk)' },
                    { value: 'Spirulina Tablets 500mg', label: 'Spirulina Tablets 500mg' },
                    { value: 'Spirulina Capsules 400mg', label: 'Spirulina Capsules 400mg' },
                    { value: 'Private Label', label: 'Private Label / Custom Branding' }
                ]
            },
            {
                id: 'volume',
                type: 'select',
                label: 'Monthly Volume Requirement',
                required: true,
                options: [
                    { value: '', label: 'Select Volume' },
                    { value: 'sample', label: 'Sample Only (1–5 kg / 100–500 bottles)' },
                    { value: 'trial', label: 'Trial Order (10–50 kg / 500–2,000 bottles)' },
                    { value: 'regular', label: 'Regular Supply (50–500 kg / 2,000–20,000 bottles)' },
                    { value: 'container', label: 'Container Load (500 kg–20 MT / 20,000+ bottles)' },
                    { value: 'annual_contract', label: 'Annual Contract (20+ MT / 200,000+ bottles)' }
                ],
                hint: 'Estimate your monthly need'
            },
            {
                id: 'timeline',
                type: 'select',
                label: 'When Do You Need First Shipment?',
                required: true,
                options: [
                    { value: '', label: 'Select Timeline' },
                    { value: 'asap', label: 'ASAP (Within 2 Weeks)' },
                    { value: '1_month', label: 'Within 1 Month' },
                    { value: '2_3_months', label: '2–3 Months' },
                    { value: 'planning', label: 'Planning Phase (3+ Months)' }
                ]
            },
            // STEP 5: Optional Deep-dive (sample request, certifications)
            {
                id: 'certifications',
                type: 'multiselect',
                label: 'Required Certifications (Select All That Apply)',
                required: false,
                options: [
                    { value: 'usda_organic', label: 'USDA Organic' },
                    { value: 'eu_organic', label: 'EU Organic' },
                    { value: 'iso_22000', label: 'ISO 22000 / HACCP' },
                    { value: 'fda_gras', label: 'FDA GRAS' },
                    { value: 'halal', label: 'Halal' },
                    { value: 'kosher', label: 'Kosher' },
                    { value: 'non_gmo', label: 'Non-GMO Project Verified' },
                    { value: 'gmp', label: 'GMP Certified' }
                ]
            },
            {
                id: 'shipping_terms',
                type: 'select',
                label: 'Preferred Shipping Terms',
                required: false,
                options: [
                    { value: '', label: 'Select Terms' },
                    { value: 'FOB', label: 'FOB India (Free on Board)' },
                    { value: 'CIF', label: 'CIF (Cost, Insurance, Freight)' },
                    { value: 'CFR', label: 'CFR (Cost and Freight)' },
                    { value: 'DAP', label: 'DAP (Delivered at Place)' },
                    { value: 'air_freight', label: 'Air Freight (Express)' },
                    { value: 'not_sure', label: 'Need Guidance' }
                ]
            },
            {
                id: 'requirements',
                type: 'textarea',
                label: 'Additional Requirements',
                placeholder: 'Packaging specs, labeling requirements, payment terms, quality parameters, or any other details...',
                required: false,
                hint: 'Optional — helps us prepare an accurate quote'
            }
        ],

        // Professional responses - minimal emojis, clear language
        responses: {
            greeting: [
                "Thank you for reaching out. I'll help you find the right solution.",
                "Welcome. Let's get you the information you need efficiently."
            ],
            askingInterest: [
                "What type of spirulina product are you evaluating?"
            ],
            askingName: "May I have your name?",
            askingEmail: "What's the best email to send specifications and pricing?",
            askingCompany: "Your company name (optional, helps us tailor the proposal):",
            askingCountry: "Which country will this ship to? This determines certifications and logistics.",
            askingProduct: "Which product format fits your need?",
            askingVolume: "What's your estimated monthly volume?",
            askingTimeline: "When do you need the first delivery?",
            askingCertifications: "Any specific certifications required for your market?",
            askingShipping: "Do you have preferred shipping terms, or would you like our recommendation?",
            askingRequirements: "Any other details — packaging, labeling, payment terms, quality specs?",
            thankYou: [
                "Thank you. Your request is being processed.",
                "Received. Our export team will contact you within 15 minutes during business hours."
            ],
            error: "Please check your entry and try again.",
            sampleOffer: "Would you like to start with a complimentary 100g sample? We'll ship it at no cost for quality verification.",
            sampleConfirm: "Excellent. I'll arrange the sample shipment. You'll receive tracking within 24 hours.",
            exitIntentTitle: "Before You Go — Get Our Export Catalog Free",
            exitIntentBody: "Download our complete product catalog with specifications, certifications, and volume pricing. No obligation.",
            exitIntentButton: "Get Free Catalog (PDF)",
            exitIntentSecondary: "No Thanks, Continue Browsing"
        },

        storageKey: 'spirulina_chat_lead_v2',
        sessionKey: 'spirulina_chat_session_v2',
        geoCacheKey: 'spirulina_geo_cache',
        geoCacheTTL: 24 * 60 * 60 * 1000 // 24 hours
    };

    // ==================== STATE MANAGEMENT ====================
    let state = {
        isOpen: false,
        isMinimized: false,
        currentStep: 0,
        leadData: {},
        messages: [],
        hasGreeted: false,
        isSubmitting: false,
        geoResolved: false,
        exitIntentShown: false,
        engagementScore: 0,
        sessionStart: Date.now()
    };

    // Load saved state
    function loadState() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                state.leadData = parsed.leadData || {};
                state.currentStep = parsed.currentStep || 0;
                state.hasGreeted = parsed.hasGreeted || false;
            }
            const session = localStorage.getItem(CONFIG.sessionKey);
            if (session) {
                const parsed = JSON.parse(session);
                state.isOpen = parsed.isOpen || false;
                state.isMinimized = parsed.isMinimized || false;
            }
        } catch (e) {
            console.warn('Chat bot: Could not load saved state', e);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify({
                leadData: state.leadData,
                currentStep: state.currentStep,
                hasGreeted: state.hasGreeted
            }));
            localStorage.setItem(CONFIG.sessionKey, JSON.stringify({
                isOpen: state.isOpen,
                isMinimized: state.isMinimized
            }));
        } catch (e) {
            console.warn('Chat bot: Could not save state', e);
        }
    }

    // Track analytics events
    function trackEvent(eventName, properties = {}) {
        const eventData = {
            event: eventName,
            timestamp: new Date().toISOString(),
            sessionId: state.sessionStart,
            engagementScore: state.engagementScore,
            currentStep: state.currentStep,
            ...properties
        };
        
        // Console for debugging
        console.log('[Chat Bot Analytics]', eventData);
        
        // Send to data layer for GA4/GTM
        if (window.dataLayer) {
            window.dataLayer.push(eventData);
        }
        
        // Custom event for internal tracking
        window.dispatchEvent(new CustomEvent('spirulina_chat_event', { detail: eventData }));
    }

    // ==================== GEO IP PRE-FILL ====================
    async function resolveGeo() {
        if (state.geoResolved) return;
        
        // Check cache first
        try {
            const cached = localStorage.getItem(CONFIG.geoCacheKey);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (Date.now() - timestamp < CONFIG.geoCacheTTL) {
                    applyGeoData(data);
                    return;
                }
            }
        } catch (e) {}

        try {
            // Use free IP geolocation API
            const response = await fetch('https://ipapi.co/json/', { 
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });
            const data = await response.json();
            
            if (data && data.country_name) {
                // Cache it
                localStorage.setItem(CONFIG.geoCacheKey, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
                applyGeoData(data);
            }
        } catch (e) {
            console.warn('Geo resolution failed, using defaults', e);
        } finally {
            state.geoResolved = true;
        }
    }

    function applyGeoData(data) {
        const countryMap = {
            'United States': 'United States',
            'Canada': 'Canada',
            'United Kingdom': 'United Kingdom',
            'Germany': 'Germany',
            'France': 'France',
            'Netherlands': 'Netherlands',
            'United Arab Emirates': 'United Arab Emirates',
            'Saudi Arabia': 'Saudi Arabia',
            'Japan': 'Japan',
            'Singapore': 'Singapore',
            'Australia': 'Australia',
            'India': 'India'
        };
        
        const country = countryMap[data.country_name] || 'Other';
        if (country !== 'Other' && !state.leadData.country) {
            state.leadData.country = country;
            // Pre-fill will apply when step renders
        }
    }

    // ==================== EXIT-INTENT POPUP ====================
    function initExitIntent() {
        let exitIntentTimer;
        let mouseInViewport = true;

        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && mouseInViewport && !state.exitIntentShown && state.engagementScore > 10) {
                mouseInViewport = false;
                clearTimeout(exitIntentTimer);
                exitIntentTimer = setTimeout(() => {
                    showExitIntentPopup();
                }, 300);
            }
        });

        document.addEventListener('mouseenter', () => {
            mouseInViewport = true;
            clearTimeout(exitIntentTimer);
        });

        // Track engagement
        ['click', 'scroll', 'keydown'].forEach(evt => {
            document.addEventListener(evt, () => {
                state.engagementScore += 1;
            }, { passive: true });
        });

        // Scroll depth tracking
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPct > maxScroll) {
                maxScroll = scrollPct;
                if (maxScroll >= 50 && state.engagementScore < 20) {
                    state.engagementScore = 20;
                }
            }
        }, { passive: true });
    }

    function showExitIntentPopup() {
        if (state.exitIntentShown) return;
        state.exitIntentShown = true;
        trackEvent('exit_intent_shown');

        const overlay = document.createElement('div');
        overlay.id = 'exitIntentOverlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 10001;
            display: flex; align-items: center; justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const popup = document.createElement('div');
        popup.style.cssText = `
            background: white; border-radius: 16px; padding: 40px; max-width: 480px;
            margin: 20px; box-shadow: 0 25px 50px rgba(0,0,0,0.2);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
        `;

        popup.innerHTML = `
            <div style="width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #059669, #047857); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                <svg width="28" height="28" fill="white" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            </div>
            <h2 style="margin: 0 0 12px; font-size: 24px; color: #1f2937;">${CONFIG.responses.exitIntentTitle}</h2>
            <p style="margin: 0 0 24px; color: #6b7280; line-height: 1.6;">${CONFIG.responses.exitIntentBody}</p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
                <button id="exitIntentDownload" style="
                    background: linear-gradient(135deg, #059669, #047857);
                    color: white; border: none; padding: 14px 28px;
                    border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                " onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 20px rgba(5,150,105,0.4)'" onmouseout="this.style.transform='';this.style.boxShadow=''">
                    ${CONFIG.responses.exitIntentButton}
                </button>
                <button id="exitIntentDismiss" style="
                    background: white; color: #6b7280; border: 2px solid #e5e7eb;
                    padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: 500; cursor: pointer;
                " onmouseover="this.style.borderColor='#059669';this.style.color='#059669'" onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#6b7280'">
                    ${CONFIG.responses.exitIntentSecondary}
                </button>
            </div>
        `;

        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        // Download handler
        document.getElementById('exitIntentDownload').onclick = () => {
            trackEvent('catalog_downloaded', { source: 'exit_intent' });
            downloadCatalog();
            closeExitIntent();
        };

        document.getElementById('exitIntentDismiss').onclick = () => {
            trackEvent('exit_intent_dismissed');
            closeExitIntent();
        };

        overlay.onclick = (e) => {
            if (e.target === overlay) closeExitIntent();
        };
    }

    function closeExitIntent() {
        const overlay = document.getElementById('exitIntentOverlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                overlay.remove();
                document.body.style.overflow = '';
            }, 300);
        }
    }

    function downloadCatalog() {
        // Create a comprehensive catalog PDF content as blob
        const catalogContent = generateCatalogContent();
        const blob = new Blob([catalogContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Spirulina_Garden_Export_Catalog.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Also offer email delivery
        if (state.leadData.email) {
            trackEvent('catalog_email_requested');
        }
    }

    function generateCatalogContent() {
        // Simple PDF-like text content (in production, use a proper PDF library)
        return `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 1000 >>
stream
BT
/F1 24 Tf
50 720 Td
(Spirulina Garden - Export Catalog) Tj
0 -40 Td
/F1 14 Tf
(Premium Organic Spirulina for Global Markets) Tj
0 -30 Td
/F1 12 Tf
(ISO 22000 | HACCP | USDA Organic | EU Organic | FDA GRAS | Halal | Kosher) Tj
0 -40 Td
(Products:) Tj
0 -20 Td
(- Organic Spirulina Powder: 65-70% Protein, Bulk 1kg-20MT+) Tj
0 -20 Td
(- Spirulina Tablets: 500mg, 60-count bottles) Tj
0 -20 Td
(- Spirulina Capsules: 400mg, 60-count bottles) Tj
0 -20 Td
(- Private Label: Custom branding, packaging, formulations) Tj
0 -40 Td
(Export Capabilities:) Tj
0 -20 Td
(- 50+ Countries: USA, EU, Middle East, Asia, Africa) Tj
0 -20 Td
(- Shipping: Air & Sea Freight, FOB/CIF/DAP Terms) Tj
0 -20 Td
(- Lead Time: 2-4 weeks from order confirmation) Tj
0 -20 Td
(- MOQ: 25kg Powder | 500 Bottles Tablets/Capsules) Tj
0 -40 Td
(Contact:) Tj
0 -20 Td
(WhatsApp: +91 8470905599) Tj
0 -20 Td
(Email: contact@spirulinagarden.com) Tj
0 -20 Td
(Web: spirulinagarden.com) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>
endobj
xref
0 6
0000000000 65535 f
0000000010 00000 n
0000000060 00000 n
0000000117 00000 n
0000000202 00000 n
0000010000 00000 n
trailer
<< /Size 6 /Root 1 0 R >>
startxref
10200
%%EOF`;
    }

    // ==================== DOM CREATION ====================
    function createChatBot() {
        const container = document.createElement('div');
        container.id = 'spirulina-chat-bot';
        container.innerHTML = getStyles() + getHTML();
        return container;
    }

    function getStyles() {
        return `
            <style>
                #spirulina-chat-bot {
                    position: fixed; bottom: 20px; right: 20px; z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .chat-fab {
                    width: 60px; height: 60px; border-radius: 50%;
                    background: linear-gradient(135deg, #059669, #047857);
                    box-shadow: 0 4px 20px rgba(5, 150, 105, 0.4);
                    cursor: pointer; display: flex; align-items: center; justify-content: center;
                    transition: all 0.3s ease; animation: pulse 2s infinite; border: none;
                }
                .chat-fab:hover { transform: scale(1.1); box-shadow: 0 6px 25px rgba(5, 150, 105, 0.5); }
                .chat-fab:focus { outline: 3px solid #059669; outline-offset: 3px; }
                .chat-fab svg { width: 28px; height: 28px; color: white; }
                .chat-fab .notification-badge {
                    position: absolute; top: -5px; right: -5px;
                    background: #ef4444; color: white; border-radius: 50%;
                    width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
                    font-size: 11px; font-weight: bold; animation: bounce 1s infinite;
                }
                @keyframes pulse { 0%, 100% { box-shadow: 0 4px 20px rgba(5, 150, 105, 0.4); } 50% { box-shadow: 0 4px 30px rgba(5, 150, 105, 0.6); } }
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

                .chat-window {
                    position: absolute; bottom: 80px; right: 0;
                    width: 380px; max-width: calc(100vw - 40px);
                    height: 580px; max-height: 75vh;
                    background: white; border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    display: none; flex-direction: column; overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .chat-window.open { display: flex; animation: slideUp 0.3s ease; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                .chat-header {
                    background: linear-gradient(135deg, #059669, #047857); color: white;
                    padding: 16px 20px; display: flex; align-items: center; gap: 12px;
                }
                .chat-avatar { width: 40px; height: 40px; border-radius: 50%;
                    background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .chat-avatar svg { width: 24px; height: 24px; color: white; }
                .chat-title h3 { font-size: 16px; font-weight: 600; margin: 0; line-height: 1.2; }
                .chat-title span { font-size: 12px; opacity: 0.9; }
                .chat-status { margin-left: auto; display: flex; align-items: center; gap: 6px; font-size: 11px; }
                .chat-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: blink 2s infinite; }
                @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
                .chat-actions { display: flex; gap: 8px; margin-left: 12px; }
                .chat-action-btn {
                    background: rgba(255,255,255,0.15); border: none; color: white;
                    width: 32px; height: 32px; border-radius: 8px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; transition: background 0.2s;
                }
                .chat-action-btn:hover { background: rgba(255,255,255,0.25); }
                .chat-action-btn svg { width: 18px; height: 18px; }

                .chat-messages { flex: 1; overflow-y: auto; padding: 20px;
                    display: flex; flex-direction: column; gap: 16px; background: #f9fafb; }

                .chat-message { display: flex; gap: 8px; max-width: 85%; animation: fadeIn 0.3s ease; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .chat-message.bot { align-self: flex-start; }
                .chat-message.user { align-self: flex-end; flex-direction: row-reverse; }

                .chat-message-avatar { width: 32px; height: 32px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .chat-message.bot .chat-message-avatar { background: linear-gradient(135deg, #059669, #047857); }
                .chat-message.user .chat-message-avatar { background: linear-gradient(135deg, #2563eb, #1d4ed8); }
                .chat-message-avatar svg { width: 18px; height: 18px; color: white; }

                .chat-message-content { background: white; padding: 12px 16px; border-radius: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                .chat-message.bot .chat-message-content { border-bottom-left-radius: 4px; }
                .chat-message.user .chat-message-content { background: linear-gradient(135deg, #059669, #047857); color: white; border-bottom-right-radius: 4px; }
                .chat-message-text { font-size: 14px; line-height: 1.5; }
                .chat-message-time { font-size: 10px; opacity: 0.6; margin-top: 4px; text-align: right; }
                .chat-message.user .chat-message-time { text-align: left; }

                .chat-input-area { padding: 16px 20px; background: white; border-top: 1px solid #e5e7eb; }
                .chat-quick-replies { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
                .quick-reply { background: white; border: 2px solid #e5e7eb; color: #374151;
                    padding: 8px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
                .quick-reply:hover { border-color: #059669; color: #059669; }

                .chat-form-step { background: white; padding: 16px; border-radius: 12px; border: 1px solid #e5e7eb; }
                .chat-form-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 8px; }
                .chat-form-input, .chat-form-textarea, .chat-form-select {
                    width: 100%; border: 2px solid #e5e7eb; border-radius: 10px;
                    padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none;
                    transition: border-color 0.2s; box-sizing: border-box;
                }
                .chat-form-input:focus, .chat-form-textarea:focus, .chat-form-select:focus {
                    border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
                }
                .chat-form-textarea { min-height: 80px; resize: vertical; }
                .chat-form-hint { font-size: 11px; color: #9ca3af; margin-top: 6px; }
                .chat-form-error { color: #ef4444; font-size: 12px; margin-top: 6px; display: none; }
                .chat-form-error.show { display: block; }

                .chat-progress { display: flex; gap: 6px; margin-bottom: 16px; justify-content: center; }
                .chat-progress-dot { width: 10px; height: 10px; border-radius: 50%; background: #e5e7eb; transition: all 0.3s; }
                .chat-progress-dot.active { background: #059669; }
                .chat-progress-dot.completed { background: #22c55e; }

                .chat-typing { display: flex; gap: 4px; padding: 8px 12px; }
                .chat-typing-dot { width: 8px; height: 8px; border-radius: 50%; background: #059669; animation: typing 1.4s infinite ease-in-out; }
                .chat-typing-dot:nth-child(2) { animation-delay: 0.2s; }
                .chat-typing-dot:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.5; } 30% { transform: translateY(-6px); opacity: 1; } }

                .chat-window.minimized { height: 60px; }
                .chat-window.minimized .chat-messages, .chat-window.minimized .chat-input-area { display: none; }

                @media (max-width: 480px) {
                    .chat-window { width: calc(100vw - 20px); height: 75vh; max-height: 75vh; bottom: 80px; right: 10px; }
                    #spirulina-chat-bot { bottom: 15px; right: 15px; }
                }

                .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

                .chat-success { text-align: center; padding: 30px 20px; }
                .chat-success-icon { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #22c55e, #16a34a); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
                .chat-success-icon svg { width: 40px; height: 40px; color: white; }
                .chat-success h3 { color: #059669; margin-bottom: 8px; }
                .chat-success p { color: #6b7280; margin-bottom: 20px; }

                .choice-options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
                .choice-btn { background: white; border: 2px solid #e5e7eb; color: #374151; padding: 12px; border-radius: 10px; font-size: 13px; cursor: pointer; text-align: left; transition: all 0.2s; }
                .choice-btn:hover { border-color: #059669; color: #059669; }
                .choice-btn.selected { border-color: #059669; background: #f0fdf4; color: #059669; }

                .multiselect-options { display: flex; flex-wrap: wrap; gap: 8px; max-height: 200px; overflow-y: auto; padding: 4px; }
                .multiselect-option { background: white; border: 2px solid #e5e7eb; color: #374151; padding: 8px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
                .multiselect-option:hover { border-color: #059669; color: #059669; }
                .multiselect-option.selected { border-color: #059669; background: #f0fdf4; color: #059669; }

                .sample-card { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 16px; margin: 16px 0; }
                .sample-card h4 { color: #059669; margin: 0 0 8px; font-size: 15px; }
                .sample-card p { color: #374151; margin: 0 0 12px; font-size: 13px; }
                .sample-actions { display: flex; gap: 8px; }

                .input-wrapper { display: flex; gap: 8px; align-items: flex-end; }
                .chat-input { flex: 1; border: 2px solid #e5e7eb; border-radius: 24px; padding: 12px 16px; font-size: 14px; outline: none; transition: border-color 0.2s; resize: none; min-height: 48px; max-height: 120px; font-family: inherit; }
                .chat-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); }
                .chat-send-btn { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, #059669, #047857); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0; }
                .chat-send-btn:hover { transform: scale(1.05); }
                .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
                .chat-send-btn svg { width: 20px; height: 20px; }

                .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none; transition: all 0.2s; border: none; cursor: pointer; }
                .btn-primary { background: linear-gradient(135deg, #059669, #047857); color: white; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(5, 150, 105, 0.4); }
                .btn-secondary { background: white; color: #059669; border: 2px solid #059669; }
                .btn-secondary:hover { background: #f0fdf4; }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
            </style>
        `;
    }

    function getHTML() {
        return `
            <button class="chat-fab" id="chatFab" aria-label="Open chat with ${CONFIG.botName} from ${CONFIG.companyName}" aria-expanded="false">
                <svg id="fabIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <svg id="fabCloseIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                <span class="notification-badge" id="notificationBadge" style="display:none;">1</span>
            </button>

            <div class="chat-window" id="chatWindow" role="dialog" aria-label="Chat with ${CONFIG.botName}" aria-modal="true">
                <div class="chat-header">
                    <div class="chat-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>
                        </svg>
                    </div>
                    <div class="chat-title">
                        <h3>${CONFIG.botName} — Export Specialist</h3>
                        <span>Online • Typically replies in minutes</span>
                    </div>
                    <div class="chat-status"><span class="chat-status-dot"></span><span>Available</span></div>
                    <div class="chat-actions">
                        <button class="chat-action-btn" id="minimizeBtn" aria-label="Minimize chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
                        <button class="chat-action-btn" id="closeBtn" aria-label="Close chat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages" role="log" aria-live="polite"></div>
                <div class="chat-input-area" id="chatInputArea">
                    <div class="chat-quick-replies" id="quickReplies"></div>
                    <div class="chat-form-step" id="formStep" style="display:none;"></div>
                    <div class="chat-typing" id="typingIndicator" style="display:none;"><div class="chat-typing-dot"></div><div class="chat-typing-dot"></div><div class="chat-typing-dot"></div></div>
                    <div class="input-wrapper" id="inputWrapper">
                        <textarea class="chat-input" id="chatInput" placeholder="Type your message..." rows="1" aria-label="Your message"></textarea>
                        <button class="chat-send-btn" id="sendBtn" aria-label="Send message" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button>
                    </div>
                </div>
            </div>
        `;
    }

    // ==================== MESSAGE HANDLING ====================
    function addMessage(text, isUser = false, options = {}) {
        const container = document.getElementById('chatMessages');
        const div = document.createElement('div');
        div.className = `chat-message ${isUser ? 'user' : 'bot'}`;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        div.innerHTML = `
            <div class="chat-message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${isUser ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' : '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>'}</svg></div>
            <div class="chat-message-content"><div class="chat-message-text">${escapeHtml(text)}</div><div class="chat-message-time">${time}</div></div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        state.messages.push({ text, isUser, time, ...options });
        return div;
    }

    function showTyping() { document.getElementById('typingIndicator').style.display = 'flex'; document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight; }
    function hideTyping() { document.getElementById('typingIndicator').style.display = 'none'; }
    function hideQuickReplies() { document.getElementById('quickReplies').innerHTML = ''; }

    function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

    // ==================== STEP RENDERING ====================
    function renderStep(stepIndex) {
        const step = CONFIG.steps[stepIndex];
        const container = document.getElementById('formStep');
        container.style.display = 'block';
        document.getElementById('inputWrapper').style.display = 'none';

        // Progress indicator
        let progressHtml = '<div class="chat-progress">';
        CONFIG.steps.forEach((s, i) => { progressHtml += `<div class="chat-progress-dot ${i < stepIndex ? 'completed' : i === stepIndex ? 'active' : ''}"></div>`; });
        progressHtml += '</div>';

        let inputHtml = '';
        const value = state.leadData[step.id] || '';

        switch (step.type) {
            case 'choice':
                inputHtml = '<div class="choice-options">';
                step.options.forEach(opt => {
                    const selected = value === opt.value ? 'selected' : '';
                    inputHtml += `<button class="choice-btn ${selected}" data-value="${escapeHtml(opt.value)}">${escapeHtml(opt.label)}</button>`;
                });
                inputHtml += '</div>';
                break;
            case 'select':
                inputHtml = `<select class="chat-form-select" id="formField" ${step.required ? 'required' : ''}>`;
                step.options.forEach(opt => { inputHtml += `<option value="${escapeHtml(opt.value)}" ${value === opt.value ? 'selected' : ''}>${escapeHtml(opt.label)}</option>`; });
                inputHtml += '</select>';
                break;
            case 'multiselect':
                inputHtml = '<div class="multiselect-options" id="multiselectContainer">';
                const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
                step.options.forEach(opt => {
                    const selected = selectedValues.includes(opt.value) ? 'selected' : '';
                    inputHtml += `<button class="multiselect-option ${selected}" data-value="${escapeHtml(opt.value)}" type="button">${escapeHtml(opt.label)}</button>`;
                });
                inputHtml += '</div><input type="hidden" id="formField" name="${step.id}">';
                break;
            case 'textarea':
                inputHtml = `<textarea class="chat-form-textarea" id="formField" placeholder="${escapeHtml(step.placeholder || '')}" ${step.required ? 'required' : ''}>${escapeHtml(value)}</textarea>`;
                break;
            default:
                inputHtml = `<input type="${step.type}" class="chat-form-input" id="formField" placeholder="${escapeHtml(step.placeholder || '')}" value="${escapeHtml(value)}" ${step.required ? 'required' : ''}>`;
        }

        container.innerHTML = `
            ${progressHtml}
            <label class="chat-form-label" for="formField">${escapeHtml(step.label)} ${step.required ? '<span style="color:#ef4444">*</span>' : ''}</label>
            ${inputHtml}
            ${step.hint ? `<div class="chat-form-hint">${escapeHtml(step.hint)}</div>` : ''}
            <div class="chat-form-error" id="formError"></div>
        `;

        // Bind events
        const input = document.getElementById('formField');
        if (input) {
            input.focus();
            input.addEventListener('input', () => document.getElementById('formError').classList.remove('show'));
            if (step.type !== 'textarea' && step.type !== 'multiselect') {
                input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleFormSubmit(step); } });
            }
        }

        // Choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                state.leadData[step.id] = btn.dataset.value;
                saveState();
                setTimeout(() => handleFormSubmit(step), 100);
            };
        });

        // Multiselect
        document.querySelectorAll('.multiselect-option').forEach(btn => {
            btn.onclick = () => {
                btn.classList.toggle('selected');
                const container = document.getElementById('multiselectContainer');
                const selected = Array.from(container.querySelectorAll('.multiselect-option.selected')).map(b => b.dataset.value);
                state.leadData[step.id] = selected;
                document.getElementById('formField').value = JSON.stringify(selected);
                saveState();
            };
        });
    }

    function hideFormStep() {
        document.getElementById('formStep').style.display = 'none';
        document.getElementById('inputWrapper').style.display = 'flex';
    }

    // ==================== CONVERSATION FLOW ====================
    async function startConversation() {
        await resolveGeo();
        
        if (state.hasGreeted) {
            if (state.currentStep < CONFIG.steps.length) {
                renderStep(state.currentStep);
            } else {
                showCompletion();
            }
            return;
        }

        state.hasGreeted = true;
        saveState();
        trackEvent('chat_opened');

        addMessage(CONFIG.welcomeMessage, false);

        setTimeout(() => {
            askForStep(0);
        }, 600);
    }

    function askForStep(stepIndex) {
        if (stepIndex >= CONFIG.steps.length) {
            showCompletion();
            return;
        }

        state.currentStep = stepIndex;
        saveState();

        const step = CONFIG.steps[stepIndex];
        let message = '';

        // Contextual messages based on step
        switch (step.id) {
            case 'interest':
                message = CONFIG.responses.askingInterest;
                break;
            case 'name':
                message = CONFIG.responses.askingName;
                break;
            case 'email':
                message = CONFIG.responses.askingEmail;
                break;
            case 'company':
                message = CONFIG.responses.askingCompany;
                break;
            case 'country':
                message = CONFIG.responses.askingCountry;
                break;
            case 'product':
                message = CONFIG.responses.askingProduct;
                break;
            case 'volume':
                message = CONFIG.responses.askingVolume;
                break;
            case 'timeline':
                message = CONFIG.responses.askingTimeline;
                break;
            case 'certifications':
                message = CONFIG.responses.askingCertifications;
                break;
            case 'shipping_terms':
                message = CONFIG.responses.askingShipping;
                break;
            case 'requirements':
                message = CONFIG.responses.askingRequirements;
                break;
            default:
                message = step.label;
        }

        showTyping();
        setTimeout(() => {
            hideTyping();
            addMessage(message, false);
            renderStep(stepIndex);
            trackEvent('step_shown', { step: step.id, stepIndex });
        }, 500);
    }

    function handleFormSubmit(step) {
        const input = document.getElementById('formField');
        let value = '';

        if (step.type === 'multiselect') {
            value = input.value ? JSON.parse(input.value) : [];
        } else {
            value = input ? input.value.trim() : '';
        }

        // Validation
        if (step.required && (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value))) {
            const errorEl = document.getElementById('formError');
            errorEl.textContent = CONFIG.responses.error;
            errorEl.classList.add('show');
            input?.focus();
            return;
        }

        if (step.validate && !step.validate(value)) {
            const errorEl = document.getElementById('formError');
            errorEl.textContent = step.validate(value);
            errorEl.classList.add('show');
            input?.focus();
            return;
        }

        // Save data
        state.leadData[step.id] = value;
        saveState();
        trackEvent('step_completed', { step: step.id, value });

        // Add user message
        hideFormStep();
        const displayValue = Array.isArray(value) ? value.join(', ') : value;
        addMessage(displayValue || '(skipped)', true);

        // Check for sample request flow
        if (step.id === 'interest' && value === 'sample') {
            handleSampleRequest();
            return;
        }

        // Acknowledge and continue
        const ackMessages = CONFIG.responses.thankYou;
        const message = ackMessages[Math.floor(Math.random() * ackMessages.length)];

        showTyping();
        setTimeout(() => {
            hideTyping();
            addMessage(message, false);
            
            // Check if we should offer sample after volume selection
            if (step.id === 'volume' && (value === 'sample' || value === 'trial')) {
                setTimeout(offerSample, 800);
            } else {
                setTimeout(() => askForStep(stepIndex + 1), 600);
            }
        }, 400);
    }

    function offerSample() {
        addMessage(CONFIG.responses.sampleOffer, false);
        showQuickReplies([
            { text: 'Yes, Send Free Sample', action: 'request_sample' },
            { text: 'No, Proceed to Quote', action: 'skip_sample' }
        ]);
    }

    function handleSampleRequest() {
        addMessage(CONFIG.responses.sampleConfirm, false);
        state.leadData.sampleRequested = true;
        saveState();
        trackEvent('sample_requested');
        setTimeout(() => askForStep(state.currentStep + 1), 800);
    }

    function handleQuickReply(reply) {
        hideQuickReplies();
        addMessage(reply.text, true);
        trackEvent('quick_reply', { action: reply.action });

        if (reply.action === 'request_sample') {
            handleSampleRequest();
        } else if (reply.action === 'skip_sample') {
            askForStep(state.currentStep + 1);
        } else if (reply.action === 'start_form') {
            askForStep(0);
        } else if (reply.action === 'whatsapp') {
            openWhatsApp();
        } else if (reply.action === 'products') {
            window.location.href = 'products.html';
        } else if (reply.action === 'download_catalog') {
            downloadCatalog();
        }
    }

    function showCompletion() {
        hideFormStep();
        hideQuickReplies();
        document.getElementById('inputWrapper').style.display = 'none';

        const container = document.getElementById('chatMessages');
        const div = document.createElement('div');
        div.className = 'chat-message bot';
        
        const timeline = state.leadData.timeline;
        const urgencyNote = timeline === 'asap' ? ' We\'ve flagged this as urgent.' : '';
        
        div.innerHTML = `
            <div class="chat-success">
                <div class="chat-success-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
                <h3>Request Submitted</h3>
                <p>Thank you, ${state.leadData.name || 'there'}. Your inquiry has been received.${urgencyNote} Our export team will contact you at ${state.leadData.email} within 15 minutes during business hours.</p>
                <a href="https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(createWhatsAppMessage())}" target="_blank" class="btn btn-primary" style="margin-right: 8px;">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    Continue on WhatsApp
                </a>
                <button class="btn btn-secondary" onclick="window.SpirulinaChatBot.downloadCatalog()">Download Catalog</button>
            </div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        sendToWhatsApp();
        sendToEmail();
        trackEvent('lead_completed', { leadData: state.leadData });

        setTimeout(() => {
            state.currentStep = 0;
            state.hasGreeted = false;
            saveState();
        }, 8000);
    }

    // ==================== WHATSAPP & EMAIL ====================
    function createWhatsAppMessage() {
        const d = state.leadData;
        return `*NEW LEAD - SPIRULINA GARDEN*\n━━━━━━━━━━━━━━━━━━━━\n\n*CONTACT:*\nName: ${d.name || '—'}\nEmail: ${d.email || '—'}\nCompany: ${d.company || '—'}\nCountry: ${d.country || '—'}\n\n*REQUIREMENTS:*\nInterest: ${d.interest || '—'}\nProduct: ${d.product || '—'}\nVolume: ${d.volume || '—'}\nTimeline: ${d.timeline || '—'}\nCertifications: ${Array.isArray(d.certifications) ? d.certifications.join(', ') : (d.certifications || '—')}\nShipping: ${d.shipping_terms || '—'}\nNotes: ${d.requirements || '—'}\n\n━━━━━━━━━━━━━━━━━━━━\nSubmitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\nSource: Chat Bot (spirulinagarden.com)`;
    }

    function sendToWhatsApp() {
        if (state.isSubmitting) return;
        state.isSubmitting = true;
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(createWhatsAppMessage())}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        storeLeadLocally();
        state.isSubmitting = false;
    }

    async function sendToEmail() {
        try {
            const response = await fetch('/api/lead-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...state.leadData, source: 'chat_bot_v2' })
            });
            const result = await response.json();
            if (result.success) {
                console.log('✅ Lead sent to email/CRM:', result.leadId);
            }
        } catch (e) {
            console.warn('Email API unavailable:', e);
        }
    }

    function storeLeadLocally() {
        try {
            const leads = JSON.parse(localStorage.getItem('spirulina_leads') || '[]');
            leads.push({ data: state.leadData, timestamp: new Date().toISOString() });
            if (leads.length > 50) leads.shift();
            localStorage.setItem('spirulina_leads', JSON.stringify(leads));
        } catch (e) {}
    }

    function openWhatsApp() {
        const msg = 'Hello, I\'m interested in your spirulina products. Please share export pricing and specifications.';
        window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    }

    // ==================== UI INTERACTIONS ====================
    function toggleChat() {
        const win = document.getElementById('chatWindow');
        const fab = document.getElementById('chatFab');
        const fabIcon = document.getElementById('fabIcon');
        const fabCloseIcon = document.getElementById('fabCloseIcon');

        state.isOpen = !state.isOpen;
        state.isMinimized = false;
        saveState();

        if (state.isOpen) {
            win.classList.add('open');
            win.classList.remove('minimized');
            fabIcon.style.display = 'none';
            fabCloseIcon.style.display = 'block';
            fab.setAttribute('aria-expanded', 'true');
            document.getElementById('chatInput').focus();
            startConversation();
            trackEvent('chat_opened_manual');
        } else {
            win.classList.remove('open');
            fabIcon.style.display = 'block';
            fabCloseIcon.style.display = 'none';
            fab.setAttribute('aria-expanded', 'false');
        }
    }

    function minimizeChat() {
        const win = document.getElementById('chatWindow');
        state.isMinimized = !state.isMinimized;
        saveState();
        win.classList.toggle('minimized', state.isMinimized);
    }

    function closeChat() {
        const win = document.getElementById('chatWindow');
        const fab = document.getElementById('chatFab');
        const fabIcon = document.getElementById('fabIcon');
        const fabCloseIcon = document.getElementById('fabCloseIcon');

        state.isOpen = false;
        state.isMinimized = false;
        saveState();

        win.classList.remove('open', 'minimized');
        fabIcon.style.display = 'block';
        fabCloseIcon.style.display = 'none';
        fab.setAttribute('aria-expanded', 'false');
    }

    function handleInput() {
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        sendBtn.disabled = input.value.trim().length === 0;
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }

    function handleSend() {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        input.style.height = 'auto';
        document.getElementById('sendBtn').disabled = true;

        addMessage(text, true);
        trackEvent('free_text_message');

        setTimeout(() => {
            const responses = [
                "Thank you for the details. Let me connect you with the right information.",
                "I appreciate that. Our team will address this in the proposal.",
                "Noted. Is there anything specific about certifications or shipping you'd like to clarify?"
            ];
            addMessage(responses[Math.floor(Math.random() * responses.length)], false);
            
            setTimeout(() => {
                showQuickReplies([
                    { text: 'Request Quote', action: 'start_form' },
                    { text: 'Download Catalog', action: 'download_catalog' },
                    { text: 'Chat on WhatsApp', action: 'whatsapp' }
                ]);
            }, 500);
        }, 600);
    }

    // ==================== INITIALIZATION ====================
    function init() {
        loadState();
        initExitIntent();

        const bot = createChatBot();
        document.body.appendChild(bot);

        const fab = document.getElementById('chatFab');
        const win = document.getElementById('chatWindow');
        const minimizeBtn = document.getElementById('minimizeBtn');
        const closeBtn = document.getElementById('closeBtn');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');

        fab.addEventListener('click', toggleChat);
        minimizeBtn.addEventListener('click', minimizeChat);
        closeBtn.addEventListener('click', closeChat);

        input.addEventListener('input', handleInput);
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
        sendBtn.addEventListener('click', handleSend);

        document.addEventListener('click', (e) => {
            if (state.isOpen && !win.contains(e.target) && !fab.contains(e.target)) closeChat();
        });

        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.isOpen) closeChat(); });

        if (Object.keys(state.leadData).length > 0 && !state.hasGreeted) {
            document.getElementById('notificationBadge').style.display = 'flex';
        }

        console.log('🌿 Spirulina Garden Chat Bot v2 initialized');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    window.SpirulinaChatBot = {
        open: toggleChat,
        close: closeChat,
        getLeadData: () => state.leadData,
        downloadCatalog,
        reset: () => {
            localStorage.removeItem(CONFIG.storageKey);
            localStorage.removeItem(CONFIG.sessionKey);
            state = { ...state, leadData: {}, currentStep: 0, hasGreeted: false };
        }
    };
})();