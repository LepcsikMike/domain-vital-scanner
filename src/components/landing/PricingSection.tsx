import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, ArrowRight, Calendar } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Kostenloser Plan",
      price: "0",
      period: "Forever",
      description: "Perfekt zum Testen und für gelegentliche Audits",
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      features: [
        "1 Domain-Scan pro Tag",
        "Basis-Sicherheitschecks (HTTPS, SSL)",
        "Performance-Überblick",
        "Meta-Tags & CMS Erkennung",
        "Generator-Tags Analyse",
        "Web-Interface Zugriff"
      ],
      limitations: [
        "Kein CSV-Export",
        "Keine API-Integration",
        "Begrenzte Analyse-Tiefe"
      ],
      cta: "Kostenlos testen",
      ctaAction: () => window.location.href = '/app',
      highlight: false
    },
    {
      name: "Enterprise Plan",
      price: "19",
      period: "pro Monat",
      description: "Für Agenturen und professionelle Website-Audits",
      icon: <Crown className="h-6 w-6 text-yellow-400" />,
      badge: "Beliebt",
      features: [
        "Unbegrenzte Domain-Scans",
        "Google PageSpeed Insights Integration",
        "Vollständige Core Web Vitals",
        "Erweiterte SEO-Analyse",
        "CSV & JSON Export",
        "API-Zugriff für CRM Integration",
        "Batch-Analyse (1000+ Domains)",
        "Priorisierte Risiko-Bewertung",
        "Common Crawl Domain Discovery",
        "Custom Search API Zugang",
        "Premium Support"
      ],
      limitations: [],
      cta: "Enterprise sichern",
      ctaAction: () => window.open('https://buy.stripe.com/7sYeVegbJekDdQbdjy8AE04', '_blank'),
      highlight: true
    }
  ];

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transparent{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            Starten Sie kostenlos oder nutzen Sie den vollen Funktionsumfang für professionelle Website-Audits
          </p>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
            onClick={() => window.open('https://calendly.com/hi-inspiroware/30min', '_blank')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            Persönliche Demo vereinbaren
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
                    <div className="text-slate-400 text-xs mb-2">Einschränkungen:</div>
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
