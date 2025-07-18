import { getDomainUrl } from '@/utils/urlUtils';
import { TechnologyIntelligenceService } from './TechnologyIntelligenceService';
import { TechnologyDetails, MarketingTools, SecurityAudit } from '@/types/domain-analysis';

export interface ParsedHtmlData {
  title: string | null;
  metaDescription: string | null;
  h1Tags: string[];
  generatorTags: string[];
  hasViewport: boolean;
  robotsDirectives: string[];
  technologies: string[];
  responseTime: number;
  contentSize: number;
  // Enhanced BuiltWith-style data
  technologyDetails: TechnologyDetails;
  marketingTools: MarketingTools;
  securityAudit: SecurityAudit;
  headers: Headers;
}

export class HtmlParser {
  // Optimized CORS proxies matching DomainAnalyzer
  private corsProxies = [
    { url: 'https://api.codetabs.com/v1/proxy?quest=', name: 'codetabs', timeout: 6000 },
    { url: 'https://api.allorigins.win/get?url=', name: 'allorigins', timeout: 8000 },
    { url: 'https://corsproxy.io/?', name: 'corsproxy', timeout: 7000 },
    { url: 'https://thingproxy.freeboard.io/fetch/', name: 'thingproxy', timeout: 6000 }
  ];
  
  async parseWebsite(domain: string): Promise<ParsedHtmlData> {
    const startTime = Date.now();
    console.log(`Starting optimized parsing for: ${domain}`);
    
    try {
      const cleanUrl = getDomainUrl(domain);
      console.log(`Normalized URL for parsing: ${cleanUrl}`);
      
      // Try proxies with early exit strategy
      for (let proxyIndex = 0; proxyIndex < this.corsProxies.length; proxyIndex++) {
        const proxy = this.corsProxies[proxyIndex];
        
        try {
          const result = await this.tryParseWithProxy(cleanUrl, proxy, startTime);
          if (result && result.contentSize > 100) {
            console.log(`Successfully parsed ${domain} with ${proxy.name}`);
            return result;
          }
        } catch (error) {
          console.warn(`Proxy ${proxy.name} failed for ${domain}:`, error);
          
          // Don't retry on certain errors
          if (error.message?.includes('403') || error.message?.includes('404')) {
            console.log(`Skipping remaining proxies due to ${error.message}`);
            break;
          }
          
          continue;
        }
      }
      
      console.error(`All proxies failed for ${domain}`);
      return this.getEmptyParsedData(Date.now() - startTime);
      
    } catch (error) {
      console.error(`Failed to parse ${domain}:`, error);
      return this.getEmptyParsedData(Date.now() - startTime);
    }
  }
  
  private async tryParseWithProxy(url: string, proxy: { url: string; name: string; timeout: number }, startTime: number): Promise<ParsedHtmlData | null> {
    const proxyUrl = proxy.url + encodeURIComponent(url);
    console.log(`Trying to parse ${url} with ${proxy.name} (timeout: ${proxy.timeout}ms)`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), proxy.timeout);
    
    try {
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`${proxy.name} returned ${response.status}`);
        
        // Throw specific error for certain status codes
        if (response.status === 403 || response.status === 404) {
          throw new Error(`${response.status}`);
        }
        
