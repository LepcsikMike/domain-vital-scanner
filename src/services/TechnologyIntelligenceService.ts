import { TechnologyDetails, MarketingTools, SecurityAudit } from '@/types/domain-analysis';

export interface TechnologySignature {
  name: string;
  patterns: string[];
  category: 'js' | 'css' | 'cms' | 'server' | 'analytics' | 'cdn' | 'security' | 'ecommerce' | 'social';
  version?: RegExp;
  confidence?: number;
}

export class TechnologyIntelligenceService {
  private static technologies: TechnologySignature[] = [
    // JavaScript Libraries
    { name: 'React', patterns: ['React', '_react', 'react-dom'], category: 'js', version: /React\.version\s*[=:]\s*["']([^"']+)["']/ },
    { name: 'Vue.js', patterns: ['Vue.js', 'vue.min.js', '__VUE__'], category: 'js', version: /Vue\.version\s*[=:]\s*["']([^"']+)["']/ },
    { name: 'Angular', patterns: ['ng-version', 'angular.min.js', 'AngularJS'], category: 'js', version: /ng-version="([^"]+)"/ },
    { name: 'jQuery', patterns: ['jquery', 'jQuery'], category: 'js', version: /jQuery\s+v?([0-9.]+)/ },
    { name: 'Bootstrap', patterns: ['bootstrap.min.js', 'bootstrap.css'], category: 'js' },
    { name: 'Lodash', patterns: ['lodash.min.js', '_.each'], category: 'js' },
    { name: 'Moment.js', patterns: ['moment.min.js', 'moment.js'], category: 'js' },
    { name: 'D3.js', patterns: ['d3.min.js', 'd3.js'], category: 'js' },

    // CSS Frameworks
    { name: 'Bootstrap', patterns: ['bootstrap.css', 'bootstrap.min.css'], category: 'css', version: /Bootstrap\s+v?([0-9.]+)/ },
    { name: 'Tailwind CSS', patterns: ['tailwindcss', 'tailwind.css'], category: 'css' },
    { name: 'Foundation', patterns: ['foundation.css', 'foundation.min.css'], category: 'css' },
    { name: 'Bulma', patterns: ['bulma.css', 'bulma.min.css'], category: 'css' },
    { name: 'Materialize', patterns: ['materialize.css', 'materialize.min.css'], category: 'css' },

    // CMS Detection
    { name: 'WordPress', patterns: ['wp-content', 'wp-includes', '/wp-json/'], category: 'cms', version: /WordPress\s+([0-9.]+)/ },
    { name: 'Drupal', patterns: ['drupal.js', '/sites/all/', 'Drupal.settings'], category: 'cms', version: /Drupal\s+([0-9.]+)/ },
    { name: 'Joomla', patterns: ['joomla.css', '/components/com_', 'Joomla!'], category: 'cms', version: /Joomla!\s+([0-9.]+)/ },
    { name: 'TYPO3', patterns: ['typo3conf', '/typo3/', 'TYPO3 CMS'], category: 'cms', version: /TYPO3\s+([0-9.]+)/ },
    { name: 'Shopify', patterns: ['cdn.shopify.com', 'Shopify.shop'], category: 'ecommerce' },
    { name: 'WooCommerce', patterns: ['woocommerce', 'wc-ajax'], category: 'ecommerce' },
    { name: 'Magento', patterns: ['mage/', 'magento', 'Mage.Cookies'], category: 'ecommerce' },

    // Analytics & Marketing
    { name: 'Google Analytics', patterns: ['google-analytics.com', 'gtag(', 'ga('], category: 'analytics', version: /gtag\('config',\s*'([^']+)'/ },
    { name: 'Google Tag Manager', patterns: ['googletagmanager.com', 'GTM-'], category: 'analytics', version: /GTM-([A-Z0-9]+)/ },
    { name: 'Facebook Pixel', patterns: ['facebook.net/tr', 'fbq('], category: 'analytics', version: /fbq\('init',\s*'([^']+)'/ },
    { name: 'Hotjar', patterns: ['hotjar.com', 'hj('], category: 'analytics' },
    { name: 'Mixpanel', patterns: ['mixpanel.com', 'mixpanel.track'], category: 'analytics' },
    { name: 'Segment', patterns: ['segment.com', 'analytics.track'], category: 'analytics' },

