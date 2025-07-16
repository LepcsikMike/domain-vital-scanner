
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieContextType {
  preferences: CookiePreferences;
  hasConsent: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  updatePreferences: (prefs: Partial<CookiePreferences>) => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true as these are required
  analytics: false,
  marketing: false,
  preferences: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const useCookies = () => {
  const context = useContext(CookieContext);
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};

interface CookieProviderProps {
  children: ReactNode;
}

export const CookieProvider: React.FC<CookieProviderProps> = ({ children }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [hasConsent, setHasConsent] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Load preferences from localStorage
    const savedPreferences = localStorage.getItem('cookie-preferences');
    const savedConsent = localStorage.getItem('cookie-consent');
    
    if (savedPreferences && savedConsent) {
      setPreferences(JSON.parse(savedPreferences));
      setHasConsent(JSON.parse(savedConsent));
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-preferences', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent', 'true');
    setPreferences(prefs);
    setHasConsent(true);
    setShowBanner(false);
  };

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    savePreferences(allAccepted);
  };

  const rejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    savePreferences(onlyNecessary);
  };

  const updatePreferences = (prefs: Partial<CookiePreferences>) => {
    const newPreferences = { ...preferences, ...prefs, necessary: true };
    savePreferences(newPreferences);
  };

  return (
    <CookieContext.Provider
      value={{
        preferences,
        hasConsent,
        acceptAll,
        rejectAll,
        updatePreferences,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};
