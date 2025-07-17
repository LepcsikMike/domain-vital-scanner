import { DomainDiscoveryOptions } from './DomainDiscovery';

export interface DirectoryResult {
  name: string;
  website?: string;
  phone?: string;
  address?: string;
  directory: string;
}

export class DirectoryScraperService {
  private corsProxy = 'https://api.allorigins.win/raw?url=';

  async searchGelbeSeiten(options: DomainDiscoveryOptions): Promise<string[]> {
    const { query, location = '' } = options;
    const domains: string[] = [];

    try {
      console.log(`Searching Gelbe Seiten for: ${query} in ${location}`);
      
      // In a real implementation, this would scrape gelbeseiten.de
      // For demo, we generate realistic results
      const mockResults = this.generateGelbeSeitenResults(query, location);
      
      for (const result of mockResults) {
        if (result.website) {
          const domain = this.extractDomain(result.website);
          if (domain && !domains.includes(domain)) {
            domains.push(domain);
          }
        }
      }
    } catch (error) {
      console.error('Gelbe Seiten search error:', error);
    }

    return domains;
  }

  async searchDasOertliche(options: DomainDiscoveryOptions): Promise<string[]> {
    const { query, location = '' } = options;
    const domains: string[] = [];

    try {
      console.log(`Searching Das Örtliche for: ${query} in ${location}`);
      
      const mockResults = this.generateDasOertlicheResults(query, location);
      
      for (const result of mockResults) {
        if (result.website) {
          const domain = this.extractDomain(result.website);
          if (domain && !domains.includes(domain)) {
            domains.push(domain);
          }
        }
      }
    } catch (error) {
      console.error('Das Örtliche search error:', error);
    }

    return domains;
  }

  async searchJameda(options: DomainDiscoveryOptions): Promise<string[]> {
    const { query, location = '' } = options;
    const domains: string[] = [];

    // Only search Jameda for medical professionals
    const medicalTerms = ['zahnarzt', 'arzt', 'doktor', 'praxis', 'klinik', 'therapeut'];
    const isMedical = medicalTerms.some(term => 
      query.toLowerCase().includes(term)
    );

    if (!isMedical) {
      return domains;
    }

    try {
      console.log(`Searching Jameda for: ${query} in ${location}`);
      
      const mockResults = this.generateJamedaResults(query, location);
      
      for (const result of mockResults) {
        if (result.website) {
          const domain = this.extractDomain(result.website);
          if (domain && !domains.includes(domain)) {
            domains.push(domain);
          }
        }
      }
    } catch (error) {
      console.error('Jameda search error:', error);
    }

    return domains;
  }

  async search11880(options: DomainDiscoveryOptions): Promise<string[]> {
    const { query, location = '' } = options;
    const domains: string[] = [];

    try {
      console.log(`Searching 11880.com for: ${query} in ${location}`);
      
      const mockResults = this.generate11880Results(query, location);
      
      for (const result of mockResults) {
        if (result.website) {
          const domain = this.extractDomain(result.website);
          if (domain && !domains.includes(domain)) {
            domains.push(domain);
          }
        }
      }
    } catch (error) {
      console.error('11880.com search error:', error);
    }

    return domains;
  }

  private generateGelbeSeitenResults(query: string, location: string): DirectoryResult[] {
    const results: DirectoryResult[] = [];
    const locationShort = location.toLowerCase().replace(/\s+/g, '');

    for (let i = 0; i < 8; i++) {
      results.push({
        name: `${query} ${location} - Gelbe Seiten ${i + 1}`,
        website: `https://gelbe-seiten-${query.toLowerCase()}-${locationShort}-${i + 1}.de`,
        directory: 'Gelbe Seiten'
      });
    }

    return results;
  }

  private generateDasOertlicheResults(query: string, location: string): DirectoryResult[] {
    const results: DirectoryResult[] = [];
    const locationShort = location.toLowerCase().replace(/\s+/g, '');

    for (let i = 0; i < 6; i++) {
      results.push({
        name: `${query} ${location} - Das Örtliche ${i + 1}`,
        website: `https://oertliche-${query.toLowerCase()}-${locationShort}-${i + 1}.de`,
        directory: 'Das Örtliche'
      });
    }

    return results;
  }

  private generateJamedaResults(query: string, location: string): DirectoryResult[] {
    const results: DirectoryResult[] = [];
    const locationShort = location.toLowerCase().replace(/\s+/g, '');

    for (let i = 0; i < 10; i++) {
      results.push({
        name: `Dr. ${query} ${location} - Jameda ${i + 1}`,
        website: `https://jameda-${query.toLowerCase()}-${locationShort}-${i + 1}.de`,
        directory: 'Jameda'
      });
    }

    return results;
  }

  private generate11880Results(query: string, location: string): DirectoryResult[] {
    const results: DirectoryResult[] = [];
    const locationShort = location.toLowerCase().replace(/\s+/g, '');

    for (let i = 0; i < 7; i++) {
      results.push({
        name: `${query} ${location} - 11880 ${i + 1}`,
        website: `https://11880-${query.toLowerCase()}-${locationShort}-${i + 1}.de`,
        directory: '11880.com'
      });
    }

    return results;
  }

  private extractDomain(url: string): string | null {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return null;
    }
  }
}