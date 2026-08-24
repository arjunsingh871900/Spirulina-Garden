/**
 * Spirulina Garden Chatbot - Analytics Module
 * Tracks events for GA4, GTM, and internal analytics
 */

export class Analytics {
  constructor(config, state) {
    this.config = config;
    this.state = state;
    this.sessionId = state.sessionStart;
  }

  // Track an event
  track(eventName, properties = {}) {
    if (!this.config.features.analytics) return;
    
    const eventData = {
      event: eventName,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      engagementScore: this.state.engagementScore,
      currentStep: this.state.currentStep,
      currentFlow: this.state.currentFlow,
      ...properties
    };
    
    // Console for debugging
    console.log('[Chat Bot Analytics]', eventData);
    
    // Send to data layer for GA4/GTM
    if (window.dataLayer) {
      window.dataLayer.push(eventData);
    }
    
    // Custom event for internal tracking
    window.dispatchEvent(new CustomEvent('sg_chat_event', { detail: eventData }));
    
    // Send to external analytics endpoint (if configured)
    this.sendToEndpoint(eventData);
  }

  // Send to external analytics endpoint
  async sendToEndpoint(eventData) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        keepalive: true
      });
    } catch (e) {
      // Silently fail - analytics shouldn't break the app
    }
  }

  // Track page view (for SPA navigation within chat)
  trackPageView(pageName) {
    this.track('page_view', { page: pageName });
  }

  // Track conversion
  trackConversion(conversionType, value = 0) {
    this.track('conversion', { 
      conversionType, 
      value,
      currency: 'INR'
    });
  }

  // Track error
  trackError(error, context = {}) {
    this.track('error', {
      message: error.message || String(error),
      stack: error.stack,
      ...context
    });
  }

  // Track timing
  trackTiming(category, variable, timeMs) {
    this.track('timing', { category, variable, timeMs });
  }

  // Get session summary
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      duration: Date.now() - this.sessionId,
      engagementScore: this.state.engagementScore,
      stepsCompleted: this.state.currentStep,
      flow: this.state.currentFlow,
      hasLeadData: this.state.hasData(),
      leadDataKeys: Object.keys(this.state.leadData)
    };
  }
}