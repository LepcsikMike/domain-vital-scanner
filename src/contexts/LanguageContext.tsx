import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  availableLanguages: { code: string; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const availableLanguages = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentLanguageFromPath = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const langFromPath = pathSegments[0];
    return availableLanguages.find(lang => lang.code === langFromPath)?.code || 'de';
  };

  const currentLanguage = getCurrentLanguageFromPath();

  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const changeLanguage = (lang: string) => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentLang = pathSegments[0];
    
    let newPath;
    if (availableLanguages.find(l => l.code === currentLang)) {
      // Replace existing language in path
      pathSegments[0] = lang;
      newPath = '/' + pathSegments.join('/');
    } else {
      // Add language to path
      newPath = '/' + lang + location.pathname;
    }
    
    // Ensure path doesn't end with double slashes
    newPath = newPath.replace(/\/+$/, '') || '/' + lang;
    
    i18n.changeLanguage(lang);
    navigate(newPath);
    localStorage.setItem('preferred-language', lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        availableLanguages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};