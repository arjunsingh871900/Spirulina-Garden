/**
 * Spirulina Garden Chatbot - Exit Intent Module
 * Detects when user is about to leave and shows retention popup
 */

export class ExitIntent {
  constructor(config, state, analytics) {
    this.config = config;
    this.state = state;
    this.analytics = analytics;
    this.mouseInViewport = true;
    this.exitIntentTimer = null;
    this.engagementThreshold = 10;
  }

  init() {
    if (!this.config.features.exitIntent) return;
    
    this.bindEvents();
    this.trackScrollDepth();
  }

  bindEvents() {
    // Mouse leave detection (desktop)
    document.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
    document.addEventListener('mouseenter', () => this.onMouseEnter());
    
    // Track engagement
    ['click', 'scroll', 'keydown'].forEach(evt => {
      document.addEventListener(evt, () => {
        this.state.incrementEngagement(1);
      }, { passive: true });
    });
  }

  onMouseLeave(e) {
    // Only trigger if mouse leaves top of viewport (closing tab/window)
    if (e.clientY <= 0 && this.mouseInViewport && !this.state.exitIntentShown && this.state.engagementScore > this.engagementThreshold) {
      this.mouseInViewport = false;
      this.clearTimer();
      
      this.exitIntentTimer = setTimeout(() => {
        this.show();
      }, 300);
    }
  }

  onMouseEnter() {
    this.mouseInViewport = true;
    this.clearTimer();
  }

  clearTimer() {
    if (this.exitIntentTimer) {
      clearTimeout(this.exitIntentTimer);
      this.exitIntentTimer = null;
    }
  }

  trackScrollDepth() {
    let maxScroll = 0;
    window.addEventListener('scroll', () => {
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      
      const scrollPct = Math.round((window.scrollY / scrollHeight) * 100);
      if (scrollPct > maxScroll) {
        maxScroll = scrollPct;
        if (maxScroll >= 50 && this.state.engagementScore < 20) {
          this.state.incrementEngagement(20 - this.state.engagementScore);
        }
      }
    }, { passive: true });
  }

  show() {
    if (this.state.exitIntentShown) return;
    this.state.exitIntentShown = true;
    this.analytics.track('exit_intent_shown', { engagementScore: this.state.engagementScore });
    this.ui.showExitIntent();
    
    // Bind exit intent buttons
    this.bindExitButtons();
  }

  bindExitButtons() {
    const downloadBtn = this.ui.exitDownloadBtn;
    const dismissBtn = this.ui.exitDismissBtn;
    const overlay = this.ui.exitOverlay;
    
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        this.analytics.track('catalog_downloaded', { source: 'exit_intent' });
        this.ui.hideExitIntent();
        this.downloadCatalog();
      };
    }
    
    if (dismissBtn) {
      dismissBtn.onclick = () => {
        this.analytics.track('exit_intent_dismissed');
        this.ui.hideExitIntent();
      };
    }
    
    if (overlay) {
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          this.analytics.track('exit_intent_dismissed');
          this.ui.hideExitIntent();
        }
      };
    }
  }

  downloadCatalog() {
    // This will be called from FlowManager
    this.ui.window.dispatchEvent(new CustomEvent('sg:downloadCatalog'));
  }
}