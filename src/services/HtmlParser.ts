import { getDomainUrl } from '@/utils/urlUtils';

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
}

export class HtmlParser {
  private corsProxies = [
    'https://api.allorigins.win/get?url=',
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/'
  ];
  
  async parseWebsite(domain: string): Promise<ParsedHtmlData> {
    const startTime = Date.now();
    console.log(`Parsing website: ${domain}`);
    
    try {
      // Normalize the domain to prevent double protocol issues
      const cleanUrl = getDomainUrl(domain);
      console.log(`Normalized URL for parsing: ${cleanUrl}`);
      
      // Try multiple proxies until one works
      for (let proxyIndex = 0; proxyIndex < this.corsProxies.length; proxyIndex++) {
        try {
          const result = await this.tryParseWithProxy(cleanUrl, proxyIndex, startTime);
          if (result) {
            console.log(`Successfully parsed ${domain} with proxy ${proxyIndex + 1}`);
            return result;
          }
        } catch (error) {
          console.warn(`Proxy ${proxyIndex + 1} failed for ${domain}:`, error);
          continue;
        }
      }
      
      // If all proxies failed
      console.error(`All proxies failed for ${domain}`);
      return this.getEmptyParsedData(Date.now() - startTime);
      
    } catch (error) {
      console.error(`Failed to parse ${domain}:`, error);
      return this.getEmptyParsedData(Date.now() - startTime);
    }
  }
  
  private async tryParseWithProxy(url: string, proxyIndex: number, startTime: number): Promise<ParsedHtmlData | null> {
    const corsProxy = this.corsProxies[proxyIndex];
    const proxyUrl = corsProxy + encodeURIComponent(url);
    
    console.log(`Trying to parse ${url} with proxy ${proxyIndex + 1}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
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
        console.warn(`Proxy ${proxyIndex + 1} returned ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      // Handle different proxy response formats
      let html = '';
      if (corsProxy.includes('allorigins')) {
        html = data.contents || '';
      } else {
        html = data.contents || data.body || data.data || '';
      }
      
      if (!html || html.length < 100) {
        console.warn(`Proxy ${proxyIndex + 1} returned insufficient content`);
        return null;
      }
      
      const responseTime = Date.now() - startTime;
      return this.extractDataFromHtml(html, responseTime);
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.warn(`Request timeout for ${url} via proxy ${proxyIndex + 1}`);
      } else {
        console.warn(`Network error for ${url} via proxy ${proxyIndex + 1}:`, error);
      }
      
      return null;
    }
  }
  
  private extractDataFromHtml(html: string, responseTime: number): ParsedHtmlData {
    // Create a temporary DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract title
    const title = doc.querySelector('title')?.textContent?.trim() || null;
    
    // Extract meta description
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || null;
    
    // Extract H1 tags
    const h1Elements = doc.querySelectorAll('h1');
    const h1Tags = Array.from(h1Elements).map(h1 => h1.textContent?.trim() || '');
    
    // Extract generator tags
    const generatorElements = doc.querySelectorAll('meta[name="generator"]');
    const generatorTags = Array.from(generatorElements).map(gen => gen.getAttribute('content') || '');
    
    // Check for viewport meta tag
    const hasViewport = doc.querySelector('meta[name="viewport"]') !== null;
    
    // Extract robots directives
    const robotsElement = doc.querySelector('meta[name="robots"]');
    const robotsDirectives = robotsElement ? 
      (robotsElement.getAttribute('content') || '').split(',').map(d => d.trim()) : [];
    
    // Detect technologies
    const technologies = this.detectTechnologies(html, doc);
    
    // Calculate content size
    const contentSize = new Blob([html]).size;
    
    return {
      title,
      metaDescription,
      h1Tags,
      generatorTags,
      hasViewport,
      robotsDirectives,
      technologies,
      responseTime,
      contentSize
    };
  }
  
  private detectTechnologies(html: string, doc: Document): string[] {
    const technologies = [];
    
    // Check for common CMS patterns
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
    
    // Check for outdated technologies
    const generatorContent = doc.querySelector('meta[name="generator"]')?.getAttribute('content') || '';
    
    if (generatorContent.includes('Dreamweaver')) {
      technologies.push('Dreamweaver (veraltet)');
    }
    
    if (generatorContent.includes('FrontPage')) {
      technologies.push('FrontPage (veraltet)');
    }
    
    // Check for JavaScript frameworks
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
    return {
      title: null,
      metaDescription: null,
      h1Tags: [],
      generatorTags: [],
      hasViewport: false,
      robotsDirectives: [],
      technologies: [],
      responseTime,
      contentSize: 0
    };
  }
  
  async checkRobotsTxt(domain: string): Promise<{ exists: boolean; content: string | null }> {
    try {
      // Normalize the domain for robots.txt check
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
      const robotsUrl = `https://${cleanDomain}/robots.txt`;
      console.log(`Checking robots.txt at: ${robotsUrl}`);
      
      // Try multiple proxies for robots.txt check
      for (let proxyIndex = 0; proxyIndex < this.corsProxies.length; proxyIndex++) {
        try {
          const corsProxy = this.corsProxies[proxyIndex];
          const proxyUrl = corsProxy + encodeURIComponent(robotsUrl);
          
          const response = await fetch(proxyUrl, {
            signal: AbortSignal.timeout(10000)
          });
          
          if (response.ok) {
            const data = await response.json();
            const content = corsProxy.includes('allorigins') ? data.contents : data.contents || data.body || data.data;
            
            if (content && content.length > 0) {
              return {
                exists: true,
                content: content
              };
            }
          }
        } catch (error) {
          console.warn(`Robots.txt check failed with proxy ${proxyIndex + 1}:`, error);
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
