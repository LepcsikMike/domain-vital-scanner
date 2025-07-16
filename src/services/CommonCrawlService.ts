
export interface CommonCrawlResult {
  domains: string[];
  totalFound: number;
  crawlDate: string;
}

export class CommonCrawlService {
  private readonly baseUrl = 'https://index.commoncrawl.org/CC-MAIN-2024-10-index';
  private readonly fallbackUrls = [
    'https://index.commoncrawl.org/CC-MAIN-2024-07-index',
    'https://index.commoncrawl.org/CC-MAIN-2024-04-index'
  ];
  
  async searchDomains(keywords: string[], tld: string = '.de', maxResults: number = 50): Promise<CommonCrawlResult> {
    console.log(`Searching Common Crawl for domains with keywords: ${keywords.join(', ')} and TLD: ${tld}`);
    
    try {
      // Build search query
      const query = this.buildSearchQuery(keywords, tld);
      
      const result = await this.performSearch(query, maxResults);
      
      return {
        domains: result.domains,
        totalFound: result.domains.length,
        crawlDate: '2024-10'
      };
      
    } catch (error) {
      console.error('Common Crawl search failed:', error);
      return {
        domains: [],
        totalFound: 0,
        crawlDate: '2024-10'
      };
    }
  }
  
  private buildSearchQuery(keywords: string[], tld: string): string {
    // Common Crawl uses URL pattern matching
    const keywordPattern = keywords.join('|');
    return `url:*${tld}* AND (${keywordPattern})`;
  }
  
  private async performSearch(query: string, maxResults: number): Promise<{ domains: string[] }> {
    const urls = [this.baseUrl, ...this.fallbackUrls];
    
    for (const url of urls) {
      try {
        const result = await this.searchIndex(url, query, maxResults);
        if (result.domains.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn(`Common Crawl index ${url} failed:`, error);
        continue;
      }
    }
    
    return { domains: [] };
  }
  
  private async searchIndex(indexUrl: string, query: string, maxResults: number): Promise<{ domains: string[] }> {
    const searchUrl = `${indexUrl}?url=${encodeURIComponent(query)}&output=json&limit=${maxResults}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
    
    try {
      const response = await fetch(searchUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Common Crawl returned ${response.status}`);
      }
      
      const text = await response.text();
      const domains = this.parseCrawlResponse(text);
      
      return { domains: [...new Set(domains)] }; // Remove duplicates
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  private parseCrawlResponse(text: string): string[] {
    const domains: string[] = [];
    
    try {
      // Common Crawl returns JSONL (one JSON object per line)
      const lines = text.trim().split('\n');
      
      lines.forEach(line => {
        try {
          const record = JSON.parse(line);
          if (record.url) {
            const domain = this.extractDomain(record.url);
            if (domain && !domains.includes(domain)) {
              domains.push(domain);
            }
          }
        } catch (parseError) {
          // Skip invalid JSON lines
        }
      });
      
    } catch (error) {
      console.warn('Failed to parse Common Crawl response:', error);
    }
    
    return domains;
  }
  
  private extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace(/^www\./, '');
    } catch (error) {
      return null;
    }
  }
  
  async searchByIndustry(industry: string, tld: string = '.de'): Promise<CommonCrawlResult> {
    const keywords = this.getIndustryKeywords(industry);
    return this.searchDomains(keywords, tld, 30);
  }
  
  private getIndustryKeywords(industry: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'medizin': ['medizin', 'arzt', 'praxis', 'klinik', 'gesundheit'],
      'handwerk': ['handwerk', 'meister', 'betrieb', 'service'],
      'gastronomie': ['restaurant', 'gastronomie', 'cafe', 'bistro'],
      'einzelhandel': ['shop', 'einzelhandel', 'store', 'verkauf'],
      'dienstleistung': ['dienstleistung', 'service', 'beratung'],
      'technologie': ['technologie', 'software', 'digital', 'tech'],
      'immobilien': ['immobilien', 'makler', 'wohnung'],
      'bildung': ['bildung', 'schule', 'kurs', 'training'],
      'finance': ['finanz', 'bank', 'versicherung', 'kredit']
    };
    
    return keywordMap[industry.toLowerCase()] || [industry];
  }
}
