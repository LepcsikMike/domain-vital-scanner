import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
const Imprint = () => {
  const {
    t
  } = useTranslation('legal');
  const {
    currentLanguage
  } = useLanguage();

  // German content (existing)
  if (currentLanguage === 'de') {
    return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Button variant="outline" onClick={() => window.history.back()} className="mb-4 border-slate-600 hover:bg-slate-800 text-slate-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
              <h1 className="text-4xl font-bold text-white mb-4">{t('imprint.title')}</h1>
              <p className="text-slate-300">{t('imprint.subtitle')}</p>
            </div>

            {/* Content */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm text-slate-300 space-y-8">
              
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.provider')}</h2>
                <div className="bg-slate-800/50 p-6 rounded border border-slate-600">
                  <p className="text-lg font-semibold text-white mb-2">{t('common.company')}</p>
                  <p>Registrierungsnummer: {t('common.registrationNumber')}</p>
                  <p>Sitz: {t('common.location')}</p>
                  <p>EU-Umsatzsteuer-ID: {t('common.vatId')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('common.contact')}</h2>
                <div className="space-y-2">
                  <p><strong>E-Mail:</strong> <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:underline">{t('common.email')}</a></p>
                  <p><strong>Website:</strong> <a href="https://domainaudit.pro" className="text-cyan-400 hover:underline">domainaudit.pro</a></p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.management')}</h2>
                <p>{t('imprint.manager')}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.registry')}</h2>
                <div className="space-y-2">
                  <p><strong>Registergericht:</strong> {t('imprint.registryCourt')}</p>
                  <p><strong>Registernummer:</strong> {t('common.registrationNumber')}</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.euDispute')}</h2>
                <p className="mb-4">
                  {t('imprint.euDisputeText')} 
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline ml-1">
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p>{t('imprint.euDisputeContact')}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.consumerDispute')}</h2>
                <p>{t('imprint.consumerDisputeText')}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.contentLiability')}</h2>
                <p className="mb-4">{t('imprint.contentLiabilityText1')}</p>
                <p>{t('imprint.contentLiabilityText2')}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.linkLiability')}</h2>
                <p>{t('imprint.linkLiabilityText')}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.copyright')}</h2>
                <p>{t('imprint.copyrightText')}</p>
              </section>

            </div>
          </div>
        </div>
      </div>;
  }

  // English/Spanish content using translations
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="outline" onClick={() => window.history.back()} className="mb-4 border-slate-600 hover:bg-slate-800 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">{t('imprint.title')}</h1>
            <p className="text-slate-300">{t('imprint.subtitle')}</p>
          </div>

          {/* Content */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm text-slate-300 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.provider')}</h2>
              <div className="bg-slate-800/50 p-6 rounded border border-slate-600">
                <p className="text-lg font-semibold text-white mb-2">{t('common.company')}</p>
                <p>{t('common.registrationNumber')}: 16234567</p>
                <p>{t('common.location')}</p>
                <p>{t('common.vatId')}: EE102345678</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('common.contact')}</h2>
              <div className="space-y-2">
                <p><strong>E-Mail:</strong> <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:underline">{t('common.email')}</a></p>
                <p><strong>Website:</strong> <a href="https://domainaudit.pro" className="text-cyan-400 hover:underline">domainaudit.pro</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.management')}</h2>
              <p>{t('imprint.manager')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.registry')}</h2>
              <div className="space-y-2">
                <p><strong>{t('imprint.registryCourt').split(':')[0]}:</strong> {t('imprint.registryCourt').split(':')[1]}</p>
                <p><strong>{t('common.registrationNumber')}:</strong> 16234567</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.euDispute')}</h2>
              <p className="mb-4">
                {t('imprint.euDisputeText')} 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>{t('imprint.euDisputeContact')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.consumerDispute')}</h2>
              <p>{t('imprint.consumerDisputeText')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.contentLiability')}</h2>
              <p className="mb-4">{t('imprint.contentLiabilityText1')}</p>
              <p>{t('imprint.contentLiabilityText2')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.linkLiability')}</h2>
              <p>{t('imprint.linkLiabilityText')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('imprint.copyright')}</h2>
              <p>{t('imprint.copyrightText')}</p>
            </section>

          </div>
        </div>
      </div>
    </div>;
};
export default Imprint;