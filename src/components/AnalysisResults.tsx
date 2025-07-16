
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
  Filter
} from 'lucide-react';
import { DomainAnalysisResult } from '@/types/domain-analysis';

interface AnalysisResultsProps {
  results: DomainAnalysisResult[];
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('domain');

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
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Domain suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-600 text-white">
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
          <SelectTrigger className="w-full sm:w-48 bg-slate-800 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="domain">Domain A-Z</SelectItem>
            <SelectItem value="score">PageSpeed Score</SelectItem>
            <SelectItem value="issues">Anzahl Probleme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Table */}
      <div className="border border-slate-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700 bg-slate-800/50">
              <TableHead className="text-slate-300">Domain</TableHead>
              <TableHead className="text-slate-300">HTTPS</TableHead>
              <TableHead className="text-slate-300">Technologie</TableHead>
              <TableHead className="text-slate-300">PageSpeed</TableHead>
              <TableHead className="text-slate-300">Core Web Vitals</TableHead>
              <TableHead className="text-slate-300">SEO</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.map((result) => (
              <TableRow key={result.domain} className="border-slate-700 hover:bg-slate-800/30">
                <TableCell className="font-medium text-white">
                  <div className="flex items-center space-x-2">
                    <span>{result.domain}</span>
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
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">LCP:</span>
                      <span className="text-white">{result.coreWebVitals.lcp || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">CLS:</span>
                      <span className="text-white">{result.coreWebVitals.cls || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">INP:</span>
                      <span className="text-white">{result.coreWebVitals.inp || 'N/A'}</span>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    {result.seoAudit.issues.length === 0 ? (
                      <Badge className="bg-green-600 text-xs">OK</Badge>
                    ) : (
                      result.seoAudit.issues.slice(0, 2).map((issue, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {issue}
                        </Badge>
                      ))
                    )}
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

      {filteredResults.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          <p>Keine Ergebnisse für die aktuellen Filter gefunden.</p>
        </div>
      )}
    </div>
  );
};
