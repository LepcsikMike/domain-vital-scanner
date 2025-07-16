
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Shield, Zap, ArrowRight, Calendar } from 'lucide-react';

const HeroSection = () => {
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
              <Button 
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => window.open('https://calendly.com/hi-inspiroware/30min', '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Beratung vereinbaren
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
            Google APIs Enhanced
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Veraltete Websites{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              automatisch
            </span>{' '}
            identifizieren
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Finden Sie potenzielle Kunden durch technische Website-Audits. 
            Scannen Sie ganze Domainlisten und identifizieren Sie Websites mit 
            Sicherheitsproblemen, veralteter Technik und SEO-Schwächen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-3 text-lg"
              onClick={() => window.location.href = '/app'}
            >
              <Zap className="h-5 w-5 mr-2" />
              Kostenlos testen
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={() => window.open('https://calendly.com/hi-inspiroware/30min', '_blank')}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Demo vereinbaren
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-cyan-400 font-semibold text-sm mb-1">Google PageSpeed</div>
              <div className="text-white text-2xl font-bold">Core Web Vitals</div>
              <div className="text-slate-400 text-sm">Echte Performance-Daten</div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-green-400 font-semibold text-sm mb-1">SSL & Security</div>
              <div className="text-white text-2xl font-bold">HTTPS Checks</div>
              <div className="text-slate-400 text-sm">Automatische Sicherheitsprüfung</div>
            </div>
            
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-blue-400 font-semibold text-sm mb-1">Batch Analysis</div>
              <div className="text-white text-2xl font-bold">Bulk Scan</div>
              <div className="text-slate-400 text-sm">Tausende Domains parallel</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
