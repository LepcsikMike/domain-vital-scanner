import { useState, useCallback } from 'react';
import { DomainAnalysisResult } from '@/types/domain-analysis';
import { DomainAnalyzer } from '@/services/DomainAnalyzer';
import { DomainDiscovery, DomainDiscoveryOptions } from '@/services/DomainDiscovery';
import { toast } from '@/hooks/use-toast';

interface AnalysisSettings {
  checkHTTPS: boolean;
  checkTechnology: boolean;
  checkPageSpeed: boolean;
  checkSEO: boolean;
  checkCrawling: boolean;
  batchSize: number;
  timeout: number;
  includeSubdomains: boolean;
}

export const useDomainAnalysis = () => {
  const [domains, setDomains] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<DomainAnalysisResult[]>([]);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [successfulAnalyses, setSuccessfulAnalyses] = useState(0);
  const [settings, setSettings] = useState<AnalysisSettings>({
    checkHTTPS: true,
    checkTechnology: true,
    checkPageSpeed: true,
    checkSEO: true,
    checkCrawling: true,
    batchSize: 5, // Reduced for free service
    timeout: 30,
    includeSubdomains: false
  });

  const startAnalysis = useCallback(async (domainList: string[], searchType: string) => {
    setIsAnalyzing(true);
    setProgress(0);
    setResults([]);
    
    let domainsToAnalyze: string[] = [];
    
    if (searchType === 'manual') {
      domainsToAnalyze = domainList;
    } else {
      // Use real domain discovery
      toast({
        title: "Domain-Suche läuft",
        description: "Suche nach echten Domains...",
      });
      
      domainsToAnalyze = await discoverRealDomains({
        query: domainList[0],
        tld: '.de',
        maxResults: 10
      });
    }

    setDomains(domainsToAnalyze);
    
    if (domainsToAnalyze.length === 0) {
      toast({
        title: "Keine Domains gefunden",
        description: "Versuche es mit anderen Suchbegriffen",
        variant: "destructive",
      });
      setIsAnalyzing(false);
      return;
    }
    
    try {
      const analyzer = new DomainAnalyzer(settings);
      const total = domainsToAnalyze.length;
      const newResults: DomainAnalysisResult[] = [];
      let successful = 0;

      for (let i = 0; i < total; i++) {
        const domain = domainsToAnalyze[i];
        
        try {
          console.log(`Analyzing real domain ${i + 1}/${total}: ${domain}`);
          
          const result = await analyzer.analyzeDomain(domain);
          newResults.push(result);
          setResults([...newResults]);
          
          if (result.criticalIssues < 3) {
            successful++;
          }
          
          setAnalysisCount(prev => prev + 1);
          setSuccessfulAnalyses(successful);
          
          const progressPercent = ((i + 1) / total) * 100;
          setProgress(progressPercent);
          
          // Delay between requests to be respectful to free services
          if (i < total - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
          
        } catch (error) {
          console.error(`Error analyzing ${domain}:`, error);
          toast({
            title: "Analyse-Fehler",
            description: `Fehler bei der Analyse von ${domain}`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Analyse abgeschlossen",
        description: `${newResults.length} echte Domains analysiert (${successful} erfolgreich)`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analyse-Fehler",
        description: "Fehler bei der Domain-Analyse",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setProgress(100);
    }
  }, [settings]);

  const pauseAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    toast({
      title: "Analyse pausiert",
      description: "Die Analyse wurde pausiert",
    });
  }, []);

  const exportResults = useCallback(() => {
    if (results.length === 0) return;

    const csvHeaders = [
      'Domain',
      'HTTPS_Status',
      'SSL_Gültig',
      'Veraltete_Technologie',
      'PageSpeed_Mobile',
      'PageSpeed_Desktop',
      'LCP',
      'CLS',
      'INP',
      'SEO_Probleme',
      'Crawling_Fehler',
      'Kritische_Probleme'
    ];

    const csvData = results.map(result => [
      result.domain,
      result.httpsStatus.valid ? 'Ja' : 'Nein',
      result.httpsStatus.sslValid ? 'Ja' : 'Nein',
      result.technologyAudit.outdatedTechnologies.join(';') || 'Keine',
      result.pageSpeedScores.mobile || 'N/A',
      result.pageSpeedScores.desktop || 'N/A',
      result.coreWebVitals.lcp || 'N/A',
      result.coreWebVitals.cls || 'N/A',
      result.coreWebVitals.inp || 'N/A',
      result.seoAudit.issues.join(';') || 'Keine',
      result.crawlingStatus.hasErrors ? 'Ja' : 'Nein',
      result.criticalIssues
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `domain-analysis-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export erfolgreich",
      description: "Die Ergebnisse wurden als CSV-Datei heruntergeladen",
    });
  }, [results]);

  const updateSettings = useCallback((newSettings: AnalysisSettings) => {
    setSettings(newSettings);
  }, []);

  const getSuccessRate = () => {
    if (analysisCount === 0) return 0;
    return Math.round((successfulAnalyses / analysisCount) * 100);
  };

  return {
    domains,
    isAnalyzing,
    progress,
    results,
    settings,
    analysisCount,
    successRate: getSuccessRate(),
    startAnalysis,
    pauseAnalysis,
    exportResults,
    updateSettings
  };
};

// Real domain discovery function
const discoverRealDomains = async (options: DomainDiscoveryOptions): Promise<string[]> => {
  const discovery = new DomainDiscovery();
  
  try {
    const domains = await discovery.discoverDomains(options);
    
    // Validate discovered domains
    const validDomains = [];
    for (const domain of domains.slice(0, 5)) { // Limit for free service
      const isValid = await discovery.validateDomain(domain);
      if (isValid) {
        validDomains.push(domain);
      }
    }
    
    return validDomains;
  } catch (error) {
    console.error('Domain discovery failed:', error);
    return [];
  }
};
