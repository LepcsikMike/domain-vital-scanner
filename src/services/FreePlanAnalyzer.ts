
import { DomainAnalysisResult } from '@/types/domain-analysis';
import { DomainAnalyzer } from './DomainAnalyzer';

export class FreePlanAnalyzer extends DomainAnalyzer {
  constructor(settings: any) {
    super(settings);
  }
  
  async analyzeDomain(domain: string): Promise<DomainAnalysisResult> {
    console.log(`Starting free plan analysis for domain: ${domain}`);
    
    // Get base analysis without API enhancements
    const result = await super.analyzeDomain(domain);
    
    // For free plan, provide simulated but realistic data
    // Remove API-enhanced features
    result.pageSpeedScores = {
      mobile: Math.floor(Math.random() * 40) + 50, // 50-90 range
      desktop: Math.floor(Math.random() * 30) + 60 // 60-90 range
    };
    
    // Simplified Core Web Vitals (no real API data)
    result.coreWebVitals = {
      lcp: `${(Math.random() * 2 + 1.5).toFixed(1)}s`,
      cls: `${(Math.random() * 0.2).toFixed(3)}`,
      inp: `${Math.floor(Math.random() * 200 + 100)}ms`
    };
    
    // Recalculate critical issues for free plan
    result.criticalIssues = this.calculateFreePlanCriticalIssues(result);
    
    return result;
  }
  
  private calculateFreePlanCriticalIssues(result: DomainAnalysisResult): number {
    let count = 0;
    
    // Basic security checks
    if (!result.httpsStatus.valid) count++;
    if (!result.httpsStatus.sslValid) count++;
    
    // Basic performance check (less strict)
    if (result.pageSpeedScores.mobile && result.pageSpeedScores.mobile < 70) count++;
    
    // Basic SEO issues
    if (result.seoAudit.issues.length >= 2) count++;
    
    // Technology issues
    if (result.technologyAudit.outdatedTechnologies.length > 0) count++;
    
    return count;
  }
}
