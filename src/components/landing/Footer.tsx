
import React from 'react';
import { Globe, Mail, Calendar, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">DomainAudit Pro</h3>
                <p className="text-slate-400 text-sm">Powered by Google APIs</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
              Die professionelle Lösung für automatisierte Website-Audits. 
              Identifizieren Sie veraltete Websites und gewinnen Sie neue Kunden 
              durch datenbasierte Analysen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                onClick={() => window.location.href = '/app'}
              >
                Kostenlos testen
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={() => window.open('https://calendly.com/hi-inspiroware/30min', '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Demo buchen
              </Button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontakt</h4>
            <div className="space-y-3">
              <a 
                href="mailto:hi@inspiroware.com" 
                className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors group"
              >
                <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                hi@inspiroware.com
              </a>
              <a 
                href="https://calendly.com/hi-inspiroware/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-slate-300 hover:text-cyan-400 transition-colors group"
              >
                <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Termin vereinbaren
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Google PageSpeed Integration</li>
              <li>SSL & Security Checks</li>
              <li>SEO-Analyse</li>
              <li>Batch Domain Scanning</li>
              <li>CSV/JSON Export</li>
              <li>API-Zugriff</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-slate-400 text-sm mb-4 sm:mb-0">
            © 2025 Inspiroware OÜ. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-slate-400 text-sm">
            <span>Made with ❤️ for web professionals</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
