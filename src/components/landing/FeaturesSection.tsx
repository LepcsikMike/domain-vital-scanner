
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Zap, FileText, Search, Download, Globe, Lock, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FeaturesSection = () => {
  const { t } = useTranslation('landing');
  
  const features = [
    {
      icon: <FileText className="h-8 w-8 text-purple-400" />,
      title: t('features.pdfReports.title'),
      description: t('features.pdfReports.description'),
      highlights: [t('features.pdfReports.highlights.summary'), t('features.pdfReports.highlights.technical'), t('features.pdfReports.highlights.actionPlan')]
    },
    {
      icon: <Shield className="h-8 w-8 text-green-400" />,
      title: t('features.security.title'),
      description: t('features.security.description'),
      highlights: [t('features.security.highlights.https'), t('features.security.highlights.ssl'), t('features.security.highlights.headers')]
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-400" />,
      title: t('features.performance.title'),
      description: t('features.performance.description'),
      highlights: [t('features.performance.highlights.metrics'), t('features.performance.highlights.devices'), t('features.performance.highlights.score')]
    },
    {
      icon: <Search className="h-8 w-8 text-blue-400" />,
      title: t('features.seo.title'),
      description: t('features.seo.description'),
      highlights: [t('features.seo.highlights.meta'), t('features.seo.highlights.robots'), t('features.seo.highlights.schema')]
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-400" />,
      title: t('features.discovery.title'),
      description: t('features.discovery.description'),
      highlights: [t('features.discovery.highlights.industry'), t('features.discovery.highlights.tld'), t('features.discovery.highlights.crawl')]
    },
    {
      icon: <Download className="h-8 w-8 text-orange-400" />,
      title: t('features.export.title'),
      description: t('features.export.description'),
      highlights: [t('features.export.highlights.pdf'), t('features.export.highlights.csv'), t('features.export.highlights.api')]
    }
  ];

  return (
    <div className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('features.title')}
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3" />
                      <span className="text-slate-400">{highlight}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Technical Credibility */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-6 bg-slate-900/30 border border-slate-700 rounded-full px-8 py-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-slate-300 text-sm">Google APIs</span>
            </div>
            <div className="w-px h-4 bg-slate-600" />
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-blue-400" />
              <span className="text-slate-300 text-sm">{t('features.trust.secureAnalysis')}</span>
            </div>
            <div className="w-px h-4 bg-slate-600" />
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              <span className="text-slate-300 text-sm">{t('features.trust.realData')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
