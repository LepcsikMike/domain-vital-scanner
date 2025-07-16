
export interface IndustryDomainEntry {
  domain: string;
  industry: string;
  country: string;
  verified: boolean;
}

export class IndustryDomainDatabase {
  private static industryDomains: Record<string, IndustryDomainEntry[]> = {
    medizin: [
      { domain: 'doctolib.de', industry: 'medizin', country: 'de', verified: true },
      { domain: 'jameda.de', industry: 'medizin', country: 'de', verified: true },
      { domain: 'gesundheit.de', industry: 'medizin', country: 'de', verified: true },
      { domain: 'netdoktor.de', industry: 'medizin', country: 'de', verified: true },
      { domain: 'apotheken-umschau.de', industry: 'medizin', country: 'de', verified: true },
      { domain: 'ratiopharm.de', industry: 'medizin', country: 'de', verified: true },
      { domain: 'klinikum.de', industry: 'medizin', country: 'de', verified: true },
      { domain: 'praxis-info.de', industry: 'medizin', country: 'de', verified: true }
    ],
    handwerk: [
      { domain: 'handwerker.de', industry: 'handwerk', country: 'de', verified: true },
      { domain: 'baubeaver.de', industry: 'handwerk', country: 'de', verified: true },
      { domain: 'dachdeckerei-mueller.de', industry: 'handwerk', country: 'de', verified: true },
      { domain: 'elektriker-berlin.de', industry: 'handwerk', country: 'de', verified: true },
      { domain: 'malermeister.de', industry: 'handwerk', country: 'de', verified: true },
      { domain: 'tischler-service.de', industry: 'handwerk', country: 'de', verified: true }
    ],
    gastronomie: [
      { domain: 'lieferando.de', industry: 'gastronomie', country: 'de', verified: true },
      { domain: 'restaurant.info', industry: 'gastronomie', country: 'de', verified: true },
      { domain: 'opentable.de', industry: 'gastronomie', country: 'de', verified: true },
      { domain: 'tripadvisor.de', industry: 'gastronomie', country: 'de', verified: true },
      { domain: 'booking.com', industry: 'gastronomie', country: 'com', verified: true },
      { domain: 'hotel.de', industry: 'gastronomie', country: 'de', verified: true }
    ],
    technologie: [
      { domain: 'sap.com', industry: 'technologie', country: 'com', verified: true },
      { domain: 'teamviewer.com', industry: 'technologie', country: 'com', verified: true },
      { domain: 'software-ag.com', industry: 'technologie', country: 'com', verified: true },
      { domain: 'codecentric.de', industry: 'technologie', country: 'de', verified: true }
    ],
    einzelhandel: [
      { domain: 'otto.de', industry: 'einzelhandel', country: 'de', verified: true },
      { domain: 'zalando.de', industry: 'einzelhandel', country: 'de', verified: true },
      { domain: 'amazon.de', industry: 'einzelhandel', country: 'de', verified: true },
      { domain: 'ebay.de', industry: 'einzelhandel', country: 'de', verified: true }
    ]
  };

  private static keywordMappings: Record<string, string[]> = {
    medizin: ['arzt', 'praxis', 'klinik', 'gesundheit', 'medizin', 'zahnarzt', 'apotheke', 'therapie'],
    handwerk: ['handwerker', 'bau', 'renovierung', 'installation', 'reparatur', 'service', 'meister'],
    gastronomie: ['restaurant', 'hotel', 'cafe', 'bar', 'küche', 'catering', 'gastronomie'],
    technologie: ['software', 'it', 'tech', 'digital', 'entwicklung', 'app', 'web'],
    einzelhandel: ['shop', 'store', 'verkauf', 'handel', 'online', 'ecommerce']
  };

  static detectIndustryFromQuery(query: string): string | null {
    const normalizedQuery = query.toLowerCase();
    
    for (const [industry, keywords] of Object.entries(this.keywordMappings)) {
      if (keywords.some(keyword => normalizedQuery.includes(keyword))) {
        return industry;
      }
    }
    
    return null;
  }

  static getIndustryDomains(industry: string, tld?: string): IndustryDomainEntry[] {
    const domains = this.industryDomains[industry] || [];
    
    if (tld) {
      const tldSuffix = tld.startsWith('.') ? tld.substring(1) : tld;
      return domains.filter(entry => entry.domain.endsWith(`.${tldSuffix}`));
    }
    
    return domains;
  }

  static generateDomainVariations(keywords: string[], industry: string, location: string, tld: string): string[] {
    const domains: string[] = [];
    const tldSuffix = tld.startsWith('.') ? tld : `.${tld}`;
    
    const industryKeywords = this.keywordMappings[industry] || [];
    const allKeywords = [...keywords, ...industryKeywords].slice(0, 3);
    
    const prefixes = ['best', 'top', 'premium', 'lokal', 'ihr', 'mein', 'pro'];
    const suffixes = ['service', 'online', '24', 'express', 'direkt', 'plus', 'center'];
    
    // Basic keyword domains
    allKeywords.forEach(keyword => {
      domains.push(`${keyword}${tldSuffix}`);
      
      // With location
      if (location) {
        const loc = location.toLowerCase().replace(/\s+/g, '-');
        domains.push(`${keyword}-${loc}${tldSuffix}`);
        domains.push(`${loc}-${keyword}${tldSuffix}`);
      }
      
      // With prefixes and suffixes
      prefixes.forEach(prefix => {
        domains.push(`${prefix}-${keyword}${tldSuffix}`);
      });
      
      suffixes.forEach(suffix => {
        domains.push(`${keyword}-${suffix}${tldSuffix}`);
      });
    });
    
    return domains.slice(0, 25);
  }

  static getAllKnownDomains(): string[] {
    const allDomains: string[] = [];
    Object.values(this.industryDomains).forEach(industryList => {
      industryList.forEach(entry => {
        allDomains.push(entry.domain);
      });
    });
    return allDomains;
  }
}
