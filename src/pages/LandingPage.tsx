
import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PricingSection from '@/components/landing/PricingSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';
import SEOHelmet from '@/components/SEOHelmet';
import { useTranslation } from 'react-i18next';

const LandingPage = () => {
  const { t } = useTranslation('landing');

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://domainauditpro.com/#website",
        "url": "https://domainauditpro.com/",
        "name": "DomainAudit Pro",
        "description": t('meta.description'),
        "publisher": {
          "@id": "https://domainauditpro.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": "https://domainauditpro.com/app?domain={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organization",
        "@id": "https://domainauditpro.com/#organization",
        "name": "DomainAudit Pro",
        "url": "https://domainauditpro.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://domainauditpro.com/lovable-uploads/5a1ec849-a5aa-4327-bbf9-b7897f7e2e51.png"
        },
        "description": t('meta.description')
      },
      {
        "@type": "SoftwareApplication",
        "name": "DomainAudit Pro",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web Browser",
        "url": "https://domainauditpro.com/app",
        "description": t('meta.description'),
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR",
          "description": t('hero.testFree')
        },
        "featureList": [
          "HTTPS & SSL Certificate Check",
          "SEO Audit & Technical Analysis", 
          "Core Web Vitals Measurement",
          "Technology Stack Detection",
          "Security Analysis",
          "Batch Domain Analysis"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": t('faq.q1'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('faq.a1')
            }
          },
          {
            "@type": "Question", 
            "name": t('faq.q2'),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('faq.a2')
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <SEOHelmet 
        structuredData={structuredData}
      />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
