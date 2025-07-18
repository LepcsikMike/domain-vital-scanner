
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

const FAQSection = () => {
  const { t, i18n } = useTranslation('landing');
  
  const faqs = {
    de: [
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
      }
    ],
    en: [
      {
        question: "What PDF reports can I create?",
        answer: "The Enterprise Plan offers three professional PDF report types: Executive Summary (management overview), Technical Deep-Dive (detailed technical analysis), and Action Plan (prioritized recommendations). All reports are optimized for client presentations."
      },
      {
        question: "How do PDF reports differ from the web view?",
        answer: "PDF reports are professionally formatted with corporate design, charts, scores, and structured recommendations. They are perfect for client presentations, proposals, and audit documentation - comparable to SEOptimer or GTmetrix premium reports."
      },
      {
        question: "What data does the Enhanced CSV Export contain?",
        answer: "The Enhanced CSV Export includes 20+ data fields: Core Web Vitals, performance scores, marketing tools, technology stack, security assessment, SEO metrics, meta tags, and much more. Ideal for CRM integration and data analysis."
      },
      {
        question: "How exactly does the domain analysis work?",
        answer: "DomainAudit Pro uses Google APIs (PageSpeed Insights, Custom Search) and proprietary crawlers to comprehensively analyze websites. We automatically check HTTPS status, performance metrics (Core Web Vitals), SEO factors, outdated technologies, and security aspects."
      }
    ],
    es: [
      {
        question: "¿Qué informes PDF puedo crear?",
        answer: "El Plan Enterprise ofrece tres tipos de informes PDF profesionales: Resumen Ejecutivo (visión general para gestión), Análisis Técnico Detallado (análisis técnico profundo) y Plan de Acción (recomendaciones priorizadas). Todos los informes están optimizados para presentaciones a clientes."
      },
      {
        question: "¿En qué se diferencian los informes PDF de la vista web?",
        answer: "Los informes PDF están formateados profesionalmente con diseño corporativo, gráficos, puntuaciones y recomendaciones estructuradas. Son perfectos para presentaciones a clientes, propuestas y documentación de auditoría - comparables a los informes premium de SEOptimer o GTmetrix."
      },
      {
        question: "¿Qué datos contiene la Exportación CSV Mejorada?",
        answer: "La Exportación CSV Mejorada incluye más de 20 campos de datos: Core Web Vitals, puntuaciones de rendimiento, herramientas de marketing, stack tecnológico, evaluación de seguridad, métricas SEO, meta tags y mucho más. Ideal para integración con CRM y análisis de datos."
      },
      {
        question: "¿Cómo funciona exactamente el análisis de dominio?",
        answer: "DomainAudit Pro utiliza APIs de Google (PageSpeed Insights, Custom Search) y rastreadores propios para analizar sitios web de manera integral. Verificamos automáticamente el estado HTTPS, métricas de rendimiento (Core Web Vitals), factores SEO, tecnologías obsoletas y aspectos de seguridad."
      }
    ]
  };

  return (
    <section className="py-16 bg-slate-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">FAQ</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs[i18n.language]?.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-white">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-slate-300">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
