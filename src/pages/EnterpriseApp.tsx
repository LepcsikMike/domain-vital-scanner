import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Globe, Shield, Zap, FileText, Download, Pause, Crown } from 'lucide-react';
import { DomainSearchForm } from '@/components/DomainSearchForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { DashboardStats } from '@/components/DashboardStats';
import { AnalysisSettings } from '@/components/AnalysisSettings';
import { CostTracker } from '@/components/CostTracker';
import { useDomainAnalysis } from '@/hooks/useDomainAnalysis';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { usePlan } from '@/contexts/PlanContext';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
const EnterpriseApp = () => {
  const { t } = useTranslation('app');
  const [searchParams] = useSearchParams();
  const {
    activateEnterprisePlan
  } = usePlan();
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
  useEffect(() => {
    // Check for access key in URL parameters
    const accessKey = searchParams.get('key') || searchParams.get('access');
    if (accessKey) {
      // Validate access key (simple validation for now)
      const validKeys = ['ENT_2024_ACCESS_PRO', 'PREMIUM_USER_2024', 'ENTERPRISE_ACCESS_KEY'];
      if (validKeys.includes(accessKey)) {
        activateEnterprisePlan();
      }
    } else {
      // Auto-activate Enterprise for this route
      activateEnterprisePlan();
    }
  }, [searchParams, activateEnterprisePlan]);
  const handleSearchStart = (domainList: string[], searchType: string, searchOptions?: any) => {
    startAnalysis(domainList, searchType, searchOptions);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Enterprise Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex-shrink-0">
                <Globe className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-2xl font-bold text-white flex items-center">
                  <span className="hidden sm:inline">{t('header.enterprise.title')}</span>
                  <span className="sm:hidden">{t('header.enterprise.titleShort')}</span>
                  <Crown className="h-4 w-4 lg:h-5 lg:w-5 ml-2 text-yellow-500 flex-shrink-0" />
                </h1>
                <p className="text-slate-400 text-xs lg:text-sm hidden sm:block">
                  {t('header.enterprise.subtitle')}
                </p>
                <p className="text-slate-400 text-xs sm:hidden">
                  {t('header.enterprise.subtitleShort')}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between lg:justify-end gap-2 lg:gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{t('header.enterprise.badge')}</span>
                  <span className="sm:hidden">{t('header.enterprise.badgeShort')}</span>
                </Badge>
                
                <Badge variant="outline" className="border-green-500 text-green-400 text-xs hidden sm:flex">
                  {t('header.enterprise.apiBadge')}
                </Badge>
              </div>
              
              <LanguageSwitcher />
              
              <Button 
                onClick={exportResults} 
                variant="outline" 
                disabled={results.length === 0} 
                size="sm"
                className="border-primary/50 hover:bg-primary/10 text-primary hover:text-primary"
              >
                <Download className="h-4 w-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">{t('navigation.exportCsv')}</span>
                <span className="sm:hidden">{t('navigation.export')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6">
            {/* Search Form */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Search className="h-5 w-5 mr-2 text-cyan-400" />
                  {t('navigation.domainSearchEnterprise')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DomainSearchForm onSearchStart={handleSearchStart} isAnalyzing={isAnalyzing} />
              </CardContent>
            </Card>

            {/* API Settings */}
            <ApiKeySettings />

            {/* Cost Tracker */}
            <CostTracker analysisCount={analysisCount} successRate={successRate} />

            {/* Analysis Settings */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  {t('features.settings.advanced')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnalysisSettings settings={settings} onSettingsChange={updateSettings} />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Dashboard Stats */}
            <DashboardStats results={results} />

            {/* Progress */}
            {isAnalyzing && <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm transition-all duration-300 ease-in-out">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-400" />
                      {t('analysis.progress.enterprise')}
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
                      {Math.round(progress)}% {t('analysis.progress.enterpriseComplete')}
                    </p>
                  </div>
                </CardContent>
              </Card>}

            {/* Analysis Results */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-400" />
                  {t('analysis.results.enterprise')}
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
export default EnterpriseApp;