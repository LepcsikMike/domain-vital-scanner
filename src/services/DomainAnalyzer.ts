import { DomainAnalysisResult } from '@/types/domain-analysis';
import { HtmlParser, ParsedHtmlData } from './HtmlParser';

interface AnalysisSettings {
  checkHTTPS: boolean;
  checkTechnology: boolean;
  checkPageSpeed: boolean;
  checkSEO: boolean;
  checkCrawling: boolean;
  batchSize: number;
  timeout: number;
  includeSubdomains: boolean;
}

export class DomainAnalyzer {
  private settings: AnalysisSettings;
  private htmlParser: HtmlParser;
  private corsProxy = 'https://api.allorigins.win/get?url=';

  constructor(settings: AnalysisSettings) {
    this.settings = settings;
    this.htmlParser = new HtmlParser();
  }

  async analyzeDomain(domain: string): Promise<DomainAnalysisResult> {
    console.log(`Starting real analysis for domain: ${domain}`);
    
    const result: DomainAnalysisResult = {
      domain,
      timestamp: new Date().toISOString(),
      httpsStatus: { valid: false, sslValid: false, redirectsToHttps: false },
      technologyAudit: { 
        cmsDetected: '', 
        outdatedTechnologies: [], 
        generatorTags: [] 
      },
      pageSpeedScores: { mobile: null, desktop: null },
      coreWebVitals: { lcp: null, cls: null, inp: null },
      seoAudit: { 
        hasTitle: false, 
        hasMetaDescription: false, 
        hasH1: false, 
        issues: [] 
      },
      crawlingStatus: { 
        isAccessible: false, 
        hasErrors: false, 
        robotsTxtExists: false 
      },
      criticalIssues: 0
    };

    try {
      // Parse website HTML first
      let parsedData: ParsedHtmlData | null = null;
      
      if (this.settings.checkSEO || this.settings.checkTechnology) {
        parsedData = await this.htmlParser.parseWebsite(domain);
      }

      // HTTPS & SSL Check
      if (this.settings.checkHTTPS) {
        result.httpsStatus = await this.checkHTTPS(domain);
      }

      // Technology Audit
      if (this.settings.checkTechnology && parsedData) {
        result.technologyAudit = this.analyzeTechnology(parsedData);
      }

      // Basic PageSpeed Check (browser-based)
      if (this.settings.checkPageSpeed && parsedData) {
        const pageSpeedData = this.calculateBasicPageSpeed(parsedData);
        result.pageSpeedScores = pageSpeedData.scores;
        result.coreWebVitals = pageSpeedData.vitals;
      }

      // SEO Audit
      if (this.settings.checkSEO && parsedData) {
        result.seoAudit = this.auditSEO(parsedData);
      }

      // Crawling Status
      if (this.settings.checkCrawling) {
        result.crawlingStatus = await this.checkCrawlingStatus(domain, parsedData);
      }

      // Calculate critical issues count
      result.criticalIssues = this.calculateCriticalIssues(result);

      console.log(`Real analysis completed for ${domain}:`, result);
      return result;

    } catch (error) {
      console.error(`Error analyzing ${domain}:`, error);
      // Return partial results even on error
      result.criticalIssues = 5; // Mark as highly problematic
      return result;
    }
  }

  private async checkHTTPS(domain: string) {
    console.log(`Checking real HTTPS for ${domain}`);
    
    try {
      // Test both HTTP and HTTPS
      const httpsTest = await this.testConnection(`https://${domain}`);
      const httpTest = await this.testConnection(`http://${domain}`);
      
      return {
        valid: httpsTest.success,
        sslValid: httpsTest.success && httpsTest.statusCode < 400,
        redirectsToHttps: httpTest.success && httpTest.redirectsToHttps
      };
    } catch (error) {
      console.error(`HTTPS check failed for ${domain}:`, error);
      return {
        valid: false,
        sslValid: false,
        redirectsToHttps: false
      };
    }
  }

  private async testConnection(url: string): Promise<{
    success: boolean;
    statusCode: number;
    redirectsToHttps: boolean;
  }> {
    try {
      const proxyUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        method: 'HEAD',
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      const data = await response.json();
      
      return {
        success: response.ok,
        statusCode: data.status?.http_code || 0,
        redirectsToHttps: url.startsWith('http://') && data.url?.startsWith('https://')
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 0,
        redirectsToHttps: false
      };
    }
  }

  private analyzeTechnology(parsedData: ParsedHtmlData) {
    console.log('Analyzing real technology stack');
    
    const outdatedTechnologies = [];
    const generatorTags = parsedData.generatorTags;
    let cmsDetected = '';

    // Check for outdated technologies
    generatorTags.forEach(tag => {
      if (tag.includes('Dreamweaver')) {
        outdatedTechnologies.push('Dreamweaver');
      }
      if (tag.includes('FrontPage')) {
        outdatedTechnologies.push('FrontPage');
      }
      if (tag.includes('WordPress') && tag.includes('4.')) {
        outdatedTechnologies.push('WordPress 4.x (veraltet)');
      }
    });

    // Detect CMS
    if (parsedData.technologies.includes('WordPress')) {
      cmsDetected = 'WordPress';
    } else if (parsedData.technologies.includes('TYPO3')) {
      cmsDetected = 'TYPO3';
    } else if (parsedData.technologies.includes('Drupal')) {
      cmsDetected = 'Drupal';
    } else if (parsedData.technologies.includes('Joomla')) {
      cmsDetected = 'Joomla';
    }

    return {
      cmsDetected,
      outdatedTechnologies,
      generatorTags
    };
  }

