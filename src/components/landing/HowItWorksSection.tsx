
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Search, BarChart3, Download, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HowItWorksSection = () => {
  const { t } = useTranslation('landing');
  
  const steps = [
    {
      number: "01",
      icon: <Search className="h-8 w-8 text-cyan-400" />,
      title: t('howItWorks.steps.domainInput.title'),
      description: t('howItWorks.steps.domainInput.description'),
      details: t('howItWorks.steps.domainInput.details', { returnObjects: true })
    },
    {
      number: "02",
      icon: <BarChart3 className="h-8 w-8 text-green-400" />,
      title: t('howItWorks.steps.automaticAnalysis.title'),
      description: t('howItWorks.steps.automaticAnalysis.description'),
      details: t('howItWorks.steps.automaticAnalysis.details', { returnObjects: true })
    },
    {
      number: "03",
      icon: <Download className="h-8 w-8 text-blue-400" />,
      title: t('howItWorks.steps.exportAction.title'),
      description: t('howItWorks.steps.exportAction.description'),
      details: t('howItWorks.steps.exportAction.details', { returnObjects: true })
    }
  ];

  return (
    <div className="py-24 bg-slate-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connection Lines for Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-1/3 right-1/3 h-px bg-gradient-to-r from-cyan-400/20 via-cyan-400/40 to-cyan-400/20 transform -translate-y-1/2" />
            
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm hover:bg-slate-900/70 transition-all duration-300 group relative overflow-hidden">
                  {/* Step Number Background */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-cyan-400/30">{step.number}</span>
                  </div>
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-slate-800/50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-sm text-cyan-400 font-semibold mb-1">{t('howItWorks.step')} {step.number}</div>
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 mb-6 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center">
                          <ArrowRight className="h-4 w-4 text-cyan-400 mr-3 flex-shrink-0" />
                          <span className="text-slate-400 text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline for Mobile */}
        <div className="lg:hidden mt-12 flex justify-center">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full" />
            <div className="w-8 h-px bg-cyan-400/40" />
            <div className="w-3 h-3 bg-green-400 rounded-full" />
            <div className="w-8 h-px bg-green-400/40" />
            <div className="w-3 h-3 bg-blue-400 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
