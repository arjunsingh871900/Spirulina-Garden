/**
 * Spirulina Garden Chatbot - Flow Manager
 * Handles conversation flow, branching logic, and step progression
 */

export class FlowManager {
  constructor(config, state, ui, analytics, whatsapp) {
    this.config = config;
    this.state = state;
    this.ui = ui;
    this.analytics = analytics;
    this.whatsapp = whatsapp;
    
    // Bind event listeners
    this.bindEvents();
  }

  bindEvents() {
    // Form submission
    this.ui.window.addEventListener('sg:formSubmit', (e) => this.handleFormSubmit(e.detail.step));
    
    // Quick replies
    this.ui.window.addEventListener('sg:quickReply', (e) => this.handleQuickReply(e.detail));
    
    // Sample actions
    this.ui.window.addEventListener('sg:sampleAction', (e) => this.handleSampleAction(e.detail.action));
  }

  // Start new conversation
  start() {
    this.state.setGreeted();
    this.analytics.track('chat_opened');
    
    // Show welcome message
    this.ui.addMessage(this.config.welcomeMessage, false);
    
    // Show initial choice: Buy/Sell/Partner
    setTimeout(() => {
      this.showInitialChoice();
    }, 600);
  }

  // Resume existing conversation
  resume() {
    const step = this.state.getCurrentStepConfig();
    if (step) {
      this.ui.addMessage(this.getContextualMessage(step), false);
      this.ui.renderStep(step);
    } else {
      this.showCompletion();
    }
  }

