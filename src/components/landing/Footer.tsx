
import React from 'react';
import { Globe, Mail, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t, i18n } = useTranslation('landing');

  const footerContent = {
    de: {
      description: "Die professionelle Lösung für automatisierte Website-Audits.",
      contact: "Kontakt",
      bookDemo: "Demo buchen",
      legal: {
        imprint: "Impressum",
        privacy: "Datenschutz",
        terms: "AGB",
        cookies: "Cookie-Einstellungen"
      }
    },
    en: {
      description: "The professional solution for automated website audits.",
      contact: "Contact",
      bookDemo: "Book Demo",
      legal: {
        imprint: "Imprint",
        privacy: "Privacy Policy",
        terms: "Terms",
        cookies: "Cookie Settings"
      }
    },
    es: {
      description: "La solución profesional para auditorías automatizadas de sitios web.",
      contact: "Contacto",
      bookDemo: "Reservar Demo",
      legal: {
        imprint: "Aviso Legal",
        privacy: "Política de Privacidad",
        terms: "Términos y Condiciones",
        cookies: "Configuración de Cookies"
      }
    }
  };

  const content = footerContent[i18n.language] || footerContent.en;

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
              {content.description}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">{content.contact}</h4>
            <div className="space-y-3">
              <a href="mailto:hi@inspiroware.com" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                hi@inspiroware.com
              </a>
              <a href="/book-demo" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                {content.bookDemo}
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <div className="space-y-3">
              <a href="/imprint" className="block text-slate-300 hover:text-white transition-colors">
                {content.legal.imprint}
              </a>
              <a href="/privacy" className="block text-slate-300 hover:text-white transition-colors">
                {content.legal.privacy}
              </a>
              <a href="/terms" className="block text-slate-300 hover:text-white transition-colors">
                {content.legal.terms}
              </a>
              <a href="/cookie-settings" className="block text-slate-300 hover:text-white transition-colors">
                {content.legal.cookies}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
