
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Wie genau funktioniert die Domain-Analyse?",
      answer: "DomainAudit Pro nutzt Google APIs (PageSpeed Insights, Custom Search) und eigene Crawler, um Websites umfassend zu analysieren. Wir prüfen HTTPS-Status, Performance-Metriken (Core Web Vitals), SEO-Faktoren, veraltete Technologien und Sicherheitsaspekte automatisch."
    },
    {
      question: "Welche APIs werden verwendet und sind die Daten echt?",
      answer: "Ja, wir verwenden echte Google APIs: PageSpeed Insights für Performance-Daten, Custom Search für Domain Discovery und Common Crawl für große Datensätze. Die Core Web Vitals sind echte Messwerte direkt von Google, keine Simulationen."
    },
    {
      question: "Kann ich große Domain-Listen automatisch analysieren?",
      answer: "Absolut. Der Enterprise Plan unterstützt Batch-Analysen von 1000+ Domains parallel. Sie können CSV-Listen hochladen oder unsere Domain Discovery nutzen, um automatisch relevante Domains in Ihrer Zielbranche zu finden."
    },
    {
      question: "Wie kann ich die Ergebnisse in mein CRM integrieren?",
      answer: "Der Enterprise Plan bietet vollständigen API-Zugriff und CSV/JSON-Export. Sie können die Audit-Daten direkt in Ihr CRM (HubSpot, Salesforce, etc.) importieren oder über unsere API automatisiert abrufen."
    },
    {
      question: "Was kostet die Nutzung der Google APIs?",
      answer: "Die API-Kosten sind in den Plänen bereits enthalten. Google PageSpeed Insights ist bis 25.000 Abfragen/Tag kostenlos. Custom Search kostet $5 pro 1.000 Abfragen nach den ersten 100 kostenlosen täglich."
    },
    {
      question: "Kann ich spezifische Branchen oder Regionen targeten?",
      answer: "Ja, unsere intelligente Domain Discovery kann nach Branchen (z.B. Handwerk, Medizin, Anwälte) und Regionen filtern. Sie können auch eigene Suchkriterien definieren und Multi-TLD-Suchen durchführen."
    },
    {
      question: "Wie aktuell sind die Analyse-Daten?",
      answer: "Alle Daten werden in Echtzeit beim Scan erhoben. Performance-Daten kommen direkt von Google, SSL-Zertifikate werden live geprüft, und Website-Inhalte werden frisch gecrawlt."
    },
    {
      question: "Gibt es eine Geld-zurück-Garantie?",
      answer: "Ja, wir bieten eine 30-Tage Geld-zurück-Garantie für den Enterprise Plan. Sie können jederzeit kündigen, und wir erstatten den vollen Betrag ohne Nachfragen."
    }
  ];

  return (
    <div className="py-24 bg-slate-950/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Häufig gestellte{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Fragen
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Alles was Sie über DomainAudit Pro wissen müssen
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-slate-900/50 border border-slate-700 rounded-lg px-6 backdrop-blur-sm"
              >
                <AccordionTrigger className="text-white hover:text-cyan-400 text-left py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-300 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400 mb-4">
            Weitere Fragen? Wir helfen gerne weiter.
          </p>
          <a 
            href="mailto:hi@inspiroware.com" 
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            hi@inspiroware.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
