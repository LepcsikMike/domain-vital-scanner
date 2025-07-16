
export class DnsLookup {
  private dohEndpoints = [
    'https://cloudflare-dns.com/dns-query',
    'https://dns.google/dns-query',
    'https://dns.quad9.net/dns-query'
  ];

  async checkDomainExists(domain: string): Promise<boolean> {
    try {
      // Use DNS-over-HTTPS to check if domain exists
      for (const endpoint of this.dohEndpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const response = await fetch(`${endpoint}?name=${domain}&type=A`, {
            headers: {
              'Accept': 'application/dns-json'
            },
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            return data.Answer && data.Answer.length > 0;
          }
        } catch (error) {
          console.log(`DNS lookup failed for ${endpoint}, trying next...`);
          continue;
        }
      }
      
      return false;
    } catch (error) {
      console.warn(`DNS lookup failed for ${domain}:`, error);
      return false;
    }
  }

  async bulkCheckDomains(domains: string[]): Promise<string[]> {
    const validDomains = [];
    
    for (const domain of domains) {
      try {
        const exists = await this.checkDomainExists(domain);
        if (exists) {
          validDomains.push(domain);
        }
        
        // Add delay to be respectful to DNS servers
        await new Promise(resolve => setTimeout(resolve, 400));
      } catch (error) {
        console.warn(`Bulk check failed for ${domain}:`, error);
      }
    }
    
    return validDomains;
  }

  generateDomainVariations(keywords: string[], tld: string, count: number = 20): string[] {
    const domains = [];
    const tldSuffix = tld.startsWith('.') ? tld : `.${tld}`;
    
    // TLD-specific suffixes and prefixes
    const tldSpecific = this.getTldSpecificTerms(tldSuffix);
    const { suffixes, prefixes } = tldSpecific;
    
    keywords.forEach(keyword => {
      // Direct keyword domains
      domains.push(`${keyword}${tldSuffix}`);
      
      // With suffixes
      suffixes.forEach(suffix => {
        domains.push(`${keyword}-${suffix}${tldSuffix}`);
        domains.push(`${suffix}-${keyword}${tldSuffix}`);
      });
      
      // With prefixes
      prefixes.forEach(prefix => {
        domains.push(`${prefix}-${keyword}${tldSuffix}`);
      });
      
      // Numbers
      for (let i = 1; i <= 3; i++) {
        domains.push(`${keyword}${i}${tldSuffix}`);
        domains.push(`${keyword}-${i}${tldSuffix}`);
      }
    });
    
    // Shuffle and return limited count
    return domains.sort(() => Math.random() - 0.5).slice(0, count);
  }

  private getTldSpecificTerms(tld: string): { suffixes: string[], prefixes: string[] } {
    const tldTerms: Record<string, { suffixes: string[], prefixes: string[] }> = {
      '.de': {
        suffixes: ['service', 'online', '24', 'direkt', 'express', 'plus', 'werk', 'haus', 'shop'],
        prefixes: ['best', 'top', 'premium', 'schnell', 'günstig', 'lokal', 'ihr', 'mein']
      },
      '.com': {
        suffixes: ['online', 'pro', 'hub', 'zone', 'world', 'global', 'tech', 'solutions'],
        prefixes: ['best', 'top', 'premium', 'smart', 'fast', 'global', 'my', 'your']
      },
      '.org': {
        suffixes: ['foundation', 'initiative', 'network', 'community', 'alliance'],
        prefixes: ['united', 'international', 'global', 'national', 'local']
      },
      '.net': {
        suffixes: ['network', 'systems', 'tech', 'solutions', 'services'],
        prefixes: ['network', 'system', 'tech', 'digital', 'cyber']
      }
    };
    
    return tldTerms[tld] || tldTerms['.com'];
  }
}
