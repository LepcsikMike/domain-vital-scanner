import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Globe, Shield, Zap, FileText, Download, Play, Pause, AlertCircle, Crown } from 'lucide-react';
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
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { usePlan } from '@/contexts/PlanContext';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import SEOHelmet from '@/components/SEOHelmet';
const Index = () => {
  const { t } = useTranslation('app');
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
        title: t('alerts.limitReached.title'),
        description: t('alerts.limitReached.description', { limit: dailyScansLimit }),
        variant: "destructive"
      });
      return;
    }

    // Increment daily scans for free plan
    incrementDailyScans();
    startAnalysis(domainList, searchType, searchOptions);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <SEOHelmet 
        title={t('app.meta.title')}
        description={t('app.meta.description')}
        keywords={t('app.meta.keywords')}
      />
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t('header.free.title')}</h1>
                <p className="text-slate-400 text-sm">
                  {t('header.free.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <PlanBadge />
              
              <Badge variant="outline" className="border-slate-600 text-slate-400">
                {t('header.free.badge')}
              </Badge>
              
              <LanguageSwitcher />
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
                    {t('navigation.domainSearchFree')}
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
                      {t('alerts.limitReached.title')}
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
                  {t('features.free.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>{t('features.free.domainScan')}</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>{t('features.free.httpsCheck')}</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>{t('features.free.performance')}</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-2">✓</span>
                    <span>{t('features.free.metaTags')}</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <span className="mr-2">✗</span>
                    <span>{t('features.free.csvExport')}</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <span className="mr-2">✗</span>
                    <span>{t('features.free.apiIntegration')}</span>
                  </div>
                  <div className="flex items-center text-red-400">
                    <span className="mr-2">✗</span>
                    <span>{t('features.free.advancedAnalysis')}</span>
                  </div>
                </div>
                <Button onClick={() => window.open('/enterprise', '_blank')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 mt-4">
                  <Crown className="h-4 w-4 mr-2" />
                  {t('features.free.upgradeButton')}
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
                  {t('features.settings.basic')}
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
                      {t('analysis.progress.basic')}
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
                      {Math.round(progress)}% {t('analysis.progress.basicComplete')}
                    </p>
                  </div>
                </CardContent>
              </Card>}

            {/* Analysis Results */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-400" />
                  {t('analysis.results.basic')}
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