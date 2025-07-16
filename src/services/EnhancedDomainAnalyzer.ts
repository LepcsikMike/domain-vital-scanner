
import { DomainAnalysisResult } from '@/types/domain-analysis';
import { GooglePageSpeedService } from './GooglePageSpeedService';
import { DomainAnalyzer } from './DomainAnalyzer';

export class EnhancedDomainAnalyzer extends DomainAnalyzer {
  private googlePageSpeed: GooglePageSpeedService;
  
  constructor(settings: any) {
    super(settings);
    this.googlePageSpeed = new GooglePageSpeedService();
  }
  
  async analyzeDomain(domain: string): Promise<DomainAnalysisResult> {
    console.log(`Starting enhanced analysis for domain: ${domain}`);
    
    // Get base analysis from parent class
    const baseResult = await super.analyzeDomain(domain);
    
    // Enhance with Google PageSpeed Insights if API key is available
    if (this.googlePageSpeed.hasApiKey()) {
      try {
        console.log(`Using Google PageSpeed Insights for ${domain}`);
        const googleResult = await this.googlePageSpeed.analyzePageSpeed(domain);
        
        if (googleResult) {
          // Replace simulated scores with real Google data
          baseResult.pageSpeedScores = googleResult.scores;
          baseResult.coreWebVitals = googleResult.coreWebVitals;
          
          // Add Google recommendations to SEO issues
          if (googleResult.recommendations.length > 0) {
            baseResult.seoAudit.issues.push(
              ...googleResult.recommendations.map(rec => `Performance: ${rec}`)
            );
          }
          
          console.log(`Enhanced ${domain} with real Google PageSpeed data`);
        }
      } catch (error) {
        console.warn(`Google PageSpeed enhancement failed for ${domain}:`, error);
        // Fallback to base analysis (already completed)
      }
    }
    
    // Recalculate critical issues with enhanced data
    baseResult.criticalIssues = this.calculateEnhancedCriticalIssues(baseResult);
    
    return baseResult;
  }
  
  private calculateEnhancedCriticalIssues(result: DomainAnalysisResult): number {
    let count = 0;
    
    // HTTPS/SSL issues
    if (!result.httpsStatus.valid) count++;
    if (!result.httpsStatus.sslValid) count++;
    
    // Performance issues (stricter with real Google data)
    if (result.pageSpeedScores.mobile && result.pageSpeedScores.mobile < 60) count++;
    if (result.pageSpeedScores.desktop && result.pageSpeedScores.desktop < 70) count++;
    
    // Core Web Vitals issues
    if (result.coreWebVitals.lcp && !result.coreWebVitals.lcp.includes('N/A')) {
      const lcpValue = parseFloat(result.coreWebVitals.lcp);
      if (lcpValue > 2.5) count++;
    }
    
    if (result.coreWebVitals.cls && !result.coreWebVitals.cls.includes('N/A')) {
      const clsValue = parseFloat(result.coreWebVitals.cls);
      if (clsValue > 0.1) count++;
    }
    
    // SEO issues
    if (result.seoAudit.issues.length >= 3) count++;
    
    // Technology issues
    if (result.technologyAudit.outdatedTechnologies.length > 0) count++;
    
    // Crawling issues
    if (result.crawlingStatus.hasErrors || !result.crawlingStatus.isAccessible) count++;
    
    return count;
  }
}
