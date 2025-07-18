
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Zap, ArrowRight, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const HeroSection = () => {
  const { t } = useTranslation('landing');

  return (
    <div className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
      
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DomainAudit Pro</h1>
                <p className="text-slate-400 text-xs">Powered by Google APIs</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Button 
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open('https://calendly.com/hi-inspiroware/30min', '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('hero.consultation')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="border-green-500 text-green-400 mb-6">
            <Shield className="h-3 w-3 mr-1" />
            {t('hero.badge')}
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
            {t('hero.headline')}
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            {t('hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 px-4 sm:px-0">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg"
              onClick={() => window.location.href = '/app'}
            >
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('hero.testFree')}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open('https://calendly.com/hi-inspiroware/30min', '_blank')}
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('hero.bookDemo')}
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto px-4 sm:px-0">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-cyan-400 font-semibold text-xs sm:text-sm mb-1">{t('hero.trust2')}</div>
              <div className="text-white text-lg sm:text-xl lg:text-2xl font-bold">PDF-Export</div>
              <div className="text-slate-400 text-xs sm:text-sm">Executive Summary & Deep-Dive</div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-green-400 font-semibold text-xs sm:text-sm mb-1">{t('hero.trust1')}</div>
              <div className="text-white text-lg sm:text-xl lg:text-2xl font-bold">{t('hero.trust3')}</div>
              <div className="text-slate-400 text-xs sm:text-sm">Echte Performance-Daten</div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
              <div className="text-blue-400 font-semibold text-xs sm:text-sm mb-1">{t('hero.trust4')}</div>
              <div className="text-white text-lg sm:text-xl lg:text-2xl font-bold">CSV/JSON/PDF</div>
              <div className="text-slate-400 text-xs sm:text-sm">20+ Datenfelder, API-Integration</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
