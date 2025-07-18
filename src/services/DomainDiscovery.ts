import { DnsLookup } from './DnsLookup';
import { IndustryDomainDatabase } from './IndustryDomainDatabase';
import { GoogleCustomSearchService } from './GoogleCustomSearchService';
import { CommonCrawlService } from './CommonCrawlService';
import { LocalBusinessSearch, LocalSearchOptions } from './LocalBusinessSearch';
import { ExternalApiService } from './ExternalApiService';
import { DirectoryScraperService } from './DirectoryScraperService';
import { SocialMediaSearchService } from './SocialMediaSearchService';

export interface DomainDiscoveryOptions {
  query: string;
  industry?: string;
  location?: string;
  tld?: string;
  maxResults?: number;
}

export class DomainDiscovery {
  private corsProxy = 'https://api.allorigins.win/get?url=';
  private dnsLookup = new DnsLookup();
  private googleSearch = new GoogleCustomSearchService();
  private commonCrawl = new CommonCrawlService();
  private localSearch = new LocalBusinessSearch();
  private externalApi = new ExternalApiService();
  private directoryScraper = new DirectoryScraperService();
  private socialMedia = new SocialMediaSearchService();
  private cache = new Map<string, string[]>();
  
  async discoverDomains(options: DomainDiscoveryOptions): Promise<string[]> {
    console.log('Starting enhanced intelligent domain discovery with options:', options);
    
    const cacheKey = JSON.stringify(options);
    if (this.cache.has(cacheKey)) {
      console.log('Returning cached results');
      return this.cache.get(cacheKey)!;
    }
    
    try {
      const discoveredDomains: string[] = [];
      
      // Step 0: Local business search optimization
      if (options.location && options.query) {
        console.log('Using local business search for location-based discovery');
        try {
          const localResults = await this.localSearch.searchLocalBusinesses({
            business: options.query,
            location: options.location,
            tld: options.tld || '.de',
            maxResults: options.maxResults || 8,
            radius: 'region'
          });
          
          // Add high-confidence local results first
          localResults.forEach(result => {
            if (result.confidence >= 0.8) {
              result.domains.slice(0, 6).forEach(domain => {
                if (!discoveredDomains.includes(domain)) {
                  discoveredDomains.push(domain);
                }
              });
            }
          });
          
          console.log(`Local business search found ${discoveredDomains.length} potential domains`);
        } catch (error) {
          console.warn('Local business search failed:', error);
        }
      }

      // Step 0.5: Enhanced External APIs (Yelp, Google Places, Hunter.io) - parallel execution
      if (options.query) {
        console.log('Using enhanced multi-source API search');
        try {
          const externalResults = await this.externalApi.searchAllSources(options);
          
          externalResults.forEach(domain => {
            if (!discoveredDomains.includes(domain)) {
              discoveredDomains.push(domain);
            }
          });
          
          console.log(`Enhanced external APIs found ${externalResults.length} quality domains`);
        } catch (error) {
          console.warn('Enhanced external API search failed:', error);
        }
      }

      // Step 0.6: Directory Scraping (German business directories) - parallel execution
      if (options.location && options.query) {
        console.log('Using German business directories');
        try {
          const [gelbeSeitenResults, oertlicheResults, jamedaResults, elevenResults] = await Promise.all([
            this.directoryScraper.searchGelbeSeiten(options),
            this.directoryScraper.searchDasOertliche(options),
            this.directoryScraper.searchJameda(options),
            this.directoryScraper.search11880(options)
          ]);
          
          [...gelbeSeitenResults, ...oertlicheResults, ...jamedaResults, ...elevenResults].forEach(domain => {
            if (!discoveredDomains.includes(domain)) {
              discoveredDomains.push(domain);
            }
          });
          
          console.log(`Directory scraping found ${gelbeSeitenResults.length + oertlicheResults.length + jamedaResults.length + elevenResults.length} additional domains`);
        } catch (error) {
          console.warn('Directory scraping failed:', error);
        }
      }

      // Step 0.7: Social Media Search - parallel execution
      if (options.location && options.query) {
        console.log('Using social media business search');
        try {
          const [linkedinResults, facebookResults, instagramResults] = await Promise.all([
            this.socialMedia.searchLinkedIn(options),
            this.socialMedia.searchFacebook(options),
            this.socialMedia.searchInstagram(options)
          ]);
          
          [...linkedinResults, ...facebookResults, ...instagramResults].forEach(domain => {
            if (!discoveredDomains.includes(domain)) {
              discoveredDomains.push(domain);
            }
          });
          
          console.log(`Social media found ${linkedinResults.length + facebookResults.length + instagramResults.length} additional domains`);
        } catch (error) {
          console.warn('Social media search failed:', error);
        }
      }
      
      // Step 1: Enhanced Google Custom Search for local businesses
      if (this.googleSearch.hasCredentials()) {
        console.log('Using Google Custom Search for domain discovery');
        try {
          let googleResult;
          
          if (options.location) {
            // Use local business optimized search
            const localQueries = this.localSearch.generateGoogleSearchQueries(
              options.query, 
              options.location
            );
            
            // Try multiple local search patterns
            for (const query of localQueries.slice(0, 3)) {
              const result = await this.googleSearch.searchDomains(query, options.tld || '.de', 5);
              if (result.domains.length > 0) {
                result.domains.forEach(domain => {
                  if (!discoveredDomains.includes(domain)) {
                    discoveredDomains.push(domain);
                  }
                });
                break; // Use first successful query
              }
            }
          } else {
            // Standard industry search
            googleResult = await this.googleSearch.searchByIndustry(
              options.industry || options.query,
              options.location,
              options.tld
            );
            
            googleResult.domains.forEach(domain => {
              if (!discoveredDomains.includes(domain)) {
                discoveredDomains.push(domain);
              }
            });
          }
          
          console.log(`Google Search found additional domains, total: ${discoveredDomains.length}`);
        } catch (error) {
          console.warn('Google Custom Search failed:', error);
        }
      }
      
      // Step 2: Try Common Crawl for additional domains
      if (discoveredDomains.length < 8) {
        console.log('Enhancing with Common Crawl data');
        try {
          const crawlResult = await this.commonCrawl.searchByIndustry(
            options.industry || options.query,
            options.tld || '.de'
          );
          
          // Add new domains not already found
          crawlResult.domains.forEach(domain => {
            if (!discoveredDomains.includes(domain)) {
              discoveredDomains.push(domain);
            }
          });
          
          console.log(`Common Crawl added ${crawlResult.domains.length} additional domains`);
        } catch (error) {
          console.warn('Common Crawl search failed:', error);
        }
      }
      
      // Step 3: Fallback to existing industry database
      if (discoveredDomains.length < 5) {
        console.log('Using fallback industry database');
        const industry = options.industry || IndustryDomainDatabase.detectIndustryFromQuery(options.query);
        const knownDomains = industry ? IndustryDomainDatabase.getIndustryDomains(industry, options.tld) : [];
        
        knownDomains.slice(0, 5).forEach(entry => {
          if (!discoveredDomains.includes(entry.domain)) {
            discoveredDomains.push(entry.domain);
          }
        });
      }
      
      // Step 4: Generate additional domains if still needed
      if (discoveredDomains.length < 5) {
        console.log('Generating additional domain variations');
        const keywords = this.extractKeywords(options);
        const generatedDomains = IndustryDomainDatabase.generateDomainVariations(
          keywords, 
          options.industry || 'general', 
          options.location || '', 
          options.tld || '.de'
        );
        
        generatedDomains.slice(0, 5).forEach(domain => {
          if (!discoveredDomains.includes(domain)) {
            discoveredDomains.push(domain);
          }
        });
      }
      
      // Step 5: Validate discovered domains
      const validatedDomains = [];
      const maxChecks = Math.min(discoveredDomains.length, 15);
      
      for (let i = 0; i < maxChecks; i++) {
        const domain = discoveredDomains[i];
        
        try {
          const isValid = await this.quickValidateDomain(domain);
          if (isValid) {
            validatedDomains.push(domain);
            console.log(`✓ Validated domain: ${domain}`);
          }
        } catch (error) {
          console.warn(`Validation failed for ${domain}:`, error);
        }
        
        // Add delay between validations to be respectful
        if (i < maxChecks - 1) {
          await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        // Stop if we have enough results
        if (validatedDomains.length >= (options.maxResults || 8)) {
          break;
        }
      }
      
      // Step 6: Ensure minimum results with intelligent fallbacks
      if (validatedDomains.length < 3) {
        const fallbackDomains = await this.getIntelligentFallbacks(options.industry, options.tld);
        fallbackDomains.forEach(domain => {
          if (!validatedDomains.includes(domain)) {
            validatedDomains.push(domain);
          }
        });
      }
      
      // Cache results
      this.cache.set(cacheKey, validatedDomains);
      
      console.log(`Enhanced discovery completed: ${validatedDomains.length} validated domains`);
      return validatedDomains.slice(0, options.maxResults || 8);
      
    } catch (error) {
      console.error('Enhanced domain discovery failed:', error);
      return this.getIntelligentFallbacks(options.industry, options.tld);
    }
  }
  
  private extractKeywords(options: DomainDiscoveryOptions): string[] {
    const keywords = [];
    
    if (options.query) {
      keywords.push(options.query.toLowerCase());
    }
    
    if (options.location) {
      keywords.push(options.location.toLowerCase());
    }
    
    return keywords.filter((keyword, index, self) => self.indexOf(keyword) === index);
  }
  
  private async getIntelligentFallbacks(industry?: string, tld?: string): Promise<string[]> {
    // Get industry-specific fallbacks first
    if (industry) {
      const industryDomains = IndustryDomainDatabase.getIndustryDomains(industry, tld);
      if (industryDomains.length > 0) {
        return industryDomains.slice(0, 5).map(entry => entry.domain);
      }
    }
    
    // General fallbacks based on TLD
    const tldSuffix = tld || '.de';
    const fallbacks: Record<string, string[]> = {
      '.de': ['spiegel.de', 'zeit.de', 'focus.de', 'n-tv.de', 'handelsblatt.de'],
      '.com': ['google.com', 'microsoft.com', 'github.com', 'stackoverflow.com'],
      '.org': ['wikipedia.org', 'mozilla.org', 'apache.org'],
      '.net': ['sourceforge.net', 'cloudflare.net']
    };
    
    return fallbacks[tldSuffix] || fallbacks['.de'];
  }
  
  async quickValidateDomain(domain: string): Promise<boolean> {
    try {
      console.log(`Quick validating domain: ${domain}`);
      
      // First check DNS with shorter timeout
      const dnsExists = await this.dnsLookup.checkDomainExists(domain);
      if (!dnsExists) {
        return false;
      }
      
      // Then check HTTP accessibility with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const proxyUrl = `${this.corsProxy}${encodeURIComponent(`https://${domain}`)}`;
        const response = await fetch(proxyUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          return data.status && data.status.http_code < 500;
        }
        
        return false;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        // If HTTP fails but DNS exists, still consider it valid
        return true;
      }
      
    } catch (error) {
      console.warn(`Quick validation failed for ${domain}:`, error);
      return false;
    }
  }
}
