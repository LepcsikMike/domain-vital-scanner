import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Shield, Zap, FileText, Download, Play, Pause, AlertCircle, Crown } from 'lucide-react';
import logo from '@/assets/logo.png';
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
  const {
    isEnterprise,
    canScan,
    dailyScansUsed,
    dailyScansLimit,
    incrementDailyScans,
    upgradeToPro,
    resetToFreePlan
  } = usePlan();

  // Force free plan on /app route
  useEffect(() => {
    resetToFreePlan();
  }, [resetToFreePlan]);
  const handleSearchStart = (domainList: string[], searchType: string, searchOptions?: any) => {
    if (!canScan) {
      toast({
        title: "Tägliches Limit erreicht",
        description: `Sie haben Ihr Limit von ${dailyScansLimit} Scan(s) pro Tag erreicht. Upgraden Sie auf Enterprise für unbegrenzte Scans.`,
        variant: "destructive"
      });
      return;
    }

    // Increment daily scans for free plan
    incrementDailyScans();
    startAnalysis(domainList, searchType, searchOptions);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg">
                <img src={logo} alt="DomainAudit Pro Logo" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">DomainAudit Pro - Kostenlos</h1>
                <p className="text-slate-400 text-sm">
                  Basis Domain-Analyse mit täglichen Limits
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PlanBadge />
              
              <Badge variant="outline" className="border-slate-600 text-slate-400">
                Basis-Version
              </Badge>
              
              
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
                    Domain-Suche (Kostenlos)
                  </span>
                  <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                    {dailyScansUsed}/{dailyScansLimit}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!canScan && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Tägliches Limit erreicht
                    </div>
                  </div>}
                <DomainSearchForm onSearchStart={handleSearchStart} isAnalyzing={isAnalyzing} />
              </CardContent>
            </Card>

            {/* Free Plan Features Info */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Kostenloser Plan Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>1 Domain-Scan pro Tag</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>HTTPS & SSL Checks</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>Performance-Überblick</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>Meta-Tags & CMS Erkennung</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <span className="mr-2">✗</span>
                    <span>CSV-Export</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <span className="mr-2">✗</span>
                    <span>API-Integration</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <span className="mr-2">✗</span>
                    <span>Erweiterte Analyse</span>
                  </div>
                </div>
                <Button onClick={() => window.open('/enterprise', '_blank')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 mt-4">
                  <Crown className="h-4 w-4 mr-2" />
                  Auf Enterprise upgraden
                </Button>
              </CardContent>
            </Card>

            {/* Cost Tracker */}
            <CostTracker analysisCount={analysisCount} successRate={successRate} />

            {/* Analysis Settings - Limited for Free */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Basis-Einstellungen
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
            {isAnalyzing && <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm transition-all duration-300 ease-in-out">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-400" />
                      Basis Live-Analyse
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
                      {Math.round(progress)}% abgeschlossen - Basis-Sicherheitschecks
                    </p>
                  </div>
                </CardContent>
              </Card>}

            {/* Analysis Results */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-400" />
                  Basis Analyse-Ergebnisse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalysisResults results={results} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};
export default Index;