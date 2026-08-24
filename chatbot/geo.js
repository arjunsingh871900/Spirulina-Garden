/**
 * Spirulina Garden Chatbot - Geo Resolution Module
 * Resolves user's country via IP geolocation for form pre-filling
 */

export class GeoResolver {
  constructor(config, state) {
    this.config = config;
    this.state = state;
  }

  // Resolve user's geographic location
  async resolve() {
    if (this.state.geoResolved) return;
    if (!this.config.features.geoPrefill) {
      this.state.geoResolved = true;
      return;
    }
    
    // Check cache first
    const cached = this.getCachedGeo();
    if (cached) {
      this.applyGeoData(cached);
      return;
    }
    
    try {
      // Use free IP geolocation API
      const response = await fetch('https://ipapi.co/json/', { 
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      
      if (data && data.country_name) {
        // Cache it
        this.cacheGeoData(data);
        this.applyGeoData(data);
      }
    } catch (e) {
      console.warn('Geo resolution failed, using defaults', e);
    } finally {
      this.state.geoResolved = true;
    }
  }

  // Get cached geo data
  getCachedGeo() {
    try {
      const cached = localStorage.getItem(this.config.geoCacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.config.geoCacheTTL) {
          return data;
        }
      }
    } catch (e) {}
    return null;
  }

  // Cache geo data
  cacheGeoData(data) {
    try {
      localStorage.setItem(this.config.geoCacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Could not cache geo data', e);
    }
  }

  // Apply geo data to lead data
  applyGeoData(data) {
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
    if (country !== 'Other' && !this.state.leadData.country) {
      this.state.leadData.country = country;
      // The form will pick this up when it renders
    }
  }

  // Get user's country (for external use)
  getCountry() {
    return this.state.leadData.country || null;
  }
}