import { DomainDiscoveryOptions } from './DomainDiscovery';

export interface BusinessResult {
  name: string;
  website?: string;
  phone?: string;
  address?: string;
  rating?: number;
  source: string;
}

export class ExternalApiService {
  private corsProxy = 'https://api.allorigins.win/raw?url=';

  async searchYelp(options: DomainDiscoveryOptions): Promise<string[]> {
    const { query, location = '', maxResults = 20 } = options;
    const domains: string[] = [];

    try {
      // Note: Yelp API requires API key - this is a simplified implementation
      // In production, this would use Supabase secrets for the API key
      const searchTerm = encodeURIComponent(`${query} ${location}`);
      
      // For demo purposes, we'll use a web search approach targeting Yelp
      const yelpSearchUrl = `https://www.yelp.de/search?find_desc=${encodeURIComponent(query)}&find_loc=${encodeURIComponent(location)}`;
      
      // This would be replaced with actual Yelp API call
      console.log(`Would search Yelp API for: ${query} in ${location}`);
      
      // Simulate API response parsing
      const mockResults = this.generateMockYelpResults(query, location);
      
      for (const result of mockResults.slice(0, maxResults)) {
        if (result.website) {
          const domain = this.extractDomain(result.website);
          if (domain && !domains.includes(domain)) {
            domains.push(domain);
          }
        }
      }
    } catch (error) {
      console.error('Yelp search error:', error);
    }

    return domains;
  }

  async searchGooglePlaces(options: DomainDiscoveryOptions): Promise<string[]> {
    const { query, location = '', maxResults = 20 } = options;
    const domains: string[] = [];

    try {
      // Note: Google Places API requires API key and billing setup
      // This is a simplified implementation for demonstration
      console.log(`Would search Google Places API for: ${query} in ${location}`);
      
      // Simulate Places API response
      const mockResults = this.generateMockPlacesResults(query, location);
      
      for (const result of mockResults.slice(0, maxResults)) {
        if (result.website) {
          const domain = this.extractDomain(result.website);
          if (domain && !domains.includes(domain)) {
            domains.push(domain);
          }
        }
      }
    } catch (error) {
      console.error('Google Places search error:', error);
    }

    return domains;
  }

  private generateMockYelpResults(query: string, location: string): BusinessResult[] {
    const businessTypes = {
      'zahnarzt': ['zahnarztpraxis', 'dental', 'dentist', 'zahnmedizin'],
      'restaurant': ['bistro', 'cafe', 'kitchen', 'haus'],
      'anwalt': ['kanzlei', 'rechtsanwalt', 'legal', 'recht'],
      'friseur': ['salon', 'hair', 'styling', 'beauty']
    };

    const variations = businessTypes[query.toLowerCase()] || ['praxis', 'center', 'service'];
    const results: BusinessResult[] = [];

    for (let i = 0; i < 15; i++) {
      const variation = variations[i % variations.length];
      const locationShort = location.toLowerCase().replace(/\s+/g, '');
      
      results.push({
        name: `${query} ${variation} ${location}`,
        website: `https://${variation}-${locationShort}-${i + 1}.de`,
        rating: 4 + Math.random(),
        source: 'Yelp'
      });
    }

    return results;
  }

  private generateMockPlacesResults(query: string, location: string): BusinessResult[] {
    const results: BusinessResult[] = [];
    const locationShort = location.toLowerCase().replace(/\s+/g, '');

    for (let i = 0; i < 12; i++) {
      results.push({
        name: `${query} Praxis ${location} ${i + 1}`,
        website: `https://www.${query.toLowerCase()}-${locationShort}-${i + 1}.de`,
        address: `${location} Straße ${i + 1}`,
        rating: 4.2 + Math.random() * 0.8,
        source: 'Google Places'
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