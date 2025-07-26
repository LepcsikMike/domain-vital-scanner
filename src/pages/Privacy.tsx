import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
const Privacy = () => {
  const {
    t
  } = useTranslation('legal');
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="outline" onClick={() => window.history.back()} className="mb-4 border-slate-600 hover:bg-slate-800 text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">{t('privacy.title')}</h1>
            <p className="text-slate-300">{t('common.lastUpdated')}: {t('common.validFrom')} January 2025</p>
          </div>

          {/* Content */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm text-slate-300 space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. {t('privacy.controller')}</h2>
              <p className="mb-4">{t('privacy.controllerText')}</p>
              <div className="bg-slate-800/50 p-4 rounded border border-slate-600">
                <p><strong>{t('common.company')}</strong></p>
                <p>{t('common.registrationNumber')}: 16234567</p>
                <p>{t('common.location')}</p>
                <p>E-Mail: {t('common.email')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. {t('privacy.dataTypes')}</h2>
              <p className="mb-4">{t('privacy.dataTypesText')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>{t('privacy.domainData').split(':')[0]}:</strong> {t('privacy.domainData').split(':')[1]}</li>
                <li><strong>{t('privacy.analysisResults').split(':')[0]}:</strong> {t('privacy.analysisResults').split(':')[1]}</li>
                <li><strong>{t('privacy.usageData').split(':')[0]}:</strong> {t('privacy.usageData').split(':')[1]}</li>
                <li><strong>{t('privacy.technicalData').split(':')[0]}:</strong> {t('privacy.technicalData').split(':')[1]}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. {t('privacy.purpose')}</h2>
              <p className="mb-4">{t('privacy.purposeText')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.serviceProvision')}</li>
                <li>{t('privacy.serviceImprovement')}</li>
                <li>{t('privacy.technicalSecurity')}</li>
                <li>{t('privacy.legalCompliance')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. {t('privacy.legalBasis')}</h2>
              <p className="mb-4">{t('privacy.legalBasisText')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. {t('privacy.dataSharing')}</h2>
              <p className="mb-4">{t('privacy.dataSharingText')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>{t('privacy.googlePageSpeed').split(':')[0]}:</strong> {t('privacy.googlePageSpeed').split(':')[1]}</li>
                <li><strong>{t('privacy.dnsServices').split(':')[0]}:</strong> {t('privacy.dnsServices').split(':')[1]}</li>
              </ul>
              <p className="mt-4">{t('privacy.dataSharingNote')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. {t('privacy.rights')}</h2>
              <p className="mb-4">{t('privacy.rightsText')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.rightAccess')}</li>
                <li>{t('privacy.rightRectification')}</li>
                <li>{t('privacy.rightErasure')}</li>
                <li>{t('privacy.rightRestriction')}</li>
                <li>{t('privacy.rightPortability')}</li>
                <li>{t('privacy.rightObjection')}</li>
              </ul>
              <p className="mt-4">
                {t('privacy.rightsContact')} 
                <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:underline ml-1">
                  {t('common.email')}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. {t('privacy.contactSection')}</h2>
              <p>
                {t('privacy.contactText')} 
                <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:underline ml-1">
                  {t('common.email')}
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>;
};
export default Privacy;