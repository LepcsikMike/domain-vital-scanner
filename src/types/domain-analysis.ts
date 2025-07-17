
export interface TechnologyDetails {
  jsLibraries: string[];
  cssFrameworks: string[];
  analyticsTools: string[];
  adNetworks: string[];
  cdnProviders: string[];
  serverTech: string[];
  ecommercePlatforms: string[];
  securityTools: string[];
  socialWidgets: string[];
  version: string | null;
}

export interface MarketingTools {
  googleAnalytics: string[];
  facebookPixel: string[];
  googleTagManager: string[];
  googleAdSense: string[];
  linkedinInsight: string[];
  twitterAnalytics: string[];
  hotjar: string[];
  mixpanel: string[];
  segment: string[];
}

export interface SecurityAudit {
  vulnerableLibraries: string[];
  outdatedVersions: string[];
  securityHeaders: {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
  };
  riskyScripts: string[];
  httpsIssues: string[];
  score: number;
}

export interface CompetitorInsights {
  similarDomains: string[];
  sharedTechnologies: string[];
  industryCategory: string;
  marketPosition: 'leading' | 'following' | 'emerging';
  technicalSimilarity: number;
}

export interface DomainAnalysisResult {
  domain: string;
  timestamp: string;
  httpsStatus: {
    valid: boolean;
    sslValid: boolean;
    redirectsToHttps: boolean;
  };
  technologyAudit: {
    cmsDetected: string;
    outdatedTechnologies: string[];
    generatorTags: string[];
  };
  pageSpeedScores: {
    mobile: number | null;
    desktop: number | null;
  };
  coreWebVitals: {
    lcp: string | null; // Largest Contentful Paint
    cls: string | null; // Cumulative Layout Shift  
    inp: string | null; // Interaction to Next Paint
  };
  seoAudit: {
    hasTitle: boolean;
    hasMetaDescription: boolean;
    hasH1: boolean;
    issues: string[];
  };
  crawlingStatus: {
    isAccessible: boolean;
    hasErrors: boolean;
    robotsTxtExists: boolean;
  };
  // New enhanced fields
  technologyDetails: TechnologyDetails;
  marketingTools: MarketingTools;
  securityAudit: SecurityAudit;
  competitorInsights: CompetitorInsights;
  criticalIssues: number;
}

export interface AnalysisProgress {
  current: number;
  total: number;
  currentDomain: string;
  stage: string;
}

export interface AnalysisFilter {
  showCriticalOnly: boolean;
  httpsIssuesOnly: boolean;
  seoIssuesOnly: boolean;
  minPageSpeedScore: number;
  searchTerm: string;
}
