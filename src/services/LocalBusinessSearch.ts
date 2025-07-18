export interface LocalSearchOptions {
  business: string;
  location: string;
  tld?: string;
  maxResults?: number;
  radius?: 'city' | 'region' | 'country';
}

export interface LocalSearchResult {
  domains: string[];
  searchTerms: string[];
  confidence: number;
  source: 'google' | 'directory' | 'social' | 'generated';
}

export class LocalBusinessSearch {
  private germanCities = new Map([
    ['berlin', ['brandenburg', 'potsdam', 'cottbus']],
    ['münchen', ['bayern', 'augsburg', 'regensburg']],
    ['hamburg', ['schleswig-holstein', 'lübeck', 'kiel']],
    ['köln', ['düsseldorf', 'essen', 'dortmund', 'nordrhein-westfalen']],
    ['frankfurt', ['wiesbaden', 'mainz', 'darmstadt', 'hessen']],
    ['stuttgart', ['karlsruhe', 'mannheim', 'baden-württemberg']],
    ['düsseldorf', ['köln', 'essen', 'dortmund', 'nordrhein-westfalen']],
    ['leipzig', ['dresden', 'chemnitz', 'sachsen']],
    ['nürnberg', ['erlangen', 'fürth', 'bayern']],
    ['hannover', ['braunschweig', 'göttingen', 'niedersachsen']]
  ]);

  private businessPatterns = new Map([
    ['zahnarzt', ['dentist', 'dental', 'zahnmedizin', 'zahnpraxis', 'kieferorthopäde']],
    ['anwalt', ['rechtsanwalt', 'kanzlei', 'jurist', 'legal', 'recht']],
    ['arzt', ['medizin', 'praxis', 'doktor', 'gesundheit', 'klinik']],
    ['friseur', ['salon', 'haare', 'beauty', 'styling', 'coiffeur']],
    ['restaurant', ['gastronomie', 'essen', 'küche', 'bistro', 'cafe']],
    ['hotel', ['übernachtung', 'pension', 'gasthaus', 'unterkunft']],
    ['apotheke', ['pharmazie', 'medikament', 'gesundheit', 'arzneimittel']],
    ['immobilien', ['makler', 'wohnung', 'haus', 'miete', 'verkauf']],
    ['autohaus', ['auto', 'fahrzeug', 'kfz', 'werkstatt', 'garage']],
    ['versicherung', ['assekuranz', 'schutz', 'vorsorge', 'risiko']]
  ]);

  async searchLocalBusinesses(options: LocalSearchOptions): Promise<LocalSearchResult[]> {
    console.log('Starting local business search for:', options);
    
    const results: LocalSearchResult[] = [];
    const business = options.business.toLowerCase();
    const location = options.location.toLowerCase();
    
    // 1. Generate primary search terms
    const searchTerms = this.generateSearchTerms(business, location);
    
    // 2. Generate domain patterns for local businesses
    const primaryDomains = this.generateLocalDomains(business, location, options.tld || '.de');
    results.push({
      domains: primaryDomains,
      searchTerms: searchTerms.primary,
      confidence: 0.9,
      source: 'generated'
    });
    
    // 3. Generate expanded search with radius
    if (options.radius !== 'city') {
      const expandedDomains = this.expandSearchRadius(business, location, options.tld || '.de');
      if (expandedDomains.length > 0) {
        results.push({
          domains: expandedDomains,
          searchTerms: searchTerms.expanded,
          confidence: 0.7,
          source: 'generated'
        });
      }
    }
    
    // 4. Generate alternative business terms
    const alternativeDomains = this.generateAlternativeBusinessTerms(business, location, options.tld || '.de');
    if (alternativeDomains.length > 0) {
      results.push({
        domains: alternativeDomains,
        searchTerms: searchTerms.alternatives,
        confidence: 0.6,
        source: 'generated'
      });
    }
    
    return results;
  }

  private generateSearchTerms(business: string, location: string) {
    const businessVariations = this.businessPatterns.get(business) || [business];
    const locationVariations = this.getLocationVariations(location);
    
    return {
      primary: [
        `${business} ${location} site:.de`,
        `${business}praxis ${location} site:.de`,
        `${business}-${location} site:.de`
      ],
      expanded: locationVariations.map(loc => `${business} ${loc} site:.de`),
      alternatives: businessVariations.map(biz => `${biz} ${location} site:.de`)
    };
  }

