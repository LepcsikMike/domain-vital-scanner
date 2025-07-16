
import { useState, useCallback } from 'react';
import { DomainAnalysisResult } from '@/types/domain-analysis';
import { DomainAnalyzer } from '@/services/DomainAnalyzer';
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
  const [settings, setSettings] = useState<AnalysisSettings>({
    checkHTTPS: true,
    checkTechnology: true,
    checkPageSpeed: true,
    checkSEO: true,
    checkCrawling: true,
    batchSize: 10,
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
      // Simuliere automatische Domain-Suche
      domainsToAnalyze = await simulateAutomaticDomainDiscovery(domainList[0]);
    }

    setDomains(domainsToAnalyze);
    
    try {
      const analyzer = new DomainAnalyzer(settings);
      const total = domainsToAnalyze.length;
      const newResults: DomainAnalysisResult[] = [];

      for (let i = 0; i < total; i++) {
        const domain = domainsToAnalyze[i];
        
        try {
          console.log(`Analyzing domain ${i + 1}/${total}: ${domain}`);
          const result = await analyzer.analyzeDomain(domain);
          newResults.push(result);
          setResults([...newResults]);
          
          const progressPercent = ((i + 1) / total) * 100;
          setProgress(progressPercent);
          
          // Kleine Pause zwischen Analysen
          await new Promise(resolve => setTimeout(resolve, 1000));
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
        description: `${newResults.length} Domains erfolgreich analysiert`,
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

  return {
    domains,
    isAnalyzing,
    progress,
    results,
    settings,
    startAnalysis,
    pauseAnalysis,
    exportResults,
    updateSettings
  };
};

// Simuliert automatische Domain-Suche basierend auf Suchbegriffen
const simulateAutomaticDomainDiscovery = async (query: string): Promise<string[]> => {
  // In einer echten Implementierung würde hier eine API-Abfrage erfolgen
  // Zum Beispiel über Google Custom Search API, SEMrush API, oder andere Services
  
  const sampleDomains = [
    'musterfirma-berlin.de',
    'handwerk-service-24.de',
    'ihr-lokaler-dienstleister.de',
    'qualitaets-handwerker.de',
    'schnelle-reparaturen.de'
  ];
  
  // Simuliere Suchzeit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return sampleDomains;
};
