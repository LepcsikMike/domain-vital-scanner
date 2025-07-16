
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, Shield, Zap, FileText, Download, Play, Pause, AlertCircle } from 'lucide-react';
import { DomainSearchForm } from '@/components/DomainSearchForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { DashboardStats } from '@/components/DashboardStats';
import { AnalysisSettings } from '@/components/AnalysisSettings';
import { CostTracker } from '@/components/CostTracker';
import { useDomainAnalysis } from '@/hooks/useDomainAnalysis';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { FeatureGate } from '@/components/FeatureGate';
import { UpgradeBanner } from '@/components/UpgradeBanner';
import { PlanBadge } from '@/components/PlanBadge';
import { usePlan } from '@/contexts/PlanContext';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    domains,
    isAnalyzing,
    progress,
    results,
    analysisCount,
    successRate,
    startAnalysis,
    pauseAnalysis,
    exportResults,
    settings,
    updateSettings
  } = useDomainAnalysis();
  
  const { isEnterprise, canScan, dailyScansUsed, dailyScansLimit, incrementDailyScans, upgradeToPro } = usePlan();
  
  const handleSearchStart = (domainList: string[], searchType: string, searchOptions?: any) => {
    if (!canScan && !isEnterprise) {
      toast({
        title: "Tägliches Limit erreicht",
        description: `Sie haben Ihr Limit von ${dailyScansLimit} Scan(s) pro Tag erreicht. Upgraden Sie auf Enterprise für unbegrenzte Scans.`,
        variant: "destructive",
      });
      return;
    }
    
    // Increment daily scans for free plan
    if (!isEnterprise) {
      incrementDailyScans();
    }
    
    startAnalysis(domainList, searchType, searchOptions);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DomainAudit Pro</h1>
                <p className="text-slate-400 text-sm">
                  {isEnterprise ? 'Erweiterte Domain-Analyse mit Google APIs & Echten Daten' : 'Basis Domain-Analyse'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PlanBadge />
              
              {isEnterprise ? (
                <Badge variant="outline" className="border-green-500 text-green-400">
                  API-Enhanced
                </Badge>
              ) : (
                <Badge variant="outline" className="border-slate-600 text-slate-400">
                  Basis-Version
                </Badge>
              )}
              
              <FeatureGate 
                feature="export" 
                fallback={
                  <Button variant="outline" className="border-slate-600 text-slate-300 opacity-50" disabled>
                    <Download className="h-4 w-4 mr-2" />
                    Export (Enterprise)
                  </Button>
                }
              >
                <Button onClick={exportResults} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" disabled={results.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </FeatureGate>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Upgrade Banner for Free Plan */}
        <UpgradeBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Form */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Search className="h-5 w-5 mr-2 text-cyan-400" />
                    {isEnterprise ? 'Multi-TLD Domain-Suche' : 'Domain-Suche'}
                  </span>
                  {!isEnterprise && (
                    <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                      {dailyScansUsed}/{dailyScansLimit}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!canScan && !isEnterprise && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Tägliches Limit erreicht
                    </div>
                  </div>
                )}
                <DomainSearchForm onSearchStart={handleSearchStart} isAnalyzing={isAnalyzing} />
              </CardContent>
            </Card>

            {/* API Settings - Enterprise Only */}
            <FeatureGate feature="api">
              <ApiKeySettings />
            </FeatureGate>

            {/* Cost Tracker */}
            <CostTracker analysisCount={analysisCount} successRate={successRate} />

            {/* Analysis Settings */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  {isEnterprise ? 'Erweiterte Einstellungen' : 'Basis-Einstellungen'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalysisSettings settings={settings} onSettingsChange={updateSettings} />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dashboard Stats */}
            <DashboardStats results={results} />

            {/* Progress */}
            {isAnalyzing && (
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm transition-all duration-300 ease-in-out">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-400" />
                      {isEnterprise ? 'API-Enhanced Live-Analyse' : 'Basis Live-Analyse'}
                    </span>
                    <Button size="sm" variant="outline" onClick={pauseAnalysis} className="border-slate-600 text-slate-300 hover:bg-slate-800">
                      <Pause className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-slate-400">
                      {Math.round(progress)}% abgeschlossen - {isEnterprise ? 'Google APIs & intelligente Analyse' : 'Basis-Sicherheitschecks'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-400" />
                  {isEnterprise ? 'Erweiterte Analyse-Ergebnisse' : 'Basis Analyse-Ergebnisse'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalysisResults results={results} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
