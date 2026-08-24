/**
 * Spirulina Garden Chatbot - UI Module
 * Handles all DOM manipulation, rendering, and user interactions
 */

export class UI {
  constructor(config, state) {
    this.config = config;
    this.state = state;
    
    // DOM references (populated after init)
    this.fab = null;
    this.window = null;
    this.messagesContainer = null;
    this.chatInput = null;
    this.sendBtn = null;
    this.minimizeBtn = null;
    this.closeBtn = null;
    this.quickRepliesContainer = null;
    this.formStepContainer = null;
    this.typingIndicator = null;
    this.inputWrapper = null;
    this.notificationBadge = null;
    this.fabIcon = null;
    this.fabCloseIcon = null;
    
    // Templates
    this.templates = {};
  }

  // Initialize UI - create and inject DOM
  init() {
    this.createStyles();
    this.createDOM();
    this.cacheElements();
    this.applyStoredState();
  }

  // Inject CSS
  createStyles() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'chatbot/css/chatbot.css';
    document.head.appendChild(link);
  }

  // Create all DOM elements
  createDOM() {
    // Create FAB
    this.fab = document.createElement('button');
    this.fab.id = 'sg-chatbot-fab';
    this.fab.setAttribute('aria-label', `Open chat with ${this.config.botName} from ${this.config.companyName}`);
    this.fab.setAttribute('aria-expanded', 'false');
    this.fab.setAttribute('data-state', 'closed');
    this.fab.innerHTML = `
      <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
      <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      <span class="notification-badge" id="sgNotificationBadge" style="display:none;">1</span>
    `;

    // Create Chat Window
    this.window = document.createElement('div');
    this.window.id = 'sg-chatbot-window';
    this.window.setAttribute('role', 'dialog');
    this.window.setAttribute('aria-label', `Chat with ${this.config.botName}`);
    this.window.setAttribute('aria-modal', 'true');
    this.window.setAttribute('data-state', 'closed');
    this.window.innerHTML = this.getWindowHTML();

    // Create Exit Intent Overlay
    this.exitOverlay = document.createElement('div');
    this.exitOverlay.id = 'sg-exit-overlay';
    this.exitOverlay.setAttribute('data-visible', 'false');
    this.exitOverlay.innerHTML = this.getExitIntentHTML();

    // Append to body
    document.body.appendChild(this.fab);
    document.body.appendChild(this.window);
    document.body.appendChild(this.exitOverlay);
  }

  // Get chat window HTML
  getWindowHTML() {
    return `
      <header class="sg-chat-header">
        <div class="sg-chat-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <circle cx="12" cy="8" r="5"/>
            <path d="M20 21a8 8 0 0 0-16 0"/>
          </svg>
        </div>
        <div class="sg-chat-title">
          <h3>${this.config.botName} — ${this.config.companyTagline}</h3>
          <span class="sg-chat-subtitle">
            <span class="sg-status-dot" aria-hidden="true"></span>
            <span>Online • Typically replies in minutes</span>
          </span>
        </div>
        <div class="sg-chat-actions">
          <button class="sg-chat-action-btn" id="sgMinimizeBtn" aria-label="Minimize chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <button class="sg-chat-action-btn" id="sgCloseBtn" aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </header>
      <div class="sg-chat-messages" id="sgChatMessages" role="log" aria-live="polite" aria-label="Conversation"></div>
      <div class="sg-chat-input-area" id="sgChatInputArea">
        <div class="sg-quick-replies" id="sgQuickReplies"></div>
        <div class="sg-form-step" id="sgFormStep" style="display:none;"></div>
        <div class="sg-typing" id="sgTypingIndicator" style="display:none;">
          <div class="sg-typing-dot"></div>
          <div class="sg-typing-dot"></div>
          <div class="sg-typing-dot"></div>
        </div>
        <div class="sg-input-wrapper" id="sgInputWrapper">
          <textarea class="sg-chat-input" id="sgChatInput" placeholder="Type your message..." rows="1" aria-label="Your message"></textarea>
          <button class="sg-send-btn" id="sgSendBtn" aria-label="Send message" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  // Get exit intent overlay HTML
  getExitIntentHTML() {
    return `
      <div class="sg-exit-popup">
        <div class="sg-exit-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <h2>${this.config.responses.exitIntentTitle}</h2>
        <p>${this.config.responses.exitIntentBody}</p>
        <div class="sg-exit-actions">
          <button class="sg-btn sg-btn--primary" id="sgExitDownload">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            ${this.config.responses.exitIntentButton}
          </button>
          <button class="sg-btn sg-btn--secondary" id="sgExitDismiss">${this.config.responses.exitIntentSecondary}</button>
        </div>
      </div>
    `;
  }

  // Cache DOM element references
  cacheElements() {
    this.messagesContainer = document.getElementById('sgChatMessages');
    this.chatInput = document.getElementById('sgChatInput');
    this.sendBtn = document.getElementById('sgSendBtn');
    this.minimizeBtn = document.getElementById('sgMinimizeBtn');
    this.closeBtn = document.getElementById('sgCloseBtn');
    this.quickRepliesContainer = document.getElementById('sgQuickReplies');
    this.formStepContainer = document.getElementById('sgFormStep');
    this.typingIndicator = document.getElementById('sgTypingIndicator');
    this.inputWrapper = document.getElementById('sgInputWrapper');
    this.notificationBadge = document.getElementById('sgNotificationBadge');
    this.fabIcon = this.fab.querySelector('.chat-icon');
    this.fabCloseIcon = this.fab.querySelector('.close-icon');
    this.exitDownloadBtn = document.getElementById('sgExitDownload');
    this.exitDismissBtn = document.getElementById('sgExitDismiss');
  }

  // Apply stored state (minimized, etc.)
  applyStoredState() {
    if (this.state.isMinimized) {
      this.window.classList.add('minimized');
      this.window.setAttribute('data-state', 'minimized');
    }
  }

  // ========================================
  // Window State Methods
  // ========================================
  open() {
    this.window.classList.add('open');
    this.window.setAttribute('data-state', 'open');
    this.fab.setAttribute('data-state', 'open');
    this.fab.setAttribute('aria-expanded', 'true');
    this.chatInput.focus();
    this.scrollToBottom();
  }

  close() {
    this.window.classList.remove('open', 'minimized');
    this.window.setAttribute('data-state', 'closed');
    this.fab.setAttribute('data-state', 'closed');
    this.fab.setAttribute('aria-expanded', 'false');
  }

  toggleMinimize() {
    this.state.isMinimized = !this.state.isMinimized;
    this.window.classList.toggle('minimized', this.state.isMinimized);
    this.window.setAttribute('data-state', this.state.isMinimized ? 'minimized' : 'open');
    this.state.saveSession();
  }

  // ========================================
  // Message Methods
  // ========================================
  addMessage(text, isUser = false, options = {}) {
    const div = document.createElement('div');
    div.className = `sg-message ${isUser ? 'sg-message--user' : 'sg-message--bot'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const avatarSVG = isUser 
      ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
      : '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>';
    
    div.innerHTML = `
      <div class="sg-message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${avatarSVG}</svg></div>
      <div class="sg-message-content"><div class="sg-message-text">${text}</div><div class="sg-message-time">${time}</div></div>
    `;
    
    this.messagesContainer.appendChild(div);
    this.scrollToBottom();
    
    this.state.messages.push({ text, isUser, time, ...options });
    return div;
  }

  // Add a message with HTML content (for rich messages)
  addHTMLMessage(html, isUser = false) {
    const div = document.createElement('div');
    div.className = `sg-message ${isUser ? 'sg-message--user' : 'sg-message--bot'}`;
    
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const avatarSVG = isUser 
      ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
      : '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>';
    
    div.innerHTML = `
      <div class="sg-message-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${avatarSVG}</svg></div>
      <div class="sg-message-content">${html}<div class="sg-message-time">${time}</div></div>
    `;
    
    this.messagesContainer.appendChild(div);
    this.scrollToBottom();
    return div;
  }

  showTyping() {
    this.typingIndicator.style.display = 'flex';
    this.scrollToBottom();
  }

  hideTyping() {
    this.typingIndicator.style.display = 'none';
  }

  // ========================================
  // Quick Replies
  // ========================================
  showQuickReplies(replies) {
    this.quickRepliesContainer.innerHTML = '';
    
    replies.forEach(reply => {
      const btn = document.createElement('button');
      btn.className = 'sg-quick-reply';
      btn.textContent = reply.text;
      btn.dataset.action = reply.action;
      btn.addEventListener('click', () => this.handleQuickReply(reply));
      this.quickRepliesContainer.appendChild(btn);
    });
  }

  hideQuickReplies() {
    this.quickRepliesContainer.innerHTML = '';
  }

  handleQuickReply(reply) {
    this.hideQuickReplies();
    this.addMessage(reply.text, true);
    
    // Emit custom event for flow manager to handle
    this.window.dispatchEvent(new CustomEvent('sg:quickReply', { 
      detail: { action: reply.action, text: reply.text } 
    }));
  }

  // ========================================
  // Form Step Rendering
  // ========================================
  renderStep(step) {
    this.formStepContainer.style.display = 'block';
    this.inputWrapper.style.display = 'none';
    this.hideQuickReplies();
    
    const steps = this.state.getCurrentSteps();
    const totalSteps = steps.length;
    const currentIndex = this.state.currentStep;
    
    // Progress indicator
    let progressHtml = '<div class="sg-progress">';
    steps.forEach((s, i) => {
      let cls = 'sg-progress-dot';
      if (i < currentIndex) cls += ' sg-progress-dot--completed';
      else if (i === currentIndex) cls += ' sg-progress-dot--active';
      progressHtml += `<div class="${cls}"></div>`;
    });
    progressHtml += '</div>';
    
    // Input HTML based on type
    const value = this.state.leadData[step.id] || '';
    let inputHtml = '';
    
    switch (step.type) {
      case 'choice':
        inputHtml = '<div class="sg-choice-options">';
        step.options.forEach(opt => {
          const selected = value === opt.value ? 'sg-choice-btn--selected' : '';
          inputHtml += `<button class="sg-choice-btn ${selected}" data-value="${this.escapeHtml(opt.value)}">${this.escapeHtml(opt.label)}</button>`;
        });
        inputHtml += '</div>';
        break;
        
      case 'select':
        inputHtml = `<select class="sg-form-select" id="sgFormField" ${step.required ? 'required' : ''}>`;
        step.options.forEach(opt => {
          inputHtml += `<option value="${this.escapeHtml(opt.value)}" ${value === opt.value ? 'selected' : ''}>${this.escapeHtml(opt.label)}</option>`;
        });
        inputHtml += '</select>';
        break;
        
      case 'multiselect':
        inputHtml = '<div class="sg-multiselect-options" id="sgMultiselectContainer">';
        const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);
        step.options.forEach(opt => {
          const selected = selectedValues.includes(opt.value) ? 'sg-multiselect-option--selected' : '';
          inputHtml += `<button class="sg-multiselect-option ${selected}" data-value="${this.escapeHtml(opt.value)}" type="button">${this.escapeHtml(opt.label)}</button>`;
        });
        inputHtml += '</div><input type="hidden" id="sgFormField" name="${step.id}">';
        break;
        
      case 'textarea':
        inputHtml = `<textarea class="sg-form-textarea" id="sgFormField" placeholder="${this.escapeHtml(step.placeholder || '')}" ${step.required ? 'required' : ''}>${this.escapeHtml(value)}</textarea>`;
        break;
        
      default:
        inputHtml = `<input type="${step.type}" class="sg-form-input" id="sgFormField" placeholder="${this.escapeHtml(step.placeholder || '')}" value="${this.escapeHtml(value)}" ${step.required ? 'required' : ''}>`;
    }
    
    // Required indicator
    const requiredHtml = step.required ? '<span class="required" aria-hidden="true">*</span>' : '';
    
    this.formStepContainer.innerHTML = `
      ${progressHtml}
      <label class="sg-form-label" for="sgFormField">${this.escapeHtml(step.label)} ${requiredHtml}</label>
      ${inputHtml}
      ${step.hint ? `<div class="sg-form-hint">${this.escapeHtml(step.hint)}</div>` : ''}
      <div class="sg-form-error" id="sgFormError"></div>
    `;
    
    // Bind events
    this.bindFormEvents(step);
    
    // Focus input
    setTimeout(() => {
      const input = document.getElementById('sgFormField');
      if (input) input.focus();
    }, 50);
  }

  bindFormEvents(step) {
    const input = document.getElementById('sgFormField');
    const errorEl = document.getElementById('sgFormError');
    
    if (input) {
      input.addEventListener('input', () => errorEl.classList.remove('sg-form-error--visible'));
      
      if (step.type !== 'textarea' && step.type !== 'multiselect') {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.window.dispatchEvent(new CustomEvent('sg:formSubmit', { detail: { step } }));
          }
        });
      }
    }
    
    // Choice buttons
    document.querySelectorAll('.sg-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sg-choice-btn').forEach(b => b.classList.remove('sg-choice-btn--selected'));
        btn.classList.add('sg-choice-btn--selected');
        this.state.setData(step.id, btn.dataset.value);
        setTimeout(() => {
          this.window.dispatchEvent(new CustomEvent('sg:formSubmit', { detail: { step } }));
        }, 100);
      });
    });
    
    // Multiselect options
    document.querySelectorAll('.sg-multiselect-option').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('sg-multiselect-option--selected');
        const container = document.getElementById('sgMultiselectContainer');
        const selected = Array.from(container.querySelectorAll('.sg-multiselect-option--selected')).map(b => b.dataset.value);
        this.state.setData(step.id, selected);
        document.getElementById('sgFormField').value = JSON.stringify(selected);
      });
    });
  }

  hideFormStep() {
    this.formStepContainer.style.display = 'none';
    this.inputWrapper.style.display = 'flex';
  }

  // ========================================
  // Completion Screen
  // ========================================
  showCompletion() {
    this.hideFormStep();
    this.hideQuickReplies();
    this.inputWrapper.style.display = 'none';
    
    const data = this.state.leadData;
    const timeline = data.timeline;
    const urgencyNote = timeline === 'asap' ? ' We\'ve flagged this as urgent.' : '';
    
    const whatsappMsg = this.createWhatsAppMessage(data);
    const whatsappUrl = `https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`;
    
    const html = `
      <div class="sg-completion">
        <div class="sg-completion-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3>Request Submitted</h3>
        <p>Thank you, ${data.name || data.seller_name || data.partner_name || 'there'}. Your inquiry has been received.${urgencyNote} Our team will contact you at ${data.email || data.seller_email || data.partner_email} within 15 minutes during business hours.</p>
        <div class="sg-completion-actions">
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="sg-btn sg-btn--primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            Continue on WhatsApp
          </a>
          <button class="sg-btn sg-btn--secondary" onclick="window.SpirulinaChatBot.downloadCatalog()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download Catalog
          </button>
        </div>
      </div>
    `;
    
    this.addHTMLMessage(html, false);
  }

  // ========================================
  // Sample Card
  // ========================================
  showSampleCard() {
    const html = `
      <div class="sg-sample-card">
        <h4>🎁 Free Quality Sample</h4>
        <p>We'd love to send you a complimentary 100g sample of our premium organic spirulina powder. No cost, no obligation — just quality verification.</p>
        <div class="sg-sample-actions">
          <button class="sg-btn sg-btn--primary" data-action="request_sample">Yes, Send Free Sample</button>
          <button class="sg-btn sg-btn--secondary" data-action="skip_sample">No, Proceed to Quote</button>
        </div>
      </div>
    `;
    
    this.addHTMLMessage(html, false);
    
    // Bind sample card buttons
    this.messagesContainer.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.window.dispatchEvent(new CustomEvent('sg:sampleAction', { 
          detail: { action: e.target.dataset.action } 
        }));
      });
    });
  }

  // ========================================
  // Input Handling
  // ========================================
  updateSendButton() {
    const hasText = this.chatInput.value.trim().length > 0;
    this.sendBtn.disabled = !hasText;
    
    // Auto-resize textarea
    this.chatInput.style.height = 'auto';
    this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 130) + 'px';
  }

  // ========================================
  // Notification Badge
  // ========================================
  showNotificationBadge() {
    this.notificationBadge.style.display = 'flex';
  }

  hideNotificationBadge() {
    this.notificationBadge.style.display = 'none';
  }

  // ========================================
  // Exit Intent
  // ========================================
  showExitIntent() {
    this.exitOverlay.setAttribute('data-visible', 'true');
    document.body.style.overflow = 'hidden';
  }

  hideExitIntent() {
    this.exitOverlay.setAttribute('data-visible', 'false');
    document.body.style.overflow = '';
  }

  // ========================================
  // Utilities
  // ========================================
  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  createWhatsAppMessage(data) {
    const flow = this.state.currentFlow;
    let msg = `*NEW LEAD - SPIRULINA GARDEN*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (flow === 'sell') {
      msg += `*SELLER INQUIRY*\n`;
      msg += `Name: ${data.seller_name || '—'}\n`;
      msg += `Email: ${data.seller_email || '—'}\n`;
      msg += `Farm/Company: ${data.farm_name || '—'}\n`;
      msg += `Location: ${data.location || '—'}\n`;
      msg += `Annual Capacity: ${data.annual_capacity || '—'}\n`;
      msg += `Certifications: ${Array.isArray(data.current_certs) ? data.current_certs.join(', ') : (data.current_certs || '—')}\n`;
      msg += `Harvest Cycle: ${data.harvest_cycle || '—'}\n`;
      msg += `Quality Specs: ${data.quality_specs || '—'}\n`;
      msg += `Packaging: ${data.packaging || '—'}\n`;
      msg += `Requirements: ${data.seller_requirements || '—'}\n`;
    } else if (flow === 'partner') {
      msg += `*PARTNERSHIP INQUIRY*\n`;
      msg += `Name: ${data.partner_name || '—'}\n`;
      msg += `Email: ${data.partner_email || '—'}\n`;
      msg += `Company: ${data.partner_company || '—'}\n`;
      msg += `Type: ${data.partner_type || '—'}\n`;
      msg += `Target Markets: ${Array.isArray(data.target_markets) ? data.target_markets.join(', ') : (data.target_markets || '—')}\n`;
      msg += `Annual Volume: ${data.annual_volume || '—'}\n`;
      msg += `Requirements: ${data.partner_requirements || '—'}\n`;
    } else {
      msg += `*BUYER INQUIRY*\n`;
      msg += `Name: ${data.name || '—'}\n`;
      msg += `Email: ${data.email || '—'}\n`;
      msg += `Company: ${data.company || '—'}\n`;
      msg += `Country: ${data.country || '—'}\n`;
      msg += `Interest: ${data.interest || '—'}\n`;
      msg += `Product: ${data.product || '—'}\n`;
      msg += `Volume: ${data.volume || '—'}\n`;
      msg += `Timeline: ${data.timeline || '—'}\n`;
      msg += `Certifications: ${Array.isArray(data.certifications) ? data.certifications.join(', ') : (data.certifications || '—')}\n`;
      msg += `Shipping: ${data.shipping_terms || '—'}\n`;
      msg += `Notes: ${data.requirements || '—'}\n`;
    }
    
    msg += `\n━━━━━━━━━━━━━━━━━━━━\nSubmitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\nSource: Chat Bot (spirulinagarden.com)`;
    
    return msg;
  }
}