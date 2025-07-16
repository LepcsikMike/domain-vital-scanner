
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
          const response = await fetch(`${endpoint}?name=${domain}&type=A`, {
            headers: {
              'Accept': 'application/dns-json'
            }
          });
          
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
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn(`Bulk check failed for ${domain}:`, error);
      }
    }
    
    return validDomains;
  }

  generateRandomDeDomains(keywords: string[], count: number = 20): string[] {
    const domains = [];
    const suffixes = ['service', 'online', '24', 'pro', 'direkt', 'express', 'plus', 'werk', 'haus', 'shop'];
    const prefixes = ['best', 'top', 'premium', 'schnell', 'günstig', 'lokal', 'ihr', 'mein'];
    
    keywords.forEach(keyword => {
      // Direct keyword domains
      domains.push(`${keyword}.de`);
      
      // With suffixes
      suffixes.forEach(suffix => {
        domains.push(`${keyword}-${suffix}.de`);
        domains.push(`${suffix}-${keyword}.de`);
      });
      
      // With prefixes
      prefixes.forEach(prefix => {
        domains.push(`${prefix}-${keyword}.de`);
      });
      
      // Numbers
      for (let i = 1; i <= 5; i++) {
        domains.push(`${keyword}${i}.de`);
        domains.push(`${keyword}-${i}.de`);
      }
    });
    
    // Shuffle and return limited count
    return domains.sort(() => Math.random() - 0.5).slice(0, count);
  }
}
