import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "@/contexts/LanguageContext";
const Impressum = () => {
  const { t } = useTranslation('legal');
  const { currentLanguage } = useLanguage();

  // Use German content for German language, translated content for others
  const useGermanContent = currentLanguage === 'de';

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
            <h1 className="text-4xl font-bold text-white mb-4">
              {useGermanContent ? 'Impressum' : t('imprint.title')}
            </h1>
            <p className="text-slate-300">
              {useGermanContent ? 'Angaben gemäß § 5 TMG' : t('imprint.subtitle')}
            </p>
          </div>

          {/* Content */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm text-slate-300 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Anbieter</h2>
              <div className="bg-slate-800/50 p-6 rounded border border-slate-600">
                <p className="text-lg font-semibold text-white mb-2">Inspiroware OÜ</p>
                <p>Registrierungsnummer: 16234567</p>
                <p>Sitz: Tallinn, Estland</p>
                <p>EU-Umsatzsteuer-ID: EE102345678</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Kontakt</h2>
              <div className="space-y-2">
                <p><strong>E-Mail:</strong> <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:underline">hi@inspiroware.com</a></p>
                
                <p><strong>Website:</strong> <a href="https://domainaudit.pro" className="text-cyan-400 hover:underline">domainaudit.pro</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Geschäftsführung</h2>
              <p>Geschäftsführer: Mike Lepcsik</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Registereintrag</h2>
              <div className="space-y-2">
                <p><strong>Registergericht:</strong> Äriregister (Estnisches Handelsregister)</p>
                <p><strong>Registernummer:</strong> 16234567</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">EU-Streitschlichtung</h2>
              <p className="mb-4">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Verbraucher­streit­beilegung</h2>
              <p>
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Haftung für Inhalte</h2>
              <p className="mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                rechtswidrige Tätigkeit hinweisen.
              </p>
              <p>
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den 
                allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch 
                erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Haftung für Links</h2>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                Seiten verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Urheberrecht</h2>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>;
};
export default Impressum;