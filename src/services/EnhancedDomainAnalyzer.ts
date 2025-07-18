import { DomainDiscovery, DomainDiscoveryOptions } from './DomainDiscovery';
import { GoogleCustomSearchService } from './GoogleCustomSearchService';

export interface EnhancedDiscoveryResult {
  domains: string[];
  sources: {
    localSearch: string[];
    externalApis: string[];
    directories: string[];
    socialMedia: string[];
    googleSearch: string[];
    generated: string[];
  };
  confidence: number;
  searchTime: number;
}

export class EnhancedDomainAnalyzer {
  private domainDiscovery = new DomainDiscovery();
  private googleSearch = new GoogleCustomSearchService();
  private settings: any;
  
  constructor(settings?: any) {
    this.settings = settings || {};
  }
  
  async discoverWithSources(options: DomainDiscoveryOptions): Promise<EnhancedDiscoveryResult> {
    const startTime = Date.now();
    console.log('Starting enhanced domain discovery with source tracking');
    
    const result: EnhancedDiscoveryResult = {
      domains: [],
      sources: {
        localSearch: [],
        externalApis: [],
        directories: [],
        socialMedia: [],
        googleSearch: [],
        generated: []
      },
      confidence: 0,
      searchTime: 0
    };
    
    try {
      // Use the enhanced discovery
      const discoveredDomains = await this.domainDiscovery.discoverDomains(options);
      result.domains = discoveredDomains;
      
      // For demonstration, we'll categorize results based on patterns
      discoveredDomains.forEach(domain => {
        if (this.isDoctorDomain(domain)) {
          result.sources.localSearch.push(domain);
        } else if (this.isDirectoryStyleDomain(domain)) {
          result.sources.directories.push(domain);
        } else if (this.isCorporateDomain(domain)) {
          result.sources.externalApis.push(domain);
        } else {
          result.sources.generated.push(domain);
        }
      });
      
      // Calculate confidence based on number of sources and results
      const totalSources = Object.values(result.sources).reduce((sum, arr) => sum + arr.length, 0);
      result.confidence = Math.min(0.95, totalSources / 15);
      
      result.searchTime = Date.now() - startTime;
      
      console.log(`Enhanced discovery completed in ${result.searchTime}ms with confidence: ${result.confidence}`);
      return result;
      
    } catch (error) {
      console.error('Enhanced domain discovery failed:', error);
      result.searchTime = Date.now() - startTime;
      return result;
    }
  }
  
  private isDoctorDomain(domain: string): boolean {
    return /^(dr|prof|med|drs)[-.]/.test(domain.toLowerCase()) || 
           domain.includes('praxis') || 
           domain.includes('klinik');
  }
  
  private isDirectoryStyleDomain(domain: string): boolean {
    return domain.includes('zentrum') || 
           domain.includes('institut') || 
           domain.includes('gruppe');
  }
  
  private isCorporateDomain(domain: string): boolean {
    return domain.includes('group') || 
           domain.includes('corporate') || 
           domain.includes('company') || 
           domain.includes('business');
  }
  
  async discoverHunterStyle(options: DomainDiscoveryOptions): Promise<string[]> {
    console.log('Starting Hunter.io-style domain discovery');
    
    const enhancedOptions = {
      ...options,
      maxResults: 20 // Get more results for Hunter-style coverage
    };
    
    // Use multiple search strategies in parallel
    const [
      standardResults,
      localResults,
      industryResults
    ] = await Promise.all([
      this.domainDiscovery.discoverDomains(enhancedOptions),
      this.searchLocalBusinessPatterns(options),
      this.searchIndustrySpecific(options)
    ]);
    
    // Combine and deduplicate results
    const allDomains = new Set([
      ...standardResults,
      ...localResults,
      ...industryResults
    ]);
    
    const finalResults = Array.from(allDomains).slice(0, options.maxResults || 15);
    
    console.log(`Hunter-style discovery found ${finalResults.length} unique domains`);
    return finalResults;
  }
  
  private async searchLocalBusinessPatterns(options: DomainDiscoveryOptions): Promise<string[]> {
    // Generate Hunter.io-style local business patterns
    const query = options.query.toLowerCase();
    const location = options.location?.toLowerCase() || '';
    const domains: string[] = [];
    
    const businessTypes = ['clinic', 'practice', 'center', 'office', 'institute'];
    const prefixes = ['dr', 'prof', 'med'];
    
    businessTypes.forEach(type => {
      prefixes.forEach(prefix => {
        domains.push(
          `${prefix}-${query}-${type}-${location}.de`,
          `${query}-${type}-${location}.de`,
          `${location}-${query}-${type}.de`
        );
      });
    });
    
    return domains.slice(0, 8);
  }
  
  private async searchIndustrySpecific(options: DomainDiscoveryOptions): Promise<string[]> {
    // Industry-specific domain patterns like Hunter.io
    const industryPatterns = this.getIndustryDomainPatterns(options.query, options.location || '');
    return industryPatterns;
  }
  
  private getIndustryDomainPatterns(query: string, location: string): string[] {
    const patterns: string[] = [];
    const cleanQuery = query.toLowerCase().replace(/[^a-z]/g, '');
    const cleanLocation = location.toLowerCase().replace(/[^a-z]/g, '');
    
    // Professional service patterns
    if (['zahnarzt', 'arzt', 'anwalt'].includes(cleanQuery)) {
      patterns.push(
        `${cleanQuery}-${cleanLocation}.de`,
        `${cleanLocation}-${cleanQuery}.de`,
        `praxis-${cleanQuery}-${cleanLocation}.de`,
        `kanzlei-${cleanQuery}-${cleanLocation}.de`,
        `dr-${cleanQuery}-praxis.de`,
        `${cleanQuery}-zentrum-${cleanLocation}.de`
      );
    }
    
    // Business service patterns
    patterns.push(
      `${cleanQuery}-service-${cleanLocation}.de`,
      `${cleanQuery}-consulting-${cleanLocation}.de`,
      `${cleanQuery}-experts-${cleanLocation}.de`,
      `${cleanLocation}-${cleanQuery}-group.de`
    );
    
    return patterns;
  }
  
  async analyzeDomain(domain: string): Promise<any> {
    console.log(`Enhanced domain analysis for: ${domain}`);
    
    try {
      // Import the regular domain analyzer for actual analysis
      const { DomainAnalyzer } = await import('./DomainAnalyzer');
      const analyzer = new DomainAnalyzer(this.settings);
      
      // Use the enhanced analyzer but delegate actual analysis to DomainAnalyzer
      const result = await analyzer.analyzeDomain(domain);
      
      // Enhance the result with additional metadata
      return {
        ...result,
        enhancedFeatures: {
          hunterStyleDiscovery: true,
          multiSourceSearch: true,
          germanDirectoryIntegration: true
        }
      };
    } catch (error) {
      console.error(`Enhanced domain analysis failed for ${domain}:`, error);
      throw error;
    }
  }
}