  private generateLocalDomains(business: string, location: string, tld: string): string[] {
    const domains: string[] = [];
    const cleanBusiness = this.cleanBusinessTerm(business);
    const cleanLocation = this.cleanLocationTerm(location);
    
    // Enhanced patterns for German local businesses with realistic variations
    const professionalPrefixes = ['dr', 'prof', 'med', 'drs'];
    const businessSuffixes = ['praxis', 'zentrum', 'klinik', 'kanzlei', 'institut', 'gruppe', 'team', 'service', 'care'];
    const locationVariants = [cleanLocation, `${cleanLocation}er`, `${cleanLocation}-city`, `${cleanLocation}-mitte`];
    
    // Professional practice patterns
    professionalPrefixes.forEach(prefix => {
      locationVariants.forEach(locVariant => {
        domains.push(
          `${prefix}-${cleanBusiness}-${locVariant}${tld}`,
          `${prefix}${cleanBusiness}${locVariant}${tld}`,
          `${prefix}-${locVariant}-${cleanBusiness}${tld}`
        );
      });
    });
    
    // Business type patterns
    businessSuffixes.forEach(suffix => {
      locationVariants.forEach(locVariant => {
        domains.push(
          `${cleanBusiness}-${suffix}-${locVariant}${tld}`,
          `${cleanBusiness}${suffix}-${locVariant}${tld}`,
          `${locVariant}-${cleanBusiness}-${suffix}${tld}`,
          `${suffix}-${cleanBusiness}-${locVariant}${tld}`
        );
      });
    });
    
    // Geographic patterns
    locationVariants.forEach(locVariant => {
      domains.push(
        `${cleanBusiness}-${locVariant}${tld}`,
        `${cleanBusiness}${locVariant}${tld}`,
        `${locVariant}-${cleanBusiness}${tld}`,
        `${locVariant}${cleanBusiness}${tld}`,
        `${cleanBusiness}-${locVariant}-online${tld}`,
        `${cleanBusiness}24-${locVariant}${tld}`,
        `${cleanBusiness}-${locVariant}-center${tld}`,
        `${cleanBusiness}-clinic-${locVariant}${tld}`,
        `${cleanBusiness}-office-${locVariant}${tld}`
      );
    });
    
    // Corporate patterns
    ['group', 'corporate', 'company', 'business'].forEach(corp => {
      domains.push(
        `${cleanBusiness}-${corp}${tld}`,
        `${cleanBusiness}${corp}${tld}`,
        `${cleanLocation}-${cleanBusiness}-${corp}${tld}`
      );
    });
    
    // Filter for realistic length and format
    return domains
      .filter(domain => domain.length >= 8 && domain.length <= 60)
      .filter(domain => !domain.includes('--'))
      .slice(0, 25); // Return top 25 most likely patterns
  }

  private expandSearchRadius(business: string, location: string, tld: string): string[] {
    const nearbyLocations = this.germanCities.get(location.toLowerCase()) || [];
    const domains: string[] = [];
    
    nearbyLocations.forEach(nearbyLocation => {
      const expandedDomains = this.generateLocalDomains(business, nearbyLocation, tld);
      domains.push(...expandedDomains.slice(0, 3)); // Take top 3 patterns for each location
    });
    
    return domains;
  }

  private generateAlternativeBusinessTerms(business: string, location: string, tld: string): string[] {
    const alternatives = this.businessPatterns.get(business.toLowerCase()) || [];
    const domains: string[] = [];
    
    alternatives.forEach(altBusiness => {
      const altDomains = this.generateLocalDomains(altBusiness, location, tld);
      domains.push(...altDomains.slice(0, 2)); // Take top 2 patterns for each alternative
    });
    
    return domains;
  }

  private getLocationVariations(location: string): string[] {
    const variations = [location];
    const nearby = this.germanCities.get(location.toLowerCase());
    
    if (nearby) {
      variations.push(...nearby.slice(0, 2)); // Add 2 nearby locations
    }
    
    return variations;
  }

  private cleanBusinessTerm(business: string): string {
    return business
      .toLowerCase()
      .replace(/[^a-zA-ZäöüßÄÖÜ]/g, '')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');
  }

  private cleanLocationTerm(location: string): string {
    return location
      .toLowerCase()
      .replace(/[^a-zA-ZäöüßÄÖÜ]/g, '')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss');
  }

  // Generate Google search queries optimized for local businesses
  generateGoogleSearchQueries(business: string, location: string): string[] {
    return [
      `"${business}" "${location}" site:.de`,
      `${business} praxis ${location} site:.de`,
      `${business} ${location} deutschland site:.de`,
      `${business} zentrum ${location} site:.de`,
      `dr ${business} ${location} site:.de`,
      `${business} klinik ${location} site:.de`,
      `${business} ${location} termine site:.de`,
      `${business} ${location} kontakt site:.de`
    ];
  }

  // Validate if a domain looks like a local business
  isLocalBusinessDomain(domain: string, business: string, location: string): boolean {
    const lowerDomain = domain.toLowerCase();
    const lowerBusiness = business.toLowerCase();
    const lowerLocation = location.toLowerCase();
    
    const businessMatch = lowerDomain.includes(lowerBusiness) || 
                         (this.businessPatterns.get(lowerBusiness) || [])
                           .some(alt => lowerDomain.includes(alt));
    
    const locationMatch = lowerDomain.includes(lowerLocation) ||
                         (this.germanCities.get(lowerLocation) || [])
                           .some(alt => lowerDomain.includes(alt));
    
    return businessMatch && locationMatch;
  }
}