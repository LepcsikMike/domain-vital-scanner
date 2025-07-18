
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  TrendingUp
} from 'lucide-react';
import { DomainAnalysisResult } from '@/types/domain-analysis';
import { getDomainUrl } from '@/utils/urlUtils';
import { TechnologyStackCard } from './TechnologyStackCard';

interface AnalysisResultsProps {
  results: DomainAnalysisResult[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('domain');
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

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
      <CheckCircle className="h-4 w-4 text-green-400" />
    ) : (
      <XCircle className="h-4 w-4 text-red-400" />
    );
  };

  const getScoreBadge = (score: number | null) => {
    if (!score) return <Badge variant="secondary">N/A</Badge>;
    
    if (score >= 90) return <Badge className="bg-green-600">Gut ({score})</Badge>;
    if (score >= 50) return <Badge className="bg-yellow-600">Mittel ({score})</Badge>;
    return <Badge className="bg-red-600">Schlecht ({score})</Badge>;
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

      {/* Results - Mobile Card View / Desktop Table */}
      <div className="block lg:hidden">
        {/* Mobile Card View */}
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <Card key={result.domain} className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Domain Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <a 
                          href={getDomainUrl(result.domain)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors font-medium"
                        >
                          <span className="truncate">{result.domain}</span>
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedDomain(expandedDomain === result.domain ? null : result.domain)}
                          className="h-6 w-6 p-0"
                        >
                          <Cpu className="h-3 w-3" />
                        </Button>
                      </div>
                      {result.criticalIssues >= 2 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                      )}
                    </div>

                  {/* Status Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <div className="text-slate-400 text-xs">HTTPS</div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(result.httpsStatus.valid)}
                        <span className="text-xs">{result.httpsStatus.valid ? 'Gültig' : 'Fehler'}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 text-xs">Tech</div>
                      {result.technologyAudit.outdatedTechnologies.length > 0 ? (
                        <Badge variant="destructive" className="text-xs">
                          {result.technologyAudit.outdatedTechnologies[0]}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Modern</Badge>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 text-xs">PageSpeed</div>
                      <div className="space-y-1">
                        {getScoreBadge(result.pageSpeedScores.mobile)}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-slate-400 text-xs">SEO</div>
                      {result.seoAudit.issues.length === 0 ? (
                        <Badge className="bg-green-600 text-xs">OK</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          {result.seoAudit.issues.length} Issues
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Technology Stack - Expandable */}
                  {expandedDomain === result.domain && (
                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <TechnologyStackCard
                        technologyDetails={result.technologyDetails}
                        marketingTools={result.marketingTools}
                        securityAudit={result.securityAudit}
                        competitorInsights={result.competitorInsights}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 bg-slate-800/50">
                <TableHead className="text-slate-300">Domain</TableHead>
                <TableHead className="text-slate-300">HTTPS</TableHead>
                <TableHead className="text-slate-300">Technologie</TableHead>
                <TableHead className="text-slate-300">PageSpeed</TableHead>
                <TableHead className="text-slate-300">Security</TableHead>
                <TableHead className="text-slate-300">Market Position</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.domain} className="border-slate-700 hover:bg-slate-800/30">
                  <TableCell className="font-medium text-white">
                    <div className="flex items-center space-x-2">
                      <a 
                        href={getDomainUrl(result.domain)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <span>{result.domain}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedDomain(expandedDomain === result.domain ? null : result.domain)}
                        className="h-6 w-6 p-0"
                      >
                        <Cpu className="h-3 w-3" />
                      </Button>
                      {result.criticalIssues >= 2 && (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(result.httpsStatus.valid)}
                      <span className="text-sm text-slate-400">
                        {result.httpsStatus.valid ? 'Gültig' : 'Fehler'}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {result.technologyAudit.outdatedTechnologies.length > 0 ? (
                      <Badge variant="destructive" className="text-xs">
                        {result.technologyAudit.outdatedTechnologies[0]}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Modern</Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">Mobile:</span>
                        {getScoreBadge(result.pageSpeedScores.mobile)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-slate-400">Desktop:</span>
                        {getScoreBadge(result.pageSpeedScores.desktop)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-3 w-3 text-blue-400" />
                        <Badge variant={result.securityAudit.score >= 80 ? "default" : result.securityAudit.score >= 60 ? "secondary" : "destructive"} className="text-xs">
                          {result.securityAudit.score}/100
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        {result.securityAudit.vulnerableLibraries.length > 0 && (
                          <div className="text-red-400">
                            {result.securityAudit.vulnerableLibraries.length} vulnerabilities
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-3 w-3 text-purple-400" />
                        <Badge 
                          variant={result.competitorInsights.marketPosition === 'leading' ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {result.competitorInsights.marketPosition}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        {result.competitorInsights.industryCategory}
                      </div>
                      <div className="text-xs">
                        <Badge variant="outline" className="text-xs">
                          {result.competitorInsights.technicalSimilarity}% similar
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {result.crawlingStatus.hasErrors ? (
                        <XCircle className="h-4 w-4 text-red-400" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                      <span className="text-xs text-slate-400">
                        {result.crawlingStatus.hasErrors ? 'Fehler' : 'OK'}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Enhanced Technology Details - Expandable for Desktop */}
        {expandedDomain && (
          <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700">
            {(() => {
              const expandedResult = results.find(r => r.domain === expandedDomain);
              return expandedResult ? (
                <TechnologyStackCard
                  technologyDetails={expandedResult.technologyDetails}
                  marketingTools={expandedResult.marketingTools}
                  securityAudit={expandedResult.securityAudit}
                  competitorInsights={expandedResult.competitorInsights}
                />
              ) : null;
            })()}
          </div>
        )}
      </div>

      {filteredResults.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Keine Ergebnisse für die aktuellen Filter gefunden.</p>
        </div>
      )}
    </div>
  );
};
