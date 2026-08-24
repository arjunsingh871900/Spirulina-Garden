/**
 * Spirulina Garden Chatbot - Main Entry Point
 * Modular architecture with buy/sell branching
 */

import { CONFIG } from './config.js';
import { StateManager } from './state.js';
import { UI } from './ui.js';
import { FlowManager } from './flow.js';
import { Analytics } from './analytics.js';
import { ExitIntent } from './exit-intent.js';
import { GeoResolver } from './geo.js';
import { WhatsApp } from './whatsapp.js';

// ========================================
// Main Chatbot Class
// ========================================
class SpirulinaChatBot {
  constructor() {
    this.config = CONFIG;
    this.state = new StateManager(this.config);
    this.ui = new UI(this.config, this.state);
    this.analytics = new Analytics(this.config, this.state);
    this.geo = new GeoResolver(this.config, this.state);
    this.whatsapp = new WhatsApp(this.config, this.state);
    this.exitIntent = new ExitIntent(this.config, this.state, this.analytics);
    this.flow = new FlowManager(this.config, this.state, this.ui, this.analytics, this.whatsapp);
    
    this.initialized = false;
  }

  // Initialize the chatbot
  async init() {
    if (this.initialized) return;
    
    // Load persisted state
    this.state.load();
    
    // Initialize UI (creates DOM elements)
    this.ui.init();
    
    // Bind events
    this.bindEvents();
    
    // Resolve geo location for pre-filling
    await this.geo.resolve();
    
    // Initialize exit intent tracking
    this.exitIntent.init();
    
    // Check for restored session
    if (this.state.hasData() && !this.state.hasGreeted) {
      this.ui.showNotificationBadge();
    }
    
    // Restore window state
    if (this.state.isOpen) {
      this.ui.open();
      // Resume conversation
      if (this.state.currentStep > 0 || this.state.hasGreeted) {
        this.flow.resume();
      } else {
        this.flow.start();
      }
    }
    
    this.initialized = true;
    console.log('🌿 Spirulina Garden Chatbot v2 initialized');
  }

  // Bind all event listeners
  bindEvents() {
    // FAB click
    this.ui.fab.addEventListener('click', () => this.toggle());
    
    // Header actions
    this.ui.minimizeBtn.addEventListener('click', () => this.ui.toggleMinimize());
    this.ui.closeBtn.addEventListener('click', () => this.close());
    
    // Input events
    this.ui.chatInput.addEventListener('input', () => this.ui.updateSendButton());
    this.ui.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });
    this.ui.sendBtn.addEventListener('click', () => this.handleSend());
    
    // Click outside to close
    document.addEventListener('click', (e) => {
      if (this.state.isOpen && !this.ui.window.contains(e.target) && !this.ui.fab.contains(e.target)) {
        this.close();
      }
    });
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.state.isOpen) {
        this.close();
      }
    });
    
    // Expose public API
    window.SpirulinaChatBot = this.getPublicAPI();
  }

  // Handle sending a free-text message
  handleSend() {
    const text = this.ui.chatInput.value.trim();
    if (!text) return;
    
    this.ui.chatInput.value = '';
    this.ui.chatInput.style.height = 'auto';
    this.ui.updateSendButton();
    
    this.ui.addMessage(text, true);
    this.analytics.track('free_text_message', { text: text.substring(0, 100) });
    
    // Simple AI response simulation
    setTimeout(() => {
      const responses = [
        "Thank you for the details. Let me connect you with the right information.",
        "I appreciate that. Our team will address this in the proposal.",
        "Noted. Is there anything specific about certifications or shipping you'd like to clarify?",
        "Thanks for sharing. Would you like me to prepare a formal quote?"
      ];
      this.ui.addMessage(responses[Math.floor(Math.random() * responses.length)], false);
      
      setTimeout(() => {
        this.ui.showQuickReplies([
          { text: 'Request Quote', action: 'start_form' },
          { text: 'Download Catalog', action: 'download_catalog' },
          { text: 'Chat on WhatsApp', action: 'whatsapp' }
        ]);
      }, 500);
    }, 600);
  }

  // Toggle chat open/closed
  toggle() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // Open chat window
  open() {
    this.ui.open();
    this.state.isOpen = true;
    this.state.saveSession();
    this.analytics.track('chat_opened_manual');
    
    if (!this.state.hasGreeted) {
      this.flow.start();
    } else if (this.state.currentStep > 0) {
      this.flow.resume();
    }
  }

  // Close chat window
  close() {
    this.ui.close();
    this.state.isOpen = false;
    this.state.isMinimized = false;
    this.state.saveSession();
  }

  // Get public API for external access
  getPublicAPI() {
    return {
      open: () => this.open(),
      close: () => this.close(),
      toggle: () => this.toggle(),
      getLeadData: () => this.state.leadData,
      downloadCatalog: () => this.flow.downloadCatalog(),
      reset: () => this.state.reset(),
      // For testing/debugging
      _state: this.state,
      _ui: this.ui,
      _flow: this.flow
    };
  }
}

// ========================================
// Auto-initialize on DOM ready
// ========================================
const bot = new SpirulinaChatBot();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bot.init());
} else {
  bot.init();
}

// Export for module usage
export { SpirulinaChatBot };