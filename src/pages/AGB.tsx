import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
const AGB = () => {
  const { t } = useTranslation('legal');

  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="mb-4 border-cyan-400 hover:bg-cyan-400/10 text-cyan-400 hover:text-cyan-300 hover:border-cyan-300 transition-all duration-200 shadow-lg hover:shadow-cyan-400/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">{t('terms.title')}</h1>
            <p className="text-slate-300">{t('terms.validFrom')}</p>
          </div>

          {/* Content */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm text-slate-300 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.scope.title')}</h2>
              <p className="mb-4">
                {t('terms.scope.text1')}
              </p>
              <p>
                {t('terms.scope.text2')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.services.title')}</h2>
              <p className="mb-4">
                {t('terms.services.text')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>{t('terms.services.feature1')}</li>
                <li>{t('terms.services.feature2')}</li>
                <li>{t('terms.services.feature3')}</li>
                <li>{t('terms.services.feature4')}</li>
              </ul>
              <p>
                {t('terms.services.plans')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.usage.title')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('terms.usage.allowedTitle')}</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>{t('terms.usage.allowed1')}</li>
                    <li>{t('terms.usage.allowed2')}</li>
                    <li>{t('terms.usage.allowed3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('terms.usage.prohibitedTitle')}</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>{t('terms.usage.prohibited1')}</li>
                    <li>{t('terms.usage.prohibited2')}</li>
                    <li>{t('terms.usage.prohibited3')}</li>
                    <li>{t('terms.usage.prohibited4')}</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.pricing.title')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('terms.pricing.freePlanTitle')}</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>{t('terms.pricing.free1')}</li>
                    <li>{t('terms.pricing.free2')}</li>
                    <li>{t('terms.pricing.free3')}</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('terms.pricing.enterpriseTitle')}</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>{t('terms.pricing.enterprise1')}</li>
                    <li>{t('terms.pricing.enterprise2')}</li>
                    <li>{t('terms.pricing.enterprise3')}</li>
                    <li>{t('terms.pricing.enterprise4')}</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4">
                {t('terms.pricing.vatNote')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.termination.title')}</h2>
              <p className="mb-4">
                <strong>{t('terms.termination.freePlan')}</strong>
              </p>
              <p className="mb-4">
                <strong>{t('terms.termination.enterprisePlan')}</strong>
              </p>
              <p>
                {t('terms.termination.notice')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.availability.title')}</h2>
              <p className="mb-4">
                {t('terms.availability.uptime')}
              </p>
              <p className="mb-4">
                {t('terms.availability.dataAccuracy')}
              </p>
              <p>
                {t('terms.availability.defects')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.liability.title')}</h2>
              <p className="mb-4">
                {t('terms.liability.limitation')}
              </p>
              <p>
                {t('terms.liability.cap')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.dataProtection.title')}</h2>
              <p>
                {t('terms.dataProtection.text')}{' '}
                <Link to="/privacy" className="text-cyan-400 hover:underline ml-1">
                  {t('terms.dataProtection.privacyLink')}
                </Link>{', '}
                die Bestandteil dieser AGB ist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.changes.title')}</h2>
              <p>
                {t('terms.changes.text')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.final.title')}</h2>
              <p className="mb-4">
                {t('terms.final.law')}
              </p>
              <p className="mb-4">
                {t('terms.final.jurisdiction')}
              </p>
              <p>
                {t('terms.final.severability')}
              </p>
            </section>

            <section className="border-t border-slate-600 pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">{t('terms.contactTitle')}</h2>
              <p>
                {t('terms.contactText')}
                <a href={`mailto:${t('common.email')}`} className="text-cyan-400 hover:underline ml-1">
                  {t('common.email')}
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>;
};
export default AGB;