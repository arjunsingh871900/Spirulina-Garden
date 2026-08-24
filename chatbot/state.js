/**
 * Spirulina Garden Chatbot - State Management
 * Handles persistence, session management, and state transitions
 */

export class StateManager {
  constructor(config) {
    this.config = config;
    
    // Core state
    this.isOpen = false;
    this.isMinimized = false;
    this.currentStep = 0;
    this.currentFlow = 'buy'; // 'buy' | 'sell' | 'partner'
    this.leadData = {};
    this.messages = [];
    this.hasGreeted = false;
    this.isSubmitting = false;
    this.sessionStart = Date.now();
    this.engagementScore = 0;
    this.exitIntentShown = false;
    this.geoResolved = false;
    
    // Flow-specific step tracking
    this.flowSteps = {
      buy: 0,
      sell: 0,
      partner: 0
    };
  }

  // Load state from localStorage
  load() {
    try {
      // Load lead data
      const saved = localStorage.getItem(this.config.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.leadData = parsed.leadData || {};
        this.currentStep = parsed.currentStep || 0;
        this.hasGreeted = parsed.hasGreeted || false;
        this.currentFlow = parsed.currentFlow || 'buy';
        this.flowSteps = parsed.flowSteps || { buy: 0, sell: 0, partner: 0 };
        this.engagementScore = parsed.engagementScore || 0;
      }
      
      // Load session state
      const session = localStorage.getItem(this.config.sessionKey);
      if (session) {
        const parsed = JSON.parse(session);
        this.isOpen = parsed.isOpen || false;
        this.isMinimized = parsed.isMinimized || false;
      }
    } catch (e) {
      console.warn('Chat bot: Could not load saved state', e);
    }
  }

  // Save lead data and progress
  save() {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify({
        leadData: this.leadData,
        currentStep: this.currentStep,
        hasGreeted: this.hasGreeted,
        currentFlow: this.currentFlow,
        flowSteps: this.flowSteps,
        engagementScore: this.engagementScore,
        updatedAt: Date.now()
      }));
    } catch (e) {
      console.warn('Chat bot: Could not save state', e);
    }
  }

  // Save session state (open/minimized)
  saveSession() {
    try {
      localStorage.setItem(this.config.sessionKey, JSON.stringify({
        isOpen: this.isOpen,
        isMinimized: this.isMinimized
      }));
    } catch (e) {
      console.warn('Chat bot: Could not save session', e);
    }
  }

  // Save all state
  saveAll() {
    this.save();
    this.saveSession();
  }

  // Check if we have any lead data
  hasData() {
    return Object.keys(this.leadData).length > 0;
  }

  // Check if a specific flow has data
  hasFlowData(flow) {
    const flowPrefix = flow === 'buy' ? '' : `${flow}_`;
    return Object.keys(this.leadData).some(key => 
      key.startsWith(flowPrefix) || 
      ['interest', 'name', 'email', 'company', 'country', 'product', 'volume', 'timeline'].includes(key)
    );
  }

  // Get current flow steps
  getCurrentSteps() {
    switch (this.currentFlow) {
      case 'sell': return this.config.sellSteps;
      case 'partner': return this.config.partnerSteps;
      default: return this.config.buySteps;
    }
  }

  // Get current step config
  getCurrentStepConfig() {
    const steps = this.getCurrentSteps();
    return steps[this.currentStep];
  }

  // Advance to next step
  nextStep() {
    const steps = this.getCurrentSteps();
    if (this.currentStep < steps.length - 1) {
      this.currentStep++;
      this.flowSteps[this.currentFlow] = this.currentStep;
      this.save();
      return true;
    }
    return false;
  }

  // Go to specific step
  goToStep(stepIndex) {
    const steps = this.getCurrentSteps();
    if (stepIndex >= 0 && stepIndex < steps.length) {
      this.currentStep = stepIndex;
      this.flowSteps[this.currentFlow] = stepIndex;
      this.save();
      return true;
    }
    return false;
  }

  // Switch flow
  switchFlow(flow) {
    if (['buy', 'sell', 'partner'].includes(flow)) {
      this.currentFlow = flow;
      this.currentStep = this.flowSteps[flow] || 0;
      this.save();
      return true;
    }
    return false;
  }

  // Update lead data
  setData(key, value) {
    this.leadData[key] = value;
    this.save();
  }

  // Get lead data
  getData(key) {
    return this.leadData[key];
  }

  // Increment engagement score
  incrementEngagement(points = 1) {
    this.engagementScore += points;
    this.save();
  }

  // Reset all state
  reset() {
    this.isOpen = false;
    this.isMinimized = false;
    this.currentStep = 0;
    this.currentFlow = 'buy';
    this.leadData = {};
    this.messages = [];
    this.hasGreeted = false;
    this.isSubmitting = false;
    this.engagementScore = 0;
    this.exitIntentShown = false;
    this.flowSteps = { buy: 0, sell: 0, partner: 0 };
    
    try {
      localStorage.removeItem(this.config.storageKey);
      localStorage.removeItem(this.config.sessionKey);
    } catch (e) {
      console.warn('Chat bot: Could not clear storage', e);
    }
  }

  // Mark as greeted
  setGreeted() {
    this.hasGreeted = true;
    this.save();
  }

  // Set submitting state
  setSubmitting(value) {
    this.isSubmitting = value;
  }

  // Get completion progress (0-1)
  getProgress() {
    const steps = this.getCurrentSteps();
    return steps.length > 0 ? this.currentStep / (steps.length - 1) : 1;
  }

  // Get all lead data for submission
  getSubmissionData() {
    return {
      ...this.leadData,
      flow: this.currentFlow,
      submittedAt: new Date().toISOString(),
      sessionDuration: Date.now() - this.sessionStart,
      engagementScore: this.engagementScore
    };
  }
}