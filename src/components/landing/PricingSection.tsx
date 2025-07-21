
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, ArrowRight, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PricingSection = () => {
  const { t } = useTranslation('landing');

  const plans = [
    {
      name: t('pricing.plans.free.name'),
      price: t('pricing.plans.free.price'),
      period: t('pricing.plans.free.period'),
      description: t('pricing.plans.free.description'),
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      features: t('pricing.plans.free.features', { returnObjects: true }) as string[],
      limitations: t('pricing.plans.free.limitations', { returnObjects: true }) as string[],
      cta: t('pricing.plans.free.cta'),
      ctaAction: () => window.location.href = '/app',
      highlight: false
    },
    {
      name: t('pricing.plans.enterprise.name'),
      price: t('pricing.plans.enterprise.price'),
      period: t('pricing.plans.enterprise.period'),
      description: t('pricing.plans.enterprise.description'),
      icon: <Crown className="h-6 w-6 text-yellow-400" />,
      badge: t('pricing.plans.enterprise.badge'),
      features: t('pricing.plans.enterprise.features', { returnObjects: true }) as string[],
      limitations: t('pricing.plans.enterprise.limitations', { returnObjects: true }) as string[],
      cta: t('pricing.plans.enterprise.cta'),
      ctaAction: () => window.open('https://buy.stripe.com/fZuaEY6B91xRaDZbbq8AE07', '_blank'),
      highlight: true
    }
  ];

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('pricing.title')}{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              {t('pricing.titleHighlight')}
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            onClick={() => window.open('https://calendly.com/hi-inspiroware/30min', '_blank')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            {t('pricing.bookDemo')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.highlight 
                  ? 'bg-gradient-to-b from-slate-900/80 to-slate-900/60 border-cyan-500/50 shadow-2xl shadow-cyan-500/10 scale-105' 
                  : 'bg-slate-900/50 border-slate-700 hover:bg-slate-900/70'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 text-sm font-semibold">
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="p-2 bg-slate-800/50 rounded-lg">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">€{plan.price}</span>
                    <span className="text-slate-400 ml-2">/ {plan.period}</span>
                  </div>
                </div>
                
                <p className="text-slate-300 text-sm">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="border-t border-slate-700 pt-4">
                    <div className="text-slate-400 text-xs mb-2">{t('pricing.limitationsTitle')}</div>
                    <div className="space-y-2">
                      {plan.limitations.map((limitation, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-slate-500 rounded-full mr-3 flex-shrink-0" />
                          <span className="text-slate-500 text-xs">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button 
                  className={`w-full py-3 text-lg ${
                    plan.highlight 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                  onClick={plan.ctaAction}
                >
                  {plan.cta}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
