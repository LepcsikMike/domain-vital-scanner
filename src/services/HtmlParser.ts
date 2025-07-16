
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
  private corsProxy = 'https://api.allorigins.win/get?url=';
  
  async parseWebsite(domain: string): Promise<ParsedHtmlData> {
    const startTime = Date.now();
    console.log(`Parsing website: ${domain}`);
    
    try {
      const proxyUrl = `${this.corsProxy}${encodeURIComponent(`https://${domain}`)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const html = data.contents;
      const responseTime = Date.now() - startTime;
      
      return this.extractDataFromHtml(html, responseTime);
      
    } catch (error) {
      console.error(`Failed to parse ${domain}:`, error);
      return this.getEmptyParsedData(Date.now() - startTime);
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
      const robotsUrl = `https://${domain}/robots.txt`;
      const proxyUrl = `${this.corsProxy}${encodeURIComponent(robotsUrl)}`;
      
      const response = await fetch(proxyUrl);
      
      if (response.ok) {
        const data = await response.json();
        return {
          exists: true,
          content: data.contents
        };
      }
      
      return { exists: false, content: null };
      
    } catch (error) {
      console.warn(`Failed to check robots.txt for ${domain}:`, error);
      return { exists: false, content: null };
    }
  }
}
