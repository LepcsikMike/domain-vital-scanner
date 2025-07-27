import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: object;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = "/lovable-uploads/5a1ec849-a5aa-4327-bbf9-b7897f7e2e51.png",
  noIndex = false,
  structuredData
}) => {
  const { t, i18n } = useTranslation('landing');
  const { currentLanguage, availableLanguages } = useLanguage();
  
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const baseUrl = 'https://domainauditpro.com';
  
  // Generate hreflang URLs for all languages
  const getLocalizedUrl = (lang: string, path: string = '') => {
    if (lang === 'de') {
      return `${baseUrl}${path}`;
    }
    return `${baseUrl}/${lang}${path}`;
  };

  const getCurrentPath = () => {
    if (typeof window === 'undefined') return '';
    const pathname = window.location.pathname;
    // Remove language prefix to get base path
    const pathWithoutLang = pathname.replace(/^\/(en|es)/, '') || '/';
    return pathWithoutLang === '/' ? '' : pathWithoutLang;
  };

  const defaultTitle = t('meta.title');
  const defaultDescription = t('meta.description');
  const defaultKeywords = t('meta.keywords');

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalCanonical = canonical || currentUrl;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="DomainAudit Pro" />
      <meta name="language" content={currentLanguage === 'de' ? 'German' : currentLanguage === 'en' ? 'English' : 'Spanish'} />
      
      {/* Robots */}
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"} />
      <meta name="googlebot" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      
      {/* Canonical */}
      <link rel="canonical" href={finalCanonical} />
      
      {/* Hreflang tags for all languages */}
      {availableLanguages.map(lang => (
        <link 
          key={lang.code}
          rel="alternate" 
          hrefLang={lang.code} 
          href={getLocalizedUrl(lang.code, getCurrentPath())} 
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={getLocalizedUrl('de', getCurrentPath())} />
      
      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="DomainAudit Pro" />
      <meta property="og:locale" content={currentLanguage === 'de' ? 'de_DE' : currentLanguage === 'en' ? 'en_US' : 'es_ES'} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalCanonical} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      <meta property="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta property="twitter:site" content="@domainaudit_pro" />
      <meta property="twitter:creator" content="@domainaudit_pro" />
      
      {/* Geo targeting */}
      {currentLanguage === 'de' && (
        <>
          <meta name="geo.region" content="DE" />
          <meta name="geo.country" content="Germany" />
        </>
      )}
      {currentLanguage === 'en' && (
        <>
          <meta name="geo.region" content="US" />
          <meta name="geo.country" content="United States" />
        </>
      )}
      {currentLanguage === 'es' && (
        <>
          <meta name="geo.region" content="ES" />
          <meta name="geo.country" content="Spain" />
        </>
      )}
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;