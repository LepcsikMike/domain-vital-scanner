
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  ShieldAlert, 
  Zap, 
  AlertTriangle, 
  Globe,
  TrendingUp
} from 'lucide-react';
import { DomainAnalysisResult } from '@/types/domain-analysis';
import { useTranslation } from 'react-i18next';

interface DashboardStatsProps {
  results: DomainAnalysisResult[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ results }) => {
  const { t } = useTranslation('app');
  const totalDomains = results.length;
  const httpsIssues = results.filter(r => !r.httpsStatus.valid).length;
  const criticalIssues = results.filter(r => r.criticalIssues >= 2).length;
  const outdatedTech = results.filter(r => r.technologyAudit.outdatedTechnologies.length > 0).length;
  const seoIssues = results.filter(r => r.seoAudit.issues.length > 0).length;
  const avgPageSpeed = totalDomains > 0 
    ? Math.round(results.reduce((acc, r) => acc + (r.pageSpeedScores.mobile || 0), 0) / totalDomains)
    : 0;

  const stats = [
    {
      title: t('dashboardStats.titles.analyzedDomains'),
      value: totalDomains,
      icon: Globe,
      color: 'blue',
      description: t('dashboardStats.descriptions.totalAnalyses')
    },
    {
      title: t('dashboardStats.titles.httpsProblems'),
      value: httpsIssues,
      icon: Shield,
      color: 'red',
      description: t('dashboardStats.descriptions.noValidSSL')
    },
    {
      title: t('dashboardStats.titles.criticalCases'),
      value: criticalIssues,
      icon: AlertTriangle,
      color: 'yellow',
      description: t('dashboardStats.descriptions.criticalIssues')
    },
    {
      title: t('dashboardStats.titles.outdatedTechnologies'),
      value: outdatedTech,
      icon: ShieldAlert,
      color: 'orange',
      description: t('dashboardStats.descriptions.outdatedCMS')
    },
    {
      title: t('dashboardStats.titles.seoProblems'),
      value: seoIssues,
      icon: TrendingUp,
      color: 'purple',
      description: t('dashboardStats.descriptions.seoOptimization')
    },
    {
      title: t('dashboardStats.titles.avgPageSpeed'),
      value: avgPageSpeed,
      icon: Zap,
      color: avgPageSpeed >= 90 ? 'green' : avgPageSpeed >= 50 ? 'yellow' : 'red',
      description: t('dashboardStats.descriptions.avgMobileScore')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-500 bg-blue-500/10',
      red: 'border-red-500 bg-red-500/10',
      yellow: 'border-yellow-500 bg-yellow-500/10',
      orange: 'border-orange-500 bg-orange-500/10',
      purple: 'border-purple-500 bg-purple-500/10',
      green: 'border-green-500 bg-green-500/10'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-400',
      red: 'text-red-400',
      yellow: 'text-yellow-400',
      orange: 'text-orange-400',
      purple: 'text-purple-400',
      green: 'text-green-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`bg-slate-900/50 border-slate-700 backdrop-blur-sm ${getColorClasses(stat.color)}`}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1 lg:space-y-2 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-slate-400 truncate">
                    {stat.title}
                  </p>
                  <p className="text-xl lg:text-3xl font-bold text-white">
                    {stat.value}
                    {stat.title.includes('PageSpeed') && totalDomains > 0 && (
                      <span className="text-sm lg:text-lg text-slate-400 ml-1">/100</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-2 lg:p-3 rounded-lg bg-slate-800/50 flex-shrink-0`}>
                  <Icon className={`h-5 w-5 lg:h-6 lg:w-6 ${getIconColor(stat.color)}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
