import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
const AGB = () => {
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="outline" onClick={() => window.history.back()} className="mb-4 border-slate-600 hover:bg-slate-800 text-slate-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">Allgemeine Geschäftsbedingungen</h1>
            <p className="text-slate-300">Gültig ab: Januar 2025</p>
          </div>

          {/* Content */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm text-slate-300 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 1 Geltungsbereich</h2>
              <p className="mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen der 
                Inspiroware OÜ (nachfolgend "Anbieter") und den Nutzern der DomainAudit Pro Plattform 
                (nachfolgend "Nutzer") über die Nutzung der Website-Analyse-Services.
              </p>
              <p>
                Entgegenstehende oder abweichende Bedingungen des Nutzers werden nicht anerkannt, 
                es sei denn, ihre Geltung wird ausdrücklich schriftlich bestätigt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 2 Vertragsgegenstand</h2>
              <p className="mb-4">
                Der Anbieter stellt eine Web-Plattform zur Verfügung, die es ermöglicht:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                <li>Technische Analyse von Websites (SSL, Performance, SEO)</li>
                <li>Batch-Verarbeitung von Domain-Listen</li>
                <li>Export von Analyseergebnissen</li>
                <li>API-Zugriff für automatisierte Abfragen (Enterprise Plan)</li>
              </ul>
              <p>
                Die Leistungen werden in verschiedenen Tarifen angeboten (Free, Enterprise).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 3 Nutzungsrechte und -pflichten</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Erlaubte Nutzung:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kommerzielle und private Nutzung im Rahmen der gewählten Tariflimits</li>
                    <li>Analyse von Websites, für die Sie berechtigt sind oder öffentlich zugänglich sind</li>
                    <li>Export und Weiterverwendung der Analyseergebnisse</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Verbotene Nutzung:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Missbrauch der Plattform für illegale Zwecke</li>
                    <li>Überlastung der Server durch exzessive Anfragen</li>
                    <li>Reverse Engineering oder Kopieren der Software</li>
                    <li>Weiterverkauf oder Unterlizenzierung ohne Zustimmung</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 4 Preise und Zahlungsbedingungen</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Free Plan:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kostenlos</li>
                    <li>1 Domain-Scan pro Tag</li>
                    <li>Basis-Features</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Enterprise Plan:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Preise nach aktueller Preisliste</li>
                    <li>Unbegrenzte Scans</li>
                    <li>Alle Premium-Features</li>
                    <li>Monatliche oder jährliche Abrechnung</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4">
                Alle Preise verstehen sich zzgl. der gesetzlichen Umsatzsteuer. 
                Die Zahlung erfolgt im Voraus per Kreditkarte oder SEPA-Lastschrift.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 5 Laufzeit und Kündigung</h2>
              <p className="mb-4">
                <strong>Free Plan:</strong> Jederzeit ohne Fristen kündbar.
              </p>
              <p className="mb-4">
                <strong>Enterprise Plan:</strong> Die Mindestlaufzeit beträgt einen Monat. 
                Der Vertrag verlängert sich automatisch um die gewählte Periode, 
                wenn er nicht mit einer Frist von 30 Tagen zum Ende der Laufzeit gekündigt wird.
              </p>
              <p>
                Kündigungen müssen schriftlich (E-Mail genügt) an hi@inspiroware.com erfolgen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 6 Verfügbarkeit und Gewährleistung</h2>
              <p className="mb-4">
                Der Anbieter strebt eine Verfügbarkeit von 99% an, kann diese jedoch nicht garantieren. 
                Wartungsarbeiten werden nach Möglichkeit angekündigt.
              </p>
              <p className="mb-4">
                Die Analyseergebnisse basieren auf öffentlich verfügbaren Daten und externen APIs. 
                Für die Richtigkeit und Vollständigkeit wird keine Gewähr übernommen.
              </p>
              <p>
                Mängel sind unverzüglich schriftlich anzuzeigen. Bei berechtigten Mängelrügen 
                wird der Anbieter nachbessern oder die Vergütung entsprechend mindern.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 7 Haftung</h2>
              <p className="mb-4">
                Die Haftung des Anbieters ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. 
                Für indirekte Schäden, entgangenen Gewinn oder Folgeschäden wird nicht gehaftet, 
                es sei denn bei Verletzung wesentlicher Vertragspflichten.
              </p>
              <p>
                Die Haftung ist der Höhe nach auf die typischerweise vorhersehbaren Schäden begrenzt, 
                höchstens jedoch auf die in den letzten 12 Monaten gezahlte Vergütung.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 8 Datenschutz</h2>
              <p>
                Die Verarbeitung personenbezogener Daten erfolgt gemäß der 
                <a href="/datenschutz" className="text-cyan-400 hover:underline ml-1">
                  Datenschutzerklärung
                </a>, 
                die Bestandteil dieser AGB ist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 9 Änderungen der AGB</h2>
              <p>
                Der Anbieter kann diese AGB mit einer Frist von 30 Tagen ändern. 
                Widerspricht der Nutzer nicht innerhalb von 30 Tagen nach Zugang der 
                Änderungsmitteilung, gelten die Änderungen als genehmigt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">§ 10 Schlussbestimmungen</h2>
              <p className="mb-4">
                Es gilt das Recht der Republik Estland unter Ausschluss des UN-Kaufrechts.
              </p>
              <p className="mb-4">
                Gerichtsstand ist Tallinn, Estland.
              </p>
              <p>
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die 
                Wirksamkeit der übrigen Bestimmungen unberührt.
              </p>
            </section>

            <section className="border-t border-slate-600 pt-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Kontakt</h2>
              <p>
                Bei Fragen zu diesen AGB kontaktieren Sie uns unter:
                <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:underline ml-1">
                  hi@inspiroware.com
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>;
};
export default AGB;