
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Shield, 
  ShieldAlert, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  ExternalLink,
  Cpu,
  BarChart3,
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  FileText,
  Download,
  ChevronDown
} from 'lucide-react';
import { DomainAnalysisResult } from '@/types/domain-analysis';
import { getDomainUrl } from '@/utils/urlUtils';
import { TechnologyStackCard } from './TechnologyStackCard';
import { ScoreDashboard } from './ScoreDashboard';
import { ReportGenerator, ReportOptions } from '@/services/ReportGenerator';
import { useToast } from '@/hooks/use-toast';

interface AnalysisResultsProps {
  results: DomainAnalysisResult[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('domain');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredResults = results
    .filter(result => {
      if (filter === 'critical') {
        return result.criticalIssues >= 2;
      }
      if (filter === 'https-issues') {
        return !result.httpsStatus.valid;
      }
      if (filter === 'seo-issues') {
        return result.seoAudit.issues.length > 0;
      }
      return true;
    })
    .filter(result => 
      result.domain.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.pageSpeedScores.mobile || 0) - (a.pageSpeedScores.mobile || 0);
        case 'issues':
          return b.criticalIssues - a.criticalIssues;
        default:
          return a.domain.localeCompare(b.domain);
      }
    });

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="secondary">N/A</Badge>;
    
    if (score >= 90) return <Badge className="bg-success text-success-foreground">Excellent ({score})</Badge>;
    if (score >= 70) return <Badge className="bg-warning text-warning-foreground">Good ({score})</Badge>;
    if (score >= 50) return <Badge className="bg-orange-500 text-white">Fair ({score})</Badge>;
    return <Badge variant="destructive">Poor ({score})</Badge>;
  };

  const getScoreColor = (score: number | null) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    if (score >= 50) return 'text-orange-500';
    return 'text-destructive';
  };

  const getTechnologyHealthBadge = (outdatedTech: string[]) => {
    if (outdatedTech.length === 0) {
      return <Badge className="bg-success text-success-foreground">Modern</Badge>;
    }
    if (outdatedTech.length <= 2) {
      return <Badge className="bg-warning text-warning-foreground">Needs Update</Badge>;
    }
    return <Badge variant="destructive">Critical</Badge>;
  };

  const getCriticalIssues = (result: DomainAnalysisResult) => {
    const issues: string[] = [];
    
    if (!result.httpsStatus.valid) issues.push('HTTPS fehlt');
    if (result.technologyAudit.outdatedTechnologies.length > 0) {
      issues.push(`${result.technologyAudit.outdatedTechnologies.length} veraltete Technologien`);
    }
    if (result.securityAudit.vulnerableLibraries.length > 0) {
      issues.push(`${result.securityAudit.vulnerableLibraries.length} Sicherheitslücken`);
    }
    if (result.seoAudit.issues.length > 3) {
      issues.push(`${result.seoAudit.issues.length} SEO Probleme`);
    }
    if ((result.pageSpeedScores.mobile || 0) < 50) {
      issues.push('Schlechte Performance');
    }
    
    return issues;
  };

  const handleDownloadReport = async (result: DomainAnalysisResult, type: 'pdf-executive' | 'pdf-technical' | 'pdf-action-plan' | 'csv') => {
    setIsGeneratingReport(result.domain);
    
    try {
      if (type === 'csv') {
        ReportGenerator.generateEnhancedCSV([result]);
        toast({
          title: "CSV Export erfolgreich",
          description: `Detaillierte Analyse für ${result.domain} wurde heruntergeladen`,
        });
      } else {
        const reportType = type.replace('pdf-', '') as 'executive' | 'technical' | 'action-plan';
        const options: ReportOptions = {
          type: reportType,
          format: 'pdf',
          includeCharts: true,
          includeRecommendations: true
        };
        
        await ReportGenerator.generatePDFReport(result, options);
        toast({
          title: "PDF Report erfolgreich",
          description: `${reportType === 'executive' ? 'Executive' : reportType === 'technical' ? 'Technischer' : 'Aktionsplan'} Report für ${result.domain} wurde erstellt`,
        });
      }
    } catch (error) {
      toast({
        title: "Fehler beim Report-Export",
        description: "Der Report konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingReport(null);
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Noch keine Analyse-Ergebnisse vorhanden.</p>
        <p className="text-sm">Starte eine Domain-Analyse, um Ergebnisse zu sehen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter & Search Controls */}
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="w-full">
          <Input
            placeholder="Domain suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Ergebnisse</SelectItem>
              <SelectItem value="critical">Kritische Probleme</SelectItem>
              <SelectItem value="https-issues">HTTPS Probleme</SelectItem>
              <SelectItem value="seo-issues">SEO Probleme</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="domain">Domain A-Z</SelectItem>
              <SelectItem value="score">PageSpeed Score</SelectItem>
              <SelectItem value="issues">Anzahl Probleme</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Enhanced Results Cards */}
      <div className="space-y-6">
        {filteredResults.map((result) => {
          const criticalIssues = getCriticalIssues(result);
          const overallScore = Math.round(
            ((result.pageSpeedScores.mobile || 0) + 
             (result.pageSpeedScores.desktop || 0) + 
             result.securityAudit.score + 
             Math.max(0, 100 - result.seoAudit.issues.length * 10)) / 4
          );

          return (
            <Card key={result.domain} className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-primary" />
                    <div>
                      <a 
                        href={getDomainUrl(result.domain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                      >
                        {result.domain}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <p className="text-sm text-muted-foreground">
                        Analysiert am {new Date(result.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {criticalIssues.length > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {criticalIssues.length} Kritisch
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedDomain(expandedDomain === result.domain ? null : result.domain)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Score Dashboard */}
                <ScoreDashboard
                  pageSpeedMobile={result.pageSpeedScores.mobile}
                  pageSpeedDesktop={result.pageSpeedScores.desktop}
                  securityScore={result.securityAudit.score}
                  seoIssues={result.seoAudit.issues}
                  securityIssues={result.securityAudit.vulnerableLibraries}
                  technologyIssues={result.technologyAudit.outdatedTechnologies}
                  performanceIssues={
                    (result.pageSpeedScores.mobile || 0) < 50 || (result.pageSpeedScores.desktop || 0) < 50 
                      ? ['Langsame Ladezeiten'] 
                      : []
                  }
                  overallScore={overallScore}
                />

                {/* Status Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* HTTPS Status */}
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-center mb-2">
                      {result.httpsStatus.valid ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive" />
                      )}
                    </div>
                    <div className="text-sm font-medium">HTTPS</div>
                    <div className="text-xs text-muted-foreground">
                      {result.httpsStatus.valid ? 'Sicher' : 'Unsicher'}
                    </div>
                  </div>

                  {/* Technology Health */}
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-center mb-2">
                      {result.technologyAudit.outdatedTechnologies.length === 0 ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : result.technologyAudit.outdatedTechnologies.length <= 2 ? (
                        <AlertTriangle className="h-6 w-6 text-warning" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive" />
                      )}
                    </div>
                    <div className="text-sm font-medium">Technologie</div>
                    <div className="text-xs text-muted-foreground">
                      {getTechnologyHealthBadge(result.technologyAudit.outdatedTechnologies)}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className={`h-6 w-6 ${getScoreColor(result.pageSpeedScores.mobile)}`} />
                    </div>
                    <div className="text-sm font-medium">Performance</div>
                    <div className="text-xs">
                      Mobile: <span className={getScoreColor(result.pageSpeedScores.mobile)}>
                        {result.pageSpeedScores.mobile || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* SEO Health */}
                  <div className="text-center p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-center mb-2">
                      {result.seoAudit.issues.length === 0 ? (
                        <CheckCircle className="h-6 w-6 text-success" />
                      ) : result.seoAudit.issues.length <= 3 ? (
                        <AlertTriangle className="h-6 w-6 text-warning" />
                      ) : (
                        <XCircle className="h-6 w-6 text-destructive" />
                      )}
                    </div>
                    <div className="text-sm font-medium">SEO</div>
                    <div className="text-xs text-muted-foreground">
                      {result.seoAudit.issues.length === 0 ? 'Optimal' : `${result.seoAudit.issues.length} Issues`}
                    </div>
                  </div>
                </div>

                {/* Critical Issues Summary */}
                {criticalIssues.length > 0 && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <span className="font-medium text-destructive">Sofortiger Handlungsbedarf</span>
                    </div>
                    <div className="grid gap-2">
                      {criticalIssues.slice(0, 3).map((issue, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="w-2 h-2 bg-destructive rounded-full"></span>
                          <span>{issue}</span>
                        </div>
                      ))}
                      {criticalIssues.length > 3 && (
                        <div className="text-xs text-muted-foreground italic">
                          ... und {criticalIssues.length - 3} weitere Probleme
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        disabled={isGeneratingReport === result.domain}
                      >
                        <Download className="h-4 w-4" />
                        {isGeneratingReport === result.domain ? 'Erstelle...' : 'Report'}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleDownloadReport(result, 'pdf-executive')}>
                        📊 Executive Summary (PDF)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadReport(result, 'pdf-technical')}>
                        🔧 Technischer Report (PDF)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadReport(result, 'pdf-action-plan')}>
                        📋 Aktionsplan (PDF)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadReport(result, 'csv')}>
                        📁 Detaillierte Daten (CSV)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setExpandedDomain(expandedDomain === result.domain ? null : result.domain)}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Details
                  </Button>
                </div>

                {/* Expandable Details */}
                {expandedDomain === result.domain && (
                  <div className="pt-4 border-t">
                    <TechnologyStackCard
                      technologyDetails={result.technologyDetails}
                      marketingTools={result.marketingTools}
                      securityAudit={result.securityAudit}
                      competitorInsights={result.competitorInsights}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>


      {filteredResults.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Keine Ergebnisse für die aktuellen Filter gefunden.</p>
        </div>
      )}
    </div>
  );
};
