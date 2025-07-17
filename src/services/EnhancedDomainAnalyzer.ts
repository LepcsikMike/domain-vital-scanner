
import { DomainAnalysisResult, TechnologyDetails, MarketingTools, SecurityAudit, CompetitorInsights } from '@/types/domain-analysis';
import { GooglePageSpeedService } from './GooglePageSpeedService';
import { DomainAnalyzer } from './DomainAnalyzer';
import { CodeSearchService } from './CodeSearchService';

export class EnhancedDomainAnalyzer extends DomainAnalyzer {
  private googlePageSpeed: GooglePageSpeedService;
  private codeSearch: CodeSearchService;
  
  constructor(settings: any) {
    super(settings);
    this.googlePageSpeed = new GooglePageSpeedService();
    this.codeSearch = new CodeSearchService();
  }
  
  async analyzeDomain(domain: string): Promise<DomainAnalysisResult> {
    console.log(`Starting enhanced analysis for domain: ${domain}`);
    
    // Get base analysis from parent class
    const baseResult = await super.analyzeDomain(domain);
    
    // Add enhanced PublicWWW-like analysis
    try {
      const enhancedData = await this.performEnhancedAnalysis(domain);
      
      // Merge enhanced data into base result
      baseResult.technologyDetails = enhancedData.technologyDetails;
      baseResult.marketingTools = enhancedData.marketingTools;
      baseResult.securityAudit = enhancedData.securityAudit;
      baseResult.competitorInsights = enhancedData.competitorInsights;
      
      console.log(`Enhanced ${domain} with PublicWWW-like analysis`);
    } catch (error) {
      console.warn(`Enhanced analysis failed for ${domain}:`, error);
      // Provide empty enhanced data as fallback
      baseResult.technologyDetails = this.getEmptyTechnologyDetails();
      baseResult.marketingTools = this.getEmptyMarketingTools();
      baseResult.securityAudit = this.getEmptySecurityAudit();
      baseResult.competitorInsights = this.getEmptyCompetitorInsights();
    }
    
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
  
  private async performEnhancedAnalysis(domain: string): Promise<{
    technologyDetails: TechnologyDetails;
    marketingTools: MarketingTools;
    securityAudit: SecurityAudit;
    competitorInsights: CompetitorInsights;
  }> {
    console.log(`Performing enhanced PublicWWW-like analysis for ${domain}`);
    
    // Get fresh HTML for detailed analysis
    const htmlData = await this.htmlParser.parseWebsite(domain);
    
    // Use CodeSearchService for detailed analysis
    const codeAnalysis = this.codeSearch.analyzeCode(htmlData ? this.reconstructHtml(htmlData) : '');
    
    // Generate competitor insights
    const competitorInsights = this.generateCompetitorInsights(
      codeAnalysis.technologyDetails,
      codeAnalysis.marketingTools
    );
    
    return {
      technologyDetails: codeAnalysis.technologyDetails,
      marketingTools: codeAnalysis.marketingTools,
      securityAudit: codeAnalysis.securityAudit,
      competitorInsights
    };
  }

  private reconstructHtml(parsedData: any): string {
    // Reconstruct basic HTML structure for analysis
    // This is a simplified version - in a real implementation you'd want the full HTML
    return `
      <html>
        <head>
          <title>${parsedData.title || ''}</title>
          <meta name="description" content="${parsedData.metaDescription || ''}">
          ${parsedData.generatorTags.map((tag: string) => `<meta name="generator" content="${tag}">`).join('\n')}
        </head>
        <body>
          ${parsedData.h1Tags.map((h1: string) => `<h1>${h1}</h1>`).join('\n')}
          ${parsedData.technologies.map((tech: string) => `<!-- ${tech} -->`).join('\n')}
        </body>
      </html>
    `;
  }

  private generateCompetitorInsights(
    techDetails: TechnologyDetails,
    marketingTools: MarketingTools
  ): CompetitorInsights {
    // Simplified competitor analysis based on technology stack
    const allTechnologies = [
      ...techDetails.jsLibraries,
      ...techDetails.cssFrameworks,
      ...techDetails.ecommercePlatforms,
      ...marketingTools.googleAnalytics,
      ...marketingTools.googleAdSense
    ];

    // Determine industry category based on technologies
    let industryCategory = 'General';
    if (techDetails.ecommercePlatforms.length > 0) {
      industryCategory = 'E-commerce';
    } else if (marketingTools.googleAdSense.length > 0) {
      industryCategory = 'Publishing';
    } else if (techDetails.jsLibraries.some(lib => lib.includes('React') || lib.includes('Vue') || lib.includes('Angular'))) {
      industryCategory = 'Technology';
    }

    // Calculate technical similarity score
    const modernTechCount = techDetails.jsLibraries.filter(lib => 
      lib.includes('React') || lib.includes('Vue') || lib.includes('Angular')
    ).length;
    
    const technicalSimilarity = Math.min(100, (modernTechCount * 25) + (allTechnologies.length * 5));

    // Determine market position
    let marketPosition: 'leading' | 'following' | 'emerging' = 'following';
    if (technicalSimilarity >= 80) {
      marketPosition = 'leading';
    } else if (technicalSimilarity >= 50) {
      marketPosition = 'following';
    } else {
      marketPosition = 'emerging';
    }

    return {
      similarDomains: [], // Would be populated with actual competitor data
      sharedTechnologies: allTechnologies.slice(0, 5), // Top 5 shared technologies
      industryCategory,
      marketPosition,
      technicalSimilarity
    };
  }

  private getEmptyTechnologyDetails(): TechnologyDetails {
    return {
      jsLibraries: [],
      cssFrameworks: [],
      analyticsTools: [],
      adNetworks: [],
      cdnProviders: [],
      serverTech: [],
      ecommercePlatforms: [],
      securityTools: [],
      socialWidgets: [],
      version: null
    };
  }

  private getEmptyMarketingTools(): MarketingTools {
    return {
      googleAnalytics: [],
      facebookPixel: [],
      googleTagManager: [],
      googleAdSense: [],
      linkedinInsight: [],
      twitterAnalytics: [],
      hotjar: [],
      mixpanel: [],
      segment: []
    };
  }

  private getEmptySecurityAudit(): SecurityAudit {
    return {
      vulnerableLibraries: [],
      outdatedVersions: [],
      securityHeaders: {
        hsts: false,
        csp: false,
        xFrameOptions: false,
        xContentTypeOptions: false
      },
      riskyScripts: [],
      httpsIssues: [],
      score: 0
    };
  }

  private getEmptyCompetitorInsights(): CompetitorInsights {
    return {
      similarDomains: [],
      sharedTechnologies: [],
      industryCategory: 'Unknown',
      marketPosition: 'emerging',
      technicalSimilarity: 0
    };
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
    
    // Enhanced security issues
    if (result.securityAudit && result.securityAudit.score < 70) count++;
    if (result.securityAudit && result.securityAudit.vulnerableLibraries.length > 0) count += 2;
    
    // Crawling issues
    if (result.crawlingStatus.hasErrors || !result.crawlingStatus.isAccessible) count++;
    
    return count;
  }
}
