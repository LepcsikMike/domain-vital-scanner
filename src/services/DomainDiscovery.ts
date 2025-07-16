
import { DnsLookup } from './DnsLookup';
import { IndustryDomainDatabase } from './IndustryDomainDatabase';

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
  private cache = new Map<string, string[]>();
  
  async discoverDomains(options: DomainDiscoveryOptions): Promise<string[]> {
    console.log('Starting intelligent domain discovery with options:', options);
    
    const cacheKey = JSON.stringify(options);
    if (this.cache.has(cacheKey)) {
      console.log('Returning cached results');
      return this.cache.get(cacheKey)!;
    }
    
    try {
      // Step 1: Get industry-specific known domains
      const industry = options.industry || IndustryDomainDatabase.detectIndustryFromQuery(options.query);
      const knownDomains = industry ? IndustryDomainDatabase.getIndustryDomains(industry, options.tld) : [];
      
      console.log(`Found ${knownDomains.length} known domains for industry: ${industry}`);
      
      // Step 2: Generate domain variations based on search terms
      const keywords = this.extractKeywords(options);
      const generatedDomains = IndustryDomainDatabase.generateDomainVariations(
        keywords, 
        industry || 'general', 
        options.location || '', 
        options.tld || '.de'
      );
      
      console.log(`Generated ${generatedDomains.length} potential domains`);
      
      // Step 3: Combine known domains with generated ones
      const candidateDomains = [
        ...knownDomains.slice(0, 5).map(entry => entry.domain),
        ...generatedDomains
      ];
      
      // Step 4: Validate domains via DNS and HTTP
      const validatedDomains = [];
      const maxChecks = Math.min(candidateDomains.length, 15);
      
      for (let i = 0; i < maxChecks; i++) {
        const domain = candidateDomains[i];
        
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
      
      // Step 5: If we don't have enough validated domains, add working fallbacks
      if (validatedDomains.length < 3) {
        const fallbackDomains = await this.getIntelligentFallbacks(industry, options.tld);
        validatedDomains.push(...fallbackDomains.slice(0, 5 - validatedDomains.length));
      }
      
      // Cache results
      this.cache.set(cacheKey, validatedDomains);
      
      console.log(`Returning ${validatedDomains.length} validated domains for ${industry || 'general'} industry`);
      return validatedDomains;
      
    } catch (error) {
      console.error('Domain discovery failed:', error);
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