  private calculateBasicPageSpeed(parsedData: ParsedHtmlData) {
    console.log('Calculating basic page speed metrics');
    
    // Basic performance scoring based on response time and content size
    const responseTime = parsedData.responseTime;
    const contentSize = parsedData.contentSize;
    
    // Simple scoring algorithm
    let mobileScore = 100;
    let desktopScore = 100;
    
    // Penalize slow response times
    if (responseTime > 3000) mobileScore -= 30;
    else if (responseTime > 1500) mobileScore -= 15;
    
    if (responseTime > 2000) desktopScore -= 20;
    else if (responseTime > 1000) desktopScore -= 10;
    
    // Penalize large content size
    if (contentSize > 1000000) { // 1MB
      mobileScore -= 20;
      desktopScore -= 10;
    } else if (contentSize > 500000) { // 500KB
      mobileScore -= 10;
      desktopScore -= 5;
    }
    
    // Ensure scores don't go below 0
    mobileScore = Math.max(0, mobileScore);
    desktopScore = Math.max(0, desktopScore);
    
    // Generate basic Core Web Vitals estimates
    const lcp = responseTime > 2500 ? `${(responseTime / 1000).toFixed(1)}s` : '2.1s';
    const cls = contentSize > 500000 ? '0.15' : '0.05';
    const inp = responseTime > 1000 ? `${Math.min(responseTime * 0.3, 300)}ms` : '80ms';

    return {
      scores: {
        mobile: mobileScore,
        desktop: desktopScore
      },
      vitals: {
        lcp,
        cls,
        inp
      }
    };
  }

  private auditSEO(parsedData: ParsedHtmlData) {
    console.log('Performing real SEO audit');
    
    const issues = [];
    
    const hasTitle = parsedData.title !== null && parsedData.title.length > 0;
    const hasMetaDescription = parsedData.metaDescription !== null && parsedData.metaDescription.length > 0;
    const hasH1 = parsedData.h1Tags.length > 0;
    
    if (!hasTitle) issues.push('Title-Tag fehlt');
    if (!hasMetaDescription) issues.push('Meta-Description fehlt');
    if (!hasH1) issues.push('H1-Tag fehlt');
    if (parsedData.h1Tags.length > 1) issues.push('Mehrere H1-Tags gefunden');
    if (!parsedData.hasViewport) issues.push('Viewport Meta-Tag fehlt');
    
    // Check title length
    if (parsedData.title && (parsedData.title.length < 30 || parsedData.title.length > 60)) {
      issues.push('Title-Tag Länge nicht optimal');
    }
    
    // Check meta description length
    if (parsedData.metaDescription && (parsedData.metaDescription.length < 120 || parsedData.metaDescription.length > 160)) {
      issues.push('Meta-Description Länge nicht optimal');
    }

    return {
      hasTitle,
      hasMetaDescription,
      hasH1,
      issues
    };
  }

  private async checkCrawlingStatus(domain: string, parsedData: ParsedHtmlData | null) {
    console.log(`Checking real crawling status for ${domain}`);
    
    try {
      const robotsCheck = await this.htmlParser.checkRobotsTxt(domain);
      
      // Check if domain is accessible
      const isAccessible = parsedData !== null && parsedData.responseTime > 0;
      
      // Check for crawling errors
      const hasErrors = parsedData === null || 
                       parsedData.robotsDirectives.includes('noindex') ||
                       parsedData.robotsDirectives.includes('nofollow');

      return {
        isAccessible,
        hasErrors,
        robotsTxtExists: robotsCheck.exists
      };
    } catch (error) {
      console.error(`Crawling status check failed for ${domain}:`, error);
      return {
        isAccessible: false,
        hasErrors: true,
        robotsTxtExists: false
      };
    }
  }

  private calculateCriticalIssues(result: DomainAnalysisResult): number {
    let count = 0;

    // HTTPS Probleme
    if (!result.httpsStatus.valid) count++;

    // Veraltete Technologien
    if (result.technologyAudit.outdatedTechnologies.length > 0) count++;

    // Schlechte PageSpeed Scores
    if (result.pageSpeedScores.mobile && result.pageSpeedScores.mobile < 50) count++;

    // SEO Probleme
    if (result.seoAudit.issues.length >= 2) count++;

    // Crawling Probleme
    if (result.crawlingStatus.hasErrors || !result.crawlingStatus.isAccessible) count++;

    return count;
  }
}