    // CDN & Infrastructure
    { name: 'Cloudflare', patterns: ['__cfduid', 'cloudflare'], category: 'cdn' },
    { name: 'AWS CloudFront', patterns: ['cloudfront.net', 'aws-cloudfront'], category: 'cdn' },
    { name: 'KeyCDN', patterns: ['keycdn.com'], category: 'cdn' },
    { name: 'MaxCDN', patterns: ['maxcdn.com'], category: 'cdn' },

    // Security
    { name: 'reCAPTCHA', patterns: ['recaptcha', 'google.com/recaptcha'], category: 'security' },
    { name: 'hCaptcha', patterns: ['hcaptcha.com'], category: 'security' },
    { name: 'Cloudflare Security', patterns: ['cf-ray'], category: 'security' },

    // Social Media
    { name: 'Facebook SDK', patterns: ['connect.facebook.net', 'FB.init'], category: 'social' },
    { name: 'Twitter Widgets', patterns: ['platform.twitter.com', 'twttr.widgets'], category: 'social' },
    { name: 'LinkedIn Insights', patterns: ['linkedin.com/company', 'linkedin.com/in'], category: 'social' },
    { name: 'YouTube Embed', patterns: ['youtube.com/embed', 'ytimg.com'], category: 'social' },

    // Server Technologies
    { name: 'Apache', patterns: ['Server: Apache', 'Apache/'], category: 'server', version: /Apache\/([0-9.]+)/ },
    { name: 'Nginx', patterns: ['Server: nginx', 'nginx/'], category: 'server', version: /nginx\/([0-9.]+)/ },
    { name: 'IIS', patterns: ['Server: Microsoft-IIS'], category: 'server', version: /Microsoft-IIS\/([0-9.]+)/ },
    { name: 'PHP', patterns: ['X-Powered-By: PHP', 'php'], category: 'server', version: /PHP\/([0-9.]+)/ }
  ];

  static detectTechnologies(html: string, headers: Headers): TechnologyDetails {
    const detected = {
      jsLibraries: [] as string[],
      cssFrameworks: [] as string[],
      analyticsTools: [] as string[],
      adNetworks: [] as string[],
      cdnProviders: [] as string[],
      serverTech: [] as string[],
      ecommercePlatforms: [] as string[],
      securityTools: [] as string[],
      socialWidgets: [] as string[],
      version: null as string | null
    };

    const headerString = Array.from(headers.entries()).map(([key, value]) => `${key}: ${value}`).join('\n');
    const content = html + '\n' + headerString;

    this.technologies.forEach(tech => {
      let found = false;
      let version = null;

      // Check patterns
      tech.patterns.forEach(pattern => {
        if (content.toLowerCase().includes(pattern.toLowerCase())) {
          found = true;
          
          // Try to extract version if pattern provided
          if (tech.version) {
            const versionMatch = content.match(tech.version);
            if (versionMatch) {
              version = versionMatch[1];
            }
          }
        }
      });

      if (found) {
        const techName = version ? `${tech.name} ${version}` : tech.name;
        
        switch (tech.category) {
          case 'js':
            detected.jsLibraries.push(techName);
            break;
          case 'css':
            detected.cssFrameworks.push(techName);
            break;
          case 'analytics':
            detected.analyticsTools.push(techName);
            break;
          case 'cdn':
            detected.cdnProviders.push(techName);
            break;
          case 'server':
            detected.serverTech.push(techName);
            break;
          case 'ecommerce':
            detected.ecommercePlatforms.push(techName);
            break;
          case 'security':
            detected.securityTools.push(techName);
            break;
          case 'social':
            detected.socialWidgets.push(techName);
            break;
        }
      }
    });

    return detected;
  }

  static detectMarketingTools(html: string): MarketingTools {
    return {
      googleAnalytics: this.extractMatches(html, [
        /gtag\('config',\s*'(UA-[^']+)'/g,
        /gtag\('config',\s*'(G-[^']+)'/g,
        /_gaq\.push\(\['_setAccount',\s*'([^']+)'/g
      ]),
      facebookPixel: this.extractMatches(html, [
        /fbq\('init',\s*'([^']+)'/g,
        /facebook\.com\/tr\?id=([^&'"]+)/g
      ]),
      googleTagManager: this.extractMatches(html, [
        /googletagmanager\.com\/gtm\.js\?id=(GTM-[^'"&]+)/g,
        /'(GTM-[A-Z0-9]+)'/g
      ]),
      googleAdSense: this.extractMatches(html, [
        /googlesyndication\.com.*?ca-pub-([0-9]+)/g,
        /google_ad_client\s*[=:]\s*["']ca-pub-([^"']+)["']/g
      ]),
      linkedinInsight: this.extractMatches(html, [
        /linkedin\.com\/company\/([^\/'"]+)/g,
        /_linkedin_partner_id\s*[=:]\s*["']([^"']+)["']/g
      ]),
      twitterAnalytics: this.extractMatches(html, [
        /platform\.twitter\.com/g,
        /twitter\.com\/([^\/'"]+)/g
      ]),
      hotjar: this.extractMatches(html, [
        /static\.hotjar\.com\/c\/hotjar-([^.]+)\.js/g,
        /hjid:\s*([0-9]+)/g
      ]),
      mixpanel: this.extractMatches(html, [
        /mixpanel\.init\(["']([^"']+)["']/g,
        /api\.mixpanel\.com/g
      ]),
      segment: this.extractMatches(html, [
        /analytics\.load\(["']([^"']+)["']/g,
        /cdn\.segment\.com/g
      ])
    };
  }

  static analyzeSecurity(html: string, headers: Headers): SecurityAudit {
    const headerEntries = Array.from(headers.entries());
    const headerMap = new Map(headerEntries);

    const securityHeaders = {
      hsts: headerMap.has('strict-transport-security'),
      csp: headerMap.has('content-security-policy'),
      xFrameOptions: headerMap.has('x-frame-options'),
      xContentTypeOptions: headerMap.has('x-content-type-options')
    };

    const vulnerableLibraries: string[] = [];
    const outdatedVersions: string[] = [];
    const riskyScripts: string[] = [];

    // Check for vulnerable library versions
    const jqueryMatch = html.match(/jquery[/-]([0-9.]+)/i);
    if (jqueryMatch) {
      const version = jqueryMatch[1];
      if (parseFloat(version) < 3.5) {
        vulnerableLibraries.push(`jQuery ${version} (vulnerable)`);
      }
    }

    // Check for outdated WordPress
    const wpMatch = html.match(/wp-content.*?ver=([0-9.]+)/i);
    if (wpMatch) {
      const version = wpMatch[1];
      if (parseFloat(version) < 6.0) {
        outdatedVersions.push(`WordPress ${version} (outdated)`);
      }
    }

    // Detect risky external scripts
    const scriptMatches = html.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi);
    if (scriptMatches) {
      scriptMatches.forEach(script => {
        if (script.includes('http://') && !script.includes('localhost')) {
          riskyScripts.push('Non-HTTPS external script detected');
        }
      });
    }

    // Calculate security score
    let score = 100;
    if (!securityHeaders.hsts) score -= 15;
    if (!securityHeaders.csp) score -= 20;
    if (!securityHeaders.xFrameOptions) score -= 10;
    if (!securityHeaders.xContentTypeOptions) score -= 5;
    score -= vulnerableLibraries.length * 20;
    score -= outdatedVersions.length * 15;
    score -= riskyScripts.length * 10;

    return {
      vulnerableLibraries,
      outdatedVersions,
      securityHeaders,
      riskyScripts,
      httpsIssues: [],
      score: Math.max(0, score)
    };
  }

  private static extractMatches(html: string, patterns: RegExp[]): string[] {
    const matches: string[] = [];
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(html)) !== null) {
        if (match[1] && !matches.includes(match[1])) {
          matches.push(match[1]);
        }
      }
    });
    return matches;
  }
}