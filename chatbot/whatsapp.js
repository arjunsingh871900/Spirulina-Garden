/**
 * Spirulina Garden Chatbot - WhatsApp Integration Module
 * Handles WhatsApp deep linking and lead sharing
 */

export class WhatsApp {
  constructor(config, state) {
    this.config = config;
    this.state = state;
  }

  // Open WhatsApp with pre-filled message
  open(customMessage = null) {
    const message = customMessage || this.getDefaultMessage();
    const url = `https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Send lead data via WhatsApp
  send() {
    if (this.state.isSubmitting) return;
    this.state.setSubmitting(true);
    
    const message = this.createLeadMessage();
    const url = `https://wa.me/${this.config.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Store lead locally as backup
    this.storeLeadLocally();
    
    this.state.setSubmitting(false);
  }

  // Create lead message for WhatsApp
  createLeadMessage() {
    const data = this.state.leadData;
    const flow = this.state.currentFlow;
    let msg = `*NEW LEAD - SPIRULINA GARDEN*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (flow === 'sell') {
      msg += `*SELLER INQUIRY*\n`;
      msg += `Name: ${data.seller_name || '—'}\n`;
      msg += `Email: ${data.seller_email || '—'}\n`;
      msg += `Farm/Company: ${data.farm_name || '—'}\n`;
      msg += `Location: ${data.location || '—'}\n`;
      msg += `Annual Capacity: ${this.formatCapacity(data.annual_capacity) || '—'}\n`;
      msg += `Certifications: ${Array.isArray(data.current_certs) ? data.current_certs.join(', ') : (data.current_certs || '—')}\n`;
      msg += `Harvest Cycle: ${this.formatHarvestCycle(data.harvest_cycle) || '—'}\n`;
      msg += `Quality Specs: ${data.quality_specs || '—'}\n`;
      msg += `Packaging: ${this.formatPackaging(data.packaging) || '—'}\n`;
      msg += `Requirements: ${data.seller_requirements || '—'}\n`;
    } else if (flow === 'partner') {
      msg += `*PARTNERSHIP INQUIRY*\n`;
      msg += `Name: ${data.partner_name || '—'}\n`;
      msg += `Email: ${data.partner_email || '—'}\n`;
      msg += `Company: ${data.partner_company || '—'}\n`;
      msg += `Type: ${this.formatPartnerType(data.partner_type) || '—'}\n`;
      msg += `Target Markets: ${Array.isArray(data.target_markets) ? data.target_markets.map(m => this.formatMarket(m)).join(', ') : (data.target_markets || '—')}\n`;
      msg += `Annual Volume: ${this.formatVolume(data.annual_volume) || '—'}\n`;
      msg += `Requirements: ${data.partner_requirements || '—'}\n`;
    } else {
      msg += `*BUYER INQUIRY*\n`;
      msg += `Name: ${data.name || '—'}\n`;
      msg += `Email: ${data.email || '—'}\n`;
      msg += `Company: ${data.company || '—'}\n`;
      msg += `Country: ${data.country || '—'}\n`;
      msg += `Interest: ${this.formatInterest(data.interest) || '—'}\n`;
      msg += `Product: ${data.product || '—'}\n`;
      msg += `Volume: ${this.formatVolume(data.volume) || '—'}\n`;
      msg += `Timeline: ${this.formatTimeline(data.timeline) || '—'}\n`;
      msg += `Certifications: ${Array.isArray(data.certifications) ? data.certifications.map(c => this.formatCertification(c)).join(', ') : (data.certifications || '—')}\n`;
      msg += `Shipping: ${this.formatShipping(data.shipping_terms) || '—'}\n`;
      msg += `Notes: ${data.requirements || '—'}\n`;
    }
    
    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n`;
    msg += `Source: Chat Bot (spirulinagarden.com)`;
    
    return msg;
  }

  // Default message for general inquiries
  getDefaultMessage() {
    return "Hello, I'm interested in your spirulina products. Please share export pricing and specifications.";
  }

