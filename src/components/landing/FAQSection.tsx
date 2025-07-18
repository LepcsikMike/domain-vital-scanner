
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Welche PDF-Reports kann ich erstellen?",
      answer: "Der Enterprise Plan bietet drei professionelle PDF-Report-Typen: Executive Summary (Management-Überblick), Technical Deep-Dive (detaillierte technische Analyse) und Action Plan (priorisierte Handlungsempfehlungen). Alle Reports sind für Kundenpräsentationen optimiert."
    },
    {
      question: "Wie unterscheiden sich die PDF-Reports von der Web-Ansicht?",
      answer: "Die PDF-Reports sind professionell formatiert mit Corporate Design, Charts, Scores und strukturierten Empfehlungen. Sie eignen sich perfekt für Kundenpräsentationen, Angebote und Audit-Dokumentation - vergleichbar mit SEOptimer oder GTmetrix Premium-Reports."
    },
    {
      question: "Welche Daten enthält der Enhanced CSV-Export?",
      answer: "Der Enhanced CSV-Export umfasst 20+ Datenfelder: Core Web Vitals, Performance-Scores, Marketing Tools, Technology Stack, Security Assessment, SEO-Metriken, Meta-Tags und vieles mehr. Ideal für CRM-Integration und Datenanalyse."
    },
    {
      question: "Wie genau funktioniert die Domain-Analyse?",
      answer: "DomainAudit Pro nutzt Google APIs (PageSpeed Insights, Custom Search) und eigene Crawler, um Websites umfassend zu analysieren. Wir prüfen HTTPS-Status, Performance-Metriken (Core Web Vitals), SEO-Faktoren, veraltete Technologien und Sicherheitsaspekte automatisch."
    },
    {
      question: "Kann ich große Domain-Listen automatisch analysieren?",
      answer: "Absolut. Der Enterprise Plan unterstützt Batch-Analysen von 1000+ Domains parallel. Sie können CSV-Listen hochladen oder unsere Domain Discovery nutzen, um automatisch relevante Domains in Ihrer Zielbranche zu finden."
    },
    {
      question: "Wie kann ich die Ergebnisse in mein CRM integrieren?",
      answer: "Der Enterprise Plan bietet vollständigen API-Zugriff, Enhanced CSV-Export und PDF-Reports. Sie können alle Daten direkt in Ihr CRM (HubSpot, Salesforce, etc.) importieren oder über unsere API automatisiert abrufen."
    },
    {
      question: "Ist das günstiger als SEOptimer oder andere Premium-Tools?",
      answer: "Ja! SEOptimer kostet $29-99/Monat für ähnliche Features. Unser Enterprise Plan (€19/Monat) bietet vergleichbare PDF-Reports, Enhanced Export und Google API Integration zu einem Bruchteil der Kosten anderer Premium-Audit-Tools."
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
