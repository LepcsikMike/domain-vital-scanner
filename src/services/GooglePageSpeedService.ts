
export interface PageSpeedResult {
  scores: {
    mobile: number;
    desktop: number;
  };
  coreWebVitals: {
    lcp: string;
    cls: string;
    inp: string;
    fcp: string;
    fid: string;
  };
  recommendations: string[];
  loadingExperience: {
    overall_category: string;
    metrics: Record<string, any>;
  };
}

export class GooglePageSpeedService {
  private apiKey: string | null = null;
  private readonly baseUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  
  constructor() {
    // Try to get API key from localStorage first, then from environment
    this.apiKey = localStorage.getItem('google_pagespeed_api_key') || null;
  }
  
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
    localStorage.setItem('google_pagespeed_api_key', apiKey);
  }
  
  hasApiKey(): boolean {
    return !!this.apiKey;
  }
  
  async analyzePageSpeed(domain: string): Promise<PageSpeedResult | null> {
    if (!this.apiKey) {
      console.warn('Google PageSpeed API key not configured');
      return null;
    }
    
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const url = `https://${cleanDomain}`;
    
    try {
      // Test mobile
      const mobileResult = await this.runPageSpeedTest(url, 'mobile');
      
      // Test desktop  
      const desktopResult = await this.runPageSpeedTest(url, 'desktop');
      
      if (!mobileResult || !desktopResult) {
        return null;
      }
      
      return this.combineResults(mobileResult, desktopResult);
      
    } catch (error) {
      console.error(`Google PageSpeed analysis failed for ${domain}:`, error);
      return null;
    }
  }
  
  private async runPageSpeedTest(url: string, strategy: 'mobile' | 'desktop') {
    const params = new URLSearchParams({
      url: url,
      key: this.apiKey!,
      strategy: strategy,
      category: 'performance'
    });
    
    const response = await fetch(`${this.baseUrl}?${params}`);
    
    if (!response.ok) {
      throw new Error(`PageSpeed API returned ${response.status}`);
    }
    
    return await response.json();
  }
  
  private combineResults(mobileData: any, desktopData: any): PageSpeedResult {
    const mobileScore = Math.round(mobileData.lighthouseResult?.categories?.performance?.score * 100) || 0;
    const desktopScore = Math.round(desktopData.lighthouseResult?.categories?.performance?.score * 100) || 0;
    
    // Extract Core Web Vitals from mobile (preferred)
    const audits = mobileData.lighthouseResult?.audits || {};
    
    const lcp = this.formatMetric(audits['largest-contentful-paint']?.displayValue);
    const cls = this.formatMetric(audits['cumulative-layout-shift']?.displayValue);
    const inp = this.formatMetric(audits['interaction-to-next-paint']?.displayValue);
    const fcp = this.formatMetric(audits['first-contentful-paint']?.displayValue);
    const fid = this.formatMetric(audits['max-potential-fid']?.displayValue);
    
    // Extract recommendations
    const recommendations = this.extractRecommendations(audits);
    
    return {
      scores: {
        mobile: mobileScore,
        desktop: desktopScore
      },
      coreWebVitals: {
        lcp: lcp || 'N/A',
        cls: cls || 'N/A', 
        inp: inp || 'N/A',
        fcp: fcp || 'N/A',
        fid: fid || 'N/A'
      },
      recommendations,
      loadingExperience: mobileData.loadingExperience || {}
    };
  }
  
  private formatMetric(value: string | undefined): string {
    if (!value) return 'N/A';
    return value.replace(/\u00a0/g, ' '); // Replace non-breaking spaces
  }
  
  private extractRecommendations(audits: any): string[] {
    const recommendations = [];
    
    // Key performance audits to check
    const keyAudits = [
      'unused-css-rules',
      'unused-javascript', 
      'render-blocking-resources',
      'unminified-css',
      'unminified-javascript',
      'efficient-animated-content',
      'server-response-time'
    ];
    
    keyAudits.forEach(auditKey => {
      const audit = audits[auditKey];
      if (audit && audit.score !== null && audit.score < 0.9) {
        recommendations.push(audit.title || auditKey);
      }
    });
    
    return recommendations.slice(0, 5); // Limit to top 5
  }
}