        return null;
      }
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.warn(`Failed to parse JSON from ${proxy.name}:`, parseError);
        return null;
      }
      
      // Handle different proxy response formats
      let html = '';
      if (proxy.name === 'allorigins') {
        html = data.contents || '';
      } else if (proxy.name === 'codetabs') {
        html = data || '';
      } else if (proxy.name === 'thingproxy') {
        html = data || '';
      } else {
        html = data.contents || data.body || data.data || '';
      }
      
      if (!html || html.length < 100) {
        console.warn(`${proxy.name} returned insufficient content (${html.length} chars)`);
        return null;
      }
      
      const responseTime = Date.now() - startTime;
      return this.extractDataFromHtml(html, responseTime);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.warn(`Timeout for ${proxy.name} (${proxy.timeout}ms)`);
      } else {
        console.warn(`Network error for ${proxy.name}:`, error);
      }
      
      // Re-throw specific errors to stop trying other proxies
      if (error.message === '403' || error.message === '404') {
        throw error;
      }
      
      return null;
    }
  }
  
  private extractDataFromHtml(html: string, responseTime: number, headers?: Headers): ParsedHtmlData {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const title = doc.querySelector('title')?.textContent?.trim() || null;
    
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || null;
    
    const h1Elements = doc.querySelectorAll('h1');
    const h1Tags = Array.from(h1Elements).map(h1 => h1.textContent?.trim() || '');
    
    const generatorElements = doc.querySelectorAll('meta[name="generator"]');
    const generatorTags = Array.from(generatorElements).map(gen => gen.getAttribute('content') || '');
    
    const hasViewport = doc.querySelector('meta[name="viewport"]') !== null;
    
    const robotsElement = doc.querySelector('meta[name="robots"]');
    const robotsDirectives = robotsElement ? 
      (robotsElement.getAttribute('content') || '').split(',').map(d => d.trim()) : [];
    
    const technologies = this.detectTechnologies(html, doc);
    
    const contentSize = new Blob([html]).size;
    
    // Enhanced BuiltWith-style analysis
    const responseHeaders = headers || new Headers();
    const technologyDetails = TechnologyIntelligenceService.detectTechnologies(html, responseHeaders);
    const marketingTools = TechnologyIntelligenceService.detectMarketingTools(html);
    const securityAudit = TechnologyIntelligenceService.analyzeSecurity(html, responseHeaders);
    
    return {
      title,
      metaDescription,
      h1Tags,
      generatorTags,
      hasViewport,
      robotsDirectives,
      technologies,
      responseTime,
      contentSize,
      technologyDetails,
      marketingTools,
      securityAudit,
      headers: responseHeaders
    };
  }
  
  private detectTechnologies(html: string, doc: Document): string[] {
    const technologies = [];
    
    if (html.includes('wp-content') || html.includes('wordpress')) {
      technologies.push('WordPress');
    }
    
    if (html.includes('typo3') || html.includes('TYPO3')) {
      technologies.push('TYPO3');
    }
    
    if (html.includes('joomla') || html.includes('Joomla')) {
      technologies.push('Joomla');
    }
    
    if (html.includes('drupal') || html.includes('Drupal')) {
      technologies.push('Drupal');
    }
    
    const generatorContent = doc.querySelector('meta[name="generator"]')?.getAttribute('content') || '';
    
    if (generatorContent.includes('Dreamweaver')) {
      technologies.push('Dreamweaver (veraltet)');
    }
    
    if (generatorContent.includes('FrontPage')) {
      technologies.push('FrontPage (veraltet)');
    }
    
    if (html.includes('react') || html.includes('React')) {
      technologies.push('React');
    }
    
    if (html.includes('vue') || html.includes('Vue')) {
      technologies.push('Vue.js');
    }
    
    if (html.includes('angular') || html.includes('Angular')) {
      technologies.push('Angular');
    }
    
    return technologies;
  }
  
  private getEmptyParsedData(responseTime: number): ParsedHtmlData {
    const emptyHeaders = new Headers();
    
    return {
      title: null,
      metaDescription: null,
      h1Tags: [],
      generatorTags: [],
      hasViewport: false,
      robotsDirectives: [],
      technologies: [],
      responseTime,
      contentSize: 0,
      technologyDetails: {
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
      },
      marketingTools: {
        googleAnalytics: [],
        facebookPixel: [],
        googleTagManager: [],
        googleAdSense: [],
        linkedinInsight: [],
        twitterAnalytics: [],
        hotjar: [],
        mixpanel: [],
        segment: []
      },
      securityAudit: {
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
      },
      headers: emptyHeaders
    };
  }
  
  async checkRobotsTxt(domain: string): Promise<{ exists: boolean; content: string | null }> {
    try {
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
      const robotsUrl = `https://${cleanDomain}/robots.txt`;
      console.log(`Checking robots.txt at: ${robotsUrl}`);
      
      // Use optimized proxy approach for robots.txt
      for (const proxy of this.corsProxies) {
        try {
          const proxyUrl = proxy.url + encodeURIComponent(robotsUrl);
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), proxy.timeout);
          
          const response = await fetch(proxyUrl, {
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            let content = '';
            
            if (proxy.name === 'allorigins') {
              content = data.contents || '';
            } else if (proxy.name === 'codetabs') {
              content = data || '';
            } else {
              content = data.contents || data.body || data.data || '';
            }
            
            if (content && content.length > 0) {
              return {
                exists: true,
                content: content
              };
            }
          }
        } catch (error) {
          console.warn(`Robots.txt check failed with ${proxy.name}:`, error);
          continue;
        }
      }
      
      return { exists: false, content: null };
      
    } catch (error) {
      console.warn(`Failed to check robots.txt for ${domain}:`, error);
      return { exists: false, content: null };
    }
  }
}
