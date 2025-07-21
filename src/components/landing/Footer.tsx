
import React from 'react';
import { Globe, Mail, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t, i18n } = useTranslation(['landing', 'legal']);
  const { currentLanguage } = useLanguage();

  const getLocalizedLegalUrl = (page: string) => {
    const routes = {
      de: {
        imprint: '/impressum',
        privacy: '/datenschutz',
        terms: '/agb',
        cookies: '/cookie-einstellungen'
      },
      en: {
        imprint: '/en/imprint',
        privacy: '/en/privacy',
        terms: '/en/terms',
        cookies: '/en/cookie-settings'
      },
      es: {
        imprint: '/es/aviso-legal',
        privacy: '/es/privacidad',
        terms: '/es/terminos',
        cookies: '/es/configuracion-cookies'
      }
    };
    
    return routes[currentLanguage as keyof typeof routes]?.[page as keyof typeof routes['de']] || routes.de[page as keyof typeof routes['de']];
  };

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
              {currentLanguage === 'de' && 'Die professionelle Lösung für automatisierte Website-Audits.'}
              {currentLanguage === 'en' && 'The professional solution for automated website audits.'}
              {currentLanguage === 'es' && 'La solución profesional para auditorías automatizadas de sitios web.'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {currentLanguage === 'de' && 'Kontakt'}
              {currentLanguage === 'en' && 'Contact'}
              {currentLanguage === 'es' && 'Contacto'}
            </h4>
            <div className="space-y-3">
              <a href="mailto:hi@inspiroware.com" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                hi@inspiroware.com
              </a>
              <a href="https://calendly.com/hi-inspiroware/30min" target="_blank" rel="noopener noreferrer" className="flex items-center text-slate-300 hover:text-white transition-colors">
                <Calendar className="h-4 w-4 mr-2" />
                {currentLanguage === 'de' && 'Demo buchen'}
                {currentLanguage === 'en' && 'Book Demo'}
                {currentLanguage === 'es' && 'Reservar Demo'}
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <div className="space-y-3">
              <a href={getLocalizedLegalUrl('imprint')} className="block text-slate-300 hover:text-white transition-colors">
                {t('legal:common.imprint', { 
                  defaultValue: currentLanguage === 'de' ? 'Impressum' : 
                              currentLanguage === 'en' ? 'Imprint' : 'Aviso Legal' 
                })}
              </a>
              <a href={getLocalizedLegalUrl('privacy')} className="block text-slate-300 hover:text-white transition-colors">
                {t('legal:common.privacy', { 
                  defaultValue: currentLanguage === 'de' ? 'Datenschutz' : 
                              currentLanguage === 'en' ? 'Privacy Policy' : 'Política de Privacidad' 
                })}
              </a>
              <a href={getLocalizedLegalUrl('terms')} className="block text-slate-300 hover:text-white transition-colors">
                {t('legal:common.terms', { 
                  defaultValue: currentLanguage === 'de' ? 'AGB' : 
                              currentLanguage === 'en' ? 'Terms' : 'Términos' 
                })}
              </a>
              <a href={getLocalizedLegalUrl('cookies')} className="block text-slate-300 hover:text-white transition-colors">
                {t('legal:common.cookies', { 
                  defaultValue: currentLanguage === 'de' ? 'Cookie-Einstellungen' : 
                              currentLanguage === 'en' ? 'Cookie Settings' : 'Configuración de Cookies' 
                })}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
