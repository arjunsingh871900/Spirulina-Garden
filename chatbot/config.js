/**
 * Spirulina Garden Chatbot - Configuration
 * Centralized config for easy customization
 */

export const CONFIG = {
  // --- Brand & Contact ---
  whatsappNumber: '918470905599',
  botName: 'Priya',
  companyName: 'Spirulina Garden',
  companyTagline: 'Global Spirulina Supplier',
  
  // --- Welcome Message ---
  welcomeMessage: `Welcome to Spirulina Garden! I'm Priya, your spirulina specialist. 
We supply premium organic spirulina to 1,000+ businesses across 50+ countries. 
Are you looking to <strong>buy</strong> spirulina for your business, or <strong>sell</strong> your harvest to us?`,
  
  // --- Buy Flow Steps ---
  buySteps: [
    // Step 1: Interest Qualification
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
    // Step 2: Contact Basics
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
    // Step 3: Business Context
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
        { value: 'United States', label: '🇺🇸 United States' },
        { value: 'Canada', label: '🇨🇦 Canada' },
        { value: 'United Kingdom', label: '🇬🇧 United Kingdom' },
        { value: 'Germany', label: '🇩🇪 Germany' },
        { value: 'France', label: '🇫🇷 France' },
        { value: 'Netherlands', label: '🇳🇱 Netherlands' },
        { value: 'United Arab Emirates', label: '🇦🇪 UAE' },
        { value: 'Saudi Arabia', label: '🇸🇦 Saudi Arabia' },
        { value: 'Japan', label: '🇯🇵 Japan' },
        { value: 'Singapore', label: '🇸🇬 Singapore' },
        { value: 'Australia', label: '🇦🇺 Australia' },
        { value: 'India', label: '🇮🇳 India' },
        { value: 'Other', label: '🌍 Other Country' }
      ],
      hint: 'Used for shipping estimates and compliance'
    },
    // Step 4: Requirements
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
    // Step 5: Optional Deep-dive
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
  
  // --- Sell Flow Steps ---
  sellSteps: [
    {
      id: 'seller_name',
      type: 'text',
      label: 'Your Name',
      placeholder: 'e.g., Amit Patel',
      required: true,
      validate: (v) => v.length >= 2 || 'Please enter your full name'
    },
    {
      id: 'seller_email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'e.g., amit@farmorganics.com',
      required: true,
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email'
    },
    {
      id: 'farm_name',
      type: 'text',
      label: 'Farm / Company Name',
      placeholder: 'e.g., Patel Organic Farms',
      required: true
    },
    {
      id: 'location',
      type: 'text',
      label: 'Farm Location (City, State, Country)',
      placeholder: 'e.g., Pune, Maharashtra, India',
      required: true
    },
    {
      id: 'annual_capacity',
      type: 'select',
      label: 'Annual Production Capacity',
      required: true,
      options: [
        { value: '', label: 'Select Capacity' },
        { value: 'under_10mt', label: 'Under 10 MT/year' },
        { value: '10_50mt', label: '10–50 MT/year' },
        { value: '50_100mt', label: '50–100 MT/year' },
        { value: '100_500mt', label: '100–500 MT/year' },
        { value: '500mt_plus', label: '500+ MT/year' }
      ]
    },
    {
      id: 'current_certs',
      type: 'multiselect',
      label: 'Current Certifications (Select All That Apply)',
      required: false,
      options: [
        { value: 'usda_organic', label: 'USDA Organic' },
        { value: 'india_organic', label: 'India Organic (NPOP)' },
        { value: 'eu_organic', label: 'EU Organic' },
        { value: 'iso_22000', label: 'ISO 22000 / HACCP' },
        { value: 'gmp', label: 'GMP Certified' },
        { value: 'non_gmo', label: 'Non-GMO' },
        { value: 'halal', label: 'Halal' },
        { value: 'kosher', label: 'Kosher' },
        { value: 'none', label: 'None Yet (We Can Help!)' }
      ]
    },
    {
      id: 'harvest_cycle',
      type: 'select',
      label: 'Harvest Cycle',
      required: true,
      options: [
        { value: '', label: 'Select Cycle' },
        { value: 'year_round', label: 'Year-Round Continuous' },
        { value: 'seasonal', label: 'Seasonal (Specify Months)' },
        { value: 'batch', label: 'Batch-Based Production' }
      ]
    },
    {
      id: 'quality_specs',
      type: 'textarea',
      label: 'Quality Parameters',
      placeholder: 'Protein %, moisture content, heavy metals, microbiological limits, pesticide residue...',
      required: false,
      hint: 'Share your latest lab report values if available'
    },
    {
      id: 'packaging',
      type: 'select',
      label: 'Current Packaging Format',
      required: false,
      options: [
        { value: '', label: 'Select Packaging' },
        { value: 'bulk_25kg', label: '25 kg Bulk Bags' },
        { value: 'super_sacks', label: '500–1000 kg Super Sacks' },
        { value: 'custom', label: 'Custom Packaging' },
        { value: 'need_support', label: 'Need Packaging Support' }
      ]
    },
    {
      id: 'seller_requirements',
      type: 'textarea',
      label: 'What Are You Looking For?',
      placeholder: 'Target price, partnership terms, logistics support, advance payment, contract duration...',
      required: false,
      hint: 'Help us understand your expectations'
    }
  ],
  
  // --- Partner Flow Steps (Distribution/Private Label) ---
  partnerSteps: [
    {
      id: 'partner_name',
      type: 'text',
      label: 'Your Name',
      placeholder: 'e.g., Sarah Johnson',
      required: true,
      validate: (v) => v.length >= 2 || 'Please enter your full name'
    },
    {
      id: 'partner_email',
      type: 'email',
      label: 'Business Email',
      placeholder: 'e.g., sarah@healthdistro.com',
      required: true,
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid business email'
    },
    {
      id: 'partner_company',
      type: 'text',
      label: 'Company Name',
      placeholder: 'e.g., Health Distribution Inc.',
      required: true
    },
    {
      id: 'partner_type',
      type: 'choice',
      label: 'Partnership Type',
      required: true,
      options: [
        { value: 'distributor', label: '📦 Regional Distributor' },
        { value: 'private_label', label: '🏷️ Private Label Partner' },
        { value: 'white_label', label: '⚪ White Label / Co-Branding' },
        { value: 'affiliate', label: '🔗 Affiliate / Referral' },
        { value: 'joint_venture', label: '🤝 Joint Venture' }
      ]
    },
    {
      id: 'target_markets',
      type: 'multiselect',
      label: 'Target Markets / Regions',
      required: true,
      options: [
        { value: 'north_america', label: '🇺🇸🇨🇦 North America' },
        { value: 'eu', label: '🇪🇺 European Union' },
        { value: 'gcc', label: '🇦🇪🇸🇦 GCC / Middle East' },
        { value: 'asia_pacific', label: '🇯🇵🇸🇬🇦🇺 Asia Pacific' },
        { value: 'africa', label: '🌍 Africa' },
        { value: 'latam', label: '🇧🇷🇲🇽 Latin America' },
        { value: 'india', label: '🇮🇳 India Domestic' },
        { value: 'global', label: '🌐 Global' }
      ]
    },
    {
      id: 'annual_volume',
      type: 'select',
      label: 'Expected Annual Volume',
      required: true,
      options: [
        { value: '', label: 'Select Volume' },
        { value: 'under_100k', label: 'Under 100K units' },
        { value: '100k_500k', label: '100K–500K units' },
        { value: '500k_1m', label: '500K–1M units' },
        { value: '1m_5m', label: '1M–5M units' },
        { value: '5m_plus', label: '5M+ units' }
      ]
    },
    {
      id: 'partner_requirements',
      type: 'textarea',
      label: 'Partnership Details',
      placeholder: 'Exclusivity, marketing support, margin expectations, co-branding requirements...',
      required: false
    }
  ],
  
  // --- Responses/Messages ---
  responses: {
    greeting: [
      "Perfect! Let's get you the right information.",
      "Great choice. I'll guide you through the process."
    ],
    askingInterest: "What type of spirulina product are you evaluating?",
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
    
    // Sell flow responses
    askingSellerName: "What's your name?",
    askingSellerEmail: "What's the best email to reach you?",
    askingFarmName: "What's your farm or company name?",
    askingLocation: "Where is your farm located (city, state, country)?",
    askingCapacity: "What's your annual production capacity?",
    askingCerts: "What certifications do you currently hold?",
    askingHarvest: "What's your harvest cycle?",
    askingQuality: "What are your quality specifications (protein %, moisture, heavy metals)?",
    askingPackaging: "How is your spirulina currently packaged?",
    askingSellerReqs: "What are you looking for in a partnership?",
    
    // Partner flow responses
    askingPartnerName: "Your name?",
    askingPartnerEmail: "Business email?",
    askingPartnerCompany: "Company name?",
    askingPartnerType: "What type of partnership interests you?",
    askingTargetMarkets: "Which markets do you serve?",
    askingAnnualVolume: "What's your expected annual volume?",
    askingPartnerReqs: "Any specific partnership requirements?",
    
    thankYou: [
      "Thank you. Your request is being processed.",
      "Received. Our team will contact you within 15 minutes during business hours."
    ],
    error: "Please check your entry and try again.",
    sampleOffer: "Would you like to start with a complimentary 100g sample? We'll ship it at no cost for quality verification.",
    sampleConfirm: "Excellent! I'll arrange the sample shipment. You'll receive tracking within 24 hours.",
    sellerThankYou: "Thank you! Our procurement team will review your details and get back to you within 24 hours with a procurement offer.",
    partnerThankYou: "Thanks! Our partnerships team will review and contact you within 48 hours to discuss next steps.",
    
    // Exit intent
    exitIntentTitle: "Before You Go — Get Our Export Catalog Free",
    exitIntentBody: "Download our complete product catalog with specifications, certifications, and volume pricing. No obligation.",
    exitIntentButton: "Get Free Catalog (PDF)",
    exitIntentSecondary: "No Thanks, Continue Browsing"
  },
  
  // --- Storage Keys ---
  storageKey: 'sg_chat_lead_v2',
  sessionKey: 'sg_chat_session_v2',
  geoCacheKey: 'sg_geo_cache',
  geoCacheTTL: 24 * 60 * 60 * 1000, // 24 hours
  
  // --- Feature Flags ---
  features: {
    exitIntent: true,
    geoPrefill: true,
    sampleOffer: true,
    analytics: true,
    whatsappIntegration: true,
    catalogDownload: true
  }
};