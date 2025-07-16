import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
const Datenschutz = () => {
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="outline" onClick={() => window.history.back()} className="mb-4 border-slate-600 hover:bg-slate-800 text-slate-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">Datenschutzerklärung</h1>
            <p className="text-slate-300">Zuletzt aktualisiert: Januar 2025</p>
          </div>

          {/* Content */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-8 backdrop-blur-sm text-slate-300 space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Verantwortlicher</h2>
              <p className="mb-4">
                Verantwortlich für die Datenverarbeitung ist:
              </p>
              <div className="bg-slate-800/50 p-4 rounded border border-slate-600">
                <p><strong>Inspiroware OÜ</strong></p>
                <p>Registrierungsnummer: 16234567</p>
                <p>Adresse: Tallinn, Estland</p>
                <p>E-Mail: hi@inspiroware.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Art der verarbeiteten Daten</h2>
              <p className="mb-4">Wir verarbeiten folgende Kategorien von Daten:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Domain-Daten:</strong> Von Ihnen eingegebene Website-URLs für die Analyse</li>
                <li><strong>Analyseergebnisse:</strong> Technische Daten über die gescannten Websites (SSL-Status, Performance-Metriken, Meta-Tags)</li>
                <li><strong>Nutzungsdaten:</strong> Anzahl der durchgeführten Scans, verwendete Features</li>
                <li><strong>Technische Daten:</strong> IP-Adresse, Browser-Informationen, Zugriffszeitpunkte</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Zweck der Datenverarbeitung</h2>
              <p className="mb-4">Die Datenverarbeitung erfolgt für folgende Zwecke:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Bereitstellung der Website-Analyse-Services</li>
                <li>Verbesserung unserer Dienstleistungen</li>
                <li>Technische Sicherheit und Fehlerdiagnose</li>
                <li>Compliance mit gesetzlichen Verpflichtungen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Rechtsgrundlage</h2>
              <p className="mb-4">
                Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) 
                sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen zur Bereitstellung und Verbesserung unserer Services).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Datenweitergabe</h2>
              <p className="mb-4">
                Wir nutzen externe APIs für die Website-Analyse:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Google PageSpeed API:</strong> Für Performance-Analysen</li>
                <li><strong>DNS-Dienste:</strong> Für technische Domain-Überprüfungen</li>
              </ul>
              <p className="mt-4">
                Diese Dienste erhalten nur die notwendigen Daten (Domain-URLs) zur Durchführung der Analyse.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Ihre Rechte</h2>
              <p className="mb-4">Sie haben folgende Rechte:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
                <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
                <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
                <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
                <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p className="mt-4">
                Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter: 
                <a href="mailto:hi@inspiroware.com" className="text-cyan-400 hover:underline ml-1">
                  hi@inspiroware.com
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Kontakt</h2>
              <p>
                Bei Fragen zum Datenschutz kontaktieren Sie uns unter:
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
export default Datenschutz;