
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

interface DashboardStatsProps {
  results: DomainAnalysisResult[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ results }) => {
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
      title: 'Analysierte Domains',
      value: totalDomains,
      icon: Globe,
      color: 'blue',
      description: 'Gesamt durchgeführte Analysen'
    },
    {
      title: 'HTTPS Probleme',
      value: httpsIssues,
      icon: Shield,
      color: 'red',
      description: 'Domains ohne gültiges SSL'
    },
    {
      title: 'Kritische Fälle',
      value: criticalIssues,
      icon: AlertTriangle,
      color: 'yellow',
      description: '2+ kritische Probleme'
    },
    {
      title: 'Veraltete Technologien',
      value: outdatedTech,
      icon: ShieldAlert,
      color: 'orange',
      description: 'Veraltete CMS/Frameworks'
    },
    {
      title: 'SEO Probleme',
      value: seoIssues,
      icon: TrendingUp,
      color: 'purple',
      description: 'SEO-optimierungsbedürftig'
    },
    {
      title: 'Ø PageSpeed',
      value: avgPageSpeed,
      icon: Zap,
      color: avgPageSpeed >= 90 ? 'green' : avgPageSpeed >= 50 ? 'yellow' : 'red',
      description: 'Durchschnittlicher Mobile Score'
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`bg-slate-900/50 border-slate-700 backdrop-blur-sm ${getColorClasses(stat.color)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {stat.value}
                    {stat.title.includes('PageSpeed') && totalDomains > 0 && (
                      <span className="text-lg text-slate-400 ml-1">/100</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-slate-800/50`}>
                  <Icon className={`h-6 w-6 ${getIconColor(stat.color)}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
