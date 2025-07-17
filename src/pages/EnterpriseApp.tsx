
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, Shield, Zap, FileText, Download, Pause, Crown } from 'lucide-react';
import logo from '@/assets/logo.png';
import { DomainSearchForm } from '@/components/DomainSearchForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { DashboardStats } from '@/components/DashboardStats';
import { AnalysisSettings } from '@/components/AnalysisSettings';
import { CostTracker } from '@/components/CostTracker';
import { useDomainAnalysis } from '@/hooks/useDomainAnalysis';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { usePlan } from '@/contexts/PlanContext';
import { useSearchParams } from 'react-router-dom';

const EnterpriseApp = () => {
  const [searchParams] = useSearchParams();
  const { activateEnterprisePlan } = usePlan();
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Enterprise Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <img src={logo} alt="DomainAudit Pro Logo" className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  DomainAudit Pro Enterprise
                  <Crown className="h-5 w-5 ml-2 text-yellow-500" />
                </h1>
                <p className="text-slate-400 text-sm">
                  Vollständige Domain-Analyse mit Google APIs & Erweiterten Features
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Enterprise
              </Badge>
              
              <Badge variant="outline" className="border-green-500 text-green-400">
                API-Enhanced
              </Badge>
              
              <Button onClick={exportResults} variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" disabled={results.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Form */}
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Search className="h-5 w-5 mr-2 text-cyan-400" />
                  Enterprise Domain-Suche
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
                  Erweiterte Einstellungen
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
                      Enterprise API-Enhanced Live-Analyse
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
                      {Math.round(progress)}% abgeschlossen - Google APIs & intelligente Analyse aktiv
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
                  Enterprise Analyse-Ergebnisse
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

export default EnterpriseApp;
