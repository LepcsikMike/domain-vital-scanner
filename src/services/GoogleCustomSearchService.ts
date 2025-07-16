
export interface CustomSearchResult {
  domains: string[];
  totalResults: number;
  searchTime: number;
}

export class GoogleCustomSearchService {
  private apiKey: string | null = null;
  private searchEngineId: string | null = null;
  private readonly baseUrl = 'https://www.googleapis.com/customsearch/v1';
  
  constructor() {
    this.apiKey = localStorage.getItem('google_search_api_key') || null;
    this.searchEngineId = localStorage.getItem('google_search_engine_id') || null;
  }
  
  setCredentials(apiKey: string, searchEngineId: string) {
    this.apiKey = apiKey;
    this.searchEngineId = searchEngineId;
    localStorage.setItem('google_search_api_key', apiKey);
    localStorage.setItem('google_search_engine_id', searchEngineId);
  }
  
  hasCredentials(): boolean {
    return !!(this.apiKey && this.searchEngineId);
  }
  
  async searchDomains(query: string, tld: string = '.de', maxResults: number = 10): Promise<CustomSearchResult> {
    if (!this.hasCredentials()) {
      throw new Error('Google Custom Search credentials not configured');
    }
    
    const startTime = Date.now();
    
    try {
      // Build search query for specific TLD and industry
      const searchQuery = `site:*${tld} ${query}`;
      
      const params = new URLSearchParams({
        key: this.apiKey!,
        cx: this.searchEngineId!,
        q: searchQuery,
        num: Math.min(maxResults, 10).toString()
      });
      
      const response = await fetch(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Custom Search API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract domains from search results
      const domains = this.extractDomains(data.items || [], tld);
      
      return {
        domains: [...new Set(domains)], // Remove duplicates
        totalResults: parseInt(data.searchInformation?.totalResults || '0'),
        searchTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error('Google Custom Search failed:', error);
      return {
        domains: [],
        totalResults: 0,
        searchTime: Date.now() - startTime
      };
    }
  }
  
  private extractDomains(items: any[], tld: string): string[] {
    const domains: string[] = [];
    
    items.forEach(item => {
      if (item.link) {
        try {
          const url = new URL(item.link);
          const domain = url.hostname.replace(/^www\./, '');
          
          if (domain.endsWith(tld) && !domains.includes(domain)) {
            domains.push(domain);
          }
        } catch (error) {
          console.warn('Invalid URL in search result:', item.link);
        }
      }
    });
    
    return domains;
  }
  
  async searchByIndustry(industry: string, location?: string, tld: string = '.de'): Promise<CustomSearchResult> {
    let query = industry;
    
    if (location) {
      query += ` ${location}`;
    }
    
    // Add industry-specific keywords
    const industryKeywords = this.getIndustryKeywords(industry);
    if (industryKeywords.length > 0) {
      query += ` ${industryKeywords.slice(0, 2).join(' ')}`;
    }
    
    return this.searchDomains(query, tld, 15);
  }
  
  private getIndustryKeywords(industry: string): string[] {
    const keywordMap: Record<string, string[]> = {
      'medizin': ['arzt', 'praxis', 'klinik', 'gesundheit', 'therapie'],
      'handwerk': ['meister', 'betrieb', 'service', 'reparatur', 'installation'],
      'gastronomie': ['restaurant', 'cafe', 'bistro', 'küche', 'catering'],
      'einzelhandel': ['shop', 'store', 'laden', 'verkauf', 'handel'],
      'dienstleistung': ['service', 'beratung', 'consulting', 'support'],
      'technologie': ['software', 'digital', 'tech', 'innovation', 'IT'],
      'immobilien': ['makler', 'verkauf', 'vermietung', 'immobilie'],
      'bildung': ['schule', 'kurs', 'training', 'bildung', 'lernen'],
      'finance': ['bank', 'versicherung', 'finanz', 'kredit', 'anlage']
    };
    
    return keywordMap[industry.toLowerCase()] || [];
  }
}
