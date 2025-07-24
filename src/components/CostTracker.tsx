
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Activity, Globe, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CostTrackerProps {
  analysisCount: number;
  successRate: number;
}

export const CostTracker: React.FC<CostTrackerProps> = ({ 
  analysisCount, 
  successRate 
}) => {
  const { t } = useTranslation('app');
  
  const stats = [
    {
      title: t('costTracker.stats.currentCosts'),
      value: t('costTracker.values.free'),
      icon: DollarSign,
      color: 'green',
      description: t('costTracker.descriptions.completelyFree')
    },
    {
      title: t('costTracker.stats.apiCalls'),
      value: `${analysisCount}/${t('costTracker.values.unlimited')}`,
      icon: Activity,
      color: 'blue',
      description: t('costTracker.descriptions.unlimitedAvailable')
    },
    {
      title: t('costTracker.stats.successRate'),
      value: `${successRate}%`,
      icon: Globe,
      color: 'purple',
      description: t('costTracker.descriptions.last100')
    },
    {
      title: t('costTracker.stats.resourceUsage'),
      value: t('costTracker.values.minimal'),
      icon: Zap,
      color: 'yellow',
      description: t('costTracker.descriptions.browserBased')
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'border-green-500 bg-green-500/10 text-green-400',
      blue: 'border-blue-500 bg-blue-500/10 text-blue-400',
      purple: 'border-purple-500 bg-purple-500/10 text-purple-400',
      yellow: 'border-yellow-500 bg-yellow-500/10 text-yellow-400'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-green-400" />
            {t('costTracker.title')}
          </span>
          <Badge className="bg-green-600">{t('costTracker.badge')}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-4 w-4" />
                  <span className="text-lg font-bold">{stat.value}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{stat.title}</p>
                  <p className="text-xs text-slate-400">{stat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg">
          <h4 className="text-sm font-medium text-white mb-2">{t('costTracker.services.title')}</h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between">
              <span>• {t('costTracker.services.commonCrawl')}</span>
              <Badge variant="secondary" className="text-xs">{t('costTracker.badge')}</Badge>
            </div>
            <div className="flex justify-between">
              <span>• {t('costTracker.services.corsProxy')}</span>
              <Badge variant="secondary" className="text-xs">{t('costTracker.badge')}</Badge>
            </div>
            <div className="flex justify-between">
              <span>• {t('costTracker.services.htmlParsing')}</span>
              <Badge variant="secondary" className="text-xs">{t('costTracker.badge')}</Badge>
            </div>
            <div className="flex justify-between">
              <span>• {t('costTracker.services.sslValidation')}</span>
              <Badge variant="secondary" className="text-xs">{t('costTracker.badge')}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
