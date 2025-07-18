import { CompetitorInsights, TechnologyDetails } from '@/types/domain-analysis';

export interface IndustryProfile {
  category: string;
  commonTechnologies: string[];
  averageScore: number;
  marketLeaders: string[];
  emergingTrends: string[];
}

export class MarketIntelligenceService {
  private static industryProfiles: Map<string, IndustryProfile> = new Map([
    ['healthcare', {
      category: 'Gesundheitswesen',
      commonTechnologies: ['WordPress', 'Doctolib', 'Jameda', 'TYPO3'],
      averageScore: 72,
      marketLeaders: ['doctolib.de', 'jameda.de'],
      emergingTrends: ['Online-Terminbuchung', 'Telemedizin', 'DSGVO-Tools']
    }],
    ['dental', {
      category: 'Zahnmedizin',
      commonTechnologies: ['WordPress', 'Doctolib', 'Dentolo', 'Online-Buchung'],
      averageScore: 68,
      marketLeaders: ['zahnarztzentrum.de', 'dentalzentrum.de'],
      emergingTrends: ['3D-Visualisierung', 'KI-Diagnostik', 'Digitale Abdrücke']
    }],
    ['legal', {
      category: 'Rechtswesen',
      commonTechnologies: ['WordPress', 'TYPO3', 'Anwalt.de', 'SSL'],
      averageScore: 75,
      marketLeaders: ['anwalt.de', 'rechtsanwalt.com'],
      emergingTrends: ['Legal-Tech', 'Online-Beratung', 'Dokument-Automation']
    }],
    ['restaurant', {
      category: 'Gastronomie',
      commonTechnologies: ['WordPress', 'OpenTable', 'Lieferando', 'Social Media'],
      averageScore: 65,
      marketLeaders: ['lieferando.de', 'opentable.de'],
      emergingTrends: ['Online-Bestellung', 'QR-Menüs', 'Kontaktlos-Zahlung']
    }],
    ['ecommerce', {
      category: 'E-Commerce',
      commonTechnologies: ['Shopify', 'WooCommerce', 'Magento', 'Stripe'],
      averageScore: 78,
      marketLeaders: ['amazon.de', 'otto.de', 'zalando.de'],
      emergingTrends: ['Headless Commerce', 'AR Shopping', 'Voice Commerce']
    }],
    ['fitness', {
      category: 'Fitness & Wellness',
      commonTechnologies: ['WordPress', 'FitogramPro', 'Eversports', 'Apps'],
      averageScore: 70,
      marketLeaders: ['fitnessfirst.de', 'mcfit.com'],
      emergingTrends: ['Virtual Training', 'Wearable Integration', 'KI-Coaching']
    }]
  ]);

  static analyzeCompetitors(domain: string, technologies: TechnologyDetails): CompetitorInsights {
    const industry = this.detectIndustry(domain);
    const profile = this.industryProfiles.get(industry);
    
    if (!profile) {
      return {
        similarDomains: [],
        sharedTechnologies: [],
        industryCategory: 'Unknown',
        marketPosition: 'emerging',
        technicalSimilarity: 0
      };
    }

    const allTechnologies = [
      ...technologies.jsLibraries,
      ...technologies.cssFrameworks,
      ...technologies.analyticsTools,
      ...technologies.ecommercePlatforms,
      ...technologies.serverTech
    ];

    const sharedTechnologies = profile.commonTechnologies.filter(tech => 
      allTechnologies.some(userTech => userTech.toLowerCase().includes(tech.toLowerCase()))
    );

    const technicalSimilarity = (sharedTechnologies.length / profile.commonTechnologies.length) * 100;

    // Generate similar domains based on industry
    const similarDomains = this.generateSimilarDomains(domain, industry);

    // Determine market position based on technology adoption
    let marketPosition: 'leading' | 'following' | 'emerging' = 'emerging';
    if (technicalSimilarity > 80) {
      marketPosition = 'leading';
    } else if (technicalSimilarity > 50) {
      marketPosition = 'following';
    }

    return {
      similarDomains,
      sharedTechnologies,
      industryCategory: profile.category,
      marketPosition,
      technicalSimilarity: Math.round(technicalSimilarity)
    };
  }

