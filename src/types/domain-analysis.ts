
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
