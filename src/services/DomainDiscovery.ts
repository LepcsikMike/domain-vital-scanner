
import { DnsLookup } from './DnsLookup';

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
  
  // Real German medical domains database
  private realMedicalDomains = [
    'aerzte.de',
    'netdoktor.de',
    'onmeda.de',
    'gesundheit.de',
    'apotheken-umschau.de',
    'medizinfuchs.de',
    'klinikum.de',
    'praxisvita.de',
    'doccheck.com',
    'medscape.de',
    'rki.de',
    'kbv.de',
    'bundesaerztekammer.de',
    'pharmazeutische-zeitung.de',
    'deutsches-gesundheitsnetz.de'
  ];

  private realBusinessDomains = [
    // Handwerk
    'handwerk.com',
    'handwerker.de',
    'meisterbetrieb.de',
    'hwk.de',
    'bauportal.de',
    
    // Gastronomie
    'restaurant.de',
    'gastro.de',
    'lieferando.de',
    'opentable.de',
    'falstaff.de',
    
    // Einzelhandel
    'einzelhandel.de',
    'shop.de',
    'handel.de',
    'retail.de',
    'verkauf.de',
    
    // Dienstleistung
    'service.de',
    'dienstleistung.de',
    'beratung.de',
    'consulting.de',
    'agentur.de'
  ];
  
  async discoverDomains(options: DomainDiscoveryOptions): Promise<string[]> {
    console.log('Starting enhanced domain discovery with options:', options);
    
    const cacheKey = JSON.stringify(options);
    if (this.cache.has(cacheKey)) {
      console.log('Returning cached results');
      return this.cache.get(cacheKey)!;
    }
    
    try {
      let targetDomains: string[] = [];
      
      // Select domains based on search query and industry
      if (options.query.toLowerCase().includes('medizin') || 
          options.query.toLowerCase().includes('arzt') || 
          options.query.toLowerCase().includes('gesundheit') ||
          options.industry === 'medizin') {
        targetDomains = [...this.realMedicalDomains];
      } else if (options.industry) {
        targetDomains = this.getDomainsByIndustry(options.industry);
      } else {
        // General search - mix of different domains
        targetDomains = [
          ...this.realMedicalDomains.slice(0, 5),
          ...this.realBusinessDomains.slice(0, 10)
        ];
      }
      
      // Add location-specific domains if specified
      if (options.location) {
        const locationDomains = this.getLocationSpecificDomains(options.location);
        targetDomains.push(...locationDomains);
      }
      
      // Shuffle and limit results
      const shuffled = this.shuffleArray(targetDomains);
      const selectedDomains = shuffled.slice(0, options.maxResults || 8);
      
      console.log(`Selected ${selectedDomains.length} domains for validation:`, selectedDomains);
      
      // Validate domains quickly
      const validatedDomains = [];
      for (const domain of selectedDomains) {
        const isValid = await this.quickValidateDomain(domain);
        if (isValid) {
          validatedDomains.push(domain);
          console.log(`✓ Validated: ${domain}`);
        } else {
          console.log(`✗ Failed: ${domain}`);
        }
        
        // Short delay to avoid overwhelming
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Stop if we have enough results
        if (validatedDomains.length >= (options.maxResults || 8)) {
          break;
        }
      }
      
      // Cache results
      this.cache.set(cacheKey, validatedDomains);
      
      console.log(`Returning ${validatedDomains.length} validated domains:`, validatedDomains);
      return validatedDomains;
      
    } catch (error) {
      console.error('Domain discovery failed:', error);
      return this.getFallbackDomains(options);
    }
  }
  
  private getDomainsByIndustry(industry: string): string[] {
    switch (industry.toLowerCase()) {
      case 'medizin':
        return [...this.realMedicalDomains];
      case 'handwerk':
        return this.realBusinessDomains.filter(d => 
          d.includes('handwerk') || d.includes('meister') || d.includes('bau')
        );
      case 'gastronomie':
        return this.realBusinessDomains.filter(d => 
          d.includes('restaurant') || d.includes('gastro') || d.includes('lieferando')
        );
      case 'einzelhandel':
        return this.realBusinessDomains.filter(d => 
          d.includes('shop') || d.includes('handel') || d.includes('retail')
        );
      case 'dienstleistung':
        return this.realBusinessDomains.filter(d => 
          d.includes('service') || d.includes('beratung') || d.includes('consulting')
        );
      default:
        return this.realBusinessDomains;
    }
  }
  
  private getLocationSpecificDomains(location: string): string[] {
    const locationLower = location.toLowerCase();
    const locationDomains = [];
    
    // Add some real location-based domains
    if (locationLower.includes('berlin')) {
      locationDomains.push('berlin.de', 'rbb24.de', 'berliner-zeitung.de');
    } else if (locationLower.includes('münchen') || locationLower.includes('muenchen')) {
      locationDomains.push('muenchen.de', 'tz.de', 'merkur.de');
    } else if (locationLower.includes('hamburg')) {
      locationDomains.push('hamburg.de', 'mopo.de', 'ndr.de');
    } else if (locationLower.includes('köln') || locationLower.includes('koeln')) {
      locationDomains.push('koeln.de', 'express.de', 'ksta.de');
    }
    
    return locationDomains;
  }
  
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  private async quickValidateDomain(domain: string): Promise<boolean> {
    try {
      // First check DNS existence
      const dnsExists = await this.dnsLookup.checkDomainExists(domain);
      if (!dnsExists) {
        return false;
      }
      
      // Quick HTTP check with short timeout
      const proxyUrl = `${this.corsProxy}${encodeURIComponent(`https://${domain}`)}`;
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.status && data.status.http_code < 500;
      }
      
      return false;
    } catch (error) {
      console.warn(`Quick validation failed for ${domain}:`, error);
      return false;
    }
  }
  
  private getFallbackDomains(options: DomainDiscoveryOptions): string[] {
    console.log('Using fallback domains for:', options);
    
    if (options.query.toLowerCase().includes('medizin') || 
        options.query.toLowerCase().includes('arzt') || 
        options.industry === 'medizin') {
      return ['aerzte.de', 'netdoktor.de', 'gesundheit.de', 'apotheken-umschau.de'];
    }
    
    // Return relevant fallback domains based on industry
    switch (options.industry) {
      case 'handwerk':
        return ['handwerk.com', 'meisterbetrieb.de', 'bauportal.de'];
      case 'gastronomie':
        return ['restaurant.de', 'lieferando.de', 'opentable.de'];
      case 'einzelhandel':
        return ['shop.de', 'handel.de', 'retail.de'];
      case 'dienstleistung':
        return ['service.de', 'beratung.de', 'consulting.de'];
      default:
        return ['spiegel.de', 'zeit.de', 'focus.de', 'handelsblatt.de'];
    }
  }
  
  async validateDomain(domain: string): Promise<boolean> {
    return this.quickValidateDomain(domain);
  }
}