  private static detectIndustry(domain: string): string {
    const domainLower = domain.toLowerCase();
    
    if (domainLower.includes('zahnarzt') || domainLower.includes('dental') || 
        domainLower.includes('zahn') || domainLower.includes('praxis')) {
      return 'dental';
    }
    
    if (domainLower.includes('arzt') || domainLower.includes('medizin') || 
        domainLower.includes('gesundheit') || domainLower.includes('klinik')) {
      return 'healthcare';
    }
    
    if (domainLower.includes('anwalt') || domainLower.includes('rechts') || 
        domainLower.includes('kanzlei') || domainLower.includes('legal')) {
      return 'legal';
    }
    
    if (domainLower.includes('restaurant') || domainLower.includes('gastro') || 
        domainLower.includes('hotel') || domainLower.includes('cafe')) {
      return 'restaurant';
    }
    
    if (domainLower.includes('shop') || domainLower.includes('store') || 
        domainLower.includes('buy') || domainLower.includes('verkauf')) {
      return 'ecommerce';
    }
    
    if (domainLower.includes('fitness') || domainLower.includes('sport') || 
        domainLower.includes('gym') || domainLower.includes('wellness')) {
      return 'fitness';
    }

    return 'general';
  }

  private static generateSimilarDomains(domain: string, industry: string): string[] {
    const baseDomains = this.getIndustryDomains(industry);
    
    // Filter out domains that are too similar to avoid showing the same domain
    return baseDomains.filter(similarDomain => 
      !domain.includes(similarDomain.split('.')[0]) && 
      !similarDomain.includes(domain.split('.')[0])
    ).slice(0, 5);
  }

  private static getIndustryDomains(industry: string): string[] {
    const industryDomains: { [key: string]: string[] } = {
      dental: [
        'zahnarztpraxis-berlin.de',
        'dentalcenter-muenchen.de',
        'zahnmedizin-hamburg.de',
        'dental-clinic-koeln.de',
        'zahnarzt-stuttgart.de'
      ],
      healthcare: [
        'arztpraxis-berlin.de',
        'medizinzentrum-muenchen.de',
        'gesundheitszentrum-hamburg.de',
        'klinik-koeln.de',
        'hausarzt-stuttgart.de'
      ],
      legal: [
        'anwaltskanzlei-berlin.de',
        'rechtsanwaelte-muenchen.de',
        'legal-services-hamburg.de',
        'kanzlei-koeln.de',
        'anwalt-stuttgart.de'
      ],
      restaurant: [
        'restaurant-berlin.de',
        'gasthaus-muenchen.de',
        'bistro-hamburg.de',
        'cafe-koeln.de',
        'steakhouse-stuttgart.de'
      ],
      ecommerce: [
        'onlineshop-fashion.de',
        'techstore-berlin.de',
        'lifestyle-shop.de',
        'premium-store.de',
        'digitalmarkt.de'
      ],
      fitness: [
        'fitnessstudio-berlin.de',
        'sportcenter-muenchen.de',
        'wellness-hamburg.de',
        'gym-koeln.de',
        'training-stuttgart.de'
      ]
    };

    return industryDomains[industry] || [
      'beispiel-unternehmen.de',
      'muster-firma.de',
      'demo-business.de'
    ];
  }

  static getIndustryInsights(industry: string): IndustryProfile | null {
    return this.industryProfiles.get(industry) || null;
  }

  static calculateMarketScore(technologies: TechnologyDetails, industry: string): number {
    const profile = this.industryProfiles.get(industry);
    if (!profile) return 50;

    const allTechnologies = [
      ...technologies.jsLibraries,
      ...technologies.cssFrameworks,
      ...technologies.analyticsTools,
      ...technologies.ecommercePlatforms
    ];

    const modernTechCount = allTechnologies.filter(tech => 
      !tech.includes('veraltet') && !tech.includes('outdated')
    ).length;

    const hasModernStack = allTechnologies.some(tech => 
      ['React', 'Vue', 'Angular', 'Next.js'].some(modern => tech.includes(modern))
    );

    let score = profile.averageScore;
    
    if (hasModernStack) score += 15;
    if (modernTechCount > 5) score += 10;
    if (technologies.analyticsTools.length > 2) score += 5;

    return Math.min(100, Math.max(0, score));
  }
}