import { TechnologyDetails, MarketingTools, SecurityAudit } from '@/types/domain-analysis';

export interface CodePattern {
  name: string;
  patterns: RegExp[];
  category: 'js' | 'css' | 'analytics' | 'ads' | 'cdn' | 'server' | 'ecommerce' | 'security' | 'social';
  version?: RegExp;
  isVulnerable?: boolean;
  minVersion?: string;
}

export class CodeSearchService {
  private patterns: CodePattern[] = [
    // JavaScript Libraries
    {
      name: 'jQuery',
      patterns: [/jquery[.-]([0-9]+\.[0-9]+\.[0-9]+)/i, /jquery\.min\.js/i, /jquery\.js/i],
      category: 'js',
      version: /jquery[.-]([0-9]+\.[0-9]+\.[0-9]+)/i,
      isVulnerable: true,
      minVersion: '3.5.0'
    },
    {
      name: 'React',
      patterns: [/react[.-]([0-9]+\.[0-9]+\.[0-9]+)/i, /react\.min\.js/i, /__REACT_DEVTOOLS_GLOBAL_HOOK__/i],
      category: 'js',
      version: /react[.-]([0-9]+\.[0-9]+\.[0-9]+)/i
    },
    {
      name: 'Vue.js',
      patterns: [/vue[.-]([0-9]+\.[0-9]+\.[0-9]+)/i, /vue\.min\.js/i, /Vue\.config/i],
      category: 'js',
      version: /vue[.-]([0-9]+\.[0-9]+\.[0-9]+)/i
    },
    {
      name: 'Angular',
      patterns: [/angular[.-]([0-9]+\.[0-9]+\.[0-9]+)/i, /ng-version/i, /@angular/i],
      category: 'js',
      version: /angular[.-]([0-9]+\.[0-9]+\.[0-9]+)/i
    },
    {
      name: 'Bootstrap',
      patterns: [/bootstrap[.-]([0-9]+\.[0-9]+\.[0-9]+)/i, /bootstrap\.min\.css/i, /\.bootstrap/i],
      category: 'css',
      version: /bootstrap[.-]([0-9]+\.[0-9]+\.[0-9]+)/i
    },
    
    // CSS Frameworks
    {
      name: 'Tailwind CSS',
      patterns: [/tailwind/i, /\.tw-/i, /tailwindcss/i],
      category: 'css'
    },
    {
      name: 'Foundation',
      patterns: [/foundation[.-]([0-9]+\.[0-9]+)/i, /\.foundation/i],
      category: 'css',
      version: /foundation[.-]([0-9]+\.[0-9]+)/i
    },
    
    // Analytics & Tracking
    {
      name: 'Google Analytics',
      patterns: [/UA-[0-9]+-[0-9]+/i, /G-[A-Z0-9]+/i, /gtag\(/i, /google-analytics/i],
      category: 'analytics'
    },
    {
      name: 'Google Tag Manager',
      patterns: [/GTM-[A-Z0-9]+/i, /googletagmanager/i, /gtm\.js/i],
      category: 'analytics'
    },
    {
      name: 'Facebook Pixel',
      patterns: [/fbq\(/i, /facebook\.com\/tr/i, /fbevents\.js/i],
      category: 'analytics'
    },
    {
      name: 'Hotjar',
      patterns: [/hotjar/i, /hjid/i, /hj\.js/i],
      category: 'analytics'
    },
    
    // Ad Networks
    {
      name: 'Google AdSense',
      patterns: [/pub-[0-9]+/i, /googlesyndication/i, /adsbygoogle/i],
      category: 'ads'
    },
    {
      name: 'Amazon Associates',
      patterns: [/amazon-adsystem/i, /assoc-amazon/i, /amzn\.to/i],
      category: 'ads'
    },
    
    // CDN Providers
    {
      name: 'Cloudflare',
      patterns: [/cloudflare/i, /cf-ray/i, /cdnjs\.cloudflare/i],
      category: 'cdn'
    },
    {
      name: 'jQuery CDN',
      patterns: [/code\.jquery\.com/i, /ajax\.googleapis\.com.*jquery/i],
      category: 'cdn'
    },
    
    // E-commerce Platforms
    {
      name: 'Shopify',
      patterns: [/shopify/i, /\.myshopify\.com/i, /shopify_pay/i],
      category: 'ecommerce'
    },
    {
      name: 'WooCommerce',
      patterns: [/woocommerce/i, /wc-ajax/i, /wp-content.*woocommerce/i],
      category: 'ecommerce'
    },
    {
      name: 'Magento',
      patterns: [/magento/i, /mage\./i, /\.magento/i],
      category: 'ecommerce'
    },
    
    // Social Widgets
    {
      name: 'Facebook Widget',
      patterns: [/facebook\.com\/plugins/i, /fb-root/i, /facebook-jssdk/i],
      category: 'social'
    },
    {
      name: 'Twitter Widget',
      patterns: [/platform\.twitter\.com/i, /twitter-wjs/i, /tweet-button/i],
      category: 'social'
    },
    {
      name: 'LinkedIn Widget',
      patterns: [/platform\.linkedin\.com/i, /linkedin\.com\/widgets/i],
      category: 'social'
    }
  ];

  analyzeCode(html: string, responseHeaders?: Headers): {
    technologyDetails: TechnologyDetails;
    marketingTools: MarketingTools;
    securityAudit: SecurityAudit;
  } {
    const technologyDetails = this.detectTechnologies(html);
    const marketingTools = this.detectMarketingTools(html);
    const securityAudit = this.assessSecurity(html, responseHeaders);

    return {
      technologyDetails,
      marketingTools,
      securityAudit
    };
  }

  private detectTechnologies(html: string): TechnologyDetails {
    const jsLibraries: string[] = [];
    const cssFrameworks: string[] = [];
    const cdnProviders: string[] = [];
    const ecommercePlatforms: string[] = [];
    const socialWidgets: string[] = [];
    let version: string | null = null;

    this.patterns.forEach(pattern => {
      const detected = pattern.patterns.some(regex => regex.test(html));
      
      if (detected) {
        // Extract version if available
        if (pattern.version) {
          const versionMatch = html.match(pattern.version);
          if (versionMatch && versionMatch[1]) {
            version = versionMatch[1];
          }
        }

        const nameWithVersion = version ? `${pattern.name} ${version}` : pattern.name;

        switch (pattern.category) {
          case 'js':
            jsLibraries.push(nameWithVersion);
            break;
          case 'css':
            cssFrameworks.push(nameWithVersion);
            break;
          case 'cdn':
            cdnProviders.push(pattern.name);
            break;
          case 'ecommerce':
            ecommercePlatforms.push(pattern.name);
            break;
          case 'social':
            socialWidgets.push(pattern.name);
            break;
        }
      }
    });

    return {
      jsLibraries,
      cssFrameworks,
      analyticsTools: [],
      adNetworks: [],
      cdnProviders,
      serverTech: this.detectServerTech(html),
      ecommercePlatforms,
      securityTools: this.detectSecurityTools(html),
      socialWidgets,
      version
    };
  }

  private detectMarketingTools(html: string): MarketingTools {
    const googleAnalytics: string[] = [];
    const facebookPixel: string[] = [];
    const googleTagManager: string[] = [];
    const googleAdSense: string[] = [];

    // Extract Google Analytics IDs
    const gaMatches = html.match(/UA-[0-9]+-[0-9]+/gi) || [];
    const ga4Matches = html.match(/G-[A-Z0-9]+/gi) || [];
    googleAnalytics.push(...gaMatches, ...ga4Matches);

    // Extract GTM IDs
    const gtmMatches = html.match(/GTM-[A-Z0-9]+/gi) || [];
    googleTagManager.push(...gtmMatches);

    // Extract AdSense IDs
    const adsenseMatches = html.match(/pub-[0-9]+/gi) || [];
    googleAdSense.push(...adsenseMatches);

    // Detect Facebook Pixel
    if (/fbq\(/i.test(html) || /facebook\.com\/tr/i.test(html)) {
      facebookPixel.push('Facebook Pixel detected');
    }

    return {
      googleAnalytics,
      facebookPixel,
      googleTagManager,
      googleAdSense,
      linkedinInsight: this.detectLinkedInInsight(html),
      twitterAnalytics: this.detectTwitterAnalytics(html),
      hotjar: this.detectHotjar(html),
      mixpanel: [],
      segment: []
    };
  }

  private assessSecurity(html: string, responseHeaders?: Headers): SecurityAudit {
    const vulnerableLibraries: string[] = [];
    const outdatedVersions: string[] = [];
    const riskyScripts: string[] = [];
    const httpsIssues: string[] = [];

    // Check for vulnerable library versions
    this.patterns.forEach(pattern => {
      if (pattern.isVulnerable && pattern.version && pattern.minVersion) {
        const versionMatch = html.match(pattern.version);
        if (versionMatch && versionMatch[1]) {
          const detectedVersion = versionMatch[1];
          if (this.isVersionOutdated(detectedVersion, pattern.minVersion)) {
            vulnerableLibraries.push(`${pattern.name} ${detectedVersion} (vulnerable)`);
            outdatedVersions.push(`${pattern.name} should be >= ${pattern.minVersion}`);
          }
        }
      }
    });

    // Check for risky inline scripts
    if (html.includes('eval(')) {
      riskyScripts.push('eval() usage detected');
    }
    if (html.includes('innerHTML')) {
      riskyScripts.push('innerHTML usage detected');
    }

    // Check security headers (if available)
    const securityHeaders = {
      hsts: responseHeaders?.has('strict-transport-security') || false,
      csp: responseHeaders?.has('content-security-policy') || false,
      xFrameOptions: responseHeaders?.has('x-frame-options') || false,
      xContentTypeOptions: responseHeaders?.has('x-content-type-options') || false
    };

    // Calculate security score
    let score = 100;
    score -= vulnerableLibraries.length * 15;
    score -= riskyScripts.length * 10;
    score -= httpsIssues.length * 20;
    if (!securityHeaders.hsts) score -= 10;
    if (!securityHeaders.csp) score -= 10;
    if (!securityHeaders.xFrameOptions) score -= 5;
    if (!securityHeaders.xContentTypeOptions) score -= 5;

    return {
      vulnerableLibraries,
      outdatedVersions,
      securityHeaders,
      riskyScripts,
      httpsIssues,
      score: Math.max(0, score)
    };
  }

  private detectServerTech(html: string): string[] {
    const serverTech: string[] = [];
    
    if (html.includes('nginx') || html.includes('Nginx')) {
      serverTech.push('Nginx');
    }
    if (html.includes('Apache') || html.includes('apache')) {
      serverTech.push('Apache');
    }
    if (html.includes('IIS') || html.includes('Microsoft-IIS')) {
      serverTech.push('Microsoft IIS');
    }
    
    return serverTech;
  }

  private detectSecurityTools(html: string): string[] {
    const tools: string[] = [];
    
    if (html.includes('cloudflare') || html.includes('cf-ray')) {
      tools.push('Cloudflare Security');
    }
    if (html.includes('recaptcha') || html.includes('grecaptcha')) {
      tools.push('Google reCAPTCHA');
    }
    
    return tools;
  }

  private detectLinkedInInsight(html: string): string[] {
    const insights: string[] = [];
    if (html.includes('linkedin.com/widgets') || html.includes('platform.linkedin.com')) {
      insights.push('LinkedIn Insight Tag detected');
    }
    return insights;
  }

  private detectTwitterAnalytics(html: string): string[] {
    const analytics: string[] = [];
    if (html.includes('platform.twitter.com') || html.includes('twitter-wjs')) {
      analytics.push('Twitter Analytics detected');
    }
    return analytics;
  }

  private detectHotjar(html: string): string[] {
    const hotjar: string[] = [];
    if (html.includes('hotjar') || html.includes('hjid')) {
      hotjar.push('Hotjar tracking detected');
    }
    return hotjar;
  }

  private isVersionOutdated(current: string, minimum: string): boolean {
    const currentParts = current.split('.').map(Number);
    const minimumParts = minimum.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currentParts.length, minimumParts.length); i++) {
      const currentPart = currentParts[i] || 0;
      const minimumPart = minimumParts[i] || 0;
      
      if (currentPart < minimumPart) return true;
      if (currentPart > minimumPart) return false;
    }
    
    return false;
  }
}