import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  availableLanguages: { code: string; name: string; nativeName: string }[];
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState(i18n.language || 'en');

  const availableLanguages = [
    { code: 'en', name: 'English (US)', nativeName: 'English' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
  ];

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('preffy-language', lang);
  }, [i18n]);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('preffy-language');
    if (savedLanguage && savedLanguage !== language) {
      setLanguage(savedLanguage);
    }
  }, [language, setLanguage]);

  const value = {
    language,
    setLanguage,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