  // Show initial Buy/Sell/Partner choice
  showInitialChoice() {
    const html = `
      <div class="sg-choice-options" style="grid-template-columns: 1fr;">
        <button class="sg-choice-btn" data-flow="buy" style="padding: var(--space-4);">
          <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🛒</div>
          <strong>Buy Spirulina</strong><br>
          <span style="font-size: var(--font-size-xs); opacity: 0.7;">I'm an importer, distributor, or business looking to purchase</span>
        </button>
        <button class="sg-choice-btn" data-flow="sell" style="padding: var(--space-4);">
          <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🌱</div>
          <strong>Sell Spirulina</strong><br>
          <span style="font-size: var(--font-size-xs); opacity: 0.7;">I'm a farmer/producer looking to sell my harvest</span>
        </button>
        <button class="sg-choice-btn" data-flow="partner" style="padding: var(--space-4);">
          <div style="font-size: 1.5rem; margin-bottom: var(--space-2);">🤝</div>
          <strong>Partnership</strong><br>
          <span style="font-size: var(--font-size-xs); opacity: 0.7;">Distribution, private label, or joint venture</span>
        </button>
      </div>
    `;
    
    this.ui.addHTMLMessage(html, false);
    
    // Bind click events
    this.ui.messagesContainer.querySelectorAll('[data-flow]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const flow = e.currentTarget.dataset.flow;
        this.selectFlow(flow);
      });
    });
  }

  // Handle flow selection
  selectFlow(flow) {
    this.state.switchFlow(flow);
    this.analytics.track('flow_selected', { flow });
    
    // Add user message
    const flowLabels = { buy: 'Buy Spirulina', sell: 'Sell Spirulina', partner: 'Partnership' };
    this.ui.addMessage(flowLabels[flow], true);
    
    // Acknowledge and start first step
    setTimeout(() => {
      const ackMessages = this.config.responses.greeting;
      const message = ackMessages[Math.floor(Math.random() * ackMessages.length)];
      this.ui.addMessage(message, false);
      
      setTimeout(() => {
        this.askForStep(0);
      }, 400);
    }, 300);
  }

  // Ask for a specific step
  askForStep(stepIndex) {
    const steps = this.state.getCurrentSteps();
    if (stepIndex >= steps.length) {
      this.showCompletion();
      return;
    }
    
    this.state.currentStep = stepIndex;
    this.state.flowSteps[this.state.currentFlow] = stepIndex;
    this.state.save();
    
    const step = steps[stepIndex];
    const message = this.getContextualMessage(step);
    
    this.ui.showTyping();
    setTimeout(() => {
      this.ui.hideTyping();
      this.ui.addMessage(message, false);
      this.ui.renderStep(step);
      this.analytics.track('step_shown', { 
        flow: this.state.currentFlow, 
        step: step.id, 
        stepIndex 
      });
    }, 500);
  }

  // Get contextual message for a step
  getContextualMessage(step) {
    const responses = this.config.responses;
    const flow = this.state.currentFlow;
    
    // Flow-specific messages
    if (flow === 'sell') {
      const sellMessages = {
        'seller_name': responses.askingSellerName,
        'seller_email': responses.askingSellerEmail,
        'farm_name': responses.askingFarmName,
        'location': responses.askingLocation,
        'annual_capacity': responses.askingCapacity,
        'current_certs': responses.askingCerts,
        'harvest_cycle': responses.askingHarvest,
        'quality_specs': responses.askingQuality,
        'packaging': responses.askingPackaging,
        'seller_requirements': responses.askingSellerReqs
      };
      return sellMessages[step.id] || step.label;
    }
    
    if (flow === 'partner') {
      const partnerMessages = {
        'partner_name': responses.askingPartnerName,
        'partner_email': responses.askingPartnerEmail,
        'partner_company': responses.askingPartnerCompany,
        'partner_type': responses.askingPartnerType,
        'target_markets': responses.askingTargetMarkets,
        'annual_volume': responses.askingAnnualVolume,
        'partner_requirements': responses.askingPartnerReqs
      };
      return partnerMessages[step.id] || step.label;
    }
    
    // Buy flow messages (default)
    const buyMessages = {
      'interest': responses.askingInterest,
      'name': responses.askingName,
      'email': responses.askingEmail,
      'company': responses.askingCompany,
      'country': responses.askingCountry,
      'product': responses.askingProduct,
      'volume': responses.askingVolume,
      'timeline': responses.askingTimeline,
      'certifications': responses.askingCertifications,
      'shipping_terms': responses.askingShipping,
      'requirements': responses.askingRequirements
    };
    
    return buyMessages[step.id] || step.label;
  }

  // Handle form submission
  handleFormSubmit(step) {
    const input = document.getElementById('sgFormField');
    let value = '';
    
    if (step.type === 'multiselect') {
      value = input.value ? JSON.parse(input.value) : [];
    } else {
      value = input ? input.value.trim() : '';
    }
    
    // Validation
    if (step.required && (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value))) {
      const errorEl = document.getElementById('sgFormError');
      errorEl.textContent = this.config.responses.error;
      errorEl.classList.add('sg-form-error--visible');
      input?.focus();
      return;
    }
    
    if (step.validate && !step.validate(value)) {
      const errorEl = document.getElementById('sgFormError');
      errorEl.textContent = step.validate(value);
      errorEl.classList.add('sg-form-error--visible');
      input?.focus();
      return;
    }
    
    // Save data
    this.state.setData(step.id, value);
    this.analytics.track('step_completed', { 
      flow: this.state.currentFlow, 
      step: step.id, 
      value: typeof value === 'string' ? value.substring(0, 50) : JSON.stringify(value) 
    });
    
    // Add user message
    this.ui.hideFormStep();
    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    this.ui.addMessage(displayValue || '(skipped)', true);
    
    // Handle special cases
    if (step.id === 'interest' && value === 'sample') {
      this.handleSampleRequest();
      return;
    }
    
    // Acknowledge and continue
    const ackMessages = this.getThankYouMessage(step.id);
    const message = ackMessages[Math.floor(Math.random() * ackMessages.length)];
    
    this.ui.showTyping();
    setTimeout(() => {
      this.ui.hideTyping();
      this.ui.addMessage(message, false);
      
      // Check for sample offer after volume selection
      if (step.id === 'volume' && (value === 'sample' || value === 'trial')) {
        setTimeout(() => this.offerSample(), 800);
      } else {
        setTimeout(() => this.askForStep(this.state.currentStep + 1), 600);
      }
    }, 400);
  }

  // Get appropriate thank you message
  getThankYouMessage(stepId) {
    const flow = this.state.currentFlow;
    
    if (flow === 'sell') {
      return [this.config.responses.sellerThankYou];
    }
    if (flow === 'partner') {
      return [this.config.responses.partnerThankYou];
    }
    return this.config.responses.thankYou;
  }

  // Offer free sample
  offerSample() {
    this.ui.showSampleCard();
  }

  // Handle sample request
  handleSampleRequest() {
    this.state.setData('sampleRequested', true);
    this.analytics.track('sample_requested');
    
    this.ui.showTyping();
    setTimeout(() => {
      this.ui.hideTyping();
      this.ui.addMessage(this.config.responses.sampleConfirm, false);
      setTimeout(() => this.askForStep(this.state.currentStep + 1), 800);
    }, 400);
  }

  // Handle sample card actions
  handleSampleAction(action) {
    if (action === 'request_sample') {
      this.handleSampleRequest();
    } else if (action === 'skip_sample') {
      this.askForStep(this.state.currentStep + 1);
    }
  }

  // Handle quick replies
  handleQuickReply(detail) {
    const { action } = detail;
    this.analytics.track('quick_reply', { action });
    
    switch (action) {
      case 'start_form':
        this.askForStep(0);
        break;
      case 'download_catalog':
        this.downloadCatalog();
        break;
      case 'whatsapp':
        this.whatsapp.open();
        break;
      case 'products':
        window.location.href = 'products.html';
        break;
    }
  }

  // Show completion screen
  showCompletion() {
    this.ui.showCompletion();
    this.whatsapp.send();
    this.sendToEmail();
    this.analytics.track('lead_completed', { 
      flow: this.state.currentFlow, 
      leadData: this.state.getSubmissionData() 
    });
    
    // Reset after delay
    setTimeout(() => {
      this.state.currentStep = 0;
      this.state.hasGreeted = false;
      this.state.save();
    }, 8000);
  }

  // Download catalog
  downloadCatalog() {
    this.analytics.track('catalog_downloaded', { flow: this.state.currentFlow });
    
    const catalogContent = this.generateCatalogContent();
    const blob = new Blob([catalogContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Spirulina_Garden_Export_Catalog.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Generate catalog PDF content
  generateCatalogContent() {
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
<< /Length 1200 >>
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

  // Send lead to email/webhook
  async sendToEmail() {
    try {
      const response = await fetch('/api/lead-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...this.state.leadData, 
          flow: this.state.currentFlow,
          source: 'chat_bot_v2' 
        })
      });
      const result = await response.json();
      if (result.success) {
        console.log('✅ Lead sent to email/CRM:', result.leadId);
      }
    } catch (e) {
      console.warn('Email API unavailable:', e);
    }
    
    // Store locally as backup
    this.storeLeadLocally();
  }

  storeLeadLocally() {
    try {
      const leads = JSON.parse(localStorage.getItem('spirulina_leads') || '[]');
      leads.push({ 
        data: this.state.getSubmissionData(), 
        timestamp: new Date().toISOString() 
      });
      if (leads.length > 50) leads.shift();
      localStorage.setItem('spirulina_leads', JSON.stringify(leads));
    } catch (e) {}
  }
}