  // Formatters for display
  formatCapacity(value) {
    const map = {
      'under_10mt': 'Under 10 MT/year',
      '10_50mt': '10–50 MT/year',
      '50_100mt': '50–100 MT/year',
      '100_500mt': '100–500 MT/year',
      '500mt_plus': '500+ MT/year'
    };
    return map[value] || value;
  }

  formatHarvestCycle(value) {
    const map = {
      'year_round': 'Year-Round Continuous',
      'seasonal': 'Seasonal',
      'batch': 'Batch-Based'
    };
    return map[value] || value;
  }

  formatPackaging(value) {
    const map = {
      'bulk_25kg': '25 kg Bulk Bags',
      'super_sacks': '500–1000 kg Super Sacks',
      'custom': 'Custom Packaging',
      'need_support': 'Need Packaging Support'
    };
    return map[value] || value;
  }

  formatPartnerType(value) {
    const map = {
      'distributor': 'Regional Distributor',
      'private_label': 'Private Label Partner',
      'white_label': 'White Label / Co-Branding',
      'affiliate': 'Affiliate / Referral',
      'joint_venture': 'Joint Venture'
    };
    return map[value] || value;
  }

  formatMarket(value) {
    const map = {
      'north_america': 'North America',
      'eu': 'European Union',
      'gcc': 'GCC / Middle East',
      'asia_pacific': 'Asia Pacific',
      'africa': 'Africa',
      'latam': 'Latin America',
      'india': 'India Domestic',
      'global': 'Global'
    };
    return map[value] || value;
  }

  formatVolume(value) {
    const map = {
      'sample': 'Sample Only (1–5 kg / 100–500 bottles)',
      'trial': 'Trial Order (10–50 kg / 500–2,000 bottles)',
      'regular': 'Regular Supply (50–500 kg / 2,000–20,000 bottles)',
      'container': 'Container Load (500 kg–20 MT / 20,000+ bottles)',
      'annual_contract': 'Annual Contract (20+ MT / 200,000+ bottles)',
      'under_100k': 'Under 100K units',
      '100k_500k': '100K–500K units',
      '500k_1m': '500K–1M units',
      '1m_5m': '1M–5M units',
      '5m_plus': '5M+ units'
    };
    return map[value] || value;
  }

  formatTimeline(value) {
    const map = {
      'asap': 'ASAP (Within 2 Weeks)',
      '1_month': 'Within 1 Month',
      '2_3_months': '2–3 Months',
      'planning': 'Planning Phase (3+ Months)'
    };
    return map[value] || value;
  }

  formatCertification(value) {
    const map = {
      'usda_organic': 'USDA Organic',
      'eu_organic': 'EU Organic',
      'iso_22000': 'ISO 22000 / HACCP',
      'fda_gras': 'FDA GRAS',
      'halal': 'Halal',
      'kosher': 'Kosher',
      'non_gmo': 'Non-GMO Project Verified',
      'gmp': 'GMP Certified'
    };
    return map[value] || value;
  }

  formatShipping(value) {
    const map = {
      'FOB': 'FOB India (Free on Board)',
      'CIF': 'CIF (Cost, Insurance, Freight)',
      'CFR': 'CFR (Cost and Freight)',
      'DAP': 'DAP (Delivered at Place)',
      'air_freight': 'Air Freight (Express)',
      'not_sure': 'Need Guidance'
    };
    return map[value] || value;
  }

  formatInterest(value) {
    const map = {
      'bulk_powder': 'Bulk Spirulina Powder (1kg–20MT+)',
      'tablets': 'Spirulina Tablets 500mg (60-count bottles)',
      'capsules': 'Spirulina Capsules 400mg (60-count bottles)',
      'private_label': 'Private Label / Custom Branding',
      'distribution': 'Distribution Partnership',
      'sample': 'Request Free Sample First',
      'information': 'Just Gathering Information'
    };
    return map[value] || value;
  }

  // Store lead locally as backup
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